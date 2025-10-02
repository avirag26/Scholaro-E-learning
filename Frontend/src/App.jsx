import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ModernLandingPage from './Landing/ModernLandingPage';
// import UserRoutes from './components/UserRoutes';
// import AdminRoutes from './components/AdminRoutes';
import NotFoundPage from './ui/NotFound';
import TutorRoutes from "../Routes/tutorRoutes";
import AdminRoutes from "../Routes/adminRoutes";
import UserRoutes from "../Routes/userRoutes";
import PublicRoute from './utils/PublicRoute';

function App() {
  return (
    
    <>
    
   <Router>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/" element={<ModernLandingPage />} />
        </Route>
        {/* <Route path="/user/*" element={<UserRoutes />} />
        <Route path="/admin/*" element={<AdminRoutes />} />  */}
        <Route path="/user/*" element={<UserRoutes />} />
        <Route path="/tutor/*" element={<TutorRoutes />} />
        <Route path="/admin/*" element={<AdminRoutes />} />
         <Route path="*" element={<NotFoundPage />} />
        
      </Routes>
    </Router>
    
    </>

    
  );
}

export default App; 