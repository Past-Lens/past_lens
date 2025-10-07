import React, { useState, useRef } from 'react';
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

    const [recording, setRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const [cameraOn, setCameraOn] = useState(false);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const cameraStreamRef = useRef<MediaStream | null>(null);
    const [photoBlob, setPhotoBlob] = useState<Blob | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);

    const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
    const [aiLoading, setAiLoading] = useState(false);
    const [savingDraft, setSavingDraft] = useState(false);
    const [savedDraft, setSavedDraft] = useState<any | null>(null);
    const [aiDraftExplanation, setAiDraftExplanation] = useState<string | null>(
        null
    );
    const dialogFileRef = useRef<HTMLInputElement | null>(null);

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
        // TODO: send to backend
    }

    // Recording handlers (audio only)
    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true,
            });
            const mr = new MediaRecorder(stream);
            audioChunksRef.current = [];
            mr.ondataavailable = (e) => audioChunksRef.current.push(e.data);
            mr.onstop = () => {
                const blob = new Blob(audioChunksRef.current, {
                    type: 'audio/webm',
                });
                setAudioBlob(blob);
            };
            mediaRecorderRef.current = mr;
            mr.start();
            setRecording(true);
        } catch (err) {
            console.error('Recording failed', err);
        }
    };

    const stopRecording = () => {
        if (
            mediaRecorderRef.current &&
            mediaRecorderRef.current.state !== 'inactive'
        ) {
            mediaRecorderRef.current.stop();
            mediaRecorderRef.current.stream
                .getTracks()
                .forEach((t) => t.stop());
        }
        setRecording(false);
    };

    // Camera handlers (photo capture)
    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
            });
            cameraStreamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                await videoRef.current.play();
            }
            setCameraOn(true);
        } catch (err) {
            console.error('Camera failed', err);
        }
    };

    const capturePhoto = () => {
        if (!videoRef.current) return;
        const video = videoRef.current;
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
            if (blob) {
                setPhotoBlob(blob);
                const url = URL.createObjectURL(blob);
                setPhotoPreview(url);
            }
        }, 'image/jpeg');
    };

    const stopCamera = () => {
        if (cameraStreamRef.current) {
            cameraStreamRef.current.getTracks().forEach((t) => t.stop());
            cameraStreamRef.current = null;
        }
        if (videoRef.current) {
            try {
                videoRef.current.pause();
            } catch {}
            videoRef.current.srcObject = null;
        }
        setCameraOn(false);
    };

    // Ask AI - calls /api/chat with a prefilled prompt
    const askAiForHelp = async (contextHint = '') => {
        setAiLoading(true);
        try {
            const prompt = `Please suggest a concise helpful description and title for a contribution about: ${contextHint || 'general cultural content'}`;
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chatInput: prompt }),
            });
            const data = await res.json();
            setAiSuggestion(data.botResponse || '');
            setAiLoading(false);
        } catch (err) {
            setAiLoading(false);
            console.error(err);
        }
    };

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

                {/* Contribution Types - full width */}
                <section className="mb-10">
                    <div className="rounded-2xl p-8 bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-700 shadow-lg">
                        <h3 className="text-2xl font-semibold mb-3">
                            Contribution Types
                        </h3>
                        <p className="text-sm text-muted-foreground mb-6">
                            Choose a content type to learn more and start adding
                            your contribution.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {contributionCards.map((c) => (
                                <div
                                    key={c.id}
                                    className="p-6 rounded-xl border bg-white dark:bg-slate-900 hover:scale-[1.02] transition-transform shadow-md"
                                >
                                    <h4 className="font-semibold text-lg">
                                        {c.title}
                                    </h4>
                                    <p className="text-sm text-muted-foreground mt-2">
                                        {c.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Quick methods - full width */}
                <section className="mb-10">
                    <div className="rounded-2xl p-8 bg-gradient-to-br from-indigo-50 to-pink-50 dark:from-indigo-900 dark:to-pink-900 shadow-lg">
                        <h3 className="text-2xl font-semibold mb-3">
                            Quick Contribution Methods
                        </h3>
                        <p className="text-sm text-muted-foreground mb-6">
                            Two fast ways to contribute: capture live media or
                            use the multi-step form.
                        </p>

                        <div className="space-y-6">
                            <div className="p-6 rounded-xl bg-white dark:bg-slate-900 shadow hover:shadow-lg transition-shadow">
                                <div className="flex items-start gap-6 flex-col md:flex-row">
                                    <div className="flex-1">
                                        <h4 className="font-semibold">
                                            Live media
                                        </h4>
                                        <p className="text-sm text-muted-foreground mb-3">
                                            Record audio, take photos or capture
                                            short video right from your browser.
                                            After recording you can save a draft
                                            contribution.
                                        </p>
                                        <div className="flex gap-3 items-center">
                                            <select
                                                name="type"
                                                onChange={(e) =>
                                                    setForm((f) => ({
                                                        ...f,
                                                        type: e.target.value,
                                                    }))
                                                }
                                                className="rounded border px-3 py-2"
                                            >
                                                <option value="Song">
                                                    Song
                                                </option>
                                                <option value="Story">
                                                    Story
                                                </option>
                                                <option value="Artifact">
                                                    Artifact
                                                </option>
                                            </select>
                                            {!recording && (
                                                <Button
                                                    onClick={startRecording}
                                                >
                                                    Start Recording
                                                </Button>
                                            )}
                                            {recording && (
                                                <Button
                                                    variant="destructive"
                                                    onClick={stopRecording}
                                                >
                                                    Stop
                                                </Button>
                                            )}
                                            {audioBlob && (
                                                <audio
                                                    controls
                                                    src={URL.createObjectURL(
                                                        audioBlob
                                                    )}
                                                    className="ml-2"
                                                />
                                            )}
                                            {!cameraOn && (
                                                <Button onClick={startCamera}>
                                                    Open Camera
                                                </Button>
                                            )}
                                            {cameraOn && (
                                                <Button onClick={capturePhoto}>
                                                    Capture Photo
                                                </Button>
                                            )}
                                            {cameraOn && (
                                                <Button
                                                    variant="ghost"
                                                    onClick={stopCamera}
                                                >
                                                    Close Camera
                                                </Button>
                                            )}
                                            {photoPreview && (
                                                <img
                                                    src={photoPreview}
                                                    alt="preview"
                                                    className="h-14 ml-2 rounded"
                                                />
                                            )}
                                            <Button
                                                onClick={async () => {
                                                    // Confirm save
                                                    const ok = window.confirm(
                                                        'Save this draft to the server?'
                                                    );
                                                    if (!ok) return;
                                                    // construct FormData and POST to /api/draft
                                                    if (
                                                        !audioBlob &&
                                                        !photoBlob &&
                                                        form.files.length === 0
                                                    ) {
                                                        alert(
                                                            'No media or files to save in the draft. Add a recording, photo, or files.'
                                                        );
                                                        return;
                                                    }
                                                    try {
                                                        setSavingDraft(true);
                                                        const fd =
                                                            new FormData();
                                                        fd.append(
                                                            'title',
                                                            form.title ||
                                                                'Untitled'
                                                        );
                                                        fd.append(
                                                            'description',
                                                            form.description ||
                                                                ''
                                                        );
                                                        fd.append(
                                                            'type',
                                                            form.type ||
                                                                'Unknown'
                                                        );
                                                        if (audioBlob) {
                                                            fd.append(
                                                                'audio',
                                                                new File(
                                                                    [audioBlob],
                                                                    'recording.webm',
                                                                    {
                                                                        type:
                                                                            audioBlob.type ||
                                                                            'audio/webm',
                                                                    }
                                                                )
                                                            );
                                                        }
                                                        if (photoBlob) {
                                                            fd.append(
                                                                'photo',
                                                                new File(
                                                                    [photoBlob],
                                                                    'photo.jpg',
                                                                    {
                                                                        type:
                                                                            photoBlob.type ||
                                                                            'image/jpeg',
                                                                    }
                                                                )
                                                            );
                                                        }
                                                        // append any dialog files
                                                        form.files.forEach(
                                                            (f) =>
                                                                fd.append(
                                                                    'files',
                                                                    f
                                                                )
                                                        );

                                                        const res = await fetch(
                                                            '/api/draft',
                                                            {
                                                                method: 'POST',
                                                                body: fd,
                                                            }
                                                        );
                                                        const data =
                                                            await res.json();
                                                        if (!res.ok)
                                                            throw new Error(
                                                                data?.message ||
                                                                    'Upload failed'
                                                            );
                                                        // show toast and set preview
                                                        try {
                                                            (
                                                                await import(
                                                                    'react-hot-toast'
                                                                )
                                                            ).default.success(
                                                                'Draft saved'
                                                            );
                                                        } catch {
                                                            /** ignore */
                                                        }
                                                        setSavedDraft(
                                                            data.draft || data
                                                        );
                                                    } catch (err: any) {
                                                        console.error(
                                                            'Save draft failed',
                                                            err
                                                        );
                                                        try {
                                                            (
                                                                await import(
                                                                    'react-hot-toast'
                                                                )
                                                            ).default.error(
                                                                err?.message ||
                                                                    'Save failed'
                                                            );
                                                        } catch {
                                                            /** ignore */
                                                        }
                                                    } finally {
                                                        setSavingDraft(false);
                                                    }
                                                }}
                                            >
                                                {savingDraft
                                                    ? 'Saving…'
                                                    : 'Save Draft'}
                                            </Button>
                                            {savedDraft && (
                                                <Button
                                                    variant="destructive"
                                                    onClick={async () => {
                                                        const ok =
                                                            window.confirm(
                                                                'Delete this saved draft? This cannot be undone.'
                                                            );
                                                        if (!ok) return;
                                                        try {
                                                            const id =
                                                                savedDraft.id ||
                                                                savedDraft._id ||
                                                                savedDraft.draftId;
                                                            if (!id)
                                                                throw new Error(
                                                                    'Draft id missing'
                                                                );
                                                            const res =
                                                                await fetch(
                                                                    `/api/draft/${id}`,
                                                                    {
                                                                        method: 'DELETE',
                                                                    }
                                                                );
                                                            if (!res.ok)
                                                                throw new Error(
                                                                    'Delete failed'
                                                                );
                                                            try {
                                                                (
                                                                    await import(
                                                                        'react-hot-toast'
                                                                    )
                                                                ).default.success(
                                                                    'Draft deleted'
                                                                );
                                                            } catch {}
                                                            setSavedDraft(null);
                                                        } catch (err) {
                                                            console.error(err);
                                                            try {
                                                                (
                                                                    await import(
                                                                        'react-hot-toast'
                                                                    )
                                                                ).default.error(
                                                                    'Delete failed'
                                                                );
                                                            } catch {}
                                                        }
                                                    }}
                                                >
                                                    Delete Draft
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 rounded-xl bg-white dark:bg-slate-900 shadow hover:shadow-lg transition-shadow">
                                <div className="flex items-start gap-6 flex-col md:flex-row">
                                    <div className="flex-1">
                                        <h4 className="font-semibold">
                                            Multiform
                                        </h4>
                                        <p className="text-sm text-muted-foreground mb-3">
                                            Fill the detailed multi-step
                                            contribution form. Ask AI for help
                                            to craft your submission.
                                        </p>
                                        <div className="flex gap-3">
                                            <Button
                                                onClick={() =>
                                                    setFormOpen(true)
                                                }
                                            >
                                                Open Form
                                            </Button>
                                            <Button
                                                variant="outline"
                                                onClick={() =>
                                                    askAiForHelp(
                                                        form.type || ''
                                                    )
                                                }
                                            >
                                                {aiLoading
                                                    ? 'Thinking...'
                                                    : 'Ask AI'}
                                            </Button>
                                            {aiSuggestion && (
                                                <Button
                                                    onClick={() => {
                                                        setForm((f) => ({
                                                            ...f,
                                                            title:
                                                                aiSuggestion.split(
                                                                    '\n'
                                                                )[0] || '',
                                                            description:
                                                                aiSuggestion,
                                                        }));
                                                        alert(
                                                            'AI suggestion inserted into form. Open the form to review.'
                                                        );
                                                    }}
                                                >
                                                    Insert Suggestion
                                                </Button>
                                            )}
                                        </div>
                                        {aiSuggestion && (
                                            <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-800 rounded">
                                                <h5 className="font-semibold">
                                                    AI Suggestion
                                                </h5>
                                                <p className="text-sm mt-1">
                                                    {aiSuggestion}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Draft preview area */}
                {savedDraft && (
                    <section className="mb-10 rounded-2xl p-8 bg-white dark:bg-slate-900 shadow-lg">
                        <h3 className="text-2xl font-semibold mb-3">
                            Saved Draft
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <strong>Title:</strong>{' '}
                                {savedDraft.title ||
                                    savedDraft.name ||
                                    'Untitled'}
                            </div>
                            <div>
                                <strong>Description:</strong>
                                <div className="mt-2 text-sm text-muted-foreground">
                                    {savedDraft.description || ''}
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                {(() => {
                                    const photo =
                                        savedDraft.photo ||
                                        savedDraft.uploaded?.photo?.[0] ||
                                        (savedDraft.uploaded?.photo
                                            ? savedDraft.uploaded.photo[0]
                                            : null);
                                    const audio =
                                        savedDraft.audio ||
                                        savedDraft.uploaded?.audio?.[0] ||
                                        (savedDraft.uploaded?.audio
                                            ? savedDraft.uploaded.audio[0]
                                            : null);
                                    return (
                                        <>
                                            {photo && (
                                                <img
                                                    src={photo}
                                                    alt="draft photo"
                                                    className="h-28 rounded"
                                                />
                                            )}
                                            {audio && (
                                                <audio controls src={audio} />
                                            )}
                                        </>
                                    );
                                })()}
                            </div>

                            {savedDraft.uploaded?.files &&
                                savedDraft.uploaded.files.length > 0 && (
                                    <div>
                                        <strong>Files:</strong>
                                        <ul className="mt-2 list-disc list-inside text-sm">
                                            {savedDraft.uploaded.files.map(
                                                (u: string) => (
                                                    <li key={u}>
                                                        <a
                                                            className="underline"
                                                            href={u}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                        >
                                                            {u}
                                                        </a>
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    </div>
                                )}

                            <div className="flex gap-3">
                                <Button
                                    onClick={async () => {
                                        // Explain-with-AI using /api/chat
                                        try {
                                            setAiLoading(true);
                                            const prompt = `Explain the following contribution in an accessible summary for a museum catalog:\nTitle: ${savedDraft.title || ''}\nDescription: ${savedDraft.description || ''}\nType: ${savedDraft.type || ''}`;
                                            const res = await fetch(
                                                '/api/chat',
                                                {
                                                    method: 'POST',
                                                    headers: {
                                                        'Content-Type':
                                                            'application/json',
                                                    },
                                                    body: JSON.stringify({
                                                        chatInput: prompt,
                                                    }),
                                                }
                                            );
                                            const js = await res.json();
                                            setAiDraftExplanation(
                                                js.botResponse || ''
                                            );
                                        } catch (err) {
                                            console.error(err);
                                            try {
                                                (
                                                    await import(
                                                        'react-hot-toast'
                                                    )
                                                ).default.error(
                                                    'AI request failed'
                                                );
                                            } catch {}
                                        } finally {
                                            setAiLoading(false);
                                        }
                                    }}
                                >
                                    {aiLoading
                                        ? 'Thinking...'
                                        : 'Explain with AI'}
                                </Button>
                                <Button
                                    onClick={() => {
                                        alert(
                                            'Open form prefilled with draft — TODO'
                                        );
                                    }}
                                >
                                    Open in Form
                                </Button>
                            </div>

                            {aiDraftExplanation && (
                                <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-800 rounded">
                                    <h5 className="font-semibold">
                                        AI Explanation
                                    </h5>
                                    <p className="text-sm mt-1">
                                        {aiDraftExplanation}
                                    </p>
                                </div>
                            )}
                        </div>
                    </section>
                )}

                {/* Multi-step Contribution Form Dialog (migrated from Profile) */}
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
                                        <option value="Local">Local</option>
                                        <option value="Regional">
                                            Regional
                                        </option>
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
                                        {contributionCards.map((t) => (
                                            <option key={t.id} value={t.title}>
                                                {t.title}
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
                                            type="file"
                                            ref={dialogFileRef}
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
