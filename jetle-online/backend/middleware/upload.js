const multer = require("multer");
const path = require("path");
const fs = require("fs/promises");
const allowedMimeTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
let sharp = null;

try {
  sharp = require("sharp");
} catch (_) {
  sharp = null;
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1E9);
    cb(null, unique + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (allowedMimeTypes.has(String(file.mimetype || "").toLowerCase())) {
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

module.exports = upload;
