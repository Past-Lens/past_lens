import { useState } from 'react';
import Footer from '@/components/custom/Footer';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import useUserStore from '@/stores/userStore';

export default function Settings() {
    const { user, isAuthenticated } = useUserStore();
    console.log(isAuthenticated);
    const [form, setForm] = useState({
        fullName: `${user?.first_name} ${user?.last_name}` || 'Admin One',
        email: user?.user_email || 'admin@example.com',
        username: user?.user_name || 'example user',
    });
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setSaved(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setTimeout(() => {
            setSaving(false);
            setSaved(true);
        }, 1200);
    };

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <div className="flex justify-center items-center flex-1 min-h-[80vh]">
                <Card className="w-full max-w-xl p-8 flex flex-col gap-6">
                    <CardHeader className="items-center">
                        <div className="w-20 h-20 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-3xl mb-2">
                            {form.fullName
                                .split(' ')
                                .map((n) => n[0])
                                .join('')}
                        </div>
                        <CardTitle className="text-center">
                            Profile Settings
                        </CardTitle>
                    </CardHeader>
                    <form
                        className="flex flex-col gap-4"
                        onSubmit={handleSubmit}
                    >
                        <div>
                            <Label htmlFor="fullName">Full Name</Label>
                            <Input
                                id="fullName"
                                name="fullName"
                                value={form.fullName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                value={form.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="username">Username</Label>
                            <Input
                                id="username"
                                name="username"
                                value={form.username}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <Button
                            type="submit"
                            className="mt-2"
                            disabled={saving}
                        >
                            {saving ? 'Saving...' : 'Update Profile'}
                        </Button>
                        {saved && (
                            <div className="text-green-600 text-center text-sm mt-2">
                                Profile updated!
                            </div>
                        )}
                    </form>
                </Card>
            </div>
            <Footer />
        </div>
    );
}
