import { useState, useEffect, useRef } from 'react';
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
import ProfileHeader from '@/components/custom/ProfileHeader';

const Profile = () => {
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

    // Edit form state for basic info
    const [editFirst, setEditFirst] = useState('');
    const [editLast, setEditLast] = useState('');
    const [editUsername, setEditUsername] = useState('');
    const [editEmail, setEditEmail] = useState('');
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const avatarPreviewRef = useRef<string | null>(null);
    const [currentPlan, setCurrentPlan] = useState('Free');
    const [activeTab, setActiveTab] = useState<
        'details' | 'edit' | 'password' | 'plan'
    >('details');

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
    // useEffect(() => {
    //     const fetchProfile = async () => {
    //         try {
    //             const response = await axios.get('/api/user/profile', {
    //                 withCredentials: true,
    //             });
    //             setUser(response.data);
    //         } catch (err) {
    //             setError('Failed to load profile');
    //         } finally {
    //             setLoading(false);
    //         }
    //     };
    //     fetchProfile();
    // }, []);

    // Initialize local edit fields when user data becomes available
    useEffect(() => {
        if (user) {
            // some users may have a `name` and `plan` fields
            const fullName = (user as any).name ?? '';
            const parts = fullName.split(' ').filter(Boolean);
            setEditFirst(parts[0] ?? '');
            setEditLast(parts.slice(1).join(' ') ?? '');
            setEditUsername(user.username);
            setEditEmail(user.email);
            setAvatarPreview((user as any).avatar ?? null);
            setCurrentPlan((user as any).plan ?? 'Free');
            setLoading(false);
        }
    }, [user]);

    // cleanup for object URL previews
    useEffect(() => {
        return () => {
            if (avatarPreviewRef.current) {
                URL.revokeObjectURL(avatarPreviewRef.current);
                avatarPreviewRef.current = null;
            }
        };
    }, []);

    const planTiers = [
        {
            id: 'Free',
            title: 'Free',
            price: '$0/mo',
            gradient:
                'from-rose-100 to-rose-300 dark:from-rose-900 dark:to-rose-700',
        },
        {
            id: 'Business',
            title: 'Business',
            price: '$29/mo',
            gradient:
                'from-indigo-100 to-indigo-300 dark:from-indigo-900 dark:to-indigo-700',
        },
        {
            id: 'Learning',
            title: 'Learning Institution',
            price: '$99/mo',
            gradient:
                'from-green-100 to-green-300 dark:from-green-900 dark:to-green-700',
        },
    ];

    const handleUpdateBasicInfo = async () => {
        try {
            const payload = {
                name: `${editFirst} ${editLast}`.trim(),
                username: editUsername,
                email: editEmail,
            };
            const res = await axios.put('/api/user/profile', payload, {
                withCredentials: true,
            });
            // Update local user copy optimistically
            setUser((prev) =>
                prev
                    ? {
                          ...prev,
                          username: editUsername,
                          email: editEmail,
                          ...(res.data?.name ? { name: res.data.name } : {}),
                      }
                    : prev
            );
        } catch (err) {
            // ignore for now or setError
        }
    };

    const handleSelectPlan = async (planId: string) => {
        if (planId === currentPlan) return;
        try {
            await axios.put(
                '/api/user/plan',
                { plan: planId },
                { withCredentials: true }
            );
            setCurrentPlan(planId);
            setUser((prev) => (prev ? { ...prev, plan: planId } : prev));
        } catch (err) {
            // handle error
        }
    };

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
            const file = e.target.files[0];
            setAvatarFile(file);
            // create a preview URL and revoke previous
            if (avatarPreviewRef.current) {
                URL.revokeObjectURL(avatarPreviewRef.current);
                avatarPreviewRef.current = null;
            }
            const url = URL.createObjectURL(file);
            avatarPreviewRef.current = url;
            setAvatarPreview(url);
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

    // if (loading) {
    //     return (
    //         <div className="min-h-screen flex items-center justify-center">
    //             <Loader/>
    //         </div>
    //     );
    // }
    // if (error) return <div>{error}</div>;
    // if (!user) return <div>No user data</div>;

    // --- JSX (unchanged) ---

    return (
        <div
            className="min-h-screen flex items-start flex-col
        justify-start bg-gradient-to-br from-slate-100 to-slate-300 dark:from-slate-900 dark:to-slate-800 relative"
        >
            <ProfileHeader username={user?.username || 'EA'} />

            {/* Mini nav - choose which section to focus on */}
            <div className="w-full max-w-4xl mx-auto p-4">
                <nav className="flex gap-3 justify-center mb-6">
                    <button
                        onClick={() => setActiveTab('details')}
                        className={`px-4 py-2 rounded ${activeTab === 'details' ? 'bg-primary text-white' : 'bg-white dark:bg-slate-800'}`}
                    >
                        My Details
                    </button>
                    <button
                        onClick={() => setActiveTab('edit')}
                        className={`px-4 py-2 rounded ${activeTab === 'edit' ? 'bg-primary text-white' : 'bg-white dark:bg-slate-800'}`}
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => setActiveTab('password')}
                        className={`px-4 py-2 rounded ${activeTab === 'password' ? 'bg-primary text-white' : 'bg-white dark:bg-slate-800'}`}
                    >
                        Password
                    </button>
                    <button
                        onClick={() => setActiveTab('plan')}
                        className={`px-4 py-2 rounded ${activeTab === 'plan' ? 'bg-primary text-white' : 'bg-white dark:bg-slate-800'}`}
                    >
                        Plan
                    </button>
                </nav>

                {/* Single large card area - only the active section shows */}
                <div className="mx-auto">
                    {activeTab === 'details' && (
                        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-10 max-w-4xl mx-auto">
                            <div className="flex flex-col items-center gap-4">
                                <img
                                    src={user?.avatar!}
                                    alt="Avatar"
                                    className="w-32 h-32 rounded-full border-4 border-primary object-cover shadow"
                                />
                                <h2 className="text-2xl font-bold">
                                    {(user as any)?.name ?? user?.username}
                                </h2>
                                <p className="text-muted-foreground">
                                    {user?.email}
                                </p>
                                <p className="text-sm mt-2">
                                    Current plan: <strong>{currentPlan}</strong>
                                </p>
                            </div>

                            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-700 dark:text-slate-300">
                                <div className="space-y-2">
                                    <div className="font-medium">Username</div>
                                    <div>{user?.username}</div>
                                </div>
                                <div className="space-y-2">
                                    <div className="font-medium">Email</div>
                                    <div>{user?.email}</div>
                                </div>
                                <div className="space-y-2">
                                    <div className="font-medium">Name</div>
                                    <div>{(user as any)?.name ?? '-'}</div>
                                </div>
                                <div className="space-y-2">
                                    <div className="font-medium">Joined</div>
                                    <div>
                                        {(user as any)?.createdAt
                                            ? new Date(
                                                  (user as any).createdAt
                                              ).toLocaleDateString()
                                            : 'N/A'}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 border-t pt-6">
                                <h4 className="text-sm font-semibold mb-2 text-red-600">
                                    Danger Zone
                                </h4>
                                <p className="text-xs text-muted-foreground mb-3">
                                    Deleting your profile is permanent and
                                    cannot be undone.
                                </p>
                                <button
                                    onClick={handleDeleteProfile}
                                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                                >
                                    Delete Profile
                                </button>
                                {deleteMessage && (
                                    <p className="text-sm text-red-600 mt-2">
                                        {deleteMessage}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'edit' && (
                        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-10 max-w-4xl mx-auto">
                            <h3 className="text-2xl font-semibold mb-4">
                                Edit Profile
                            </h3>

                            <div className="flex items-center gap-8 flex-wrap">
                                <div className="md:col-span-1 flex flex-col items-center">
                                    <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-primary mb-3">
                                        <img
                                            src={
                                                avatarPreview ??
                                                user?.avatar ??
                                                ''
                                            }
                                            alt="Avatar preview"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            onChange={handleAvatarChange}
                                            className="rounded border px-3 py-2 text-sm"
                                        />
                                        <button
                                            onClick={handleAvatarUpload}
                                            disabled={!avatarFile}
                                            className="bg-primary text-white px-3 py-2 rounded disabled:opacity-50"
                                        >
                                            Upload
                                        </button>
                                    </div>
                                </div>

                                <div className="md:col-span-2 space-y-3">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <input
                                            value={editFirst}
                                            onChange={(e) =>
                                                setEditFirst(e.target.value)
                                            }
                                            placeholder="First name"
                                            className="rounded border px-3 py-3"
                                        />
                                        <input
                                            value={editLast}
                                            onChange={(e) =>
                                                setEditLast(e.target.value)
                                            }
                                            placeholder="Last name"
                                            className="rounded border px-3 py-3"
                                        />
                                    </div>

                                    <div>
                                        <input
                                            value={editUsername}
                                            onChange={(e) =>
                                                setEditUsername(e.target.value)
                                            }
                                            placeholder="Username"
                                            className="w-full rounded border px-3 py-3"
                                        />
                                    </div>

                                    <div>
                                        <input
                                            value={editEmail}
                                            onChange={(e) =>
                                                setEditEmail(e.target.value)
                                            }
                                            placeholder="Email"
                                            className="w-full rounded border px-3 py-3"
                                        />
                                    </div>

                                    <div className="flex gap-3 mt-2">
                                        <button
                                            onClick={handleUpdateBasicInfo}
                                            className="bg-primary text-white px-4 py-2 rounded"
                                        >
                                            Save Changes
                                        </button>
                                        <button
                                            onClick={() => {
                                                setEditFirst(
                                                    (user as any)?.name?.split(
                                                        ' '
                                                    )[0] ?? ''
                                                );
                                                setEditLast(
                                                    (user as any)?.name
                                                        ?.split(' ')
                                                        .slice(1)
                                                        .join(' ') ?? ''
                                                );
                                                setEditUsername(
                                                    user?.username ?? ''
                                                );
                                                setEditEmail(user?.email ?? '');
                                                // restore preview to existing avatar
                                                setAvatarPreview(
                                                    (user as any)?.avatar ??
                                                        null
                                                );
                                            }}
                                            className="px-4 py-2 rounded border"
                                        >
                                            Reset
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'password' && (
                        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-10 max-w-4xl mx-auto">
                            <h3 className="text-2xl font-semibold mb-4">
                                Update Password
                            </h3>
                            <div className="space-y-4">
                                <input
                                    type="password"
                                    placeholder="Old Password"
                                    value={oldPassword}
                                    onChange={(e) =>
                                        setOldPassword(e.target.value)
                                    }
                                    className="border rounded px-3 py-3 w-full"
                                />
                                <input
                                    type="password"
                                    placeholder="New Password"
                                    value={newPassword}
                                    onChange={(e) =>
                                        setNewPassword(e.target.value)
                                    }
                                    className="border rounded px-3 py-3 w-full"
                                />
                                <div className="flex gap-3">
                                    <button
                                        onClick={handlePasswordChange}
                                        className="bg-primary text-white px-4 py-2 rounded"
                                    >
                                        Change Password
                                    </button>
                                </div>
                                {passwordMessage && (
                                    <p className="text-sm text-green-600 mt-2">
                                        {passwordMessage}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'plan' && (
                        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-10 max-w-4xl mx-auto">
                            <h3 className="text-2xl font-semibold mb-4">
                                Choose a Plan
                            </h3>
                            <p className="text-sm mb-6">
                                Your current plan is{' '}
                                <strong>{currentPlan}</strong>. Select a tier
                                below.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {planTiers.map((tier) => (
                                    <div
                                        key={tier.id}
                                        className={`rounded-xl p-6 shadow-xl bg-gradient-to-br ${tier.gradient} text-slate-900 dark:text-slate-100`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h4 className="text-xl font-bold">
                                                    {tier.title}
                                                </h4>
                                                <p className="text-sm">
                                                    {tier.price}
                                                </p>
                                            </div>
                                            <div>
                                                <button
                                                    onClick={() =>
                                                        handleSelectPlan(
                                                            tier.id
                                                        )
                                                    }
                                                    className={`px-4 py-2 rounded ${currentPlan === tier.id ? 'bg-white text-slate-900' : 'bg-slate-900 text-white'}`}
                                                >
                                                    {currentPlan === tier.id
                                                        ? 'Current'
                                                        : 'Select Tier'}
                                                </button>
                                            </div>
                                        </div>
                                        <p className="mt-4 text-sm opacity-90">
                                            {tier.id === 'Free'
                                                ? 'Basic access, good to get started.'
                                                : tier.id === 'Business'
                                                  ? 'Team collaboration and advanced features.'
                                                  : 'Discounted pricing for learning institutions.'}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
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
