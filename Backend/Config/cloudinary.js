import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Cloudinary storage for course images
const courseImageStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'scholaro/courses/images',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        transformation: [
            { width: 800, height: 600, crop: 'fill', quality: 'auto' }
        ]
    },
});

// Configure Cloudinary storage for lesson videos
const lessonVideoStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'scholaro/courses/videos',
        resource_type: 'video',
        allowed_formats: ['mp4', 'mov', 'avi', 'mkv'],
        transformation: [
            { quality: 'auto', fetch_format: 'auto' }
        ]
    },
});

// Configure Cloudinary storage for PDF notes
const pdfNotesStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'scholaro/courses/pdfs',
        resource_type: 'raw',
        allowed_formats: ['pdf']
    },
});

// Create multer instances
export const uploadCourseImage = multer({ 
    storage: courseImageStorage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit for images
    }
});

export const uploadLessonVideo = multer({ 
    storage: lessonVideoStorage,
    limits: {
        fileSize: 100 * 1024 * 1024 // 100MB limit for videos
    }
});

export const uploadPdfNotes = multer({ 
    storage: pdfNotesStorage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit for PDFs
    }
});

// Combined upload for lessons (video + PDF)
export const uploadLessonFiles = multer({
    storage: multer.memoryStorage(), // We'll handle storage manually
    limits: {
        fileSize: 100 * 1024 * 1024 // 100MB limit
    },
    fileFilter: (req, file, cb) => {
        if (file.fieldname === 'video') {
            if (file.mimetype.startsWith('video/')) {
                cb(null, true);
            } else {
                cb(new Error('Only video files are allowed'));
            }
        } else if (file.fieldname === 'pdf') {
            if (file.mimetype === 'application/pdf') {
                cb(null, true);
            } else {
                cb(new Error('Only PDF files are allowed'));
            }
        } else {
            cb(new Error('Unexpected field'));
        }
    }
});

export default cloudinary;