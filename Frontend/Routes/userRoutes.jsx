import { Routes ,Route , Navigate} from "react-router-dom"; 
import Register from "../src/Pages/USER/Register";
import Login from "../src/Pages/USER/Login";
import HomePage from "../src/Pages/USER/Home";
import NotFoundPage from "../src/ui/NotFound";




const UserRoutes = () => {
  return (
    <Routes>
        {/*Public Routes*/}
        <Route path="register" element={<Register/>}/>
        
        <Route path="login" element={<Login/>}/>
       
       <Route path="home" element={<HomePage/>}/>
       <Route path="*"  element={<NotFoundPage/>}/>
    </Routes>
  );
}

export default UserRoutes;