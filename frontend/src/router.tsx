import ForgotPassword from './pages/auth/ForgotPassword';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Homepage from './pages/homepage';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/admin/dashboard';
import Protected from './components/custom/protected';
import Contributions from './pages/admin/contributions';
import UserManagement from './pages/admin/usermanagement';
import Settings from './pages/admin/settings';
import Overview from './pages/admin/overview';
import Application from './pages/admin/application';
import Profile from './pages/Profile/Profile';
import Contribute from './pages/Contribute/Contribute';
import Museum from './pages/museum/halls/museum';
import Artifacts from './pages/museum/halls/artifacts';
import Stories from './pages/museum/halls/stories';
import Library from './pages/museum/halls/library';
import Guide from './pages/museum/guide';
import Discover from './pages/museum/halls/discover';
import ImmersiveMuseum from './pages/museum/halls/immersive';

const AppRouter = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />

                {/* Museum Routes */}
                <Route path="/museum" element={<Museum />} />
                <Route path="/museum/halls/artifacts" element={<Artifacts />} />
                <Route path="/museum/halls/stories" element={<Stories />} />
                <Route path="/museum/halls/library" element={<Library />} />
                <Route path="/museum/halls/discover" element={<Discover />} />
                <Route path="/museum/halls/vr" element={<ImmersiveMuseum />} />
                <Route path="/museum/guide" element={<Guide />} />
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
                    path="user/profile"
                    element={
                        <Protected>
                            <Profile />
                        </Protected>
                    }
                />
                <Route
                    path="/contribute"
                    element={
                        <Protected>
                            <Contribute />
                        </Protected>
                    }
                />
                <Route
                    path="/museum"
                    element={
                        <Protected>
                            <Museum />
                        </Protected>
                    }
                />

                {/* Add more routes as needed */}
            </Routes>
        </Router>
    );
};
export default AppRouter;
