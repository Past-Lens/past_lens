import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/context/themecontext';
import MuseumHeader from '@/components/custom/MuseumHeader';
import DomeGallery from '@/components/immmersive 3d/DomeGallery';
import DotGridBackground from '@/components/immmersive 3d/DotGridBackground';
// Model3DViewer intentionally not used for image-first UX; keep import removed
import { Button } from '@/components/ui/button';
import { Maximize2, PlusCircle, X } from 'lucide-react';
import { museumData } from '@/utils/museumData';
import type { Artifact } from '@/types/museum';

export default function ArtifactsHall() {
    const { themeColors } = useTheme();
    const [selectedArtifact, setSelectedArtifact] = useState<Artifact | null>(
        null
    );
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [filteredArtifacts, setFilteredArtifacts] = useState(
        museumData.artifacts
    );

    useEffect(() => {
        if (activeCategory) {
            setFilteredArtifacts(
                museumData.artifacts.filter(
                    (a) => a.category === activeCategory
                )
            );
        } else {
            setFilteredArtifacts(museumData.artifacts);
        }
    }, [activeCategory]);

    const handleArtifactSelect = (artifact: Artifact) => {
        setSelectedArtifact(artifact);
    };

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
        setIsFullscreen(!isFullscreen);
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

                {/* Artifacts Content */}
                <div className="relative z-10 container mx-auto px-4 py-8">
                    <h1 className="text-4xl font-bold text-white mb-8">
                        Museum Artifacts
                    </h1>

                    {/* Category Filter */}
                    <div className="flex flex-wrap gap-4 mb-8">
                        <Button
                            key="all"
                            variant="outline"
                            className={`bg-white/5 hover:bg-white/10 text-white border-white/20 ${
                                activeCategory === null
                                    ? 'ring-2 ring-white'
                                    : ''
                            }`}
                            onClick={() => setActiveCategory(null)}
                        >
                            All Artifacts
                        </Button>
                        {museumData.categories.map((category) => (
                            <Button
                                key={category.id}
                                variant="outline"
                                className={`bg-white/5 hover:bg-white/10 text-white border-white/20 ${
                                    activeCategory === category.name
                                        ? 'ring-2 ring-white'
                                        : ''
                                }`}
                                onClick={() => setActiveCategory(category.name)}
                            >
                                {category.name} ({category.artifactCount})
                            </Button>
                        ))}
                    </div>

                    {/* 3D Gallery */}
                    <div className="relative aspect-[2/1] w-full rounded-xl overflow-hidden">
                        <DomeGallery
                            images={filteredArtifacts.map((a) => ({
                                src: a.imageUrl || a.model3dUrl,
                                alt: a.name,
                            }))}
                            /* Use reasonable radius so the dome renders at a visible scale. The
                               DomeGallery default minRadius is 600; override only if needed. */
                            minRadius={300}
                            maxRadius={900}
                            padFactor={1.5}
                            overlayBlurColor="rgba(0,0,0,0.8)"
                            maxVerticalRotationDeg={45}
                            dragSensitivity={1}
                            enlargeTransitionMs={500}
                            segments={32}
                            dragDampening={0.95}
                            imageBorderRadius="1rem"
                            openedImageBorderRadius="1.5rem"
                            onImageClick={(index) => {
                                // DomeGallery lays out tiles in a grid and may repeat/rotate images
                                // so map the clicked index back to the current filtered artifacts
                                const idx = index % filteredArtifacts.length;
                                const artifact = filteredArtifacts[idx];
                                if (artifact) {
                                    handleArtifactSelect(artifact);
                                }
                            }}
                        />

                        {/* Gallery Controls */}
                        <div className="absolute bottom-8 right-8 z-20 flex flex-col gap-4">
                            <Button
                                variant="outline"
                                size="icon"
                                className="bg-white/10 backdrop-blur-sm"
                                onClick={toggleFullscreen}
                            >
                                <Maximize2 className="h-5 w-5" />
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                className="bg-white/10 backdrop-blur-sm"
                            >
                                <PlusCircle className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>

                    {/* Artifact Modal */}
                    <AnimatePresence>
                        {selectedArtifact && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
                            >
                                <motion.div className="bg-slate-800 rounded-xl overflow-hidden max-w-6xl w-full max-h-[90vh] relative">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="absolute top-4 right-4 text-white z-10"
                                        onClick={() =>
                                            setSelectedArtifact(null)
                                        }
                                    >
                                        <X className="h-6 w-6" />
                                    </Button>

                                    <div className="flex flex-col md:flex-row h-full">
                                        {/* 3D Model Viewer */}
                                        <div className="md:w-2/3">
                                            <div className="aspect-square relative bg-black flex items-center justify-center rounded-lg overflow-hidden">
                                                {selectedArtifact.imageUrl ? (
                                                    <img
                                                        src={
                                                            selectedArtifact.imageUrl
                                                        }
                                                        alt={
                                                            selectedArtifact.name
                                                        }
                                                        className="max-w-full max-h-full object-contain p-6"
                                                    />
                                                ) : (
                                                    <div className="flex flex-col items-center justify-center text-white/60 p-6">
                                                        <div className="w-32 h-32 rounded-lg bg-white/5 flex items-center justify-center mb-4">
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                className="w-12 h-12 text-white/40"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                                stroke="currentColor"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={
                                                                        1.5
                                                                    }
                                                                    d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7M8 11l2 2 4-4 4 4"
                                                                />
                                                            </svg>
                                                        </div>
                                                        <h3 className="text-lg font-semibold text-white mb-1">
                                                            No image available
                                                        </h3>
                                                        <p className="text-white/60 text-sm text-center">
                                                            {selectedArtifact.description ||
                                                                selectedArtifact.category ||
                                                                'No preview image for this artifact.'}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Artifact Info */}
                                        <div className="md:w-1/3 p-6 overflow-y-auto">
                                            <h2 className="text-3xl font-bold text-white mb-4">
                                                {selectedArtifact.name}
                                            </h2>

                                            <div className="space-y-6">
                                                <div>
                                                    <h3 className="text-lg font-semibold text-white mb-2">
                                                        Details
                                                    </h3>
                                                    <dl className="space-y-2">
                                                        <div>
                                                            <dt className="text-white/50">
                                                                Period
                                                            </dt>
                                                            <dd className="text-white">
                                                                {
                                                                    selectedArtifact.period
                                                                }
                                                            </dd>
                                                        </div>
                                                        <div>
                                                            <dt className="text-white/50">
                                                                Origin
                                                            </dt>
                                                            <dd className="text-white">
                                                                {
                                                                    selectedArtifact.origin
                                                                }
                                                            </dd>
                                                        </div>
                                                        <div>
                                                            <dt className="text-white/50">
                                                                Category
                                                            </dt>
                                                            <dd className="text-white">
                                                                {
                                                                    selectedArtifact.category
                                                                }
                                                            </dd>
                                                        </div>
                                                    </dl>
                                                </div>

                                                <div>
                                                    <h3 className="text-lg font-semibold text-white mb-2">
                                                        Description
                                                    </h3>
                                                    <p className="text-white/70">
                                                        {
                                                            selectedArtifact.description
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}
