import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '@/context/themecontext';
import { Button } from '@/components/ui/button';
import { BookOpen, Library, Map, Compass, Globe, Menu, X } from 'lucide-react';

interface NavItem {
    label: string;
    href: string;
    icon: React.ReactNode;
}

const navigation: NavItem[] = [
    {
        label: 'Artifacts',
        href: '/museum/halls/artifacts',
        icon: <Globe className="w-4 h-4" />,
    },
    {
        label: 'Stories',
        href: '/museum/halls/stories',
        icon: <BookOpen className="w-4 h-4" />,
    },
    {
        label: 'Library',
        href: '/museum/halls/library',
        icon: <Library className="w-4 h-4" />,
    },
    {
        label: 'Guide',
        href: '/museum/guide',
        icon: <Compass className="w-4 h-4" />,
    },
];

export default function MuseumHeader() {
    const { themeColors } = useTheme();
    const location = useLocation();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header
            className={` top-0 left-0 right-0 z-50 transition-all duration-300 ${
                isScrolled ? 'backdrop-blur-md bg-black/40' : 'bg-transparent'
            }`}
        >
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/museum" className="flex items-center space-x-2">
                        <motion.img
                            src="/PLlogo.jpg"
                            alt="Past Lens"
                            className="w-8 h-8 rounded-full"
                            whileHover={{ scale: 1.1 }}
                        />
                        <span className="text-white font-semibold text-xl">
                            Past Lens
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-1">
                        {navigation.map((item) => {
                            const isActive = location.pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    to={item.href}
                                    className={`px-4 py-2 rounded-full flex items-center space-x-2 transition-colors ${
                                        isActive
                                            ? 'bg-white/10 text-white'
                                            : 'text-white/70 hover:text-white hover:bg-white/5'
                                    }`}
                                >
                                    {item.icon}
                                    <span>{item.label}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Right Section */}
                    <div className="flex items-center space-x-4">
                        <Button
                            variant="outline"
                            size="sm"
                            className="hidden md:flex bg-white/5 border-white/10 text-white hover:bg-white/10"
                        >
                            <Map className="w-4 h-4 mr-2" />
                            Map View
                        </Button>

                        {/* Mobile Menu Button */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="md:hidden text-white"
                            onClick={() =>
                                setIsMobileMenuOpen(!isMobileMenuOpen)
                            }
                        >
                            {isMobileMenuOpen ? (
                                <X className="w-6 h-6" />
                            ) : (
                                <Menu className="w-6 h-6" />
                            )}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation */}
            {isMobileMenuOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="md:hidden"
                >
                    <div className="px-2 pt-2 pb-3 space-y-1 backdrop-blur-md bg-black/40">
                        {navigation.map((item) => {
                            const isActive = location.pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    to={item.href}
                                    className={`flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium ${
                                        isActive
                                            ? 'bg-white/10 text-white'
                                            : 'text-white/70 hover:text-white hover:bg-white/5'
                                    }`}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {item.icon}
                                    <span>{item.label}</span>
                                </Link>
                            );
                        })}
                        <div className="pt-2">
                            <Button
                                variant="outline"
                                className="w-full bg-white/5 border-white/10 text-white hover:bg-white/10"
                            >
                                <Map className="w-4 h-4 mr-2" />
                                Map View
                            </Button>
                        </div>
                    </div>
                </motion.div>
            )}
        </header>
    );
}
