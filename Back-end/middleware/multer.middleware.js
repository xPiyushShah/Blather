import multer from "multer";
const storage = multer.memoryStorage(); 

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/", "audio/", "video/"];
  const isAllowed = allowedTypes.some(type => file.mimetype.startsWith(type));

  if (isAllowed) {
    cb(null, true);
  } else {
    cb(new Error("Only image, audio, or video files are allowed!"), false);
  }
};

const upload = multer({ storage, fileFilter });

export default upload;
