import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import MuseumHeader from '@/components/custom/MuseumHeader';
import {
    Play,
    Pause,
    Volume2,
    VolumeX,
    Loader2,
    AlertCircle,
    Languages,
    Globe,
    X,
} from 'lucide-react';

// Language configurations
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

interface Story {
    id?: string;
    title: string;
    theme: string;
    story: string;
    lesson: string;
}

export default function Stories() {
    const [stories, setStories] = useState<Story[]>([]);
    const [activeStory, setActiveStory] = useState<Story | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Translation & Audio states
    const [selectedLanguage, setSelectedLanguage] = useState('eng_Latn');
    const [translatedStory, setTranslatedStory] = useState('');
    const [translatedLesson, setTranslatedLesson] = useState('');
    const [isTranslating, setIsTranslating] = useState(false);
    const [isPlayingAudio, setIsPlayingAudio] = useState(false);
    const [translationError, setTranslationError] = useState('');
    const [showLanguageMenu, setShowLanguageMenu] = useState(false);
    const [mainPageLanguage, setMainPageLanguage] = useState('eng_Latn');
    const [showMainLanguageMenu, setShowMainLanguageMenu] = useState(false);

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

    // Reset translation when story changes
    useEffect(() => {
        if (activeStory) {
            setTranslatedStory('');
            setTranslatedLesson('');
            setSelectedLanguage('eng_Latn');
            setTranslationError('');
            window.speechSynthesis.cancel();
            setIsPlayingAudio(false);
        }
    }, [activeStory]);

    const handleStorySelect = (story: Story) => {
        setActiveStory(story);
    };

    const translateContent = async (targetLang: string) => {
        if (!activeStory?.story) return;

        setIsTranslating(true);
        setTranslationError('');

        try {
            // Translate story
            const storyResponse = await fetch(HF_TRANSLATION_API, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text: activeStory.story,
                    source_lang: 'eng_Latn',
                    target_lang: targetLang,
                }),
            });

            if (!storyResponse.ok) {
                throw new Error(
                    `Translation failed: ${storyResponse.statusText}`
                );
            }

            const storyResult = await storyResponse.json();
            const storyTranslation =
                storyResult.translation || storyResult.error;

            // Translate lesson
            const lessonResponse = await fetch(HF_TRANSLATION_API, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text: activeStory.lesson,
                    source_lang: 'eng_Latn',
                    target_lang: targetLang,
                }),
            });

            if (!lessonResponse.ok) {
                throw new Error(
                    `Translation failed: ${lessonResponse.statusText}`
                );
            }

            const lessonResult = await lessonResponse.json();
            const lessonTranslation =
                lessonResult.translation || lessonResult.error;

            if (storyTranslation && lessonTranslation) {
                setTranslatedStory(storyTranslation);
                setTranslatedLesson(lessonTranslation);
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

    const playAudioStory = () => {
        if (!activeStory?.story) return;

        window.speechSynthesis.cancel();

        const textToSpeak = `${translatedStory || activeStory.story}. Lesson: ${translatedLesson || activeStory.lesson}`;
        const utterance = new SpeechSynthesisUtterance(textToSpeak);

        utterance.rate = 0.9;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;

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

    const stopAudioStory = () => {
        window.speechSynthesis.cancel();
        setIsPlayingAudio(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-900">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-white animate-spin mx-auto mb-4" />
                    <p className="text-white/70 text-lg">Loading stories...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-900">
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-8 max-w-md">
                    <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2 text-center">
                        Failed to Load Stories
                    </h3>
                    <p className="text-white/70 text-center mb-4">{error}</p>
                    <Button
                        onClick={() => window.location.reload()}
                        className="w-full bg-red-500 hover:bg-red-600"
                    >
                        Retry
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-900 text-white">
            <MuseumHeader />\{/* Header */}
            <header className="border-b border-white/10 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-white">
                            Cultural Stories
                        </h1>
                        <p className="text-white/60 text-sm">
                            {stories.length} stories available
                        </p>
                    </div>

                    {/* Main Page Language Selector */}
                    <div className="relative">
                        <Button
                            variant="outline"
                            size="sm"
                            className="bg-white/5 hover:bg-white/10 text-white border-white/20"
                            onClick={() =>
                                setShowMainLanguageMenu(!showMainLanguageMenu)
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
                                <div className="px-3 py-2 bg-orange-500/20 border-b border-white/10">
                                    <h4 className="text-white font-semibold text-sm flex items-center gap-2">
                                        🇰🇪 Kenyan Languages
                                    </h4>
                                </div>
                                {KENYAN_LANGUAGES.map((lang) => (
                                    <button
                                        key={lang.code}
                                        className={`w-full px-4 py-2.5 text-left hover:bg-white/10 transition-colors flex items-center justify-between ${
                                            mainPageLanguage === lang.code
                                                ? 'bg-orange-500/20'
                                                : ''
                                        }`}
                                        onClick={() => {
                                            setMainPageLanguage(lang.code);
                                            setShowMainLanguageMenu(false);
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
                                        {mainPageLanguage === lang.code && (
                                            <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                                        )}
                                    </button>
                                ))}

                                <div className="px-3 py-2 bg-blue-500/20 border-t border-b border-white/10">
                                    <h4 className="text-white font-semibold text-sm flex items-center gap-2">
                                        🌍 International Languages
                                    </h4>
                                </div>
                                {INTERNATIONAL_LANGUAGES.map((lang) => (
                                    <button
                                        key={lang.code}
                                        className={`w-full px-4 py-2.5 text-left hover:bg-white/10 transition-colors flex items-center justify-between ${
                                            mainPageLanguage === lang.code
                                                ? 'bg-blue-500/20'
                                                : ''
                                        }`}
                                        onClick={() => {
                                            setMainPageLanguage(lang.code);
                                            setShowMainLanguageMenu(false);
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
                                        {mainPageLanguage === lang.code && (
                                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </header>
            {/* Main Content */}
            <main className="container mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Story List */}
                    <div className="lg:w-1/3">
                        <div className="space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto pr-4 custom-scrollbar">
                            {stories.map((story, index) => (
                                <motion.div
                                    key={story.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    whileHover={{ scale: 1.02, x: 4 }}
                                    whileTap={{ scale: 0.98 }}
                                    className={`group relative p-5 rounded-xl cursor-pointer transition-all duration-300 ${
                                        activeStory?.id === story.id
                                            ? 'bg-gradient-to-br from-orange-500/20 to-purple-500/20 border-2 border-orange-500/50 shadow-lg shadow-orange-500/20'
                                            : 'bg-white/5 hover:bg-white/10 border-2 border-transparent hover:border-white/10'
                                    }`}
                                    onClick={() => handleStorySelect(story)}
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
                                                {story.story.substring(0, 100)}
                                                ...
                                            </p>
                                            <div className="flex items-center gap-2 text-white/50 text-xs">
                                                <span className="px-2 py-1 bg-white/10 rounded-full">
                                                    {story.theme}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {activeStory?.id === story.id && (
                                        <motion.div
                                            layoutId="activeIndicator"
                                            className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-12 bg-gradient-to-b from-orange-500 to-purple-600 rounded-r-full"
                                        />
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Story Player */}
                    <div className="lg:w-2/3">
                        <AnimatePresence mode="wait">
                            {activeStory ? (
                                <motion.div
                                    key={activeStory.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
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

                                        {/* Language & Audio Controls */}
                                        <div className="flex flex-wrap gap-3">
                                            <div className="relative flex-1 min-w-[200px]">
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
                                                    <div className="absolute top-full left-0 mt-2 w-80 bg-slate-700 rounded-lg border border-white/20 shadow-xl z-20 max-h-80 overflow-y-auto">
                                                        <div className="px-3 py-2 bg-orange-500/20 border-b border-white/10 sticky top-0">
                                                            <h4 className="text-white font-semibold text-sm">
                                                                🇰🇪 Kenyan
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
                                                                        translateContent(
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

                                                        <div className="px-3 py-2 bg-blue-500/20 border-t border-b border-white/10 sticky top-0">
                                                            <h4 className="text-white font-semibold text-sm">
                                                                🌍 International
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
                                                                        translateContent(
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
                                                        ? stopAudioStory
                                                        : playAudioStory
                                                }
                                                disabled={isTranslating}
                                            >
                                                {isPlayingAudio ? (
                                                    <>
                                                        <VolumeX className="h-4 w-4 mr-2" />
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
                                                Translating story...
                                            </div>
                                        )}

                                        {translationError && (
                                            <div className="text-red-400 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                                                {translationError}
                                            </div>
                                        )}

                                        {/* Story Content */}
                                        <div className="bg-black/20 rounded-xl p-6 max-h-[400px] overflow-y-auto custom-scrollbar">
                                            <div className="flex items-center justify-between mb-3">
                                                <h3 className="text-xl font-semibold text-orange-400">
                                                    The Story
                                                </h3>
                                                {translatedStory && (
                                                    <span className="text-xs text-orange-400/70">
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
                                            </div>
                                            <p className="text-white/80 leading-relaxed text-lg whitespace-pre-line">
                                                {translatedStory ||
                                                    activeStory.story}
                                            </p>
                                        </div>

                                        {/* Lesson */}
                                        <div className="bg-gradient-to-br from-orange-500/10 to-purple-600/10 rounded-xl p-6 border border-orange-500/20">
                                            <div className="flex items-center justify-between mb-3">
                                                <h3 className="text-xl font-semibold text-purple-400 flex items-center gap-2">
                                                    <span className="text-2xl">
                                                        💡
                                                    </span>
                                                    Lesson
                                                </h3>
                                                {translatedLesson && (
                                                    <span className="text-xs text-purple-400/70">
                                                        Translated
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-white/90 leading-relaxed text-lg">
                                                {translatedLesson ||
                                                    activeStory.lesson}
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
                                            Choose a cultural story from the
                                            list to begin listening
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
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
