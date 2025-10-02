import { Navigate } from 'react-router-dom';

const AdminProtectedRoute = ({ children }) => {
  const adminToken = localStorage.getItem('adminAuthToken');
  const adminInfo = localStorage.getItem('adminInfo');
  
  if (!adminToken || !adminInfo) {
    return <Navigate to="/admin/login" replace />;
  }
  
  return children;
};

export default AdminProtectedRoute;