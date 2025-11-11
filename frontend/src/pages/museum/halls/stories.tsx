import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/themecontext';
import MuseumHeader from '@/components/custom/MuseumHeader';
import DotGridBackground from '@/components/immmersive 3d/DotGridBackground';
import ScrollStack from '@/components/immmersive 3d/ScrollStack';
import { Button } from '@/components/ui/button';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { museumData } from '@/utils/museumData';
import { type CulturalStory } from '@/types/museum';

export default function Stories() {
    const { themeColors } = useTheme();
    const [activeStory, setActiveStory] = useState<CulturalStory | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(
        null
    );

    const handleStorySelect = (story: CulturalStory) => {
        setActiveStory(story);
        // Stop current audio if playing
        if (audioElement) {
            audioElement.pause();
            audioElement.currentTime = 0;
        }
        // Create new audio element
        const audio = new Audio(story.audioUrl);
        audio.muted = isMuted;
        setAudioElement(audio);
        setIsPlaying(false);
    };

    const togglePlayPause = () => {
        if (audioElement) {
            if (isPlaying) {
                audioElement.pause();
            } else {
                audioElement.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const toggleMute = () => {
        if (audioElement) {
            audioElement.muted = !isMuted;
            setIsMuted(!isMuted);
        }
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
                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Story List */}
                        <div className="md:w-1/3">
                            <h2 className="text-3xl font-bold text-white mb-6">
                                Cultural Stories
                            </h2>
                            <ScrollStack className="space-y-4 max-h-[70vh] overflow-y-auto pr-4">
                                {museumData.culturalStories.map((story) => (
                                    <motion.div
                                        key={story.id}
                                        whileHover={{ scale: 1.02 }}
                                        className={`p-4 rounded-lg cursor-pointer transition-colors ${
                                            activeStory?.id === story.id
                                                ? 'bg-white/20'
                                                : 'bg-white/5 hover:bg-white/10'
                                        }`}
                                        onClick={() => handleStorySelect(story)}
                                    >
                                        <h3 className="text-xl font-semibold text-white mb-2">
                                            {story.title}
                                        </h3>
                                        <p className="text-white/70">
                                            {story.description}
                                        </p>
                                        <div className="mt-2 flex items-center gap-2 text-white/50 text-sm">
                                            <span>{story.culture}</span>
                                            <span>•</span>
                                            <span>{story.duration}</span>
                                        </div>
                                    </motion.div>
                                ))}
                            </ScrollStack>
                        </div>

                        {/* Story Player */}
                        <div className="md:w-2/3 bg-white/5 rounded-2xl p-6">
                            {activeStory ? (
                                <div className="space-y-6">
                                    <div className="aspect-video rounded-lg overflow-hidden bg-black/50">
                                        <img
                                            src={activeStory.imageUrl}
                                            alt={activeStory.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-white"
                                                onClick={() =>
                                                    setIsPlaying(!isPlaying)
                                                }
                                            >
                                                {isPlaying ? (
                                                    <Pause className="w-6 h-6" />
                                                ) : (
                                                    <Play className="w-6 h-6" />
                                                )}
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-white"
                                                onClick={() =>
                                                    setIsMuted(!isMuted)
                                                }
                                            >
                                                {isMuted ? (
                                                    <VolumeX className="w-6 h-6" />
                                                ) : (
                                                    <Volume2 className="w-6 h-6" />
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="h-full flex items-center justify-center text-white/50">
                                    Select a story to begin
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
