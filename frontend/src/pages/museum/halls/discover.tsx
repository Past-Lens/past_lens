import React, { useState } from 'react';
import { useTheme } from '@/context/themecontext';
import MuseumHeader from '@/components/custom/MuseumHeader';
import DotGridBackground from '@/components/immmersive 3d/DotGridBackground';
import { Button } from '@/components/ui/button';
import { Image, Search } from 'lucide-react';
import axInstance from '@/utils/axiosInstance';

const Discover = () => {
    const { themeColors } = useTheme();
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [community, setCommunity] = useState<'maasai' | 'kikuyu'>('maasai');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0] ?? null;
        setFile(f);
        setPreview(f ? URL.createObjectURL(f) : null);
    };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) {
            setError('Select an image first.');
            return;
        }
        setError(null);
        setLoading(true);
        try {
            const fd = new FormData();
            fd.append('image', file);
            fd.append('community', community);
            const { data } = await axInstance.post('/museum/discover', fd, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setResult(data);
        } catch (err: any) {
            setError(
                err?.response?.data?.message || err.message || 'Request failed'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-slate-900">
            <MuseumHeader />

            <main className="flex-1 relative">
                <div className="absolute inset-0 z-0">
                    <DotGridBackground
                        dotSize={2}
                        gap={30}
                        baseColor={themeColors.primary || '#ff8a00'}
                        activeColor="#ffffff"
                        proximity={100}
                        speedTrigger={0.5}
                        shockRadius={150}
                        shockStrength={0.3}
                        maxSpeed={2}
                        resistance={0.95}
                        returnDuration={1}
                        className="w-full h-full"
                    />
                </div>

                <div className="relative z-10 container mx-auto px-4 py-12">
                    <h1 className="text-4xl font-bold text-white mb-6">
                        Discover an Artifact
                    </h1>

                    <div className="bg-white/5 rounded-2xl p-6 max-w-6xl flex gap-6">
                        <form
                            onSubmit={onSubmit}
                            className="flex gap-[15%] w-11/12 mx-auto"
                        >
                            <div className="md:col-span-2 space-y-4">
                                <label className="block text-sm text-white/60">
                                    Upload image
                                </label>
                                <div className="flex items-center gap-4 flex-col-reverse">
                                    <label className="flex items-center gap-3 cursor-pointer bg-white/6 px-4 w-11/12 py-2 rounded-lg border border-white/10 hover:bg-white/10">
                                        <Image className="w-5 h-5 text-white/80" />
                                        <span className="text-white">
                                            Choose file
                                        </span>
                                        <input
                                            className="hidden"
                                            type="file"
                                            accept="image/*"
                                            onChange={onFileChange}
                                        />
                                    </label>

                                    {preview ? (
                                        <div className="w-60 h-60 rounded-lg overflow-hidden border border-white/10">
                                            <img
                                                src={preview}
                                                alt="preview"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    ) : (
                                        <div className="w-40 h-40 rounded-lg flex items-center justify-center bg-white/3 text-white/60 border border-white/10">
                                            <Search className="w-6 h-6" />
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm text-white/60 mb-2">
                                        Community
                                    </label>
                                    <select
                                        value={community}
                                        onChange={(e) =>
                                            setCommunity(e.target.value as any)
                                        }
                                        className="w-48 py-2 px-3 bg-white/5 border border-white/10 rounded-lg text-white"
                                    >
                                        <option value="maasai">Maasai</option>
                                        <option value="kikuyu">Kikuyu</option>
                                    </select>
                                </div>

                                {error && (
                                    <div className="text-red-400">{error}</div>
                                )}
                            </div>

                            <div className=" flex flex-col  min-w-160 max-w-120 overflow-auto">
                                <div className="mb-4">
                                    <label className="block text-sm text-white/60 mb-2">
                                        Action
                                    </label>
                                    <Button
                                        type="submit"
                                        className="w-full"
                                        disabled={loading}
                                    >
                                        {loading
                                            ? 'Analyzing…'
                                            : 'Submit for analysis'}
                                    </Button>
                                </div>

                                {result && (
                                    <div className="bg-white/6 rounded-lg p-4 text-white/90">
                                        <h3 className="text-lg font-semibold">
                                            Artifact Details
                                        </h3>
                                        <div className="text-sm mt-2 text-white/70 space-y-2">
                                            <div>
                                                <strong>Name:</strong>{' '}
                                                {result?.name}
                                            </div>
                                            <div>
                                                <strong>Community:</strong>{' '}
                                                {result?.community}
                                            </div>
                                            <div>
                                                <strong>
                                                    Short Description:
                                                </strong>{' '}
                                                {result?.short_description}
                                            </div>
                                            <div>
                                                <strong>
                                                    Detailed Description:
                                                </strong>{' '}
                                                {
                                                    result.enhanced
                                                        .enhanced_description
                                                }
                                            </div>
                                            <div>
                                                <strong>Uses:</strong>{' '}
                                                {result?.uses?.join(', ')}
                                            </div>
                                            <div>
                                                <strong>
                                                    Cultural Significance:
                                                </strong>{' '}
                                                {result?.cultural_significance}
                                            </div>
                                            <div>
                                                <strong>Event Context:</strong>{' '}
                                                {result?.event_context?.join(
                                                    ', '
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Discover;
