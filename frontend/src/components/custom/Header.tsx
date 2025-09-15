import { motion } from 'framer-motion';
import { Coffee, Menu } from 'lucide-react';
import { useTheme } from '../../context/themecontext';
import { Button } from '@/components/ui/button';
import { useState, useRef, useEffect } from 'react';
export default function Header() {
  const { themeName, setThemeName } = useTheme();
  const [showThemeDropdown, setShowThemeDropdown] = useState(false);
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
  // Chat box state
  const [showChat, setShowChat] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<{user: string, text: string}[]>([]);

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setChatMessages([...chatMessages, {user: "You", text: chatInput}, {user: "LensAI", text: "Sorry!! LensAI is not active yet"}]);
    setChatInput("");
  };
  // Mobile menu state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSubMenu, setMobileSubMenu] = useState<string | null>(null);

  return (
    <>
      {/* Floating Chat Button */}
      <button
        className="group fixed bottom-8 left-8 z-50 bg-orange-600 hover:bg-orange-700 px-4 py-0 text-white rounded-full shadow-lg flex items-center cursor-pointer justify-center transition-all duration-200 min-h-16"
  onClick={() => setShowChat((v: boolean) => !v)}
        aria-label="Open chat"
      >
        <span className="font-bold text-lg align-center">💬</span>
        <span className="ml-2 max-w-0 group-hover:max-w-xs group-hover:opacity-100 opacity-0 overflow-hidden transition-all duration-300 py-2">Ask LensAI</span>
      </button>
      {/* Chat Box */}
      {showChat && (
  <div className="fixed bottom-24 left-8 z-50 bg-white rounded-2xl shadow-2xl w-80 max-w-full p-4 flex flex-col">
          <div className="font-bold text-[#1b1b1d] mb-2">LensAI Chat</div>
          <div className="flex-1 overflow-y-auto mb-2 max-h-48">
            {chatMessages.map((msg: {user: string, text: string}, idx: number) => (
              <div key={idx} className={`mb-2 text-sm ${msg.user === "You" ? "text-right" : "text-left"}`}>
                <span className={`inline-block px-3 py-2 rounded-xl ${msg.user === "You" ? "bg-[#eeeff1] text-[#1b1b1d]" : "bg-orange-100 text-orange-700"}`}>{msg.text}</span>
              </div>
            ))}
          </div>
          <form onSubmit={handleSendChat} className="flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-3 py-2 rounded-xl border border-[#eeeff1] focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            <button type="submit" className="bg-orange-600 text-white px-4 py-2 rounded-xl font-bold">Send</button>
          </form>
        </div>
      )}
      <motion.header
        animate={{ y: showHeader ? 0 : -120, opacity: showHeader ? 1 : 0 }}
        transition={{ type: 'spring', stiffness: 120, damping: 20 }}
        className="fixed top-0 left-0 w-full z-30 bg-[#1b1b1d] text-white py-6 px-8 flex items-center justify-between shadow-lg rounded-b-3xl"
        style={{ willChange: 'transform' }}
      >
      <div className="flex items-center gap-4">
        <motion.div whileHover={{ scale: 1.1, rotate: 10 }} className="w-12 h-12 rounded-full bg-[#eeeff1] flex items-center justify-center shadow">
          <Coffee size={28} color="#1b1b1d" />
        </motion.div>
        <span className="text-3xl font-extrabold tracking-tight text-[#eeeff1]">Past Lens</span>
        {/* Rose icon theme dropdown */}
        <div className="relative">
          <div className="relative group">
            <button
              className="ml-2 px-2 py-1 rounded-full bg-pink-200 hover:bg-pink-300 text-pink-700 shadow flex items-center"
              onClick={() => setShowThemeDropdown((v: boolean) => !v)}
              aria-label="Choose theme"
            >
              <span style={{fontSize:'1.5rem'}}>🌹</span>
            </button>
            <span className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-3 py-1 bg-black text-white text-xs rounded shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
              choose a theme
            </span>
          </div>
          {showThemeDropdown && (
            <div className="absolute left-0 top-full mt-2 bg-white border rounded-xl shadow-lg py-2 px-2 min-w-[180px] z-50 flex flex-col gap-2">
              <button
                key="coffee"
                className={`flex items-center gap-2 w-full text-left py-2 px-4 rounded font-bold transition-all duration-200 ${themeName === 'coffee' ? 'ring-2 ring-[#4F3325]' : ''}`}
                style={{ background: themeName === 'coffee' ? '#B39885' : '#F5F5E9' }}
                onClick={() => { setThemeName('coffee'); setShowThemeDropdown(false); }}
              >
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full" style={{ background: '#4F3325' }}>
                  <Coffee size={18} color="#F5F5E9" />
                </span>
                <span className="font-bold text-base text-[#4F3325]">Coffee</span>
              </button>
              <button
                key="rose"
                className={`flex items-center gap-2 w-full text-left py-2 px-4 rounded font-bold transition-all duration-200 ${themeName === 'roseFlower' ? 'ring-2 ring-pink-400' : ''}`}
                style={{ background: themeName === 'roseFlower' ? '#ffd6e0' : '#fff0f6' }}
                onClick={() => { setThemeName('roseFlower'); setShowThemeDropdown(false); }}
              >
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full" style={{ background: '#ffb7c5' }}>
                  <span style={{ fontSize: '1.2rem' }}>🌹</span>
                </span>
                <span className="font-bold text-base text-pink-700">Rose</span>
              </button>
            </div>
          )}
        </div>
      </div>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="flex-1 mx-8">
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
            <a href="/" className="block py-2 px-4 rounded hover:bg-[#f3f4f5] font-bold">Home</a>
            <div>
              <button
                className="block w-full text-left py-2 px-4 rounded hover:bg-[#f3f4f5] font-bold"
                onClick={() => setMobileSubMenu(mobileSubMenu === 'community' ? null : 'community')}
              >Community</button>
              {mobileSubMenu === 'community' && (
                <div className="pl-4">
                  <a href="#kikuyu" className="block py-1 px-2 rounded hover:bg-[#f3f4f5]">Kikuyu</a>
                  <a href="#kamba" className="block py-1 px-2 rounded hover:bg-[#f3f4f5]">Kamba</a>
                  <a href="#swahili" className="block py-1 px-2 rounded hover:bg-[#f3f4f5]">Swahili</a>
                </div>
              )}
            </div>
            <div>
              <button
                className="block w-full text-left py-2 px-4 rounded hover:bg-[#f3f4f5] font-bold"
                onClick={() => setMobileSubMenu(mobileSubMenu === 'collections' ? null : 'collections')}
              >Collections</button>
              {mobileSubMenu === 'collections' && (
                <div className="pl-4">
                  <a href="#artifacts" className="block py-1 px-2 rounded hover:bg-[#f3f4f5]">Artifacts</a>
                  <a href="#songs" className="block py-1 px-2 rounded hover:bg-[#f3f4f5]">Songs</a>
                  <a href="#history" className="block py-1 px-2 rounded hover:bg-[#f3f4f5]">History & Origins</a>
                  <a href="#organizations" className="block py-1 px-2 rounded hover:bg-[#f3f4f5]">Social Organizations</a>
                  <a href="#ceremonies" className="block py-1 px-2 rounded hover:bg-[#f3f4f5]">Ceremonies & Events</a>
                </div>
              )}
            </div>
            <a href="#team" className="block py-2 px-4 rounded hover:bg-[#f3f4f5] font-bold">Team</a>
            <a href="#faq" className="block py-2 px-4 rounded hover:bg-[#f3f4f5] font-bold">FAQ</a>
            <a href="#contact" className="block py-2 px-4 rounded hover:bg-[#f3f4f5] font-bold">Contact</a>
            <Button size="lg" variant="secondary" 
            className="w-full mt-4 bg-[#eeeff1] text-[#1b1b1d] rounded-full px-8 py-3 font-bold shadow">
              <a className='' href='/signup'>Sign Up</a>
            </Button>
          </div>
        )}
      </div>
      <nav className="hidden md:flex gap-8 text-[#eeeff1] font-medium text-lg items-center">
        <motion.a href="/" className="px-4 py-2 rounded-full transition font-bold bg-[#eeeff1] text-[#1b1b1d] shadow">Home</motion.a>
        <motion.div className="relative group" onMouseEnter={() => handleDropdownEnter('community')} onMouseLeave={() => handleDropdownLeave('community')}>
          <button className="px-4 py-2 rounded-full transition font-bold hover:bg-[#eeeff1] hover:text-[#1b1b1d]">Community</button>
          {showDropdown === 'community' && (
            <div id="dropdown-community" className="absolute left-0 top-full mt-2 bg-[#eeeff1] text-[#1b1b1d] rounded-xl shadow-lg py-2 px-4 min-w-[160px]"
              onMouseEnter={() => handleDropdownEnter('community')}
              onMouseLeave={() => handleDropdownLeave('community')}>
              <a href="#kikuyu" className="block py-1 px-2 rounded hover:bg-[#f3f4f5]">Kikuyu</a>
              <a href="#kamba" className="block py-1 px-2 rounded hover:bg-[#f3f4f5]">Kamba</a>
              <a href="#swahili" className="block py-1 px-2 rounded hover:bg-[#f3f4f5]">Swahili</a>
            </div>
          )}
        </motion.div>
        <motion.div className="relative group" onMouseEnter={() => handleDropdownEnter('collections')} onMouseLeave={() => handleDropdownLeave('collections')}>
          <button className="px-4 py-2 rounded-full transition font-bold hover:bg-[#eeeff1] hover:text-[#1b1b1d]">Collections</button>
          {showDropdown === 'collections' && (
            <div id="dropdown-collections" className="absolute left-0 top-full mt-2 bg-[#eeeff1] text-[#1b1b1d] rounded-xl shadow-lg py-2 px-4 min-w-[220px]"
              onMouseEnter={() => handleDropdownEnter('collections')}
              onMouseLeave={() => handleDropdownLeave('collections')}>
              <a href="#artifacts" className="block py-1 px-2 rounded hover:bg-[#f3f4f5]">Artifacts</a>
              <a href="#songs" className="block py-1 px-2 rounded hover:bg-[#f3f4f5]">Songs</a>
              <a href="#history" className="block py-1 px-2 rounded hover:bg-[#f3f4f5]">History & Origins</a>
              <a href="#organizations" className="block py-1 px-2 rounded hover:bg-[#f3f4f5]">Social Organizations</a>
              <a href="#ceremonies" className="block py-1 px-2 rounded hover:bg-[#f3f4f5]">Ceremonies & Events</a>
            </div>
          )}
        </motion.div>
        <motion.div whileHover={{ scale: 1.05}}>
          <Button size="lg" variant="secondary" 
            className="w-full mt-4 bg-[#eeeff1] text-[#1b1b1d] rounded-full px-8 py-3 font-bold shadow">
              <a className='' href='/login'>Sign In</a>
          </Button>        
        </motion.div>
      </nav>
      </motion.header>
    </>
  );
}
