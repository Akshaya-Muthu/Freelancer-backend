import multer from 'multer';
import {CloudinaryStorage} from 'multer-storage-cloudinary';
import cloudinary from '../utils/cloudinary.js';
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
    params: {
        folder: 'freelance-tasks',
        allowedFormats: ['jpg', 'png', 'jpeg', 'gif','pdf', 'docx', 'doc', 'pptx', 'ppt','zip', 'rar'],
    },
});

const upload = multer({ storage: storage });

export default upload;
