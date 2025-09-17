import { motion } from "framer-motion";
import { Coffee, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "../ui/button";
import content from "@/utils/content";
import { useEffect, useState } from "react";

export default function Footer() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);
  const hours = time.getHours().toString().padStart(2, "0");
  const minutes = time.getMinutes().toString().padStart(2, "0");
  const seconds = time.getSeconds().toString().padStart(2, "0");

  return (
    <>
      <motion.section
        id="contact"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
        className="py-16 px-4 text-center rounded-t-3xl relative"
        style={{
          background:
            "linear-gradient(120deg, #232325 0%, #1b1b1d 80%, #1b1b1d 100%)",
          marginBottom: 0,
        }}
      >
        {/* Micro Animations - Join Us Subsection (fixed, visible) */}
        <motion.span
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
          className="absolute left-8 top-8 text-[1rem] opacity-30 pointer-events-none select-none z-10"
          aria-hidden="true"
        >
          💡
        </motion.span>
        <motion.span
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
          className="absolute right-16 top-16 text-[0.9rem] opacity-30 pointer-events-none select-none z-10"
          aria-hidden="true"
        >
          ✨
        </motion.span>
        <motion.span
          initial={{ y: 0 }}
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          className="absolute left-1/2 top-24 text-[0.8rem] opacity-30 pointer-events-none select-none z-10"
          aria-hidden="true"
        >
          🔵
        </motion.span>
        <motion.span
          initial={{ x: 0 }}
          animate={{ x: [0, 12, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          className="absolute right-24 bottom-16 text-[0.9rem] opacity-30 pointer-events-none select-none z-10"
          aria-hidden="true"
        >
          🟢
        </motion.span>
        <motion.span
          initial={{ opacity: 0.2 }}
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{ repeat: Infinity, duration: 1.1, ease: "easeInOut" }}
          className="absolute left-24 bottom-8 text-[0.8rem] opacity-30 pointer-events-none select-none z-10"
          aria-hidden="true"
        >
          🟣
        </motion.span>
        <h3 className="text-2xl font-bold mb-4 text-[#eeeff1]">
          Join Us in Preserving Culture
        </h3>
        <p className="max-w-xl mx-auto text-[#bdbdbd] mb-6">
          Be part of the movement to preserve and celebrate cultural heritage.
          Together, we can ensure our traditions live on for future generations.
        </p>
        <motion.div className="flex items-center justify-center w-full gap-12">
          <Button
            size="lg"
            variant="default"
            className="bg-[#eeeff1] text-[#1b1b1d] cursor-pointer p-4 hover:bg-amber-500 text-lg"
          >
            Contribute{" "}
          </Button>

          {/* Digital Clock */}
          <div className="flex gap-6 items-center justify-center px-6 py-2 rounded-xl bg-gradient-to-r from-[#232222] via-[#1b1b1d] to-[#232325] shadow border border-[#232325] min-w-[120px]">
            <span className="text-md font-semibold text-green-400 mt-1">
              online
            </span>
            <span className="text-2xl font-mono font-bold text-[#FFD700] tracking-widest">
              {hours}:{minutes}:{seconds} <span className="text-sm">EAT</span>
            </span>
          </div>
        </motion.div>
        <div className="mt-12 flex flex-col md:flex-row justify-center gap-12 text-left max-w-3xl mx-auto">
          <div className="flex items-center gap-3 text-[#eeeff1] whitespace-nowrap">
            <Mail size={24} color="#bdbdbd" />
            <span className="font-medium">{content.contact.email}</span>
          </div>
          <div className="flex items-center gap-3 text-[#eeeff1] whitespace-nowrap">
            <Phone size={24} color="#bdbdbd" />
            <span className="font-medium">{content.contact.phone}</span>
          </div>
          <div className="flex items-center gap-3 text-[#eeeff1] whitespace-nowrap">
            <MapPin size={24} color="#bdbdbd" />
            <span className="font-medium">{content.contact.address}</span>
          </div>
        </div>
      </motion.section>
      <motion.footer
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
        className="bg-[#1b1b1d] text-[#eeeff1] py-10 px-6 shadow-lg relative"
      >
        {/* Micro Animations - Footer (inside main footer content) */}
        <motion.span
          initial={{ y: 0 }}
          animate={{ y: [0, -12, 0] }}
          transition={{ repeat: Infinity, duration: 1.3, ease: "easeInOut" }}
          className="absolute left-8 top-4 text-[1.1rem] opacity-30 pointer-events-none select-none z-0"
          aria-hidden="true"
        >
          💡
        </motion.span>
        <motion.span
          initial={{ opacity: 0.2 }}
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{ repeat: Infinity, duration: 1.1, ease: "easeInOut" }}
          className="absolute right-8 top-8 text-[1rem] opacity-30 pointer-events-none select-none z-0"
          aria-hidden="true"
        >
          ✨
        </motion.span>
        <motion.span
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 3.5, ease: "linear" }}
          className="absolute left-1/2 bottom-4 text-[1.1rem] opacity-30 pointer-events-none select-none z-0"
          aria-hidden="true"
        >
          🔵
        </motion.span>
        <motion.span
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          className="absolute right-24 bottom-8 text-[0.9rem] opacity-30 pointer-events-none select-none z-0"
          aria-hidden="true"
        >
          🟢
        </motion.span>
        <motion.span
          initial={{ x: 0 }}
          animate={{ x: [0, 16, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="absolute left-24 top-12 text-[1rem] opacity-30 pointer-events-none select-none z-0"
          aria-hidden="true"
        >
          🟣
        </motion.span>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 10 }}
            className="flex items-center gap-3 mb-6 md:mb-0"
          >
            <div className="w-12 h-12 rounded-full bg-[#eeeff1] flex items-center justify-center shadow">
              <Coffee size={28} color="#1b1b1d" />
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-[#eeeff1]">
              Past Lens
            </span>
          </motion.div>
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="flex flex-col gap-2 text-[#eeeff1] text-sm">
              <span className="font-semibold">Contact</span>
              <span className="flex items-center gap-2">
                <Mail size={16} color="#eeeff1" /> info@pastlens.com
              </span>
              <span className="flex items-center gap-2">
                <Phone size={16} color="#eeeff1" /> +254 700 000 000
              </span>
            </div>
            <div className="flex flex-col gap-2 text-[#eeeff1] text-sm">
              <span className="font-semibold">Location</span>
              <span className="flex items-center gap-2">
                <MapPin size={16} color="#eeeff1" /> Nairobi, Kenya
              </span>
            </div>
          </div>
          <div className="text-xs text-[#646464] mt-6 md:mt-0">
            &copy; {new Date().getFullYear()} Past Lens. All rights reserved.
          </div>
        </div>
      </motion.footer>
    </>
  );
}
