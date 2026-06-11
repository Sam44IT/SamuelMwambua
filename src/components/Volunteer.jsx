import React from "react";
import { motion } from "framer-motion";
import { usePortfolio } from "../context/PortfolioContext";

const Volunteer = () => {
  const { portfolioData } = usePortfolio();
  const { volunteer } = portfolioData;

  return (
    <section id="volunteer" className="py-20 bg-gray-100 dark:bg-navy-800/50">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="section-title">
            Volunteer <span className="gradient-text">Work</span>
          </h2>
          <div className="w-20 h-1 bg-accent-cyan mx-auto rounded-full"></div>
          <p className="text-gray-600 dark:text-gray-400 mt-4 max-w-2xl mx-auto">
            Giving back to the community through technology
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {volunteer.map((vol, index) => (
            <motion.div
              key={vol.id}
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="glass-card p-6 hover-lift"
            >
              <div className="flex items-start mb-4">
                <div className="w-12 h-12 rounded-full bg-accent-cyan/20 flex items-center justify-center mr-4">
                  <i className="fas fa-hand-holding-heart text-2xl text-accent-cyan"></i>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {vol.organization}
                  </h3>
                  <p className="text-accent-cyan font-semibold">{vol.role}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    <i className="far fa-calendar-alt mr-1"></i>
                    {vol.period}
                  </p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-3">
                {vol.impact}
              </p>
              <div className="flex flex-wrap gap-2">
                {vol.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 rounded-md bg-accent-cyan/10 text-accent-cyan text-xs font-semibold"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Volunteer;
