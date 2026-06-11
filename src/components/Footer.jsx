import React from "react";
import { motion } from "framer-motion";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-navy-800 py-8 border-t border-gray-200 dark:border-navy-700">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center md:text-left mb-4 md:mb-0"
          >
            <p className="text-gray-600 dark:text-gray-400">
              &copy; {currentYear} Samuel Mwambua Mbai. All rights reserved.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex gap-6"
          >
            <a
              href="#home"
              className="text-gray-600 dark:text-gray-400 hover:text-accent-cyan transition-colors duration-300"
            >
              Home
            </a>
            <a
              href="#about"
              className="text-gray-600 dark:text-gray-400 hover:text-accent-cyan transition-colors duration-300"
            >
              About
            </a>
            <a
              href="#skills"
              className="text-gray-600 dark:text-gray-400 hover:text-accent-cyan transition-colors duration-300"
            >
              Skills
            </a>
            <a
              href="#contact"
              className="text-gray-600 dark:text-gray-400 hover:text-accent-cyan transition-colors duration-300"
            >
              Contact
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex gap-4 mt-4 md:mt-0"
          >
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="w-10 h-10 rounded-full bg-gray-200 dark:bg-navy-700 flex items-center justify-center hover:bg-accent-cyan transition-all duration-300"
            >
              <i className="fas fa-arrow-up text-gray-700 dark:text-white hover:text-white"></i>
            </button>
          </motion.div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
