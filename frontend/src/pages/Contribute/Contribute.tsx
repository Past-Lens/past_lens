import React from 'react';
import ProfileHeader from '@/components/custom/ProfileHeader';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
} from '@/components/ui/dialog';

const contributionCards = [
    {
        id: 'song',
        title: 'Song',
        desc: 'Share a traditional song, ritual chants or recordings.',
    },
    {
        id: 'artifact',
        title: 'Artifact',
        desc: 'Upload photos or descriptions of objects from your culture.',
    },
    {
        id: 'photo',
        title: 'Photo',
        desc: 'Photos of events, people, and places.',
    },
    {
        id: 'story',
        title: 'Story',
        desc: 'Oral histories and written stories.',
    },
];

const Contribute: React.FC = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200 dark:from-slate-900 dark:to-slate-800 py-12">
            <ProfileHeader username={'You'} />

            <div className="max-w-6xl mx-auto px-6">
                <header className="text-center py-12">
                    <h1 className="text-4xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-pink-600">
                        Share More About Your Culture
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Tell the world about the music, artifacts, stories and
                        traditions that shaped your community. Choose how you'd
                        like to contribute below.
                    </p>
                </header>

                <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                    <div className="rounded-2xl p-8 bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-700 shadow-lg">
                        <h3 className="text-2xl font-semibold mb-3">
                            Contribution Types
                        </h3>
                        <p className="text-sm text-muted-foreground mb-6">
                            Choose a content type to learn more and start adding
                            your contribution.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {contributionCards.map((c) => (
                                <div
                                    key={c.id}
                                    className="p-4 rounded-lg border bg-white dark:bg-slate-900 hover:scale-[1.02] transition-transform shadow-sm"
                                >
                                    <h4 className="font-semibold">{c.title}</h4>
                                    <p className="text-sm text-muted-foreground">
                                        {c.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-2xl p-8 bg-gradient-to-br from-indigo-50 to-pink-50 dark:from-indigo-900 dark:to-pink-900 shadow-lg">
                        <h3 className="text-2xl font-semibold mb-3">
                            Quick Contribution Methods
                        </h3>
                        <p className="text-sm text-muted-foreground mb-6">
                            Two fast ways to contribute: capture live media or
                            use the multi-step form.
                        </p>

                        <div className="grid grid-cols-1 gap-4">
                            <div className="p-4 rounded-lg bg-white dark:bg-slate-900 shadow hover:shadow-lg transition-shadow">
                                <h4 className="font-semibold">Live media</h4>
                                <p className="text-sm text-muted-foreground mb-3">
                                    Record audio, take photos or capture short
                                    video right from your browser.
                                </p>
                                <div className="flex gap-2">
                                    <select className="rounded border px-3 py-2">
                                        <option>Song</option>
                                        <option>Story</option>
                                        <option>Artifact</option>
                                    </select>
                                    <Button variant="default">Record</Button>
                                </div>
                            </div>

                            <div className="p-4 rounded-lg bg-white dark:bg-slate-900 shadow hover:shadow-lg transition-shadow">
                                <h4 className="font-semibold">Multiform</h4>
                                <p className="text-sm text-muted-foreground mb-3">
                                    Fill the detailed multi-step contribution
                                    form. Ask AI for help to craft your
                                    submission.
                                </p>
                                <div className="flex gap-2">
                                    <Button variant="default">Open Form</Button>
                                    <Button variant="outline">Ask AI</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Archive placeholder - will add later */}
                <section className="rounded-2xl p-8 bg-white dark:bg-slate-900 shadow-lg">
                    <h3 className="text-xl font-semibold mb-2">
                        Archive (coming soon)
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        We'll surface previously contributed items here.
                    </p>
                </section>
            </div>
        </div>
    );
};

export default Contribute;
