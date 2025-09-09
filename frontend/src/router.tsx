//router.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Import your components/pages here
// import Home from './pages/Home';
import Homepage from './pages/homepage'
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

const AppRouter = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Register />} />
                {/* Add more routes as needed */}
            </Routes>
        </Router>
    );
}                   
export default AppRouter;