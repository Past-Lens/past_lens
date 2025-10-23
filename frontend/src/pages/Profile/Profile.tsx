import React, { useState, useEffect, useRef } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { contributionData } from '@/utils/chartdata';
import axios from 'axios';
import Header from '@/components/custom/Header';

const Profile: React.FC = () => {
    // --- All hooks declared unconditionally at the top level ---
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

    // Multi-step form hooks (moved here so they're always called)
    const [formOpen, setFormOpen] = useState(false);
    const [step, setStep] = useState(1);
    const [form, setForm] = useState({
        community: '',
        type: '',
        source: '',
        title: '',
        description: '',
        content: '',
        files: [] as File[],
    });
    const fileInputRef = useRef<HTMLInputElement>(null);

    const contributionTypes = [
        'Story',
        'Artifact',
        'Photo',
        'Audio',
        'Video',
        'Research',
    ];
    const communities = Array.from(
        new Set(contributionData.map((c) => c.community))
    );

    // --- Effects ---
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

    // --- Handlers (no render-return logic inside them) ---
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
            await axios.put('/api/user/avatar', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials: true,
            });
            // Optionally reload profile or update avatar locally
            // e.g. fetchProfile() or setUser(prev => prev ? {...prev, avatar: newUrl} : prev)
        } catch (err) {
            // handle error
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

    function handleFormNext() {
        setStep((s) => Math.min(s + 1, 4));
    }
    function handleFormBack() {
        setStep((s) => Math.max(s - 1, 1));
    }
    function handleFormChange(
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
    }
    function handleFormFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const files = e.target.files;
        setForm((f) => ({ ...f, files: files ? Array.from(files) : [] }));
    }
    function handleFormSubmit(e: React.FormEvent) {
        e.preventDefault();
        setFormOpen(false);
        setStep(1);
        setForm({
            community: '',
            type: '',
            source: '',
            title: '',
            description: '',
            content: '',
            files: [],
        });
        // Submission logic here
    }

    // --- Render guards AFTER all hooks are declared ---
    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
    if (!user) return <div>No user data</div>;

    // --- JSX (unchanged) ---
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-300 dark:from-slate-900 dark:to-slate-800 py-12 px-4 relative">
            <Header />
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

            {/* Floating Button */}
            <Button
                className="fixed bottom-8 right-8 z-50 shadow-lg rounded-full h-14 w-14 flex items-center justify-center text-2xl bg-primary text-white hover:bg-primary/90"
                onClick={() => setFormOpen(true)}
                variant="default"
            >
                +
            </Button>

            {/* Multi-step Contribution Form Dialog */}
            <Dialog open={formOpen} onOpenChange={setFormOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>New Contribution</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleFormSubmit} className="space-y-4">
                        {/* Stepper */}
                        <div className="flex items-center justify-between mb-2">
                            {[1, 2, 3, 4].map((s) => (
                                <div
                                    key={s}
                                    className={`flex-1 h-2 mx-1 rounded-full ${step >= s ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700'}`}
                                ></div>
                            ))}
                        </div>

                        {/* Steps */}
                        {step === 1 && (
                            <div>
                                <label className="block text-xs font-semibold mb-1">
                                    Community
                                </label>
                                <select
                                    name="community"
                                    value={form.community}
                                    onChange={handleFormChange}
                                    className="w-full rounded border px-3 py-2 text-sm"
                                    required
                                >
                                    <option value="" disabled>
                                        Select community
                                    </option>
                                    {communities.map((c) => (
                                        <option key={c} value={c}>
                                            {c}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {step === 2 && (
                            <div>
                                <label className="block text-xs font-semibold mb-1">
                                    Type of Contribution
                                </label>
                                <select
                                    name="type"
                                    value={form.type}
                                    onChange={handleFormChange}
                                    className="w-full rounded border px-3 py-2 text-sm"
                                    required
                                >
                                    <option value="" disabled>
                                        Select type
                                    </option>
                                    {contributionTypes.map((t) => (
                                        <option key={t} value={t}>
                                            {t}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {step === 3 && (
                            <div>
                                <label className="block text-xs font-semibold mb-1">
                                    Source (optional)
                                </label>
                                <input
                                    name="source"
                                    value={form.source}
                                    onChange={handleFormChange}
                                    className="w-full rounded border px-3 py-2 text-sm"
                                    placeholder="e.g. Book, Oral, Archive, etc."
                                />
                            </div>
                        )}

                        {step === 4 && (
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-xs font-semibold mb-1">
                                        Title
                                    </label>
                                    <input
                                        name="title"
                                        value={form.title}
                                        onChange={handleFormChange}
                                        className="w-full rounded border px-3 py-2 text-sm"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold mb-1">
                                        Description
                                    </label>
                                    <textarea
                                        name="description"
                                        value={form.description}
                                        onChange={handleFormChange}
                                        className="w-full rounded border px-3 py-2 text-sm"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold mb-1">
                                        Content
                                    </label>
                                    <textarea
                                        name="content"
                                        value={form.content}
                                        onChange={handleFormChange}
                                        className="w-full rounded border px-3 py-2 text-sm"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold mb-1">
                                        Upload Files
                                    </label>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        multiple
                                        onChange={handleFormFileChange}
                                        className="w-full rounded border px-3 py-2 text-sm bg-white dark:bg-slate-900"
                                    />
                                    {form.files.length > 0 && (
                                        <div className="mt-2 flex flex-wrap gap-2">
                                            {form.files.map((file, i) => (
                                                <span
                                                    key={file.name + i}
                                                    className="inline-block px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-xs font-mono"
                                                >
                                                    {file.name}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        <DialogFooter className="flex flex-row gap-2 justify-between mt-4">
                            <div>
                                {step > 1 && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handleFormBack}
                                    >
                                        Back
                                    </Button>
                                )}
                            </div>
                            <div className="flex gap-2">
                                {step < 4 && (
                                    <Button
                                        type="button"
                                        onClick={handleFormNext}
                                    >
                                        Next
                                    </Button>
                                )}
                                {step === 4 && (
                                    <Button type="submit">Submit</Button>
                                )}
                                <DialogClose asChild>
                                    <Button type="button" variant="ghost">
                                        Cancel
                                    </Button>
                                </DialogClose>
                            </div>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Profile;
