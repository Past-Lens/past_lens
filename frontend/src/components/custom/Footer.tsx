import { motion } from "framer-motion";
import { Coffee, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      viewport={{ once: true }}
      className="bg-[#1b1b1d] text-[#eeeff1] py-10 px-6 mt-20 rounded-t-3xl shadow-lg"
    >
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
  );
}
