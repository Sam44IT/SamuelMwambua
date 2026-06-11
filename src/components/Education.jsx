import React from "react";
import { motion } from "framer-motion";
import { usePortfolio } from "../context/PortfolioContext";

const Education = () => {
  const { portfolioData } = usePortfolio();
  const { education } = portfolioData;

  return (
    <section id="education" className="py-20 bg-gray-100 dark:bg-navy-800/50">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="section-title">
            Educational <span className="gradient-text">Journey</span>
          </h2>
          <div className="w-20 h-1 bg-accent-cyan mx-auto rounded-full"></div>
        </motion.div>

        <div className="relative">
          {/* Vertical Timeline Line */}
          <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 w-0.5 h-full bg-gradient-to-b from-accent-cyan to-accent-blue"></div>

          {education.map((edu, index) => (
            <motion.div
              key={edu.id}
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className={`relative flex flex-col md:flex-row items-start md:items-center mb-12 ${
                index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              }`}
            >
              {/* Timeline Dot */}
              <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 w-4 h-4 rounded-full bg-accent-cyan border-4 border-white dark:border-navy-900 z-10"></div>

              {/* Content */}
              <div
                className={`ml-12 md:ml-0 w-full md:w-5/12 ${
                  index % 2 === 0 ? "md:pr-12" : "md:pl-12 md:ml-auto"
                }`}
              >
                <div className="glass-card p-6 hover-lift">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {edu.degree}
                      </h3>
                      <p className="text-accent-cyan font-semibold">
                        {edu.institution}
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-accent-cyan/10 text-accent-cyan text-sm font-semibold">
                      {edu.period}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-3">
                    {edu.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {edu.courses.map((course, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 rounded-md bg-gray-200 dark:bg-navy-700 text-xs text-gray-600 dark:text-gray-400"
                      >
                        {course}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Education;
