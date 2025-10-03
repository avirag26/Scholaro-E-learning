import { Routes, Route } from "react-router-dom";
import NotFoundPage from "../src/ui/NotFound";
import TutorRegister from "../src/Pages/TUTOR/TutorRegister";
import TutorLogin from "../src/Pages/TUTOR/TutorLogin";
import TutorHome from "../src/Pages/TUTOR/TutorHome";
import TutorProfile from "../src/Pages/TUTOR/TutorProfile";
import TutorCourses from "../src/Pages/TUTOR/TutorCourses";
import AddCourse from "../src/Pages/TUTOR/AddCourse";
import AddCourseLessons from "../src/Pages/TUTOR/AddCourseLessons";
import TutorForgotPassword from "../src/Pages/TUTOR/TutorForgotPassword";
import TutorResetPassword from "../src/Pages/TUTOR/TutorResetPassword";

import { TutorProtectedRoute, TutorPublicRoute } from "../src/utils/TutorRouteProtection";


const TutorRoutes = () => {
    return (
        <Routes>
           {/* Public Routes - Only for unauthenticated tutors */}
           <Route element={<TutorPublicRoute />}>
                <Route path="forgot-password" element={<TutorForgotPassword />} />
                <Route path="reset-password/:token" element={<TutorResetPassword />} />
                <Route path="register" element={<TutorRegister />} />
                <Route path="login" element={<TutorLogin />} />
           </Route>
           {/* Protected Routes - Only for authenticated tutors */}
           <Route element={<TutorProtectedRoute />}>
                <Route path="home" element={<TutorHome />} />
                <Route path="profile" element={<TutorProfile />} />
                <Route path="courses" element={<TutorCourses />} />
                <Route path="add-course" element={<AddCourse />} />
                <Route path="add-course-lessons" element={<AddCourseLessons />} />
           </Route>
           <Route path="*"  element={<NotFoundPage/>}/>
        </Routes>
    )

}
  
export default TutorRoutes;