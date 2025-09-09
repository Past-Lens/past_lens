import { motion } from 'framer-motion';
import { Coffee, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useRef, useEffect } from 'react';

export default function Header() {
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
        onClick={() => setShowChat((v) => !v)}
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
            {chatMessages.map((msg, idx) => (
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
          onClick={() => setMobileMenuOpen((open) => !open)}
          aria-label="Open menu"
        >
          <Menu size={28} />
        </button>
        {mobileMenuOpen && (
          <div className="absolute top-22 right-4 bg-[#eeeff1] text-[#1b1b1d] rounded-xl shadow-lg py-4 px-6 min-w-[220px] z-50">
            <a href="#home" className="block py-2 px-4 rounded hover:bg-[#f3f4f5] font-bold">Home</a>
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
            <Button size="lg" variant="secondary" className="w-full mt-4 bg-[#eeeff1] text-[#1b1b1d] rounded-full px-8 py-3 font-bold shadow">Sign Up</Button>
          </div>
        )}
      </div>
      <nav className="hidden md:flex gap-8 text-[#eeeff1] font-medium text-lg items-center">
        <motion.a href="#home" className="px-4 py-2 rounded-full transition font-bold bg-[#eeeff1] text-[#1b1b1d] shadow">Home</motion.a>
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
          <Button size="lg" variant="secondary" className="bg-[#eeeff1] text-[#1b1b1d] rounded-full px-8 py-3 font-bold shadow">Sign Up</Button>
        </motion.div>
      </nav>
      </motion.header>
    </>
  );
}
