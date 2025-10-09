import Course from '../Model/CourseModel.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure local storage as fallback
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
        console.log('=== CREATE COURSE DEBUG ===');
        console.log('Request body:', req.body);
        console.log('Request file:', req.file);
        console.log('Tutor object:', req.tutor);

        const { title, description, category, regularPrice, offerPercentage } = req.body;

        // Check if tutor exists
        if (!req.tutor) {
            console.error('No tutor object found in request');
            return res.status(401).json({ message: 'Authentication failed - no tutor found' });
        }

        const tutorId = req.tutor._id;
        const tutorName = req.tutor.full_name;

        console.log('Tutor ID:', tutorId);
        console.log('Tutor Name:', tutorName);
        console.log('Tutor full object keys:', Object.keys(req.tutor));

        if (!req.file) {
            console.error('No file uploaded');
            return res.status(400).json({ message: 'Course image is required' });
        }

        const imageUrl = `/uploads/courses/${req.file.filename}`;
        console.log('Image URL:', imageUrl);

        const courseData = {
            title,
            description,
            category,
            regularPrice: parseFloat(regularPrice),
            offerPercentage: parseFloat(offerPercentage) || 0,
            imageUrl,
            instructor: tutorId,
            instructorName: tutorName
        };

        console.log('Course data to save:', courseData);

        const course = new Course(courseData);
        await course.save();

        console.log('Course saved successfully:', course._id);

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
        console.error('=== ERROR CREATING COURSE ===');
        console.error('Error details:', error);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
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
        console.log('=== ADD LESSON DEBUG ===');
        console.log('Course ID:', req.params.courseId);
        console.log('Request body:', req.body);
        console.log('Request files:', req.files);

        const { courseId } = req.params;
        const { title, position } = req.body;
        const tutorId = req.tutor._id;

        console.log('Tutor ID:', tutorId);

        const course = await Course.findOne({ _id: courseId, instructor: tutorId });

        if (!course) {
            console.error('Course not found for ID:', courseId, 'and tutor:', tutorId);
            return res.status(404).json({ message: 'Course not found' });
        }

        console.log('Course found:', course.title);

        const videoFile = req.files?.video?.[0];
        const pdfFile = req.files?.pdf?.[0];

        console.log('Video file:', videoFile ? videoFile.filename : 'Not provided');
        console.log('PDF file:', pdfFile ? pdfFile.filename : 'Not provided');

        if (!videoFile) {
            console.error('No video file provided');
            return res.status(400).json({ message: 'Video file is required' });
        }

        const lesson = {
            title,
            position: parseInt(position),
            videoUrl: `/uploads/courses/${videoFile.filename}`,
            pdfNotesUrl: pdfFile ? `/uploads/courses/${pdfFile.filename}` : null
        };

        console.log('Lesson data:', lesson);

        course.lessons.push(lesson);
        await course.save();

        console.log('Lesson added successfully');

        res.status(201).json({
            message: 'Lesson added successfully',
            lesson: course.lessons[course.lessons.length - 1]
        });
    } catch (error) {
        console.error('=== ERROR ADDING LESSON ===');
        console.error('Error details:', error);
        console.error('Error message:', error.message);
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
        if (course.imageUrl && course.imageUrl.startsWith('/uploads/')) {
            const imagePath = path.join(__dirname, '..', course.imageUrl);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        // Delete lesson files
        course.lessons.forEach(lesson => {
            if (lesson.videoUrl && lesson.videoUrl.startsWith('/uploads/')) {
                const videoPath = path.join(__dirname, '..', lesson.videoUrl);
                if (fs.existsSync(videoPath)) {
                    fs.unlinkSync(videoPath);
                }
            }
            if (lesson.pdfNotesUrl && lesson.pdfNotesUrl.startsWith('/uploads/')) {
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

// Get user's enrolled courses
const getUserEnrolledCourses = async (req, res) => {
    try {
        const userId = req.user._id;
        
        // Find user with populated courses
        const user = await User.findById(userId)
            .populate({
                path: 'courses.course',
                select: 'title description imageUrl instructorName regularPrice finalPrice rating totalLessons'
            });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const enrolledCourses = user.courses.map(enrollment => ({
            courseId: enrollment.course._id,
            title: enrollment.course.title,
            description: enrollment.course.description,
            imageUrl: enrollment.course.imageUrl,
            instructorName: enrollment.course.instructorName,
            price: enrollment.course.finalPrice,
            rating: enrollment.course.rating,
            totalLessons: enrollment.course.totalLessons,
            enrollmentDate: enrollment.enrollmentDate,
            progress: enrollment.progress,
            completionStatus: enrollment.completionStatus
        }));

        res.status(200).json({
            message: 'Enrolled courses retrieved successfully',
            courses: enrolledCourses
        });
    } catch (error) {
        console.error('Error getting enrolled courses:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Enroll user in a course
const enrollInCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const userId = req.user._id;

        // Check if course exists and is listed
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        if (!course.isListed) {
            return res.status(400).json({ message: 'Course is not available for enrollment' });
        }

        // Check if user is already enrolled
        const user = await User.findById(userId);
        const alreadyEnrolled = user.courses.some(enrollment => 
            enrollment.course.toString() === courseId
        );

        if (alreadyEnrolled) {
            return res.status(400).json({ message: 'Already enrolled in this course' });
        }

        // Add course to user's enrolled courses
        user.courses.push({
            course: courseId,
            enrollmentDate: new Date(),
            progress: 0,
            completionStatus: false
        });

        await user.save();

        // Update course enrolled students count
        course.enrolledStudents.push(userId);
        await course.save();

        res.status(200).json({
            message: 'Successfully enrolled in course',
            courseId: courseId,
            enrollmentDate: new Date()
        });
    } catch (error) {
        console.error('Error enrolling in course:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get course progress for a user
const getCourseProgress = async (req, res) => {
    try {
        const { courseId } = req.params;
        const userId = req.user._id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const enrollment = user.courses.find(course => 
            course.course.toString() === courseId
        );

        if (!enrollment) {
            return res.status(404).json({ message: 'Not enrolled in this course' });
        }

        res.status(200).json({
            message: 'Course progress retrieved successfully',
            progress: {
                courseId: courseId,
                progress: enrollment.progress,
                completionStatus: enrollment.completionStatus,
                enrollmentDate: enrollment.enrollmentDate
            }
        });
    } catch (error) {
        console.error('Error getting course progress:', error);
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
    upload,
    getUserEnrolledCourses,
    enrollInCourse,
    getCourseProgress
};