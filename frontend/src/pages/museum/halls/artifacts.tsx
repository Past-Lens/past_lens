import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/context/themecontext';
import MuseumHeader from '@/components/custom/MuseumHeader';
import DomeGallery from '@/components/immmersive 3d/DomeGallery';
import DotGridBackground from '@/components/immmersive 3d/DotGridBackground';
import { Button } from '@/components/ui/button';
import {
    Info,
    Maximize2,
    Grid3x3,
    Codepen,
    X,
    Languages,
    Volume2,
    Loader2,
    Globe,
} from 'lucide-react';
import type { Artifact } from '@/types/museum';
import axios from 'axios';

const KENYAN_LANGUAGES = [
    { code: 'swa_Latn', name: 'Swahili', flag: '🇰🇪', region: 'National' },
    { code: 'eng_Latn', name: 'English', flag: '🇰🇪', region: 'National' },
    { code: 'kik_Latn', name: 'Kikuyu', flag: '🇰🇪', region: 'Central Kenya' },
    { code: 'luo_Latn', name: 'Dholuo', flag: '🇰🇪', region: 'Nyanza' },
    { code: 'kam_Latn', name: 'Kamba', flag: '🇰🇪', region: 'Eastern Kenya' },
    { code: 'luy_Latn', name: 'Luhya', flag: '🇰🇪', region: 'Western Kenya' },
    { code: 'kln_Latn', name: 'Kalenjin', flag: '🇰🇪', region: 'Rift Valley' },
    { code: 'mas_Latn', name: 'Maasai', flag: '🇰🇪', region: 'Southern Kenya' },
    { code: 'mer_Latn', name: 'Meru', flag: '🇰🇪', region: 'Eastern Kenya' },
    { code: 'emb_Latn', name: 'Embu', flag: '🇰🇪', region: 'Eastern Kenya' },
    { code: 'guz_Latn', name: 'Kisii', flag: '🇰🇪', region: 'Nyanza' },
    { code: 'som_Latn', name: 'Somali', flag: '🇰🇪', region: 'North Eastern' },
    { code: 'tuk_Latn', name: 'Turkana', flag: '🇰🇪', region: 'Rift Valley' },
    { code: 'pok_Latn', name: 'Pokot', flag: '🇰🇪', region: 'Rift Valley' },
    { code: 'saq_Latn', name: 'Samburu', flag: '🇰🇪', region: 'Rift Valley' },
    { code: 'tai_Latn', name: 'Taita', flag: '🇰🇪', region: 'Coast' },
    { code: 'dav_Latn', name: 'Dawida', flag: '🇰🇪', region: 'Coast' },
    { code: 'kab_Latn', name: 'Kabras', flag: '🇰🇪', region: 'Western Kenya' },
    { code: 'naq_Latn', name: 'Nandi', flag: '🇰🇪', region: 'Rift Valley' },
    { code: 'teso_Latn', name: 'Teso', flag: '🇰🇪', region: 'Western Kenya' },
];

const INTERNATIONAL_LANGUAGES = [
    { code: 'fra_Latn', name: 'French', flag: '🇫🇷', region: 'Europe' },
    { code: 'spa_Latn', name: 'Spanish', flag: '🇪🇸', region: 'Europe' },
    { code: 'deu_Latn', name: 'German', flag: '🇩🇪', region: 'Europe' },
    { code: 'ita_Latn', name: 'Italian', flag: '🇮🇹', region: 'Europe' },
    { code: 'por_Latn', name: 'Portuguese', flag: '🇵🇹', region: 'Europe' },
    { code: 'nld_Latn', name: 'Dutch', flag: '🇳🇱', region: 'Europe' },
    { code: 'rus_Cyrl', name: 'Russian', flag: '🇷🇺', region: 'Europe' },
    { code: 'ara_Arab', name: 'Arabic', flag: '🇸🇦', region: 'Middle East' },
    { code: 'tur_Latn', name: 'Turkish', flag: '🇹🇷', region: 'Middle East' },
    {
        code: 'zho_Hans',
        name: 'Chinese (Simplified)',
        flag: '🇨🇳',
        region: 'Asia',
    },
    { code: 'jpn_Jpan', name: 'Japanese', flag: '🇯🇵', region: 'Asia' },
    { code: 'kor_Hang', name: 'Korean', flag: '🇰🇷', region: 'Asia' },
    { code: 'hin_Deva', name: 'Hindi', flag: '🇮🇳', region: 'Asia' },
    { code: 'tha_Thai', name: 'Thai', flag: '🇹🇭', region: 'Asia' },
    { code: 'vie_Latn', name: 'Vietnamese', flag: '🇻🇳', region: 'Asia' },
];

const SUPPORTED_LANGUAGES = [...KENYAN_LANGUAGES, ...INTERNATIONAL_LANGUAGES];

const HF_TRANSLATION_API =
    'https://st-thomas-of-aquinas-no-language-left-behind-api.hf.space/translate';

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
    const [viewMode, setViewMode] = useState<'3d' | 'grid'>('grid');
    const [galleryError, setGalleryError] = useState(false);

    // Translation & Audio states
    const [selectedLanguage, setSelectedLanguage] = useState('eng_Latn');
    const [translatedDescription, setTranslatedDescription] = useState('');
    const [isTranslating, setIsTranslating] = useState(false);
    const [isPlayingAudio, setIsPlayingAudio] = useState(false);
    const [translationError, setTranslationError] = useState('');
    const [showLanguageMenu, setShowLanguageMenu] = useState(false);
    const [showMainLanguageMenu, setShowMainLanguageMenu] = useState(false);
    const [mainPageLanguage, setMainPageLanguage] = useState('eng_Latn');

    useEffect(() => {
        const fetchArtifacts = async () => {
            try {
                setLoading(true);
                setError(null);
                const res = await axios.get(
                    'http://localhost:5000/api/dataset'
                );
                const rawData = res.data as any[];

                console.log('🔍 Raw data sample:', rawData[0]);

                // Transform Media_Link to image_url
                const data: Artifact[] = rawData.map((item) => ({
                    Artifact_ID:
                        item.Artifact_ID || item._id?.$numberInt || item._id,
                    Title: item.Title || item.name || 'Untitled',
                    Type: item.Type || 'Artifact',
                    Community_Origin:
                        item.Community_Origin ||
                        item.related_community ||
                        'Unknown',
                    Contributor: item.Contributor || 'Unknown',
                    Description: item.Description || item.description || '',
                    Language: item.Language,
                    image_url: item.Media_Link || item.image_url || '',
                    model3dUrl: item.model3dUrl,
                    category: item.category,
                    position: item.position,
                }));

                console.log('✅ Fetched artifacts:', data.length);
                console.log('📦 Transformed artifact sample:', data[0]);
                console.log('🖼️ First image URL:', data[0]?.image_url);

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

    // Reset translation when artifact changes
    useEffect(() => {
        if (selectedArtifact) {
            setTranslatedDescription('');
            setSelectedLanguage('eng_Latn');
            setTranslationError('');
        }
    }, [selectedArtifact]);

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

    const translateDescription = async (targetLang: string) => {
        if (!selectedArtifact?.Description) return;

        setIsTranslating(true);
        setTranslationError('');

        try {
            const response = await fetch(HF_TRANSLATION_API, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text: selectedArtifact.Description,
                    source_lang: 'eng_Latn',
                    target_lang: targetLang,
                }),
            });

            if (!response.ok) {
                throw new Error(`Translation failed: ${response.statusText}`);
            }

            const result = await response.json();
            const translation = result.translation || result.error;

            if (translation) {
                setTranslatedDescription(translation);
                setSelectedLanguage(targetLang);
            } else {
                throw new Error('No translation received');
            }
        } catch (error) {
            console.error('❌ Translation error:', error);
            setTranslationError('Translation failed. Please try again.');
        } finally {
            setIsTranslating(false);
        }
    };

    const playAudioDescription = () => {
        if (!selectedArtifact?.Description) return;

        // Stop any existing speech
        window.speechSynthesis.cancel();

        const textToSpeak =
            translatedDescription || selectedArtifact.Description;
        const utterance = new SpeechSynthesisUtterance(textToSpeak);

        // Configure speech settings
        utterance.rate = 0.9;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;

        // Try to use appropriate voice for the language
        const voices = window.speechSynthesis.getVoices();
        const langCode = selectedLanguage.split('_')[0];

        const preferredVoice =
            voices.find((voice) =>
                voice.lang.toLowerCase().startsWith(langCode.toLowerCase())
            ) || voices.find((voice) => voice.lang.startsWith('en'));

        if (preferredVoice) {
            utterance.voice = preferredVoice;
        }

        utterance.onstart = () => setIsPlayingAudio(true);
        utterance.onend = () => setIsPlayingAudio(false);
        utterance.onerror = () => {
            setIsPlayingAudio(false);
            console.error('❌ Audio playback failed');
        };

        window.speechSynthesis.speak(utterance);
    };

    const stopAudioDescription = () => {
        window.speechSynthesis.cancel();
        setIsPlayingAudio(false);
    };

    const galleryImages = filteredArtifacts.map((a) => ({
        src: a.image_url || '',
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
                    <div className="mb-4 flex items-center justify-between flex-wrap gap-4">
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

                        <div className="flex gap-2 items-center">
                            {/* Main Page Language Selector */}
                            <div className="relative">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="bg-white/5 hover:bg-white/10 text-white border-white/20"
                                    onClick={() =>
                                        setShowMainLanguageMenu(
                                            !showMainLanguageMenu
                                        )
                                    }
                                >
                                    <Languages className="h-4 w-4 mr-2" />
                                    {
                                        SUPPORTED_LANGUAGES.find(
                                            (l) => l.code === mainPageLanguage
                                        )?.flag
                                    }{' '}
                                    {
                                        SUPPORTED_LANGUAGES.find(
                                            (l) => l.code === mainPageLanguage
                                        )?.name
                                    }
                                </Button>

                                {showMainLanguageMenu && (
                                    <div className="absolute top-full right-0 mt-2 w-80 bg-slate-800 rounded-lg border border-white/20 shadow-xl z-30 max-h-96 overflow-y-auto">
                                        {/* Kenyan Languages Section */}
                                        <div className="px-3 py-2 bg-orange-500/20 border-b border-white/10">
                                            <h4 className="text-white font-semibold text-sm flex items-center gap-2">
                                                🇰🇪 Kenyan Languages
                                            </h4>
                                        </div>
                                        {KENYAN_LANGUAGES.map((lang) => (
                                            <button
                                                key={lang.code}
                                                className={`w-full px-4 py-2.5 text-left hover:bg-white/10 transition-colors flex items-center justify-between ${
                                                    mainPageLanguage ===
                                                    lang.code
                                                        ? 'bg-orange-500/20'
                                                        : ''
                                                }`}
                                                onClick={() => {
                                                    setMainPageLanguage(
                                                        lang.code
                                                    );
                                                    setShowMainLanguageMenu(
                                                        false
                                                    );
                                                }}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <span className="text-xl">
                                                        {lang.flag}
                                                    </span>
                                                    <div>
                                                        <div className="text-white font-medium">
                                                            {lang.name}
                                                        </div>
                                                        <div className="text-white/50 text-xs">
                                                            {lang.region}
                                                        </div>
                                                    </div>
                                                </div>
                                                {mainPageLanguage ===
                                                    lang.code && (
                                                    <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                                                )}
                                            </button>
                                        ))}

                                        {/* International Languages Section */}
                                        <div className="px-3 py-2 bg-blue-500/20 border-t border-b border-white/10">
                                            <h4 className="text-white font-semibold text-sm flex items-center gap-2">
                                                🌍 International Languages
                                            </h4>
                                        </div>
                                        {INTERNATIONAL_LANGUAGES.map((lang) => (
                                            <button
                                                key={lang.code}
                                                className={`w-full px-4 py-2.5 text-left hover:bg-white/10 transition-colors flex items-center justify-between ${
                                                    mainPageLanguage ===
                                                    lang.code
                                                        ? 'bg-blue-500/20'
                                                        : ''
                                                }`}
                                                onClick={() => {
                                                    setMainPageLanguage(
                                                        lang.code
                                                    );
                                                    setShowMainLanguageMenu(
                                                        false
                                                    );
                                                }}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <span className="text-xl">
                                                        {lang.flag}
                                                    </span>
                                                    <div>
                                                        <div className="text-white font-medium">
                                                            {lang.name}
                                                        </div>
                                                        <div className="text-white/50 text-xs">
                                                            {lang.region}
                                                        </div>
                                                    </div>
                                                </div>
                                                {mainPageLanguage ===
                                                    lang.code && (
                                                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* View Mode Toggle */}
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
                                            src={artifact.image_url}
                                            alt={artifact.Title}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                console.error(
                                                    '❌ Failed to load:',
                                                    artifact.image_url
                                                );
                                                e.currentTarget.src =
                                                    'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><rect fill="%23334155" width="400" height="400"/><text x="50%" y="50%" text-anchor="middle" fill="%239ca3af" font-size="16">Image Failed</text></svg>';
                                            }}
                                            onLoad={() =>
                                                console.log(
                                                    '✅ Loaded:',
                                                    artifact.image_url
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
                        <div className="relative w-11/12 h-[600px] rounded-xl overflow-hidden bg-black/20 backdrop-blur-sm">
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
                        <p>
                            🌐 Main Language:{' '}
                            {
                                SUPPORTED_LANGUAGES.find(
                                    (l) => l.code === mainPageLanguage
                                )?.name
                            }
                        </p>
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
                                                src={selectedArtifact.image_url}
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

                                            {/* Language & Audio Controls */}
                                            <div className="mb-6 space-y-3">
                                                <div className="flex gap-2">
                                                    <div className="relative flex-1">
                                                        <Button
                                                            variant="outline"
                                                            className="w-full bg-white/5 hover:bg-white/10 text-white border-white/20 justify-start"
                                                            onClick={() =>
                                                                setShowLanguageMenu(
                                                                    !showLanguageMenu
                                                                )
                                                            }
                                                        >
                                                            <Globe className="h-4 w-4 mr-2" />
                                                            {
                                                                SUPPORTED_LANGUAGES.find(
                                                                    (l) =>
                                                                        l.code ===
                                                                        selectedLanguage
                                                                )?.flag
                                                            }{' '}
                                                            {
                                                                SUPPORTED_LANGUAGES.find(
                                                                    (l) =>
                                                                        l.code ===
                                                                        selectedLanguage
                                                                )?.name
                                                            }
                                                        </Button>

                                                        {showLanguageMenu && (
                                                            <div className="absolute top-full mt-2 w-80 bg-slate-700 rounded-lg border border-white/20 shadow-xl z-20 max-h-80 overflow-y-auto">
                                                                {/* Kenyan Languages */}
                                                                <div className="px-3 py-2 bg-orange-500/20 border-b border-white/10 sticky top-0">
                                                                    <h4 className="text-white font-semibold text-sm">
                                                                        🇰🇪
                                                                        Kenyan
                                                                        Languages
                                                                    </h4>
                                                                </div>
                                                                {KENYAN_LANGUAGES.map(
                                                                    (lang) => (
                                                                        <button
                                                                            key={
                                                                                lang.code
                                                                            }
                                                                            className={`w-full px-4 py-2 text-left hover:bg-white/10 transition-colors flex items-center justify-between ${
                                                                                selectedLanguage ===
                                                                                lang.code
                                                                                    ? 'bg-orange-500/20'
                                                                                    : ''
                                                                            }`}
                                                                            onClick={() => {
                                                                                translateDescription(
                                                                                    lang.code
                                                                                );
                                                                                setShowLanguageMenu(
                                                                                    false
                                                                                );
                                                                            }}
                                                                        >
                                                                            <div className="flex items-center gap-2">
                                                                                <span className="text-lg">
                                                                                    {
                                                                                        lang.flag
                                                                                    }
                                                                                </span>
                                                                                <div>
                                                                                    <div className="text-white text-sm">
                                                                                        {
                                                                                            lang.name
                                                                                        }
                                                                                    </div>
                                                                                    <div className="text-white/50 text-xs">
                                                                                        {
                                                                                            lang.region
                                                                                        }
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </button>
                                                                    )
                                                                )}

                                                                {/* International Languages */}
                                                                <div className="px-3 py-2 bg-blue-500/20 border-t border-b border-white/10 sticky top-0">
                                                                    <h4 className="text-white font-semibold text-sm">
                                                                        🌍
                                                                        International
                                                                    </h4>
                                                                </div>
                                                                {INTERNATIONAL_LANGUAGES.map(
                                                                    (lang) => (
                                                                        <button
                                                                            key={
                                                                                lang.code
                                                                            }
                                                                            className={`w-full px-4 py-2 text-left hover:bg-white/10 transition-colors flex items-center justify-between ${
                                                                                selectedLanguage ===
                                                                                lang.code
                                                                                    ? 'bg-blue-500/20'
                                                                                    : ''
                                                                            }`}
                                                                            onClick={() => {
                                                                                translateDescription(
                                                                                    lang.code
                                                                                );
                                                                                setShowLanguageMenu(
                                                                                    false
                                                                                );
                                                                            }}
                                                                        >
                                                                            <div className="flex items-center gap-2">
                                                                                <span className="text-lg">
                                                                                    {
                                                                                        lang.flag
                                                                                    }
                                                                                </span>
                                                                                <div>
                                                                                    <div className="text-white text-sm">
                                                                                        {
                                                                                            lang.name
                                                                                        }
                                                                                    </div>
                                                                                    <div className="text-white/50 text-xs">
                                                                                        {
                                                                                            lang.region
                                                                                        }
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </button>
                                                                    )
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>

                                                    <Button
                                                        variant="outline"
                                                        className="bg-white/5 hover:bg-white/10 text-white border-white/20"
                                                        onClick={
                                                            isPlayingAudio
                                                                ? stopAudioDescription
                                                                : playAudioDescription
                                                        }
                                                        disabled={isTranslating}
                                                    >
                                                        {isPlayingAudio ? (
                                                            <>
                                                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                                Stop
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Volume2 className="h-4 w-4 mr-2" />
                                                                Listen
                                                            </>
                                                        )}
                                                    </Button>
                                                </div>

                                                {isTranslating && (
                                                    <div className="flex items-center gap-2 text-orange-400 text-sm">
                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                        Translating...
                                                    </div>
                                                )}

                                                {translationError && (
                                                    <div className="text-red-400 text-sm">
                                                        {translationError}
                                                    </div>
                                                )}
                                            </div>

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
                                                    <h3 className="text-lg font-semibold text-white mb-2 flex items-center justify-between">
                                                        Description
                                                        {translatedDescription && (
                                                            <span className="text-xs text-orange-400 font-normal">
                                                                Translated to{' '}
                                                                {
                                                                    SUPPORTED_LANGUAGES.find(
                                                                        (l) =>
                                                                            l.code ===
                                                                            selectedLanguage
                                                                    )?.name
                                                                }
                                                            </span>
                                                        )}
                                                    </h3>
                                                    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                                                        <p className="text-white/70 leading-relaxed">
                                                            {translatedDescription ||
                                                                selectedArtifact.Description ||
                                                                'No description available.'}
                                                        </p>
                                                    </div>
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
