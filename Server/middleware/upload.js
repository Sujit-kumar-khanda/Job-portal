
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dest = req.uploadDest || path.join(process.cwd(), "uploads");
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = `${Date.now()}-${Math.random().toString(36).slice(2,8)}${ext}`;
    cb(null, name);
  },
});

const fileFilter = (req, file, cb) => {
  if (req.uploadAccept) {
    const ext = path.extname(file.originalname).toLowerCase();
    if (req.uploadAccept.includes(ext)) return cb(null, true);
    return cb(new Error("File type not allowed"), false);
  }
  cb(null, true);
};

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter,
});

export default upload;
