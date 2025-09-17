import ForgotPassword from "./pages/auth/ForgotPassword";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Homepage from "./pages/homepage";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
};
export default AppRouter;
