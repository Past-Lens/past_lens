//Profile page
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Profile: React.FC = () => {
    const [user, setUser] = useState<{
        id: string;
        username: string;
        email: string;
        avatar: string;
    } | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [passwordMessage, setPasswordMessage] = useState<string | null>(null);
    const [deleteMessage, setDeleteMessage] = useState<string | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get('/api/user/profile', {
                    withCredentials: true,
                });
                setUser(response.data);
            } catch (err) {
                setError('Failed to load profile');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setAvatarFile(e.target.files[0]);
        }
    };

    const handleAvatarUpload = async () => {
        if (!avatarFile) return;
        const formData = new FormData();
        formData.append('avatar', avatarFile);
        try {
            const response = await axios.put('/api/user/avatar', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials: true,
            });
            setUser((prev) =>
                prev ? { ...prev, avatar: response.data.avatar } : prev
            );
            setAvatarFile(null);
        } catch (err) {
            setError('Failed to upload avatar');
        }
    };

    const handlePasswordChange = async () => {
        try {
            await axios.put(
                '/api/user/password',
                { oldPassword, newPassword },
                { withCredentials: true }
            );
            setPasswordMessage('Password updated successfully');
            setOldPassword('');
            setNewPassword('');
        } catch (err) {
            setPasswordMessage('Failed to update password');
        }
    };

    const handleDeleteProfile = async () => {
        try {
            await axios.delete('/api/user/profile', { withCredentials: true });
            setDeleteMessage('Profile deleted successfully');
            setUser(null);
        } catch (err) {
            setDeleteMessage('Failed to delete profile');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
    if (!user) return <div>No user data</div>;

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-300 dark:from-slate-900 dark:to-slate-800 py-12 px-4">
            <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-xl shadow-lg p-8 flex flex-col gap-8">
                <div className="flex flex-col items-center gap-2">
                    <img
                        src={user.avatar}
                        alt="Avatar"
                        className="w-24 h-24 rounded-full border-4 border-primary object-cover shadow"
                    />
                    <h1 className="text-2xl font-bold mt-2">{user.username}</h1>
                    <p className="text-muted-foreground">{user.email}</p>
                </div>

                <div className="border-t pt-6 flex flex-col gap-4">
                    <h2 className="text-lg font-semibold mb-2">
                        Update Avatar
                    </h2>
                    <div className="flex gap-2 items-center">
                        <input
                            type="file"
                            onChange={handleAvatarChange}
                            className="file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-primary file:text-white"
                        />
                        <button
                            onClick={handleAvatarUpload}
                            disabled={!avatarFile}
                            className="bg-primary text-white px-4 py-2 rounded disabled:opacity-50"
                        >
                            Upload
                        </button>
                    </div>
                </div>

                <div className="border-t pt-6 flex flex-col gap-4">
                    <h2 className="text-lg font-semibold mb-2">
                        Change Password
                    </h2>
                    <input
                        type="password"
                        placeholder="Old Password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        className="border rounded px-3 py-2 w-full"
                    />
                    <input
                        type="password"
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="border rounded px-3 py-2 w-full"
                    />
                    <button
                        onClick={handlePasswordChange}
                        className="bg-primary text-white px-4 py-2 rounded"
                    >
                        Change Password
                    </button>
                    {passwordMessage && (
                        <p className="text-sm text-center text-green-600 dark:text-green-400 mt-1">
                            {passwordMessage}
                        </p>
                    )}
                </div>

                <div className="border-t pt-6 flex flex-col gap-4">
                    <h2 className="text-lg font-semibold mb-2 text-red-600">
                        Delete Profile
                    </h2>
                    <button
                        onClick={handleDeleteProfile}
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                    >
                        Delete Profile
                    </button>
                    {deleteMessage && (
                        <p className="text-sm text-center text-red-600 mt-1">
                            {deleteMessage}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
