//Profile page 
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Profile: React.FC = () => {
  const [user, setUser] = useState<{ id: string; username: string; email: string; avatar: string } | null>(null);
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
        const response = await axios.get('/api/user/profile', { withCredentials: true });       
        setUser(response.data);
        } catch (err) {
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }
, []);

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
        withCredentials: true
      });
      setUser(prev => prev ? { ...prev, avatar: response.data.avatar } : prev);
      setAvatarFile(null);
    } catch (err) {
      setError('Failed to upload avatar');
    }
  };

  const handlePasswordChange = async () => {
    try {
      await axios.put('/api/user/password', { oldPassword, newPassword }, { withCredentials: true });
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
    <div>
      <h1>Profile</h1>
      <img src={user.avatar} alt="Avatar" width={100} height={100} />
      <p>Username: {user.username}</p>
      <p>Email: {user.email}</p>

      <div>
        <h2>Update Avatar</h2>
        <input type="file" onChange={handleAvatarChange} />
        <button onClick={handleAvatarUpload} disabled={!avatarFile}>Upload</button>
      </div>

      <div>
        <h2>Change Password</h2>
        <input type="password" placeholder="Old Password" value={oldPassword} onChange={e => setOldPassword(e.target.value)} />
        <input type="password" placeholder="New Password" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
        <button onClick={handlePasswordChange}>Change Password</button>
        {passwordMessage && <p>{passwordMessage}</p>}
      </div>

      <div>
        <h2>Delete Profile</h2>
        <button onClick={handleDeleteProfile}>Delete Profile</button>
        {deleteMessage && <p>{deleteMessage}</p>}
      </div>
    </div>
  );
};

export default Profile;


