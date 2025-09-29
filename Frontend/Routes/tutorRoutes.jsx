import { Routes, Route } from "react-router-dom";
import NotFoundPage from "../src/ui/NotFound";
import TutorRegister from "../src/Pages/TUTOR/TutorRegister";
import TutorLogin from "../src/Pages/TUTOR/TutorLogin";
import TutorHome from "../src/Pages/TUTOR/TutorHome";

import { TutorProtectedRoute, TutorPublicRoute } from "../src/utils/TutorRouteProtection";


const TutorRoutes = () => {
    return (
        <Routes>
           {/* Public Routes - Only for unauthenticated tutors */}
           <Route element={<TutorPublicRoute />}>
                <Route path="register" element={<TutorRegister />} />
                <Route path="login" element={<TutorLogin />} />
           </Route>
           {/* Protected Routes - Only for authenticated tutors */}
           <Route element={<TutorProtectedRoute />}>
                <Route path="home" element={<TutorHome />} />
                
           </Route>
           <Route path="*"  element={<NotFoundPage/>}/>
        </Routes>
    )

}
  
export default TutorRoutes;