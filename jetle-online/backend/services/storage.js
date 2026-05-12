const crypto = require("crypto");
const fs = require("fs/promises");
const path = require("path");

let productionLocalWarningShown = false;

function parseCloudinaryConfig() {
  const rawUrl = String(process.env.CLOUDINARY_URL || "").trim();
  if (rawUrl) {
    try {
      const parsed = new URL(rawUrl);
      if (parsed.protocol === "cloudinary:") {
        return {
          cloudName: parsed.hostname,
          apiKey: decodeURIComponent(parsed.username || ""),
          apiSecret: decodeURIComponent(parsed.password || "")
        };
      }
    } catch (_) {
      return null;
    }
  }

  const cloudName = String(process.env.CLOUDINARY_CLOUD_NAME || "").trim();
  const apiKey = String(process.env.CLOUDINARY_API_KEY || "").trim();
  const apiSecret = String(process.env.CLOUDINARY_API_SECRET || "").trim();
  if (cloudName && apiKey && apiSecret) {
    return { cloudName, apiKey, apiSecret };
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

function buildCloudinarySignature(folder, timestamp, apiSecret) {
  return crypto
    .createHash("sha1")
    .update(`folder=${folder}&timestamp=${timestamp}${apiSecret}`)
    .digest("hex");
}

async function uploadSingleFileToCloudinary(file, config) {
  if (!global.fetch || typeof FormData === "undefined" || typeof Blob === "undefined") {
    throw new Error("fetch_or_formdata_unavailable");
  }

  const folder = String(process.env.CLOUDINARY_FOLDER || "jetle_online").trim();
  const timestamp = Math.floor(Date.now() / 1000);
  const signature = buildCloudinarySignature(folder, timestamp, config.apiSecret);
  const bytes = await fs.readFile(file.path);

  const form = new FormData();
  form.append("file", new Blob([bytes]), path.basename(file.path));
  form.append("api_key", config.apiKey);
  form.append("timestamp", String(timestamp));
  form.append("folder", folder);
  form.append("signature", signature);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${config.cloudName}/image/upload`, {
    method: "POST",
    body: form
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload?.error?.message || "cloudinary_upload_failed");
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
    return uploadToCloudinary(files);
  }

  if (process.env.NODE_ENV === "production" && !productionLocalWarningShown) {
    productionLocalWarningShown = true;
    console.warn("WARN Upload storage local disk kullanıyor. Railway/container restart sonrası görsel kaybı riski var.");
  }

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

module.exports = {
  storeFiles
};
