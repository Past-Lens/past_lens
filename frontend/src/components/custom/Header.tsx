import { motion } from "framer-motion";
import { Coffee, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Header({
  showHeader,
  showDropdown,
  handleDropdownEnter,
  handleDropdownLeave,
}: {
  showHeader: boolean;
  showDropdown: string | null;
  handleDropdownEnter: (menu: string) => void;
  handleDropdownLeave: (menu: string) => void;
}) {
  return (
    <motion.header
      animate={{ y: showHeader ? 0 : -120, opacity: showHeader ? 1 : 0 }}
      transition={{ type: "spring", stiffness: 120, damping: 20 }}
      className="fixed top-0 left-0 w-full z-30 bg-[#1b1b1d] text-white py-6 px-8 flex items-center justify-between shadow-lg rounded-b-3xl"
      style={{ willChange: "transform" }}
    >
      <div className="flex items-center gap-4">
        <motion.div
          whileHover={{ scale: 1.1, rotate: 10 }}
          className="w-12 h-12 rounded-full bg-[#eeeff1] flex items-center justify-center shadow"
        >
          <Coffee size={28} color="#1b1b1d" />
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
          className="w-full max-w-md px-5 py-2 rounded-full bg-[#eeeff1] text-[#1b1b1d] placeholder-[#646464] border-none shadow focus:outline-none focus:ring-2 focus:ring-[#646464]"
        />
      </motion.div>
      <nav className="hidden md:flex gap-8 text-[#eeeff1] font-medium text-lg items-center">
        <motion.a
          href="#home"
          className="px-4 py-2 rounded-full transition font-bold bg-[#eeeff1] text-[#1b1b1d] shadow"
        >
          Home
        </motion.a>
        <motion.div
          className="relative group"
          onMouseEnter={() => handleDropdownEnter("community")}
          onMouseLeave={() => handleDropdownLeave("community")}
        >
          <button className="px-4 py-2 rounded-full transition font-bold hover:bg-[#eeeff1] hover:text-[#1b1b1d]">
            Community
          </button>
          {showDropdown === "community" && (
            <div
              id="dropdown-community"
              className="absolute left-0 top-full mt-2 bg-[#eeeff1] text-[#1b1b1d] rounded-xl shadow-lg py-2 px-4 min-w-[160px]"
              onMouseEnter={() => handleDropdownEnter("community")}
              onMouseLeave={() => handleDropdownLeave("community")}
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
          onMouseEnter={() => handleDropdownEnter("collections")}
          onMouseLeave={() => handleDropdownLeave("collections")}
        >
          <button className="px-4 py-2 rounded-full transition font-bold hover:bg-[#eeeff1] hover:text-[#1b1b1d]">
            Collections
          </button>
          {showDropdown === "collections" && (
            <div
              id="dropdown-collections"
              className="absolute left-0 top-full mt-2 bg-[#eeeff1] text-[#1b1b1d] rounded-xl shadow-lg py-2 px-4 min-w-[220px]"
              onMouseEnter={() => handleDropdownEnter("collections")}
              onMouseLeave={() => handleDropdownLeave("collections")}
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
        <motion.div whileHover={{ scale: 1.05 }}>
          <Button
            size="lg"
            variant="secondary"
            className="bg-[#eeeff1] text-[#1b1b1d] rounded-full px-8 py-3 font-bold shadow"
          >
            Sign Up
          </Button>
        </motion.div>
      </nav>
    </motion.header>
  );
}
