import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/context/themecontext';
import MuseumHeader from '@/components/custom/MuseumHeader';
import LightRaysBackground from '@/components/immmersive 3d/LightRaysBackground';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Museum() {
    const { themeColors } = useTheme();
    const navigate = useNavigate();
    const [showQuote, setShowQuote] = useState(false);

    useEffect(() => {
        // Delay the quote appearance for a dramatic effect
        const timer = setTimeout(() => {
            setShowQuote(true);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="min-h-screen flex flex-col bg-black overflow-hidden">
            <MuseumHeader />
            {/* Main content */}
            <main className="flex-1 relative pt-18">
                {/* Light Rays Background */}
                <div className="absolute inset-0 z-0">
                    <LightRaysBackground
                        raysOrigin="top-center"
                        raysColor={'#ffffff'}
                        raysSpeed={0.2}
                        lightSpread={1.2}
                        rayLength={1.5}
                        pulsating={true}
                        fadeDistance={0.6}
                        saturation={1.2}
                        followMouse={true}
                        mouseInfluence={0.6}
                        noiseAmount={0.03}
                        distortion={0.15}
                        className="w-full h-full"
                    />
                </div>

                {/* Content Overlay */}
                <div className="relative z-10 container mx-auto px-4 h-full flex items-center justify-center">
                    <div className="text-center">
                        <AnimatePresence>
                            {showQuote && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{
                                        duration: 1,
                                        ease: 'easeOut',
                                    }}
                                    className="max-w-4xl mx-auto"
                                >
                                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                                        Enlightening your path to
                                        <span className="text-orange-500">
                                            {' '}
                                            cultural diversity
                                        </span>
                                    </h1>
                                    <p className="text-xl md:text-2xl text-white/80 mb-12">
                                        Step into a world where history comes
                                        alive and cultural heritage finds its
                                        digital sanctuary
                                    </p>
                                    <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
                                        <Button
                                            size="lg"
                                            className="bg-orange-500 hover:bg-orange-600 text-white px-8"
                                            onClick={() =>
                                                navigate(
                                                    '/museum/halls/artifacts'
                                                )
                                            }
                                        >
                                            Begin Journey
                                            <ArrowRight className="ml-2 h-5 w-5" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="lg"
                                            className="border-white/20 text-black hover:bg-white/10 hover:text-gray-50"
                                            onClick={() =>
                                                navigate('/museum/guide')
                                            }
                                        >
                                            Virtual Guide Tour
                                        </Button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Footer Note */}
                <div className="absolute bottom-8 left-0 right-0 z-10">
                    <div className="text-center text-white/60 text-sm">
                        Use mouse or touch to interact with the light rays
                    </div>
                </div>
            </main>
        </div>
    );
}
