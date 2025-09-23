import ForgotPassword from './pages/auth/ForgotPassword';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Homepage from './pages/homepage';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/admin/dashboard';
import Protected from './components/custom/protected';
import Contributions from './pages/admin/contributions';
import UserManagement from './pages/admin/usermanagement';
import Settings from './pages/admin/settings.tsx';
import Overview from './pages/admin/overview';
import Application from './pages/admin/application.tsx';
import Profile from './pages/Profile/Profile.tsx';

const AppRouter = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route
                    path="/admin"
                    element={
                        <Protected>
                            <Dashboard />
                        </Protected>
                    }
                >
                    <Route
                        index
                        path="/admin"
                        element={
                            <Protected>
                                <Overview />
                            </Protected>
                        }
                    />
                    <Route
                        path="/admin/users"
                        element={
                            <Protected>
                                <UserManagement />
                            </Protected>
                        }
                    />
                    <Route
                        path="/admin/contributions"
                        element={
                            <Protected>
                                <Contributions />
                            </Protected>
                        }
                    />
                    <Route
                        path="/admin/application"
                        element={
                            <Protected>
                                <Application />
                            </Protected>
                        }
                    />
                    <Route
                        path="/admin/settings"
                        element={
                            <Protected>
                                <Settings />
                            </Protected>
                        }
                    />
                </Route>

                {/*antitciapted user routes*/}
                <Route
                    path="/profile"
                    element={
                        <Protected>
                            <Profile />
                        </Protected>
                    }
                />
                <Route
                    path="user/contribute"
                    element={
                        <Protected>
                            <>
                                {/*Put the name of the userprofilepage component */}
                            </>
                        </Protected>
                    }
                />

                {/* Add more routes as needed */}
            </Routes>
        </Router>
    );
};
export default AppRouter;
