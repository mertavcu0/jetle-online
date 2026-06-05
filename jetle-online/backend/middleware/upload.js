const multer = require("multer");
const path = require("path");
const fsSync = require("fs");
const fs = require("fs/promises");
const allowedMimeTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const allowedExtensions = new Set([".jpg", ".jpeg", ".png", ".webp"]);
const blockedExtensions = new Set([".exe", ".dll", ".bat", ".cmd", ".com", ".msi", ".sh", ".ps1", ".php", ".js", ".jar", ".scr", ".vbs"]);
const MAX_IMAGE_FILE_SIZE = 8 * 1024 * 1024;
const MAX_VIDEO_FILE_SIZE = 80 * 1024 * 1024;
let sharp = null;

try {
  sharp = require("sharp");
} catch (_) {
  sharp = null;
}

const preferredUploadRoot = path.resolve(__dirname, "..", "..", "..", "uploads");
const legacyUploadRoot = path.resolve(__dirname, "..", "uploads");

function canWriteUploadDir(dirPath) {
  try {
    fsSync.mkdirSync(dirPath, { recursive: true });
    fsSync.accessSync(dirPath, fsSync.constants.F_OK | fsSync.constants.W_OK);
    const testFile = path.join(dirPath, `.upload-write-test-${process.pid}-${Date.now()}.tmp`);
    fsSync.writeFileSync(testFile, "ok");
    fsSync.unlinkSync(testFile);
    return true;
  } catch (_) {
    return false;
  }
}

const uploadCandidates = [legacyUploadRoot, preferredUploadRoot];
const resolvedUploadRoot = uploadCandidates.find((dirPath) => canWriteUploadDir(dirPath)) || legacyUploadRoot;

console.log("UPLOAD_DIR", resolvedUploadRoot);
console.log("UPLOAD_DIR_EXISTS", fsSync.existsSync(resolvedUploadRoot));
console.log("UPLOAD_DIR_WRITE_OK", canWriteUploadDir(resolvedUploadRoot));

const uploadRoot = resolvedUploadRoot;

function getSafeExtension(file) {
  const ext = String(path.extname(file?.originalname || "") || "").toLowerCase();
  return allowedExtensions.has(ext) ? ext : "";
}

function hasBlockedExtension(file) {
  const ext = String(path.extname(file?.originalname || "") || "").toLowerCase();
  return blockedExtensions.has(ext);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadRoot);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1E9);
    cb(null, unique + getSafeExtension(file));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: MAX_IMAGE_FILE_SIZE },
  fileFilter: (req, file, cb) => {
    const mime = String(file.mimetype || "").toLowerCase();
    const ext = getSafeExtension(file);
    if (hasBlockedExtension(file)) {
      return cb(new Error("Bu dosya tipi kabul edilmiyor"));
    }
    if (mime.startsWith("video/")) {
      return cb(new Error(`Video dosyalari icin maksimum boyut ${Math.floor(MAX_VIDEO_FILE_SIZE / (1024 * 1024))}MB ve ayri bir yukleme akisi gerekir`));
    }
    if (ext && allowedMimeTypes.has(mime)) {
      return cb(null, true);
    }
    return cb(new Error("Sadece jpg, png veya webp dosyalari yuklenebilir"));
  }
});

async function optimizeSingleFile(file) {
  if (!sharp || !file?.path) {
    return {
      thumbnailUrl: ""
    };
  }

  const ext = String(path.extname(file.originalname || file.filename || "") || "").toLowerCase();
  const sourcePath = file.path;
  const parsedPath = path.parse(sourcePath);
  const thumbPath = path.join(parsedPath.dir, `${parsedPath.name}-thumb.webp`);

  let pipeline = sharp(sourcePath).rotate().resize({
    width: 1600,
    height: 1600,
    fit: "inside",
    withoutEnlargement: true
  });

  if (ext === ".png") {
    pipeline = pipeline.png({ compressionLevel: 9 });
  } else if (ext === ".webp") {
    pipeline = pipeline.webp({ quality: 82 });
  } else {
    pipeline = pipeline.jpeg({ quality: 82, mozjpeg: true });
  }

  const optimizedBuffer = await pipeline.toBuffer();
  await fs.writeFile(sourcePath, optimizedBuffer);

  await sharp(sourcePath)
    .rotate()
    .resize({
      width: 480,
      height: 480,
      fit: "cover",
      withoutEnlargement: true
    })
    .webp({ quality: 76 })
    .toFile(thumbPath);

  return {
    thumbnailUrl: `/uploads/${path.basename(thumbPath)}`
  };
}

upload.optimizeFiles = async function optimizeFiles(files = []) {
  const results = [];
  for (const file of files) {
    try {
      results.push(await optimizeSingleFile(file));
    } catch (err) {
      results.push({ thumbnailUrl: "" });
    }
  }
  return results;
};

upload.uploadRoot = uploadRoot;
upload.legacyUploadRoot = legacyUploadRoot;

module.exports = upload;
