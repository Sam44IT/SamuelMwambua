import React from "react";
import { motion } from "framer-motion";
import { usePortfolio } from "../context/PortfolioContext";

const Experience = () => {
  const { portfolioData } = usePortfolio();
  const { experience } = portfolioData;

  return (
    <section id="experience" className="py-20">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="section-title">
            Work <span className="gradient-text">Experience</span>
          </h2>
          <div className="w-20 h-1 bg-accent-cyan mx-auto rounded-full"></div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {experience.map((exp, index) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="glass-card p-6 hover-lift"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {exp.role}
                  </h3>
                  <p className="text-accent-cyan font-semibold">
                    {exp.company}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    exp.type === "Internship"
                      ? "bg-green-500/10 text-green-500"
                      : "bg-blue-500/10 text-blue-500"
                  }`}
                >
                  {exp.type}
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                <i className="far fa-calendar-alt mr-2"></i>
                {exp.period}
              </p>
              <ul className="space-y-2 mb-4">
                {exp.responsibilities.map((resp, idx) => (
                  <li
                    key={idx}
                    className="text-gray-600 dark:text-gray-400 text-sm flex items-start"
                  >
                    <i className="fas fa-check-circle text-accent-cyan mr-2 mt-1"></i>
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-2">
                {exp.skillsGained.map((skill, idx) => (
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

export default Experience;
