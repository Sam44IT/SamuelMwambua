import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const Navbar = ({ toggleDarkMode, darkMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "About", href: "#about" },
    { name: "Skills", href: "#skills" },
    { name: "Experience", href: "#experience" },
    { name: "Projects", href: "#projects" },
    { name: "Contact", href: "#contact" },
  ];
  const mobileNavLinks = [
    { name: "Home", href: "#home" },
    { name: "About", href: "#about" },
    { name: "Skills", href: "#skills" },
    { name: "Education", href: "#education" },
    { name: "Experience", href: "#experience" },
    { name: "Projects", href: "#projects" },
    { name: "Certifications", href: "#certifications" },
    { name: "Volunteer", href: "#volunteer" },
    { name: "Hobbies", href: "#hobbies" },
    { name: "Contact", href: "#contact" },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const sections = mobileNavLinks
      .map((link) => document.querySelector(link.href))
      .filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (visible?.target?.id) {
          setActiveSection(visible.target.id);
        }
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: 0.01 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const scrollToSection = (href, { closeMenuFirst = false } = {}) => {
    if (closeMenuFirst) {
      setIsOpen(false);
      window.setTimeout(() => scrollToSection(href), 280);
      return;
    }

    const element = document.querySelector(href);
    if (element) {
      const sectionId = href.slice(1);
      const navHeight = window.innerWidth < 768 ? 92 : 112;
      const targetTop =
        element.getBoundingClientRect().top + window.pageYOffset - navHeight;

      setActiveSection(sectionId);
      window.history.replaceState(null, "", href);
      window.scrollTo({ top: Math.max(targetTop, 0), behavior: "smooth" });
    }
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 w-full z-50 px-3 pt-3 md:px-6 md:pt-5">
      <motion.div
        initial={{ opacity: 0, y: -14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className={`mx-auto max-w-6xl rounded-3xl border transition-all duration-300 ${
          scrolled || isOpen
            ? "border-white/70 dark:border-white/15 bg-white/85 dark:bg-navy-800/85 shadow-xl shadow-slate-900/10 backdrop-blur-xl"
            : "border-white/50 dark:border-white/10 bg-white/55 dark:bg-navy-800/45 backdrop-blur-md"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-3 md:px-5">
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("#home");
            }}
            className="group flex items-center gap-3"
            aria-label="Go to home section"
          >
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-accent-cyan to-accent-blue font-poppins text-lg font-extrabold text-white shadow-lg shadow-accent-cyan/20">
              SM
            </span>
            <span className="hidden sm:block leading-tight">
              <span className="block font-poppins text-sm font-bold text-slate-900 dark:text-white">
                Samuel Mwambua
              </span>
              <span className="block font-mono text-[11px] text-slate-500 dark:text-slate-300">
              </span>
            </span>
          </a>

          <div className="hidden items-center rounded-2xl border border-slate-200/80 bg-white/60 p-1 dark:border-white/10 dark:bg-white/5 md:flex">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.slice(1);
              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(link.href);
                  }}
                  className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-300 ${
                    isActive
                      ? "bg-slate-900 text-white shadow-md dark:bg-white dark:text-navy-900"
                      : "text-slate-600 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white"
                  }`}
                >
                  {link.name}
                </a>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleDarkMode}
              className="grid h-11 w-11 place-items-center rounded-2xl border border-slate-200 bg-white/80 text-slate-700 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-accent-cyan hover:text-accent-cyan dark:border-white/10 dark:bg-white/10 dark:text-slate-100"
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              <i className={`fas ${darkMode ? "fa-sun" : "fa-moon"}`}></i>
            </button>

            <button
              type="button"
              onClick={() => setIsOpen((open) => !open)}
              className="grid h-11 w-11 place-items-center rounded-2xl border border-slate-200 bg-white/80 text-slate-800 shadow-sm transition-all duration-300 dark:border-white/10 dark:bg-white/10 dark:text-white md:hidden"
              aria-label="Toggle navigation menu"
              aria-expanded={isOpen}
            >
              <i className={`fas ${isOpen ? "fa-times" : "fa-bars"}`}></i>
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden border-t border-slate-200/70 dark:border-white/10 md:hidden"
            >
              <div className="grid gap-2 p-3">
                {mobileNavLinks.map((link) => {
                  const isActive = activeSection === link.href.slice(1);
                  return (
                    <a
                      key={link.name}
                      href={link.href}
                      onClick={(e) => {
                        e.preventDefault();
                        scrollToSection(link.href, { closeMenuFirst: true });
                      }}
                      className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm font-semibold transition-all duration-300 ${
                        isActive
                          ? "bg-gradient-to-r from-accent-cyan to-accent-blue text-white shadow-md"
                          : "bg-white/55 text-slate-700 hover:bg-white dark:bg-white/5 dark:text-slate-200"
                      }`}
                    >
                      {link.name}
                      <i className="fas fa-arrow-right text-xs opacity-70"></i>
                    </a>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </nav>
  );
};

export default Navbar;
