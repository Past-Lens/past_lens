import Homepage from '@/pages/homepage';
import Header from '@/components/custom/Header';
import Footer from '@/components/custom/Footer';
import { useState, useRef, useEffect } from 'react';

function App() {
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

  return (
    <>
      <Header
        showHeader={showHeader}
        showDropdown={showDropdown}
        handleDropdownEnter={handleDropdownEnter}
        handleDropdownLeave={handleDropdownLeave}
      />
      <Homepage />
      <Footer />
    </>
  );
}

export default App;
