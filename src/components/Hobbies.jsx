import React from "react";
import { motion } from "framer-motion";
import { usePortfolio } from "../context/PortfolioContext";

const Hobbies = () => {
  const { portfolioData } = usePortfolio();
  const { hobbies } = portfolioData;

  return (
    <section id="hobbies" className="py-20">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="section-title">
            Hobbies & <span className="gradient-text">Interests</span>
          </h2>
          <div className="w-20 h-1 bg-accent-cyan mx-auto rounded-full"></div>
          <p className="text-gray-600 dark:text-gray-400 mt-4 max-w-2xl mx-auto">
            What I enjoy doing outside of tech
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {hobbies.map((hobby, index) => (
            <motion.div
              key={hobby.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="glass-card p-6 text-center hover-lift"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-accent-cyan/20 to-accent-blue/20 flex items-center justify-center mx-auto mb-4">
                <i
                  className={`fas ${hobby.icon} text-3xl text-accent-cyan`}
                ></i>
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                {hobby.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {hobby.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hobbies;
