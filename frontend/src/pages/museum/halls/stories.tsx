import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/context/themecontext';
import MuseumHeader from '@/components/custom/MuseumHeader';
import DotGridBackground from '@/components/immmersive 3d/DotGridBackground';
import ScrollStack from '@/components/immmersive 3d/ScrollStack';
import { Button } from '@/components/ui/button';
import {
    Play,
    Pause,
    Volume2,
    VolumeX,
    Loader2,
    AlertCircle,
} from 'lucide-react';
// Define the story type based on your API response
interface Story {
    id?: string;
    title: string;
    theme: string;
    story: string;
    lesson: string;
}

export default function Stories() {
    const { themeColors } = useTheme();
    const [stories, setStories] = useState<Story[]>([]);
    const [activeStory, setActiveStory] = useState<Story | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch stories from API
    useEffect(() => {
        const fetchStories = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await fetch(
                    'http://localhost:5000/api/dataset/stories'
                );

                if (!response.ok) {
                    throw new Error('Failed to fetch stories');
                }

                const data = await response.json();
                // Add IDs to stories if they don't have them
                const storiesWithIds = data.Kikuyu.map(
                    (story: Story, index: number) => ({
                        ...story,
                        id: story.id || `story-${index}`,
                    })
                );
                setStories(storiesWithIds);
            } catch (err) {
                setError(
                    err instanceof Error ? err.message : 'An error occurred'
                );
            } finally {
                setLoading(false);
            }
        };

        fetchStories();
    }, []);

    // Remove audio-related useEffect
    const handleStorySelect = (story: Story) => {
        setActiveStory(story);
    };

    return (
        <div className="min-h-screen flex flex-col bg-slate-900">
            <MuseumHeader />

            {/* Main content */}
            <main className="flex-1 relative">
                {/* Background */}
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

                {/* Stories Content */}
                <div className="relative z-10 container mx-auto px-4 py-8">
                    {/* Loading State */}
                    {loading && (
                        <div className="flex items-center justify-center min-h-[60vh]">
                            <div className="text-center">
                                <Loader2 className="w-12 h-12 text-white animate-spin mx-auto mb-4" />
                                <p className="text-white/70 text-lg">
                                    Loading stories...
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Error State */}
                    {error && (
                        <div className="flex items-center justify-center min-h-[60vh]">
                            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-8 max-w-md">
                                <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-white mb-2 text-center">
                                    Failed to Load Stories
                                </h3>
                                <p className="text-white/70 text-center mb-4">
                                    {error}
                                </p>
                                <Button
                                    onClick={() => window.location.reload()}
                                    className="w-full bg-red-500 hover:bg-red-600"
                                >
                                    Retry
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Main Content */}
                    {!loading && !error && (
                        <div className="flex flex-col lg:flex-row gap-8">
                            {/* Story List */}
                            <div className="lg:w-1/3">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="sticky top-4"
                                >
                                    <h2 className="text-3xl font-bold text-white mb-2">
                                        Cultural Stories
                                    </h2>
                                    <p className="text-white/60 mb-6">
                                        {stories.length}{' '}
                                        {stories.length === 1
                                            ? 'story'
                                            : 'stories'}{' '}
                                        available
                                    </p>

                                    <ScrollStack className="space-y-3 max-h-[70vh] overflow-y-auto pr-4 custom-scrollbar">
                                        {stories.map((story, index) => (
                                            <motion.div
                                                key={story.id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{
                                                    delay: index * 0.05,
                                                }}
                                                whileHover={{
                                                    scale: 1.02,
                                                    x: 4,
                                                }}
                                                whileTap={{ scale: 0.98 }}
                                                className={`group relative p-5 rounded-xl cursor-pointer transition-all duration-300 ${
                                                    activeStory?.id === story.id
                                                        ? 'bg-gradient-to-br from-orange-500/20 to-purple-500/20 border-2 border-orange-500/50 shadow-lg shadow-orange-500/20'
                                                        : 'bg-white/5 hover:bg-white/10 border-2 border-transparent hover:border-white/10'
                                                }`}
                                                onClick={() =>
                                                    handleStorySelect(story)
                                                }
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-orange-500 to-purple-600 flex items-center justify-center text-white font-bold">
                                                        {index + 1}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-orange-300 transition-colors">
                                                            {story.title}
                                                        </h3>
                                                        <p className="text-white/60 text-sm line-clamp-2 mb-2">
                                                            {story.story.substring(
                                                                0,
                                                                100
                                                            )}
                                                            ...
                                                        </p>
                                                        <div className="flex items-center gap-2 text-white/50 text-xs">
                                                            <span className="px-2 py-1 bg-white/10 rounded-full">
                                                                {story.theme}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {activeStory?.id ===
                                                    story.id && (
                                                    <motion.div
                                                        layoutId="activeIndicator"
                                                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-12 bg-gradient-to-b from-orange-500 to-purple-600 rounded-r-full"
                                                    />
                                                )}
                                            </motion.div>
                                        ))}
                                    </ScrollStack>
                                </motion.div>
                            </div>

                            {/* Story Player */}
                            <div className="lg:w-2/3">
                                <AnimatePresence mode="wait">
                                    {activeStory ? (
                                        <motion.div
                                            key={activeStory.id}
                                            initial={{
                                                opacity: 0,
                                                scale: 0.95,
                                            }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 shadow-2xl"
                                        >
                                            <div className="space-y-6">
                                                {/* Story Header */}
                                                <div className="border-b border-white/10 pb-4">
                                                    <h2 className="text-3xl font-bold text-white mb-2">
                                                        {activeStory.title}
                                                    </h2>
                                                    <span className="inline-block px-4 py-2 bg-gradient-to-r from-orange-500/20 to-purple-600/20 border border-orange-500/30 rounded-full text-white/80 text-sm font-medium">
                                                        {activeStory.theme}
                                                    </span>
                                                </div>

                                                {/* Story Content */}
                                                <div className="bg-black/20 rounded-xl p-6 max-h-[400px] overflow-y-auto custom-scrollbar">
                                                    <h3 className="text-xl font-semibold text-orange-400 mb-3">
                                                        The Story
                                                    </h3>
                                                    <p className="text-white/80 leading-relaxed text-lg whitespace-pre-line">
                                                        {activeStory.story}
                                                    </p>
                                                </div>

                                                {/* Lesson */}
                                                <div className="bg-gradient-to-br from-orange-500/10 to-purple-600/10 rounded-xl p-6 border border-orange-500/20">
                                                    <h3 className="text-xl font-semibold text-purple-400 mb-3 flex items-center gap-2">
                                                        <span className="text-2xl">
                                                            💡
                                                        </span>
                                                        Lesson
                                                    </h3>
                                                    <p className="text-white/90 leading-relaxed text-lg">
                                                        {activeStory.lesson}
                                                    </p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="h-[600px] bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 flex items-center justify-center"
                                        >
                                            <div className="text-center">
                                                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-orange-500/20 to-purple-600/20 flex items-center justify-center">
                                                    <Play className="w-12 h-12 text-white/40" />
                                                </div>
                                                <h3 className="text-2xl font-semibold text-white/80 mb-2">
                                                    Select a Story
                                                </h3>
                                                <p className="text-white/50">
                                                    Choose a cultural story from
                                                    the list to begin listening
                                                </p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: linear-gradient(to bottom, #ff8a00, #9333ea);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: linear-gradient(to bottom, #ff9a20, #a855f7);
                }
            `}</style>
        </div>
    );
}
