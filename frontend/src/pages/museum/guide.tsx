import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/themecontext';
import MuseumHeader from '@/components/custom/MuseumHeader';
import DotGridBackground from '@/components/immmersive 3d/DotGridBackground';
import { Button } from '@/components/ui/button';
import { Play, Pause, SkipForward, Volume2, VolumeX } from 'lucide-react';
import { museumData } from '@/utils/museumData';
import type { TourStep } from '@/types/museum';

export default function Guide() {
    const { themeColors } = useTheme();
    const guideSteps = museumData.guideTour?.steps ?? [];
    const hasStepsInit = Array.isArray(guideSteps) && guideSteps.length > 0;
    const [currentStep, setCurrentStep] = useState<TourStep | null>(
        hasStepsInit ? guideSteps[0] : null
    );
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(
        null
    );

    const handleStepSelect = (step: TourStep) => {
        setCurrentStep(step);
        if (videoElement) {
            videoElement.src = step.videoUrl || '';
            videoElement.currentTime = 0;
            if (isPlaying) {
                videoElement.play();
            }
        }
    };

    useEffect(() => {
        if (videoElement) {
            const handlePlay = () => setIsPlaying(true);
            const handlePause = () => setIsPlaying(false);
            const handleEnded = () => {
                setIsPlaying(false);
                nextStep();
            };

            videoElement.addEventListener('play', handlePlay);
            videoElement.addEventListener('pause', handlePause);
            videoElement.addEventListener('ended', handleEnded);

            return () => {
                videoElement.removeEventListener('play', handlePlay);
                videoElement.removeEventListener('pause', handlePause);
                videoElement.removeEventListener('ended', handleEnded);
            };
        }
    }, [videoElement]);

    const togglePlayPause = async () => {
        if (!videoElement) return;
        try {
            if (isPlaying) {
                videoElement.pause();
            } else {
                // play() returns a Promise in some browsers
                const p = videoElement.play();
                if (p && typeof (p as Promise<void>).then === 'function') {
                    await p;
                }
            }
        } catch (error) {
            console.error('Error toggling video playback:', error);
        }
    };

    const toggleMute = () => {
        if (videoElement) {
            videoElement.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    const nextStep = () => {
        if (!currentStep) return;
        const steps = museumData.guideTour?.steps ?? [];
        const currentIndex = steps.findIndex(
            (step) => step.id === currentStep.id
        );
        if (currentIndex >= 0 && currentIndex < steps.length - 1) {
            handleStepSelect(steps[currentIndex + 1]);
        }
    };

    const hasSteps = Array.isArray(guideSteps) && guideSteps.length > 0;

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

                {/* Guide Content */}
                <div className="relative z-10 container mx-auto px-4 py-8">
                    {!hasSteps ? (
                        <div className="max-w-3xl mx-auto p-8 bg-white/5 rounded-2xl border border-white/10 text-white">
                            <h2 className="text-2xl font-bold mb-2">
                                No tour steps available
                            </h2>
                            <p className="text-white/60">
                                There are no guide steps configured in the
                                dataset. Run the data generator or add tour
                                steps to `museumData.guideTour.steps` to enable
                                the guided tour.
                            </p>
                        </div>
                    ) : (
                        <div className="flex flex-col lg:flex-row gap-8">
                            {/* Video Player Section */}
                            <div className="lg:w-2/3 space-y-6">
                                {/* Video Container */}
                                <div className="rounded-2xl overflow-hidden bg-black/20 backdrop-blur-sm border border-white/10">
                                    <div className="aspect-video relative">
                                        <video
                                            ref={(el) => setVideoElement(el)}
                                            src={currentStep?.videoUrl || ''}
                                            className="w-full h-full object-cover"
                                            poster={
                                                museumData.guideTour
                                                    .welcomeVideo
                                            }
                                            playsInline
                                        />
                                        {/* Video Controls Overlay */}
                                        <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                                            <div className="p-6">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-4">
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            className="bg-white/10 hover:bg-white/20 text-white border-white/20"
                                                            onClick={
                                                                togglePlayPause
                                                            }
                                                        >
                                                            {isPlaying ? (
                                                                <Pause className="h-6 w-6" />
                                                            ) : (
                                                                <Play className="h-6 w-6" />
                                                            )}
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            className="bg-white/10 hover:bg-white/20 text-white border-white/20"
                                                            onClick={toggleMute}
                                                        >
                                                            {isMuted ? (
                                                                <VolumeX className="h-6 w-6" />
                                                            ) : (
                                                                <Volume2 className="h-6 w-6" />
                                                            )}
                                                        </Button>
                                                    </div>
                                                    <Button
                                                        variant="outline"
                                                        className="bg-white/10 hover:bg-white/20 text-white border-white/20"
                                                        onClick={nextStep}
                                                    >
                                                        <span>Next Step</span>
                                                        <SkipForward className="ml-2 h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Current Step Info */}
                                <div className="bg-white/5 rounded-2xl p-6 space-y-4 backdrop-blur-sm border border-white/10">
                                    <h2 className="text-3xl font-bold text-white">
                                        {currentStep?.title ?? 'Untitled step'}
                                    </h2>
                                    <p className="text-white/70 text-lg leading-relaxed">
                                        {currentStep?.description ??
                                            'No description available.'}
                                    </p>
                                    <div className="flex items-center gap-2 text-white/50">
                                        <span className="font-semibold">
                                            Location:
                                        </span>
                                        <span>
                                            {currentStep?.location ?? 'Unknown'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Tour Steps Sidebar */}
                            <div className="lg:w-1/3 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10">
                                <div className="p-6 border-b border-white/10">
                                    <h3 className="text-xl font-bold text-white">
                                        Tour Steps
                                    </h3>
                                    <p className="text-white/50 text-sm mt-1">
                                        Navigate through the museum tour
                                    </p>
                                </div>
                                <div className="p-4 max-h-[60vh] overflow-y-auto">
                                    <div className="space-y-3">
                                        {guideSteps.map((step, index) => (
                                            <motion.div
                                                key={step.id}
                                                whileHover={{ scale: 1.02 }}
                                                className={`group rounded-xl transition-all duration-200 ${
                                                    currentStep?.id === step.id
                                                        ? 'bg-white/20 ring-2 ring-white/20'
                                                        : 'hover:bg-white/10'
                                                }`}
                                            >
                                                <button
                                                    className="w-full p-4 text-left"
                                                    onClick={() =>
                                                        handleStepSelect(step)
                                                    }
                                                >
                                                    <div className="flex items-start gap-4">
                                                        <div
                                                            className={`flex-shrink-0 w-8 h-8 rounded-lg ${
                                                                currentStep?.id ===
                                                                step.id
                                                                    ? 'bg-white/30'
                                                                    : 'bg-white/10 group-hover:bg-white/20'
                                                            } flex items-center justify-center text-white font-bold transition-colors`}
                                                        >
                                                            {index + 1}
                                                        </div>
                                                        <div>
                                                            <h4 className="text-white font-semibold">
                                                                {step.title}
                                                            </h4>
                                                            <p className="text-white/50 text-sm mt-1">
                                                                {step.location}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </button>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
