const crypto = require("crypto");
const fs = require("fs/promises");
const path = require("path");

let productionLocalWarningShown = false;
const CLOUDINARY_UPLOAD_FOLDER = "jetle_online";

function safeDecode(value) {
  try {
    return decodeURIComponent(String(value || ""));
  } catch (_) {
    return String(value || "");
  }
}

function parseCloudinaryConfig() {
  const rawUrl = String(process.env.CLOUDINARY_URL || "").trim();
  if (rawUrl) {
    try {
      const parsed = new URL(rawUrl);
      const cloudName = String(parsed.hostname || "").trim();
      const apiKey = safeDecode(String(parsed.username || "").trim());
      const apiSecret = safeDecode(String(parsed.password || "").trim());
      if (parsed.protocol === "cloudinary:" && cloudName && apiKey && apiSecret) {
        return { cloudName, apiKey, apiSecret, source: "CLOUDINARY_URL" };
      }
    } catch (_) {
      // Fall through to explicit env vars.
    }
  }

  const cloudName = String(process.env.CLOUDINARY_CLOUD_NAME || "").trim();
  const apiKey = String(process.env.CLOUDINARY_API_KEY || "").trim();
  const apiSecret = String(process.env.CLOUDINARY_API_SECRET || "").trim();
  if (cloudName && apiKey && apiSecret) {
    return { cloudName, apiKey, apiSecret, source: "CLOUDINARY_*" };
  }

  return null;
}

function hasCloudinaryEnv() {
  return Boolean(parseCloudinaryConfig());
}

function getLocalUrls(files = []) {
  return (files || [])
    .filter((file) => file && file.filename)
    .map((file) => `/uploads/${file.filename}`);
}

function getMimeType(file) {
  const mime = String(file?.mimetype || "").trim().toLowerCase();
  return mime || "application/octet-stream";
}

function buildCloudinarySignature(params, apiSecret) {
  const stringToSign = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");

  return {
    stringToSign,
    signature: crypto
      .createHash("sha1")
      .update(`${stringToSign}${apiSecret}`)
      .digest("hex")
  };
}

function getConfigDebugSummary(config) {
  return {
    source: config?.source || "unknown",
    cloudName: String(config?.cloudName || ""),
    apiKeyPrefix: String(config?.apiKey || "").slice(0, 4),
    apiKeyLength: String(config?.apiKey || "").length,
    apiSecretLength: String(config?.apiSecret || "").length
  };
}

function isInvalidSignatureError(error) {
  return String(error?.message || "").toLowerCase().includes("invalid signature");
}

function getLocalFallbackResult(files = [], thumbnailResults = []) {
  return {
    provider: "local",
    urls: getLocalUrls(files),
    publicIds: [],
    thumbnailUrls: (thumbnailResults || [])
      .map((item) => String(item?.thumbnailUrl || "").trim())
      .filter(Boolean),
    assets: (files || [])
      .filter((file) => file && file.filename)
      .map((file, index) => ({
        url: `/uploads/${file.filename}`,
        publicId: "",
        provider: "local",
        thumbnailUrl: String(thumbnailResults?.[index]?.thumbnailUrl || "").trim()
      }))
  };
}

async function uploadSingleFileToCloudinary(file, config) {
  if (!global.fetch || typeof FormData === "undefined") {
    throw new Error("fetch_or_formdata_unavailable");
  }

  const folder = CLOUDINARY_UPLOAD_FOLDER;
  const timestamp = Math.floor(Date.now() / 1000);
  const signed = buildCloudinarySignature({ folder, timestamp }, config.apiSecret);
  const bytes = await fs.readFile(file.path);
  const base64Payload = `data:${getMimeType(file)};base64,${bytes.toString("base64")}`;

  const form = new FormData();
  form.append("file", base64Payload);
  form.append("api_key", config.apiKey);
  form.append("timestamp", String(timestamp));
  form.append("folder", folder);
  form.append("signature", signed.signature);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${config.cloudName}/image/upload`, {
    method: "POST",
    body: form
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(payload?.error?.message || "cloudinary_upload_failed");
    error.cloudinary = {
      status: response.status,
      payload,
      folder,
      timestamp,
      stringToSign: signed.stringToSign,
      config: getConfigDebugSummary(config)
    };
    throw error;
  }

  return {
    url: String(payload.secure_url || payload.url || "").trim(),
    publicId: String(payload.public_id || "").trim()
  };
}

async function cleanupLocalArtifacts(files = []) {
  await Promise.all(
    (files || []).map(async (file) => {
      if (!file?.path) return;
      try {
        await fs.unlink(file.path);
      } catch (_) {
        // Ignore cleanup failures.
      }

      const parsed = path.parse(file.path);
      const thumbPath = path.join(parsed.dir, `${parsed.name}-thumb.webp`);
      try {
        await fs.unlink(thumbPath);
      } catch (_) {
        // Ignore cleanup failures.
      }
    })
  );
}

async function uploadToCloudinary(files = []) {
  const config = parseCloudinaryConfig();
  if (!config) {
    return {
      provider: "local",
      urls: getLocalUrls(files),
      thumbnailUrls: []
    };
  }

  const urls = [];
  const assets = [];
  for (const file of files) {
    if (!file?.path) continue;
    const asset = await uploadSingleFileToCloudinary(file, config);
    urls.push(asset.url);
    assets.push({
      url: asset.url,
      publicId: asset.publicId,
      provider: "cloudinary",
      thumbnailUrl: ""
    });
  }

  await cleanupLocalArtifacts(files);

  return {
    provider: "cloudinary",
    urls,
    publicIds: assets.map((item) => item.publicId).filter(Boolean),
    thumbnailUrls: [],
    assets
  };
}

async function storeFiles(files = [], thumbnailResults = []) {
  if (hasCloudinaryEnv()) {
    try {
      return await uploadToCloudinary(files);
    } catch (err) {
      const invalidSignature = isInvalidSignatureError(err);
      console.error("CLOUDINARY STORAGE ERROR:", {
        message: invalidSignature ? "invalid signature / fallback local" : (err?.message || "unknown_error"),
        stack: err?.stack || "",
        cloudinary: err?.cloudinary || null,
        hasCloudinaryUrl: Boolean(String(process.env.CLOUDINARY_URL || "").trim()),
        hasCloudinaryParts: Boolean(
          String(process.env.CLOUDINARY_CLOUD_NAME || "").trim() &&
          String(process.env.CLOUDINARY_API_KEY || "").trim() &&
          String(process.env.CLOUDINARY_API_SECRET || "").trim()
        ),
        fileCount: Array.isArray(files) ? files.length : 0
      });
      console.warn(invalidSignature
        ? "WARN Cloudinary invalid signature, local fallback kullanılacak."
        : "WARN Cloudinary upload başarısız. Local uploads fallback kullanılacak.");
    }
  }

  if (process.env.NODE_ENV === "production" && !productionLocalWarningShown) {
    productionLocalWarningShown = true;
    console.warn("WARN Upload storage local disk kullanıyor. Railway/container restart sonrası görsel kaybı riski var.");
  }

  return getLocalFallbackResult(files, thumbnailResults);
}

module.exports = {
  storeFiles
};
