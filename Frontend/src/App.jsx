import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './Landing/LandingPage';
// import UserRoutes from './components/UserRoutes';
// import AdminRoutes from './components/AdminRoutes';
import NotFoundPage from './ui/NotFound';

import UserRoutes from "../Routes/userRoutes";

function App() {
  return (
    
    <>
    
   <Router>
      <Routes>
        <Route path="/" element={
          // <PublicRoutes>
          //      <LandingPage />
          // </PublicRoutes>
          <LandingPage />
         
          } />
        {/* <Route path="/user/*" element={<UserRoutes />} />
        <Route path="/admin/*" element={<AdminRoutes />} />  */}
        <Route path="/user/*" element={<UserRoutes />} />
         <Route path="*" element={<NotFoundPage />} />
        
      </Routes>
    </Router>
    
    </>

    
  );
}

export default App; 