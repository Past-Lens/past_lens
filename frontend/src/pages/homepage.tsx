import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { motion} from 'framer-motion';
import { Star, Coffee, BookOpen, Globe, Mic, Languages, Bot, ArrowUp, ChevronRightIcon } from 'lucide-react';
import content from '@/utils/content';

function getFeatureIcon(idx: number) {
  switch (idx) {
    case 0: return <Coffee size={32} color="#1b1b1d" className="mx-auto mb-2" />;
    case 1: return <BookOpen size={32} color="#1b1b1d" className="mx-auto mb-2" />;
    case 2: return <Globe size={32} color="#1b1b1d" className="mx-auto mb-2" />;
    case 3: return <Star size={32} color="#1b1b1d" className="mx-auto mb-2" />;
    case 4: return <Mic size={32} color="#1b1b1d" className="mx-auto mb-2" />;
    case 5: return <Languages size={32} color="#1b1b1d" className="mx-auto mb-2" />;
    default: return null;
  }
}

export default function Homepage() {
  // Floating buttons state
  const [showScrollTop, setShowScrollTop] = useState(false);
  // Tooltip state for virtual assistant button
  const [showTooltip, setShowTooltip] = useState(false);
  // Chat box state
  const [showChat, setShowChat] = useState(false);
  // Header sticky/hide on scroll logic
  const [showHeader, setShowHeader] = useState(true);
  const lastScrollY = useRef(window.scrollY);
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > window.innerHeight / 2);
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

  // FAQ dropdown state
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <>
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
        className="py-36 px-4 flex flex-col items-center justify-center relative overflow-hidden"
        style={{ background: 'linear-gradient(120deg, #f3f4f5 0%, #ffe5d0 40%, #ffd6e0 80%, #eeeff1 100%)' }}
      >
        {/* Rotating heart emoji background animation */}
        <motion.span
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
          className="absolute left-1/2 top-32 -translate-x-1/2 text-[5rem] opacity-20 pointer-events-none select-none z-0"
        >❤️</motion.span>
        <div className="absolute inset-0 pointer-events-none z-0" style={{background: 'radial-gradient(circle at 60% 20%, #ffb86c33 0%, #ff61a633 60%, #eeeff1 100%)'}}></div>
        <div className="relative z-10 max-w-6xl w-full flex flex-col md:flex-row items-center gap-16">
          <motion.div whileHover={{ scale: 1.05, rotate: 8 }} className="w-80 h-80 rounded-[2.5rem] bg-[#ffffff] flex items-center justify-center shadow-2xl border-4 border-[#eeeff1] mb-8 md:mb-0">
            <Coffee size={96} color="#1b1b1d" />
          </motion.div>
          <div className="flex-1 text-left">
            <h1 className="text-6xl font-extrabold mb-6 text-[#1b1b1d] leading-tight">{content.hero.title}: {content.hero.subtitle}</h1>
            <div className="flex items-center gap-2 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={28} color="#FFD700" fill="#FFD700" className="drop-shadow" />
              ))}
              <span className="ml-2 text-lg font-semibold text-[#646464]">AI-powered, trusted by thousands</span>
            </div>
            <h2 className="text-2xl font-semibold mb-4 text-[#646464]">{content.hero.description}</h2>
            <motion.div whileHover={{ scale: 1.05}}>
              <Button size="lg" variant="default" className="bg-[#1b1b1d] text-[#eeeff1] rounded-full px-10 py-4 text-xl font-bold shadow-lg cursor-pointer">Get Started</Button>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        id="features"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
        className="py-16 px-4 bg-[#eeeff1] relative"
      >
        {/* Micro Animations - Features Section */}
        <motion.span
          initial={{ y: 0 }}
          animate={{ y: [0, -18, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
          className="absolute left-8 top-8 text-[1.5rem] opacity-30 pointer-events-none select-none z-0"
          aria-hidden="true"
        >💡</motion.span>
        <motion.span
          initial={{ opacity: 0.2 }}
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
          className="absolute right-8 top-16 text-[1.2rem] opacity-30 pointer-events-none select-none z-0"
          aria-hidden="true"
        >✨</motion.span>
        <motion.span
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
          className="absolute left-1/2 bottom-8 text-[1.3rem] opacity-30 pointer-events-none select-none z-0"
          aria-hidden="true"
        >🔵</motion.span>
        <motion.span
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          className="absolute right-24 bottom-12 text-[1.1rem] opacity-30 pointer-events-none select-none z-0"
          aria-hidden="true"
        >🟢</motion.span>
        <motion.span
          initial={{ x: 0 }}
          animate={{ x: [0, 20, 0] }}
          transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
          className="absolute left-24 top-24 text-[1.2rem] opacity-30 pointer-events-none select-none z-0"
          aria-hidden="true"
        >🟣</motion.span>
    <h3 className="text-3xl font-bold text-center mb-12 text-[#1b1b1d]"> Explore Our Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {content.features.map((feature, idx) => (
            <motion.div whileHover={{ scale: 1.05, boxShadow: '0 0 4px #aaa', borderRadius:"1rem" }} key={idx}>
              <Card className="text-center bg-[#f3f4f5] border-none shadow-lg">
                <CardHeader>
                  {getFeatureIcon(idx)}
                  <CardTitle className="text-[#1b1b1d] mb-2">{feature.title}</CardTitle>
                  <CardDescription className="text-[#646464]">{feature.desc}</CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Mission Section */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
        className="py-16 px-4 bg-[#f3f4f5]"
      >
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <motion.div whileHover={{ scale: 1.05, rotate: -8 }} className="w-64 h-64 rounded-3xl bg-[#646464] flex items-center justify-center shadow-lg mb-8 md:mb-0">
            <BookOpen size={64} color="#eeeff1" />
          </motion.div>
          <div className="flex-1">
            <h3 className="text-3xl font-bold mb-4 text-[#1b1b1d]">{content.mission.title}</h3>
            <p className="max-w-2xl text-[#646464]">{content.mission.desc}</p>
          </div>
        </div>
      </motion.section>

      {/* FAQ Section */}
      <section className="py-16 px-4 max-w-3xl mx-auto relative flex">
        {/* Connective Bar (slim, height matches FAQ list, with dots) */}
        <div className="hidden md:flex flex-col items-center absolute left-[-32px] top-[80px]" style={{height: 'calc(100% - 80px)'}}>
          <div className="w-1 h-full rounded-full bg-gradient-to-b from-orange-400 via-pink-500 to-red-500 shadow-lg relative">
            {content.faq.map((_, idx) => (
              <span key={idx} style={{top: `${(idx + 0.5) * 64}px`}} className="absolute left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-white border-2 border-orange-400 shadow" />
            ))}
          </div>
        </div>
        {/* Micro Animations - FAQ Section */}
        {/* Micro Animations - FAQ Section (smaller, reordered) */}
        <motion.span
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
          className="absolute left-12 top-8 text-[1.2rem] opacity-30 pointer-events-none select-none z-0"
          aria-hidden="true"
        >✨</motion.span>
        <motion.span
          initial={{ y: 0 }}
          animate={{ y: [0, -14, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
          className="absolute right-16 top-24 text-[1.1rem] opacity-30 pointer-events-none select-none z-0"
          aria-hidden="true"
        >💡</motion.span>
        <motion.span
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
          className="absolute left-1/2 bottom-8 text-[1.1rem] opacity-30 pointer-events-none select-none z-0"
          aria-hidden="true"
        >🔵</motion.span>
        <motion.span
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
          className="absolute right-24 bottom-12 text-[1rem] opacity-30 pointer-events-none select-none z-0"
          aria-hidden="true"
        >🟢</motion.span>
        <motion.span
          initial={{ x: 0 }}
          animate={{ x: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          className="absolute left-24 top-32 text-[1rem] opacity-30 pointer-events-none select-none z-0"
          aria-hidden="true"
        >�</motion.span>
        <div className="flex-1">
          <h3 className="text-3xl font-bold text-center mb-10 text-[#1b1b1d]">Frequently Asked Questions</h3>
          <div className="flex flex-col gap-6">
            {content.faq.map((item, idx) => (
              <div key={idx} className="border border-orange-200 rounded-xl bg-white shadow">
                <button
                  className="w-full text-left px-6 py-4 font-semibold text-lg text-[#1b1b1d] flex justify-between items-center focus:outline-none"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  aria-expanded={openFaq === idx}
                >
                  <span>{item.question}</span>
                  <span className={`transition-transform duration-200 ${openFaq === idx ? 'rotate-90' : ''}`}><ChevronRightIcon/></span>
                </button>
                {openFaq === idx && (
                  <div className="px-6 pb-4 text-gray-700 text-base animate-fade-in">
                    {item.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section - Carousel & Animations */}
      <motion.section
        id="team"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
        className="py-16 px-4 relative overflow-x-hidden flex flex-col items-center justify-center"
        style={{ background: 'linear-gradient(120deg, #ffe5d0 0%, #ffd6e0 60%, #e0e7ef 100%)' }}
      >
        <motion.h3 initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="text-3xl font-bold text-center mb-12 text-[#1b1b1d]">Meet Past Lens Team</motion.h3>
        <div className="relative max-w-6xl mx-auto">
          {/* Left Arrow */}
          <button onClick={() => document.getElementById('team-scroll')?.scrollBy({ left: -320, behavior: 'smooth' })} className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-[#1b1b1d] text-[#eeeff1] rounded-full p-3 shadow-lg hover:scale-110 transition">
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
          </button>
          {/* Right Arrow */}
          <button onClick={() => document.getElementById('team-scroll')?.scrollBy({ left: 320, behavior: 'smooth' })} className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-[#1b1b1d] text-[#eeeff1] rounded-full p-3 shadow-lg hover:scale-110 transition">
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
          </button>
          <motion.div
            id="team-scroll"
            className="flex gap-8 overflow-x-auto p-4 scroll-smooth team-scroll"
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            style={{ scrollbarWidth: 'none' }}
          >
            {content.team.map((member, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.07, rotate: [0, 2, -2, 0], boxShadow: "0 8px 32px #64646455" }}
                whileTap={{ scale: 0.97 }}
                className="min-w-[300px] max-w-[300px] border-none shadow-xl rounded-2xl flex flex-col items-center p-10 relative"
                style={{
                  background: 'linear-gradient(135deg, #e0e7ef 0%, #f3f4f5 60%, #ffe5d0 100%)',
                }}
              >
                <motion.div
                  className="w-24 h-24 rounded-full bg-[#646464] flex items-center justify-center mb-4 shadow-lg"
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 + idx * 0.1 }}
                >
                  <Avatar className="w-24 h-24">
                    <AvatarFallback className="text-gray-900 font-bold text-3xl">{member.name[0]}</AvatarFallback>
                  </Avatar>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 + idx * 0.1 }}>
                  <CardTitle className="text-[#1b1b1d] text-xl font-bold mb-1">{member.name}</CardTitle>
                  <CardDescription className="text-[#646464] font-semibold mb-2">{member.role}</CardDescription>
                  <CardDescription className="text-[#646464] text-sm mb-2">{member.bio}</CardDescription>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
        <style>{`
          .team-scroll::-webkit-scrollbar { display: none; }
        `}</style>
      </motion.section>


      {/* Floating Virtual Assistant Button (top right) */}
      <div className="fixed top-30 right-8 z-40">
        <button
          className="bg-orange-600 hover:bg-orange-700 text-white rounded-full shadow-lg p-4 flex items-center cursor-pointer justify-center transition-all duration-200 relative"
          style={{ boxShadow: '0 4px 16px rgba(255, 140, 0, 0.3)' }}
          aria-label="Virtual Assistant"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          onClick={() => alert('Virtual Assistant coming soon!')}
        >
          <Bot size={28} />
          {showTooltip && (
            <span className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-3 py-1 bg-black text-white text-xs rounded shadow-lg whitespace-nowrap">Use our virtual assistant</span>
          )}
        </button>
      </div>
      {/* Chip and Chat Box (bottom left) */}
      <div className="fixed left-4 bottom-16 z-40 flex flex-col items-start">
        <button
          className="px-4 py-3 rounded-full shadow font-semibold text-base transition cursor-pointer text-white bg-gradient-to-r from-orange-400 via-pink-500 to-red-500 hover:from-orange-500 hover:to-pink-600"
          onClick={() => setShowChat(true)}
          style={{ boxShadow: '0 2px 16px rgba(255, 140, 0, 0.25)' }}
        >
          Ask LensAI
        </button>
        {showChat && (
          <div className="absolute left-0 bottom-12 w-80 bg-white rounded-xl shadow-2xl p-4 flex flex-col gap-2 border border-orange-200 animate-fade-in">
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-orange-700">LensAI Chat</span>
              <button className="text-gray-500 hover:text-orange-700 text-lg font-bold" onClick={() => setShowChat(false)}>×</button>
            </div>
            <div className="flex-1 min-h-[120px] bg-orange-50 rounded p-2 mb-2 text-sm text-gray-700">How can I help you today?</div>
            <form className="relative flex items-center" onSubmit={e => { e.preventDefault(); /* handle submit here */ }}>
              <input type="text" placeholder="Type your message..." className="border border-orange-200 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-orange-400 w-full pr-10" />
              <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-orange-600 hover:text-orange-800 p-1 cursor-pointer">
                <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
              </button>
            </form>
          </div>
        )}
      </div>
      {/* Scroll-to-Top Button */}
      {showScrollTop && (
        <button
          className="fixed bottom-24 right-8 z-40 bg-orange-500 hover:bg-orange-700 text-white rounded-full shadow-lg p-3 flex items-center justify-center transition-all duration-200"
          aria-label="Scroll to top"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <ArrowUp size={22} />
        </button>
      )}
    </>
  );
}
