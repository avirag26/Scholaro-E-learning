import { Routes, Route, Navigate } from "react-router-dom";
import Register from "../src/Pages/USER/Register";
import Login from "../src/Pages/USER/Login";
import HomePage from "../src/Pages/USER/Home";
import NotFoundPage from "../src/ui/NotFound";
import { UserProtectedRoute, UserPublicRoute } from "../src/utils/UserRouteProtection";
import ProfilePage from "../src/Pages/USER/UserProfile";
import CoursesPage from "../src/Pages/USER/Courses";
import UserForgotPassword from "../src/Pages/USER/UserForgotPassword";
import UserResetPassword from "../src/Pages/USER/UserResetPassword";

const UserRoutes = () => {
  return (
    <Routes>
      {/* Public Routes - Only for unauthenticated users */}
      <Route element={<UserPublicRoute />}>
        <Route path="forgot-password" element={<UserForgotPassword />} />
        <Route path="reset-password/:token" element={<UserResetPassword />} />
        <Route path="register" element={<Register />} />
        <Route path="login" element={<Login />} />
      </Route>

      {/* Protected Routes - Only for authenticated users */}
      <Route element={<UserProtectedRoute />}>
        <Route path="home" element={<HomePage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="courses" element={<CoursesPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default UserRoutes;