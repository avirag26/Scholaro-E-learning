import Course from '../Model/CourseModel.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = 'uploads/courses/';
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 100 * 1024 * 1024 // 100MB limit
    },
    fileFilter: function (req, file, cb) {
        if (file.fieldname === 'image') {
            if (file.mimetype.startsWith('image/')) {
                cb(null, true);
            } else {
                cb(new Error('Only image files are allowed for course image'));
            }
        } else if (file.fieldname === 'video') {
            if (file.mimetype.startsWith('video/')) {
                cb(null, true);
            } else {
                cb(new Error('Only video files are allowed'));
            }
        } else if (file.fieldname === 'pdf') {
            if (file.mimetype === 'application/pdf') {
                cb(null, true);
            } else {
                cb(new Error('Only PDF files are allowed for notes'));
            }
        } else {
            cb(new Error('Unexpected field'));
        }
    }
});

// Create a new course
const createCourse = async (req, res) => {
    try {
        const { title, description, category, regularPrice, offerPercentage } = req.body;
        const tutorId = req.tutor._id;
        const tutorName = req.tutor.name;

        if (!req.file) {
            return res.status(400).json({ message: 'Course image is required' });
        }

        const imageUrl = `/uploads/courses/${req.file.filename}`;

        const course = new Course({
            title,
            description,
            category,
            regularPrice: parseFloat(regularPrice),
            offerPercentage: parseFloat(offerPercentage) || 0,
            imageUrl,
            instructor: tutorId,
            instructorName: tutorName
        });

        await course.save();

        res.status(201).json({
            message: 'Course created successfully',
            course: {
                id: course._id,
                title: course.title,
                description: course.description,
                category: course.category,
                regularPrice: course.regularPrice,
                offerPercentage: course.offerPercentage,
                finalPrice: course.finalPrice,
                imageUrl: course.imageUrl,
                instructorName: course.instructorName,
                isListed: course.isListed,
                createdAt: course.createdAt
            }
        });
    } catch (error) {
        console.error('Error creating course:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get all courses for a tutor
const getTutorCourses = async (req, res) => {
    try {
        const tutorId = req.tutor._id;
        const courses = await Course.find({ instructor: tutorId }).sort({ createdAt: -1 });

        const coursesWithStats = courses.map(course => ({
            id: course._id,
            title: course.title,
            description: course.description,
            category: course.category,
            regularPrice: course.regularPrice,
            offerPercentage: course.offerPercentage,
            finalPrice: course.finalPrice,
            imageUrl: course.imageUrl,
            instructorName: course.instructorName,
            isListed: course.isListed,
            isApproved: course.isApproved,
            totalLessons: course.lessons.length,
            enrolledStudents: course.enrolledStudents.length,
            rating: course.rating,
            createdAt: course.createdAt,
            updatedAt: course.updatedAt
        }));

        res.status(200).json({
            message: 'Courses retrieved successfully',
            courses: coursesWithStats
        });
    } catch (error) {
        console.error('Error getting tutor courses:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Toggle course listing status
const toggleCourseListing = async (req, res) => {
    try {
        const { courseId } = req.params;
        const tutorId = req.tutor._id;

        const course = await Course.findOne({ _id: courseId, instructor: tutorId });
        
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        course.isListed = !course.isListed;
        await course.save();

        res.status(200).json({
            message: `Course ${course.isListed ? 'listed' : 'unlisted'} successfully`,
            course: {
                id: course._id,
                title: course.title,
                isListed: course.isListed
            }
        });
    } catch (error) {
        console.error('Error toggling course listing:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Add lesson to course
const addLesson = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { title, position } = req.body;
        const tutorId = req.tutor._id;

        const course = await Course.findOne({ _id: courseId, instructor: tutorId });
        
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        const videoFile = req.files?.video?.[0];
        const pdfFile = req.files?.pdf?.[0];

        if (!videoFile) {
            return res.status(400).json({ message: 'Video file is required' });
        }

        const lesson = {
            title,
            position: parseInt(position),
            videoUrl: `/uploads/courses/${videoFile.filename}`,
            pdfNotesUrl: pdfFile ? `/uploads/courses/${pdfFile.filename}` : null
        };

        course.lessons.push(lesson);
        await course.save();

        res.status(201).json({
            message: 'Lesson added successfully',
            lesson: course.lessons[course.lessons.length - 1]
        });
    } catch (error) {
        console.error('Error adding lesson:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get all listed courses for users
const getListedCourses = async (req, res) => {
    try {
        const { category, search, page = 1, limit = 12 } = req.query;
        
        let query = { isListed: true, isApproved: true };
        
        if (category && category !== 'All') {
            query.category = category.toLowerCase();
        }
        
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { instructorName: { $regex: search, $options: 'i' } }
            ];
        }

        const courses = await Course.find(query)
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Course.countDocuments(query);

        const coursesForUsers = courses.map(course => ({
            id: course._id,
            title: course.title,
            description: course.description,
            category: course.category,
            regularPrice: course.regularPrice,
            offerPercentage: course.offerPercentage,
            finalPrice: course.finalPrice,
            imageUrl: course.imageUrl,
            instructorName: course.instructorName,
            totalLessons: course.lessons.length,
            totalDuration: course.totalDuration,
            enrolledStudents: course.enrolledStudents.length,
            rating: course.rating,
            level: course.level,
            createdAt: course.createdAt
        }));

        res.status(200).json({
            message: 'Listed courses retrieved successfully',
            courses: coursesForUsers,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalCourses: total,
                hasNext: page < Math.ceil(total / limit),
                hasPrev: page > 1
            }
        });
    } catch (error) {
        console.error('Error getting listed courses:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Delete course
const deleteCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const tutorId = req.tutor._id;

        const course = await Course.findOne({ _id: courseId, instructor: tutorId });
        
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Delete associated files
        if (course.imageUrl) {
            const imagePath = path.join(__dirname, '..', course.imageUrl);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        // Delete lesson files
        course.lessons.forEach(lesson => {
            if (lesson.videoUrl) {
                const videoPath = path.join(__dirname, '..', lesson.videoUrl);
                if (fs.existsSync(videoPath)) {
                    fs.unlinkSync(videoPath);
                }
            }
            if (lesson.pdfNotesUrl) {
                const pdfPath = path.join(__dirname, '..', lesson.pdfNotesUrl);
                if (fs.existsSync(pdfPath)) {
                    fs.unlinkSync(pdfPath);
                }
            }
        });

        await Course.findByIdAndDelete(courseId);

        res.status(200).json({
            message: 'Course deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting course:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export {
    createCourse,
    getTutorCourses,
    toggleCourseListing,
    addLesson,
    getListedCourses,
    deleteCourse,
    upload
};