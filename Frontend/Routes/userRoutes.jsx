import { Routes ,Route , Navigate} from "react-router-dom"; 
import Register from "../src/Pages/USER/Register";
import Login from "../src/Pages/USER/Login";
import HomePage from "../src/Pages/USER/Home";
import NotFoundPage from "../src/ui/NotFound";
import { UserProtectedRoute, UserPublicRoute } from "../src/utils/UserRouteProtection";
import ProfilePage from "../src/Pages/USER/UserProfile";

const UserRoutes = () => {
  return (
    <Routes>
       {/* Public Routes - Only for unauthenticated users */}
       <Route element={<UserPublicRoute />}>
         <Route path="register" element={<Register />} />
         <Route path="login" element={<Login />} />
       </Route>

       {/* Protected Routes - Only for authenticated users */}
       <Route element={<UserProtectedRoute />}>
         <Route path="home" element={<HomePage />} />
         <Route path="profiles" element={<ProfilePage />} />
       </Route>

       <Route path="*"  element={<NotFoundPage/>}/>
    </Routes>
  );
}

export default UserRoutes;