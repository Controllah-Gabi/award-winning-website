import clsx from "clsx";
import gsap from "gsap";
import { useWindowScroll } from "react-use";
import { useEffect, useRef, useState } from "react";
import { TiLocationArrow } from "react-icons/ti";
import { FiMenu, FiX } from "react-icons/fi";

import Button from "./Button";

const navItems = ["Nexus", "Vault", "Prologue", "About", "Contact"];

const NavBar = () => {
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isIndicatorActive, setIsIndicatorActive] = useState(false);

  // NEW: mobile dropdown state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const audioElementRef = useRef(null);
  const navContainerRef = useRef(null);

  const { y: currentScrollY } = useWindowScroll();
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const toggleAudioIndicator = () => {
    setIsAudioPlaying((prev) => !prev);
    setIsIndicatorActive((prev) => !prev);
  };

  useEffect(() => {
    if (!audioElementRef.current) return;
    if (isAudioPlaying) audioElementRef.current.play();
    else audioElementRef.current.pause();
  }, [isAudioPlaying]);

  useEffect(() => {
    if (!navContainerRef.current) return;

    if (currentScrollY === 0) {
      setIsNavVisible(true);
      navContainerRef.current.classList.remove("floating-nav");
    } else if (currentScrollY > lastScrollY) {
      setIsNavVisible(false);
      navContainerRef.current.classList.add("floating-nav");
      // Optional: close menu when user scrolls down
      setIsMobileMenuOpen(false);
    } else if (currentScrollY < lastScrollY) {
      setIsNavVisible(true);
      navContainerRef.current.classList.add("floating-nav");
    }

    setLastScrollY(currentScrollY);
  }, [currentScrollY, lastScrollY]);

  useEffect(() => {
    if (!navContainerRef.current) return;

    gsap.to(navContainerRef.current, {
      y: isNavVisible ? 0 : -100,
      opacity: isNavVisible ? 1 : 0,
      duration: 0.2,
    });
  }, [isNavVisible]);

  // NEW: close menu on Escape
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") setIsMobileMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const handleNavClick = (item) => {
    // Close dropdown after navigation on mobile
    setIsMobileMenuOpen(false);
    // Let anchor do its thing
  };

  return (
    <div
      ref={navContainerRef}
      className="fixed inset-x-0 top-4 z-50 border-none transition-all duration-700 sm:inset-x-6 w-[90%] md:w-auto m-auto"
    >
      <header className="w-full">
        {/* Wrap nav + dropdown in a rounded container */}
        <div className="rounded-2xl bg-black">
          <nav className="flex h-16 items-center justify-between p-4">
            {/* Logo and Product button */}
            <div className="flex items-center gap-7">
              <img src="/img/qualia-wnbg.svg" alt="logo" className="w-14" />

              <Button
                id="product-button"
                title="Qualia Sports"
                containerClass=" md:flex items-center justify-center gap-1 bg-opacity-0 text-white !py-0 !px-0"
              />
            </div>

            {/* Right side: desktop links + audio + mobile toggle */}
            <div className="flex items-center">
              {/* Desktop links */}
              <div className="hidden md:block">
                {navItems.map((item, index) => (
                  <a
                    key={index}
                    href={`#${item.toLowerCase()}`}
                    className="nav-hover-btn"
                  >
                    {item}
                  </a>
                ))}
              </div>

              {/* Audio Button (keep visible on all sizes) */}
              <button
                onClick={toggleAudioIndicator}
                className="ml-4 flex items-center space-x-0.5 md:ml-10"
                aria-label={isAudioPlaying ? "Pause audio" : "Play audio"}
              >
                <audio
                  ref={audioElementRef}
                  className="hidden"
                  src="/audio/loop.mp4"
                  loop
                />
                {[1, 2, 3, 4].map((bar) => (
                  <div
                    key={bar}
                    className={clsx("indicator-line", {
                      active: isIndicatorActive,
                    })}
                    style={{ animationDelay: `${bar * 0.1}s` }}
                  />
                ))}
              </button>

              {/* Mobile hamburger */}
              <button
                type="button"
                className="ml-3 inline-flex items-center justify-center rounded-full px-3 py-2 text-white md:hidden"
                onClick={() => setIsMobileMenuOpen((p) => !p)}
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? <FiX size={18} /> : <FiMenu size={18} />}
              </button>
            </div>
          </nav>

          {/* Mobile dropdown */}
          <div
            className={clsx(
              "md:hidden overflow-hidden transition-[max-height,opacity] duration-300",
              isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            )}
          >
            <div className="px-4 pb-4 pt-2">
              <div className="flex flex-col gap-2 rounded-2xl p-2">
                {navItems.map((item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    onClick={() => handleNavClick(item)}
                    className="rounded-xl px-4 py-3 text-sm text-white hover:bg-white/10"
                  >
                    {item}
                  </a>
                ))}

              
              </div>
            </div>
          </div>
        </div>

        {/* Optional: click-away overlay when menu open */}
        {isMobileMenuOpen && (
          <button
            className="fixed inset-0 z-[-1] md:hidden"
            aria-label="Close menu overlay"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </header>
    </div>
  );
};

export default NavBar;

