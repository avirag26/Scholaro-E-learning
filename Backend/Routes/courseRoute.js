import express from 'express';
import {
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
} from '../Controllers/courseControllerHybrid.js';
import { protectTutor } from '../Middleware/tutorAuthMiddleware.js';

const router = express.Router();

// Tutor routes (protected)
router.post('/create', protectTutor, upload.single('image'), createCourse);
router.get('/tutor/courses', protectTutor, getTutorCourses);
router.patch('/toggle-listing/:courseId', protectTutor, toggleCourseListing);
router.post('/add-lesson/:courseId', protectTutor, upload.fields([
    { name: 'video', maxCount: 1 },
    { name: 'pdf', maxCount: 1 }
]), addLesson);
router.delete('/delete/:courseId', protectTutor, deleteCourse);

// Test route for debugging
router.get('/test-auth', protectTutor, (req, res) => {
    res.json({
        message: 'Authentication successful',
        tutor: {
            id: req.tutor._id,
            name: req.tutor.full_name,
            email: req.tutor.email,
            allProperties: Object.keys(req.tutor.toObject())
        }
    });
});

// Public routes (for users)
router.get('/listed', getListedCourses);

// User routes (protected)
import { protectUser } from '../Middleware/authMiddleware.js';
router.get('/enrolled', protectUser, getUserEnrolledCourses);
router.post('/enroll/:courseId', protectUser, enrollInCourse);
router.get('/progress/:courseId', protectUser, getCourseProgress);

export default router;