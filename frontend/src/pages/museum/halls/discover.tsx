import React, { useState, useEffect } from 'react';
import { useTheme } from '@/context/themecontext';
import MuseumHeader from '@/components/custom/MuseumHeader';
import DotGridBackground from '@/components/immmersive 3d/DotGridBackground';
import { Button } from '@/components/ui/button';
import {
    Image,
    Search,
    Languages,
    Globe,
    Volume2,
    VolumeX,
    Loader2,
} from 'lucide-react';
import axInstance from '@/utils/axiosInstance';

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

const Discover = () => {
    const { themeColors } = useTheme();
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [community, setCommunity] = useState<'maasai' | 'kikuyu'>('maasai');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    // Translation & Audio states
    const [selectedLanguage, setSelectedLanguage] = useState('eng_Latn');
    const [translatedResult, setTranslatedResult] = useState<any>(null);
    const [isTranslating, setIsTranslating] = useState(false);
    const [isPlayingAudio, setIsPlayingAudio] = useState(false);
    const [translationError, setTranslationError] = useState('');
    const [showLanguageMenu, setShowLanguageMenu] = useState(false);
    const [mainPageLanguage, setMainPageLanguage] = useState('eng_Latn');
    const [showMainLanguageMenu, setShowMainLanguageMenu] = useState(false);

    // Reset translation when result changes
    useEffect(() => {
        if (result) {
            setTranslatedResult(null);
            setSelectedLanguage('eng_Latn');
            setTranslationError('');
            window.speechSynthesis.cancel();
            setIsPlayingAudio(false);
        }
    }, [result]);

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

    const translateResult = async (targetLang: string) => {
        if (!result) return;

        setIsTranslating(true);
        setTranslationError('');

        try {
            const fieldsToTranslate = {
                short_description: result.short_description,
                enhanced_description:
                    result.enhanced?.enhanced_description || '',
                cultural_significance: result.cultural_significance,
            };

            const translations: any = {};

            for (const [key, text] of Object.entries(fieldsToTranslate)) {
                if (text) {
                    const response = await fetch(HF_TRANSLATION_API, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            text,
                            source_lang: 'eng_Latn',
                            target_lang: targetLang,
                        }),
                    });

                    if (!response.ok) {
                        throw new Error(`Translation failed for ${key}`);
                    }

                    const translationResult = await response.json();
                    translations[key] = translationResult.translation || text;
                }
            }

            setTranslatedResult(translations);
            setSelectedLanguage(targetLang);
        } catch (error) {
            console.error('❌ Translation error:', error);
            setTranslationError('Translation failed. Please try again.');
        } finally {
            setIsTranslating(false);
        }
    };

    const playAudioDescription = () => {
        if (!result) return;

        window.speechSynthesis.cancel();

        const textToSpeak = translatedResult
            ? `${result.name}. ${translatedResult.short_description}. ${translatedResult.enhanced_description}. Cultural Significance: ${translatedResult.cultural_significance}`
            : `${result.name}. ${result.short_description}. ${result.enhanced?.enhanced_description}. Cultural Significance: ${result.cultural_significance}`;

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

    const stopAudioDescription = () => {
        window.speechSynthesis.cancel();
        setIsPlayingAudio(false);
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
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-4xl font-bold text-white">
                            Discover an Artifact
                        </h1>

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
                                <>
                                    <div
                                        className="fixed inset-0 z-40"
                                        onClick={() =>
                                            setShowMainLanguageMenu(false)
                                        }
                                    />
                                    <div className="absolute top-full right-0 mt-2 w-80 bg-slate-800 rounded-lg border border-white/20 shadow-xl z-50 max-h-96 overflow-y-auto">
                                        <div className="px-3 py-2 bg-orange-500/20 border-b border-white/10 sticky top-0">
                                            <h4 className="text-white font-semibold text-sm">
                                                🇰🇪 Kenyan Languages
                                            </h4>
                                        </div>
                                        {KENYAN_LANGUAGES.map((lang) => (
                                            <button
                                                key={lang.code}
                                                className={`w-full px-4 py-2.5 text-left hover:bg-white/10 transition-colors ${
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
                                            </button>
                                        ))}

                                        <div className="px-3 py-2 bg-blue-500/20 border-t border-b border-white/10 sticky top-0">
                                            <h4 className="text-white font-semibold text-sm">
                                                🌍 International
                                            </h4>
                                        </div>
                                        {INTERNATIONAL_LANGUAGES.map((lang) => (
                                            <button
                                                key={lang.code}
                                                className={`w-full px-4 py-2.5 text-left hover:bg-white/10 transition-colors ${
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
                                            </button>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

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

                            <div className="flex flex-col min-w-160 max-w-120 overflow-auto">
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
                                    <>
                                        {/* Language & Audio Controls */}
                                        <div className="flex gap-2 mb-4">
                                            <div className="relative flex-1">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    className="w-full bg-white/5 hover:bg-white/10 text-white border-white/20"
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
                                                    }
                                                </Button>

                                                {showLanguageMenu && (
                                                    <>
                                                        <div
                                                            className="fixed inset-0 z-40"
                                                            onClick={() =>
                                                                setShowLanguageMenu(
                                                                    false
                                                                )
                                                            }
                                                        />
                                                        <div className="absolute top-full left-0 mt-2 w-72 bg-slate-700 rounded-lg border border-white/20 shadow-xl z-50 max-h-80 overflow-y-auto">
                                                            <div className="px-3 py-2 bg-orange-500/20 border-b border-white/10">
                                                                <h4 className="text-white font-semibold text-xs">
                                                                    🇰🇪 Kenyan
                                                                </h4>
                                                            </div>
                                                            {KENYAN_LANGUAGES.map(
                                                                (lang) => (
                                                                    <button
                                                                        key={
                                                                            lang.code
                                                                        }
                                                                        type="button"
                                                                        className={`w-full px-3 py-2 text-left hover:bg-white/10 text-xs ${
                                                                            selectedLanguage ===
                                                                            lang.code
                                                                                ? 'bg-orange-500/20'
                                                                                : ''
                                                                        }`}
                                                                        onClick={() => {
                                                                            translateResult(
                                                                                lang.code
                                                                            );
                                                                            setShowLanguageMenu(
                                                                                false
                                                                            );
                                                                        }}
                                                                    >
                                                                        <span className="text-white">
                                                                            {
                                                                                lang.flag
                                                                            }{' '}
                                                                            {
                                                                                lang.name
                                                                            }
                                                                        </span>
                                                                    </button>
                                                                )
                                                            )}

                                                            <div className="px-3 py-2 bg-blue-500/20 border-t border-b border-white/10">
                                                                <h4 className="text-white font-semibold text-xs">
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
                                                                        type="button"
                                                                        className={`w-full px-3 py-2 text-left hover:bg-white/10 text-xs ${
                                                                            selectedLanguage ===
                                                                            lang.code
                                                                                ? 'bg-blue-500/20'
                                                                                : ''
                                                                        }`}
                                                                        onClick={() => {
                                                                            translateResult(
                                                                                lang.code
                                                                            );
                                                                            setShowLanguageMenu(
                                                                                false
                                                                            );
                                                                        }}
                                                                    >
                                                                        <span className="text-white">
                                                                            {
                                                                                lang.flag
                                                                            }{' '}
                                                                            {
                                                                                lang.name
                                                                            }
                                                                        </span>
                                                                    </button>
                                                                )
                                                            )}
                                                        </div>
                                                    </>
                                                )}
                                            </div>

                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                className="bg-white/5 hover:bg-white/10 text-white border-white/20"
                                                onClick={
                                                    isPlayingAudio
                                                        ? stopAudioDescription
                                                        : playAudioDescription
                                                }
                                                disabled={isTranslating}
                                            >
                                                {isPlayingAudio ? (
                                                    <VolumeX className="h-4 w-4" />
                                                ) : (
                                                    <Volume2 className="h-4 w-4" />
                                                )}
                                            </Button>
                                        </div>

                                        {isTranslating && (
                                            <div className="flex items-center gap-2 text-orange-400 text-xs mb-2">
                                                <Loader2 className="h-3 w-3 animate-spin" />
                                                Translating...
                                            </div>
                                        )}

                                        {translationError && (
                                            <div className="text-red-400 text-xs mb-2">
                                                {translationError}
                                            </div>
                                        )}

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
                                                    {translatedResult?.short_description ||
                                                        result?.short_description}
                                                </div>
                                                <div>
                                                    <strong>
                                                        Detailed Description:
                                                    </strong>{' '}
                                                    {translatedResult?.enhanced_description ||
                                                        result.enhanced
                                                            ?.enhanced_description}
                                                </div>
                                                <div>
                                                    <strong>Uses:</strong>{' '}
                                                    {result?.uses?.join(', ')}
                                                </div>
                                                <div>
                                                    <strong>
                                                        Cultural Significance:
                                                    </strong>{' '}
                                                    {translatedResult?.cultural_significance ||
                                                        result?.cultural_significance}
                                                </div>
                                                <div>
                                                    <strong>
                                                        Event Context:
                                                    </strong>{' '}
                                                    {result?.event_context?.join(
                                                        ', '
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </>
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
