//router.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Import your components/pages here
// import Home from './pages/Home';
import Login from './pages/auth/Login';
 import Register from './pages/auth/Register';
 import ForgotPassword from './pages/auth/ForgotPassword';

const AppRouter = () => {
    return (
        <Router>
            <Routes>
                {/* <Route path="/" element={<Home />} /> */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
               
            </Routes>
        </Router>
    );
}                   
export default AppRouter;