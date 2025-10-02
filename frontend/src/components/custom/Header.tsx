import { motion } from 'framer-motion';
import { Coffee, LogIn, Menu, Plus } from 'lucide-react';
import { useTheme } from '../../context/themecontext';
import { Button } from '@/components/ui/button';
import { useState, useRef, useEffect } from 'react';
export default function Header() {
    const { themeName, setThemeName } = useTheme();
    const [showThemeDropdown, setShowThemeDropdown] = useState(false);
    const [showThemeDropdownMobile, setShowThemeDropdownMobile] =
        useState(false);
    // Header sticky/hide on scroll logic
    const [showHeader, setShowHeader] = useState(true);
    // Dropdown menu logic
    const [showDropdown, setShowDropdown] = useState<string | null>(null);
    const lastScrollY = useRef(window.scrollY);
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY < 40) {
                setShowHeader(true);
            } else if (window.scrollY > lastScrollY.current) {
                setShowHeader(false); // scrolling down
            } else {
                setShowHeader(true); // scrolling up
            }
            lastScrollY.current = window.scrollY;
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    // Dropdown menu hover fix
    const handleDropdownEnter = (menu: string) => setShowDropdown(menu);
    const handleDropdownLeave = (menu: string) => {
        setTimeout(() => {
            const dropdown = document.getElementById(`dropdown-${menu}`);
            if (dropdown && !dropdown.matches(':hover')) {
                setShowDropdown(null);
            }
        }, 100);
    };

    // Mobile menu state
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [mobileSubMenu, setMobileSubMenu] = useState<string | null>(null);

    return (
        <motion.header
            animate={{ y: showHeader ? 0 : -120, opacity: showHeader ? 1 : 0 }}
            transition={{ type: 'spring', stiffness: 120, damping: 20 }}
            className="fixed top-0 left-0 w-full z-30 bg-[#1b1b1d] text-white py-6 px-8 flex items-center justify-between shadow-lg rounded-b-3xl"
            style={{ willChange: 'transform' }}
        >
            <div className="flex items-center gap-4">
                <motion.div
                    whileHover={{ scale: 1.1, rotate: 10 }}
                    className="w-12 h-12 rounded-full bg-[#eeeff1] flex items-center justify-center shadow"
                >
                    <a href="/">
                        <img src="/PLTransparent.png" alt="PL" />
                    </a>
                </motion.div>
                <span className="text-3xl font-extrabold tracking-tight text-[#eeeff1]">
                    Past Lens
                </span>
            </div>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex-1 mx-8"
            >
                <input
                    type="text"
                    placeholder="Search Pastlens..."
                    className="w-full max-w-md min-w-[10rem] px-5 py-2 rounded-full bg-[#eeeff1] text-[#1b1b1d] placeholder-[#646464] border-none shadow focus:outline-none focus:ring-2 focus:ring-[#646464]"
                />
            </motion.div>
            {/* Hamburger menu for small screens - outside nav */}
            <div className="flex md:hidden items-center">
                <button
                    className="p-2 rounded-full bg-[#eeeff1] text-[#1b1b1d] shadow focus:outline-none"
                    onClick={() => setMobileMenuOpen((open: boolean) => !open)}
                    aria-label="Open menu"
                >
                    <Menu size={28} />
                </button>
                {mobileMenuOpen && (
                    <div className="absolute top-22 right-4 bg-[#eeeff1] text-[#1b1b1d] rounded-xl shadow-lg py-4 px-6 min-w-[220px] z-50">
                        <a
                            href="/"
                            className="block py-2 px-4 rounded hover:bg-[#f3f4f5] font-bold"
                        >
                            Home
                        </a>
                        <div>
                            <button
                                className="block w-full text-left py-2 px-4 rounded hover:bg-[#f3f4f5] font-bold"
                                onClick={() =>
                                    setMobileSubMenu(
                                        mobileSubMenu === 'community'
                                            ? null
                                            : 'community'
                                    )
                                }
                            >
                                Community
                            </button>
                            {mobileSubMenu === 'community' && (
                                <div className="pl-4">
                                    <a
                                        href="#kikuyu"
                                        className="block py-1 px-2 rounded hover:bg-[#f3f4f5]"
                                    >
                                        Kikuyu
                                    </a>
                                    <a
                                        href="#kamba"
                                        className="block py-1 px-2 rounded hover:bg-[#f3f4f5]"
                                    >
                                        Kamba
                                    </a>
                                    <a
                                        href="#swahili"
                                        className="block py-1 px-2 rounded hover:bg-[#f3f4f5]"
                                    >
                                        Swahili
                                    </a>
                                </div>
                            )}
                        </div>
                        <div>
                            <button
                                className="block w-full text-left py-2 px-4 rounded hover:bg-[#f3f4f5] font-bold"
                                onClick={() =>
                                    setMobileSubMenu(
                                        mobileSubMenu === 'collections'
                                            ? null
                                            : 'collections'
                                    )
                                }
                            >
                                Collections
                            </button>
                            {mobileSubMenu === 'collections' && (
                                <div className="pl-4">
                                    <a
                                        href="#artifacts"
                                        className="block py-1 px-2 rounded hover:bg-[#f3f4f5]"
                                    >
                                        Artifacts
                                    </a>
                                    <a
                                        href="#songs"
                                        className="block py-1 px-2 rounded hover:bg-[#f3f4f5]"
                                    >
                                        Songs
                                    </a>
                                    <a
                                        href="#history"
                                        className="block py-1 px-2 rounded hover:bg-[#f3f4f5]"
                                    >
                                        History & Origins
                                    </a>
                                    <a
                                        href="#organizations"
                                        className="block py-1 px-2 rounded hover:bg-[#f3f4f5]"
                                    >
                                        Social Organizations
                                    </a>
                                    <a
                                        href="#ceremonies"
                                        className="block py-1 px-2 rounded hover:bg-[#f3f4f5]"
                                    >
                                        Ceremonies & Events
                                    </a>
                                </div>
                            )}
                        </div>
                        <a
                            href="#team"
                            className="block py-2 px-4 rounded hover:bg-[#f3f4f5] font-bold"
                        >
                            Team
                        </a>
                        <a
                            href="#faq"
                            className="block py-2 px-4 rounded hover:bg-[#f3f4f5] font-bold"
                        >
                            FAQ
                        </a>
                        <a
                            href="#contact"
                            className="block py-2 px-4 rounded hover:bg-[#f3f4f5] font-bold"
                        >
                            Contact
                        </a>
                        <div className="flex gap-2 w-full mt-4 justify-center">
                            <div className="relative group flex items-center">
                                <Button
                                    size="icon"
                                    variant="secondary"
                                    className="bg-gray-100 border border-gray-300 text-[#1b1b1d] rounded-full p-0 flex items-center justify-center cursor-pointer"
                                    aria-label="Contribute"
                                >
                                    <Plus size={22} />
                                </Button>
                                <span className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-3 py-1 bg-black text-white text-xs rounded shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-50">
                                    Contribute
                                </span>
                            </div>
                            <div className="relative group flex items-center">
                                <Button
                                    size="icon"
                                    variant="secondary"
                                    className="bg-gray-300 hover:bg-gray-400 text-[#1b1b1d] rounded-full p-0 flex items-center justify-center cursor-pointer"
                                    aria-label="Sign In"
                                >
                                    <a href="/login">
                                        <LogIn size={22} />
                                    </a>
                                </Button>
                                <span className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-3 py-1 bg-black text-white text-xs rounded shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-50">
                                    Sign In
                                </span>
                            </div>
                            <div className="relative group flex items-center">
                                <Button
                                    size="icon"
                                    variant="secondary"
                                    className="bg-orange-600 hover:bg-orange-800 text-pink-700 rounded-full p-0 flex items-center justify-center cursor-pointer"
                                    aria-label="Choose theme"
                                    onClick={() =>
                                        setShowThemeDropdownMobile(
                                            (v: boolean) => !v
                                        )
                                    }
                                >
                                    <span style={{ fontSize: '1.3rem' }}>
                                        🎨
                                    </span>
                                </Button>
                                <span className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-3 py-1 bg-black text-white text-xs rounded shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-50">
                                    Choose Theme
                                </span>
                                {showThemeDropdownMobile && (
                                    <div className="absolute left-1/2 -translate-x-1/2 top-full mt-10 bg-white border rounded-xl shadow-lg py-2 px-2 min-w-[160px] z-50 flex flex-col gap-2">
                                        <button
                                            className={`flex items-center gap-2 w-full text-left py-2 px-4
                          border-pink-400 border-2 bg-pink-100
                          rounded font-bold transition-all duration-200 ${themeName === 'rose' ? 'ring-2 ring-pink-400' : ''}`}
                                            onClick={() => {
                                                setThemeName('rose');
                                                setShowThemeDropdownMobile(
                                                    false
                                                );
                                            }}
                                        >
                                            <span
                                                style={{ fontSize: '1.2rem' }}
                                            >
                                                🌹
                                            </span>{' '}
                                            Rose
                                        </button>
                                        <button
                                            className={`flex items-center gap-2 w-full text-left py-2 px-4 rounded 
                          border-2 border-[#4F3325] bg-orange-100
                          font-bold transition-all duration-200 ${themeName === 'coffee' ? 'ring-2 ring-[#4F3325]' : ''}`}
                                            onClick={() => {
                                                setThemeName('coffee');
                                                setShowThemeDropdownMobile(
                                                    false
                                                );
                                            }}
                                        >
                                            <span
                                                style={{ fontSize: '1.2rem' }}
                                            >
                                                ☕
                                            </span>{' '}
                                            Coffee
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <nav className="hidden md:flex gap-8 text-[#eeeff1] font-medium text-lg items-center">
                <motion.a
                    href="/"
                    className="px-4 py-2 rounded-full transition font-bold bg-[#eeeff1] text-[#1b1b1d] shadow"
                >
                    Home
                </motion.a>
                <motion.div
                    className="relative group"
                    onMouseEnter={() => handleDropdownEnter('community')}
                    onMouseLeave={() => handleDropdownLeave('community')}
                >
                    <button className="px-4 py-2 rounded-full transition font-bold hover:bg-[#eeeff1] hover:text-[#1b1b1d]">
                        Community
                    </button>
                    {showDropdown === 'community' && (
                        <div
                            id="dropdown-community"
                            className="absolute left-0 top-full mt-2 bg-[#eeeff1] text-[#1b1b1d] rounded-xl shadow-lg py-2 px-4 min-w-[160px]"
                            onMouseEnter={() =>
                                handleDropdownEnter('community')
                            }
                            onMouseLeave={() =>
                                handleDropdownLeave('community')
                            }
                        >
                            <a
                                href="#kikuyu"
                                className="block py-1 px-2 rounded hover:bg-[#f3f4f5]"
                            >
                                Kikuyu
                            </a>
                            <a
                                href="#kamba"
                                className="block py-1 px-2 rounded hover:bg-[#f3f4f5]"
                            >
                                Kamba
                            </a>
                            <a
                                href="#swahili"
                                className="block py-1 px-2 rounded hover:bg-[#f3f4f5]"
                            >
                                Swahili
                            </a>
                        </div>
                    )}
                </motion.div>
                <motion.div
                    className="relative group"
                    onMouseEnter={() => handleDropdownEnter('collections')}
                    onMouseLeave={() => handleDropdownLeave('collections')}
                >
                    <button className="px-4 py-2 rounded-full transition font-bold hover:bg-[#eeeff1] hover:text-[#1b1b1d]">
                        Collections
                    </button>
                    {showDropdown === 'collections' && (
                        <div
                            id="dropdown-collections"
                            className="absolute left-0 top-full mt-2 bg-[#eeeff1] text-[#1b1b1d] rounded-xl shadow-lg py-2 px-4 min-w-[220px]"
                            onMouseEnter={() =>
                                handleDropdownEnter('collections')
                            }
                            onMouseLeave={() =>
                                handleDropdownLeave('collections')
                            }
                        >
                            <a
                                href="#artifacts"
                                className="block py-1 px-2 rounded hover:bg-[#f3f4f5]"
                            >
                                Artifacts
                            </a>
                            <a
                                href="#songs"
                                className="block py-1 px-2 rounded hover:bg-[#f3f4f5]"
                            >
                                Songs
                            </a>
                            <a
                                href="#history"
                                className="block py-1 px-2 rounded hover:bg-[#f3f4f5]"
                            >
                                History & Origins
                            </a>
                            <a
                                href="#organizations"
                                className="block py-1 px-2 rounded hover:bg-[#f3f4f5]"
                            >
                                Social Organizations
                            </a>
                            <a
                                href="#ceremonies"
                                className="block py-1 px-2 rounded hover:bg-[#f3f4f5]"
                            >
                                Ceremonies & Events
                            </a>
                        </div>
                    )}
                </motion.div>
                <div className="flex items-center">
                    <div
                        className="inline-flex rounded-2xl shadow 
            bg-slate-300 items-center h-12  w-max"
                    >
                        <Button
                            size="lg"
                            variant="secondary"
                            className="rounded-none rounded-bl-2xl rounded-tl-2xl btngroup bg-slate-50 text-[#1b1b1d] hover:bg-[#e0e7ef]"
                            style={{ borderRight: '1px solid #d1d5db' }}
                        >
                            <Plus size={24} />
                            Contribute
                        </Button>
                        <Button
                            size="lg"
                            variant="secondary"
                            className="btngroup rounded-none border-1 justify-center border-x-slate-900 bg-slate-200"
                        >
                            <a
                                className="flex items-center gap-2"
                                href="/login"
                            >
                                <LogIn />
                                Sign In
                            </a>
                        </Button>
                        <div className="relative group flex items-center">
                            <button
                                className="bg-orange-800 hover:bg-orange-700 px-2 h-12 rounded-br-2xl rounded-tr-2xl cursor-pointer"
                                onClick={() =>
                                    setShowThemeDropdown((v: boolean) => !v)
                                }
                                aria-label="Choose theme"
                            >
                                <span style={{ fontSize: '1.5rem' }}>🎨</span>
                            </button>
                            <span className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-3 py-1 bg-black text-white text-xs rounded shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                                choose a theme
                            </span>
                            {showThemeDropdown && (
                                <div className="absolute left-[-6rem] top-full mt-2 bg-white border rounded-xl shadow-lg py-2 px-2 min-w-[180px] z-50 flex flex-col gap-2">
                                    <button
                                        key="coffee"
                                        className={`flex items-center gap-2 w-full text-left py-2 px-4 rounded font-bold transition-all duration-200 ${themeName === 'coffee' ? 'ring-2 ring-[#4F3325]' : ''}`}
                                        style={{
                                            background:
                                                themeName === 'coffee'
                                                    ? '#B39885'
                                                    : '#F5F5E9',
                                        }}
                                        onClick={() => {
                                            setThemeName('coffee');
                                            setShowThemeDropdown(false);
                                        }}
                                    >
                                        <span
                                            className="inline-flex items-center justify-center w-7 h-7 rounded-full"
                                            style={{ background: '#4F3325' }}
                                        >
                                            <Coffee size={18} color="#F5F5E9" />
                                        </span>
                                        <span className="font-bold text-base text-[#4F3325]">
                                            Coffee
                                        </span>
                                    </button>
                                    <button
                                        key="rose"
                                        className={`flex items-center gap-2 w-full text-left py-2 px-4 rounded font-bold transition-all duration-200 ${themeName === 'roseFlower' ? 'ring-2 ring-pink-400' : ''}`}
                                        style={{
                                            background:
                                                themeName === 'roseFlower'
                                                    ? '#ffd6e0'
                                                    : '#fff0f6',
                                        }}
                                        onClick={() => {
                                            setThemeName('roseFlower');
                                            setShowThemeDropdown(false);
                                        }}
                                    >
                                        <span
                                            className="inline-flex items-center justify-center w-7 h-7 rounded-full"
                                            style={{ background: '#ffb7c5' }}
                                        >
                                            <span
                                                style={{ fontSize: '1.2rem' }}
                                            >
                                                🌹
                                            </span>
                                        </span>
                                        <span className="font-bold text-base text-pink-700">
                                            Rose
                                        </span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>
        </motion.header>
    );
}
