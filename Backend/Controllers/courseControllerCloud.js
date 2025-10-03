import Course from '../Model/CourseModel.js';
import cloudinary, { uploadCourseImage, uploadLessonFiles } from '../config/cloudinary.js';

// Helper function to upload file to Cloudinary
const uploadToCloudinary = async (file, folder, resourceType = 'image') => {
    return new Promise((resolve, reject) => {
        const uploadOptions = {
            folder: `scholaro/courses/${folder}`,
            resource_type: resourceType,
        };

        if (resourceType === 'image') {
            uploadOptions.transformation = [
                { width: 800, height: 600, crop: 'fill', quality: 'auto' }
            ];
        } else if (resourceType === 'video') {
            uploadOptions.transformation = [
                { quality: 'auto', fetch_format: 'auto' }
            ];
        }

        const uploadStream = cloudinary.uploader.upload_stream(
            uploadOptions,
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            }
        );

        uploadStream.end(file.buffer);
    });
};

// Create a new course
const createCourse = async (req, res) => {
    try {
        const { title, description, category, regularPrice, offerPercentage } = req.body;
        const tutorId = req.tutor._id;
        const tutorName = req.tutor.name;

        if (!req.file) {
            return res.status(400).json({ message: 'Course image is required' });
        }

        // Upload image to Cloudinary
        const imageResult = await uploadToCloudinary(req.file, 'images', 'image');

        const course = new Course({
            title,
            description,
            category,
            regularPrice: parseFloat(regularPrice),
            offerPercentage: parseFloat(offerPercentage) || 0,
            imageUrl: imageResult.secure_url,
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

        // Upload video to Cloudinary
        const videoResult = await uploadToCloudinary(videoFile, 'videos', 'video');
        
        let pdfResult = null;
        if (pdfFile) {
            // Upload PDF to Cloudinary
            pdfResult = await uploadToCloudinary(pdfFile, 'pdfs', 'raw');
        }

        const lesson = {
            title,
            position: parseInt(position),
            videoUrl: videoResult.secure_url,
            pdfNotesUrl: pdfResult ? pdfResult.secure_url : null,
            duration: videoResult.duration ? `${Math.floor(videoResult.duration / 60)}:${String(Math.floor(videoResult.duration % 60)).padStart(2, '0')}` : "00:00"
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

        // Delete files from Cloudinary
        try {
            // Extract public ID from Cloudinary URL and delete
            if (course.imageUrl) {
                const publicId = course.imageUrl.split('/').pop().split('.')[0];
                await cloudinary.uploader.destroy(`scholaro/courses/images/${publicId}`);
            }

            // Delete lesson files
            for (const lesson of course.lessons) {
                if (lesson.videoUrl) {
                    const videoPublicId = lesson.videoUrl.split('/').pop().split('.')[0];
                    await cloudinary.uploader.destroy(`scholaro/courses/videos/${videoPublicId}`, { resource_type: 'video' });
                }
                if (lesson.pdfNotesUrl) {
                    const pdfPublicId = lesson.pdfNotesUrl.split('/').pop().split('.')[0];
                    await cloudinary.uploader.destroy(`scholaro/courses/pdfs/${pdfPublicId}`, { resource_type: 'raw' });
                }
            }
        } catch (cloudinaryError) {
            console.error('Error deleting files from Cloudinary:', cloudinaryError);
            // Continue with database deletion even if Cloudinary deletion fails
        }

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
    uploadCourseImage,
    uploadLessonFiles
};