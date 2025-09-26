import React from 'react';
// // import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './Landing/LandingPage';
// import UserRoutes from './components/UserRoutes';
// import AdminRoutes from './components/AdminRoutes';
import NotFoundPage from './ui/NotFound';

function App() {
  return (
    // <Router>
    //   <Routes>
    //     <Route path="/" element={<LandingPage />} />
    //     <Route path="/user/*" element={<UserRoutes />} />
    //     <Route path="/admin/*" element={<AdminRoutes />} /> 
    //      <Route path="*" element={<NotFoundPage />} />
    //   </Routes>
    // </Router>
    <>
    <LandingPage/>
    {/* <NotFoundPage/> */}
    
    </>
    
  );
}

export default App; 