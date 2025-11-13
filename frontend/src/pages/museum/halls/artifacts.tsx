import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/context/themecontext';
import MuseumHeader from '@/components/custom/MuseumHeader';
import DomeGallery from '@/components/immmersive 3d/DomeGallery';
import DotGridBackground from '@/components/immmersive 3d/DotGridBackground';
import { Button } from '@/components/ui/button';
import { Info, Maximize2, Grid3x3, Codepen, X } from 'lucide-react';
import type { Artifact } from '@/types/museum';
import axios from 'axios';

export default function ArtifactsHall() {
    const { themeColors } = useTheme();
    const [artifacts, setArtifacts] = useState<Artifact[]>([]);
    const [filteredArtifacts, setFilteredArtifacts] = useState<Artifact[]>([]);
    const [selectedArtifact, setSelectedArtifact] = useState<Artifact | null>(
        null
    );
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [categories, setCategories] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'3d' | 'grid'>('grid'); // Default to grid
    const [galleryError, setGalleryError] = useState(false);

    useEffect(() => {
        const fetchArtifacts = async () => {
            try {
                setLoading(true);
                setError(null);
                const res = await axios.get(
                    'http://localhost:5000/api/dataset'
                );
                const data = res.data as Artifact[];

                console.log('✅ Fetched artifacts:', data.length);

                if (!data || data.length === 0) {
                    setError('No artifacts found');
                    return;
                }

                setArtifacts(data);
                setFilteredArtifacts(data);

                const uniqueCategories = Array.from(
                    new Set(
                        data
                            .map((item) => item.Community_Origin ?? '')
                            .filter(
                                (c): c is string =>
                                    typeof c === 'string' && c !== ''
                            )
                    )
                );
                setCategories(uniqueCategories);
            } catch (error) {
                console.error('❌ Error fetching artifacts:', error);
                setError('Failed to load artifacts');
            } finally {
                setLoading(false);
            }
        };

        fetchArtifacts();
    }, []);

    useEffect(() => {
        if (activeCategory) {
            setFilteredArtifacts(
                artifacts.filter(
                    (artifact) => artifact.Community_Origin === activeCategory
                )
            );
        } else {
            setFilteredArtifacts(artifacts);
        }
    }, [activeCategory, artifacts]);

    const handleArtifactSelect = (artifact: Artifact) => {
        console.log('🖼️ Selected artifact:', artifact.Title);
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

    const galleryImages = filteredArtifacts.map((a) => ({
        src: `http://localhost:5000/media/${a.Media_Link}`,
        alt: a.Title || 'Artifact',
    }));

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                    <p className="text-lg">Loading artifacts...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
                <div className="text-center max-w-md">
                    <p className="text-red-400 mb-4">{error}</p>
                    <Button onClick={() => window.location.reload()}>
                        Retry
                    </Button>
                </div>
            </div>
        );
    }

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

                <div className="relative z-10 container mx-auto px-4 py-8">
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-bold text-white mb-2">
                                Museum Artifacts
                            </h1>
                            <p className="text-white/60">
                                {filteredArtifacts.length} artifact
                                {filteredArtifacts.length !== 1 ? 's' : ''}{' '}
                                found
                            </p>
                        </div>

                        {/* View Mode Toggle */}
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                className={`${viewMode === 'grid' ? 'bg-white/20' : 'bg-white/5'} hover:bg-white/10 text-white border-white/20`}
                                onClick={() => setViewMode('grid')}
                            >
                                <Grid3x3 className="h-4 w-4 mr-2" />
                                Grid
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className={`${viewMode === '3d' ? 'bg-white/20' : 'bg-white/5'} hover:bg-white/10 text-white border-white/20`}
                                onClick={() => setViewMode('3d')}
                            >
                                <Codepen className="h-4 w-4 mr-2" />
                                3D View
                            </Button>
                        </div>
                    </div>

                    {/* Category Filter */}
                    <div className="flex flex-wrap gap-4 mb-8">
                        <Button
                            variant="outline"
                            className={`bg-white/5 hover:bg-white/10 text-white border-white/20 ${
                                activeCategory === null
                                    ? 'ring-2 ring-orange-500'
                                    : ''
                            }`}
                            onClick={() => setActiveCategory(null)}
                        >
                            All ({artifacts.length})
                        </Button>

                        {categories.map((category) => (
                            <Button
                                key={category}
                                variant="outline"
                                className={`bg-white/5 hover:bg-white/10 text-white border-white/20 ${
                                    activeCategory === category
                                        ? 'ring-2 ring-orange-500'
                                        : ''
                                }`}
                                onClick={() => setActiveCategory(category)}
                            >
                                {category} (
                                {
                                    artifacts.filter(
                                        (a) => a.Community_Origin === category
                                    ).length
                                }
                                )
                            </Button>
                        ))}
                    </div>

                    {/* Gallery Views */}
                    {viewMode === 'grid' ? (
                        /* Grid View */
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {filteredArtifacts.map((artifact) => (
                                <motion.div
                                    key={artifact.Artifact_ID}
                                    whileHover={{ scale: 1.05 }}
                                    className="bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden cursor-pointer border border-white/10 hover:border-orange-500/50 transition-all"
                                    onClick={() =>
                                        handleArtifactSelect(artifact)
                                    }
                                >
                                    <div className="aspect-square relative bg-slate-800">
                                        <img
                                            src={`http://localhost:5000/media/${artifact.Media_Link}`}
                                            alt={artifact.Title}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                console.error(
                                                    '❌ Failed to load:',
                                                    artifact.Media_Link
                                                );
                                                e.currentTarget.src =
                                                    'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><rect fill="%23334155" width="400" height="400"/><text x="50%" y="50%" text-anchor="middle" fill="%239ca3af" font-size="16">Image Failed</text></svg>';
                                            }}
                                            onLoad={() =>
                                                console.log(
                                                    '✅ Loaded:',
                                                    artifact.Media_Link
                                                )
                                            }
                                        />
                                    </div>
                                    <div className="p-4">
                                        <h3 className="text-white font-semibold text-sm mb-1 line-clamp-1">
                                            {artifact.Title}
                                        </h3>
                                        <p className="text-white/50 text-xs line-clamp-1">
                                            {artifact.Community_Origin}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        /* 3D Dome Gallery */
                        <div className="relative w-full h-[600px] rounded-xl overflow-hidden bg-black/20 backdrop-blur-sm">
                            {!galleryError ? (
                                <DomeGallery
                                    images={galleryImages}
                                    minRadius={5}
                                    maxRadius={15}
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
                                        const artifact =
                                            filteredArtifacts[index];
                                        if (artifact)
                                            handleArtifactSelect(artifact);
                                    }}
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full text-white">
                                    <div className="text-center">
                                        <p className="mb-4">
                                            3D Gallery failed to initialize
                                        </p>
                                        <Button
                                            onClick={() => setViewMode('grid')}
                                        >
                                            Switch to Grid View
                                        </Button>
                                    </div>
                                </div>
                            )}

                            <div className="absolute bottom-8 right-8 z-20 flex flex-col gap-4">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="bg-white/10 backdrop-blur-sm hover:bg-white/20"
                                    onClick={toggleFullscreen}
                                    title="Toggle Fullscreen"
                                >
                                    <Maximize2 className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Debug Info */}
                    <div className="mt-4 p-4 bg-white/5 rounded-lg text-white/70 text-sm space-y-1">
                        <p>
                            📊 Debug: {filteredArtifacts.length} artifacts
                            loaded
                        </p>
                        <p>🖼️ View Mode: {viewMode}</p>
                        {galleryImages[0] && (
                            <p className="truncate">
                                🔗 Sample: {galleryImages[0].src}
                            </p>
                        )}
                    </div>

                    {/* Artifact Detail Modal */}
                    <AnimatePresence>
                        {selectedArtifact && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
                                onClick={() => setSelectedArtifact(null)}
                            >
                                <motion.div
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.9, opacity: 0 }}
                                    className="bg-slate-800 rounded-xl overflow-hidden max-w-6xl w-full max-h-[90vh] relative"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="absolute top-4 right-4 text-white z-10 hover:bg-white/20"
                                        onClick={() =>
                                            setSelectedArtifact(null)
                                        }
                                    >
                                        <X className="h-6 w-6" />
                                    </Button>

                                    <div className="flex flex-col md:flex-row overflow-hidden max-h-[90vh]">
                                        <div className="md:w-2/3 bg-black/40 flex items-center justify-center p-8">
                                            <img
                                                src={`http://localhost:5000/media/${selectedArtifact.Media_Link}`}
                                                alt={selectedArtifact.Title}
                                                className="max-w-full max-h-[70vh] object-contain rounded-lg"
                                                onError={(e) => {
                                                    e.currentTarget.src =
                                                        'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600"><rect fill="%23334155" width="600" height="600"/><text x="50%" y="50%" text-anchor="middle" fill="%23fff" font-size="24">Image Not Available</text></svg>';
                                                }}
                                            />
                                        </div>

                                        <div className="md:w-1/3 p-6 overflow-y-auto bg-slate-900/50">
                                            <h2 className="text-3xl font-bold text-white mb-4">
                                                {selectedArtifact.Title}
                                            </h2>

                                            <div className="space-y-6">
                                                <div>
                                                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                                                        <Info className="h-5 w-5 mr-2 text-orange-500" />
                                                        Details
                                                    </h3>
                                                    <dl className="space-y-3">
                                                        <div className="border-b border-white/10 pb-2">
                                                            <dt className="text-white/50 text-sm mb-1">
                                                                Type
                                                            </dt>
                                                            <dd className="text-white font-medium">
                                                                {selectedArtifact.Type ||
                                                                    'N/A'}
                                                            </dd>
                                                        </div>
                                                        <div className="border-b border-white/10 pb-2">
                                                            <dt className="text-white/50 text-sm mb-1">
                                                                Community Origin
                                                            </dt>
                                                            <dd className="text-white font-medium">
                                                                {selectedArtifact.Community_Origin ||
                                                                    'N/A'}
                                                            </dd>
                                                        </div>
                                                        <div className="border-b border-white/10 pb-2">
                                                            <dt className="text-white/50 text-sm mb-1">
                                                                Contributor
                                                            </dt>
                                                            <dd className="text-white font-medium">
                                                                {selectedArtifact.Contributor ||
                                                                    'N/A'}
                                                            </dd>
                                                        </div>
                                                        {selectedArtifact.Language && (
                                                            <div className="border-b border-white/10 pb-2">
                                                                <dt className="text-white/50 text-sm mb-1">
                                                                    Language
                                                                </dt>
                                                                <dd className="text-white font-medium">
                                                                    {
                                                                        selectedArtifact.Language
                                                                    }
                                                                </dd>
                                                            </div>
                                                        )}
                                                    </dl>
                                                </div>

                                                <div>
                                                    <h3 className="text-lg font-semibold text-white mb-2">
                                                        Description
                                                    </h3>
                                                    <p className="text-white/70 leading-relaxed">
                                                        {selectedArtifact.Description ||
                                                            'No description available.'}
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
