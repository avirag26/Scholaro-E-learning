import { Routes, Route } from "react-router-dom";
import NotFoundPage from "../src/ui/NotFound";
import AdminLogin from "../src/Pages/ADMIN/AdminLogin";
import AdminRegister from "../src/Pages/ADMIN/AdminRegister";
import AdminDashboard from "../src/Pages/ADMIN/AdminDashboard";
import AdminProfile from "../src/Pages/ADMIN/AdminProfile";
import AdminForgotPassword from "../src/Pages/ADMIN/AdminForgotPassword";
import AdminResetPassword from "../src/Pages/ADMIN/AdminResetPassword";
import AdminProtectedRoute from "../src/utils/AdminProtectedRoute";

const AdminRoutes = () => {
    return (
        <Routes>
           {/* Public Routes - Only for unauthenticated admins */}
           <Route path="login" element={<AdminLogin />} />
           <Route path="register" element={<AdminRegister />} />
           <Route path="forgot-password" element={<AdminForgotPassword />} />
           <Route path="reset-password/:token" element={<AdminResetPassword />} />
           
           {/* Protected Routes - Only for authenticated admins */}
           <Route path="dashboard" element={
             <AdminProtectedRoute>
               <AdminDashboard />
             </AdminProtectedRoute>
           } />
           <Route path="profile" element={
             <AdminProtectedRoute>
               <AdminProfile />
             </AdminProtectedRoute>
           } />
           
           <Route path="*" element={<NotFoundPage/>}/>
        </Routes>
    )
}
  
export default AdminRoutes;