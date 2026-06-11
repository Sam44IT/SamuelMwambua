import React, { useState } from "react";
import { motion } from "framer-motion";
import { usePortfolio } from "../context/PortfolioContext";

const Skills = () => {
  const { portfolioData } = usePortfolio();
  const { skills } = portfolioData;
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", ...new Set(skills.map((skill) => skill.category))];

  const filteredSkills =
    activeCategory === "All"
      ? skills
      : skills.filter((skill) => skill.category === activeCategory);

  return (
    <section id="skills" className="py-20">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="section-title">
            Technical <span className="gradient-text">Skills</span>
          </h2>
          <div className="w-20 h-1 bg-accent-cyan mx-auto rounded-full"></div>
          <p className="text-gray-600 dark:text-gray-400 mt-4 max-w-2xl mx-auto">
            Here are the technologies and skills I've acquired throughout my
            academic and professional journey
          </p>
        </motion.div>

        {/* Category Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
                activeCategory === category
                  ? "bg-gradient-to-r from-accent-cyan to-accent-blue text-white shadow-lg"
                  : "bg-gray-200 dark:bg-navy-800 text-gray-700 dark:text-gray-300 hover:bg-accent-cyan/20"
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* Skills Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSkills.map((skill, index) => (
            <motion.div
              key={skill.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="glass-card p-6 hover-lift"
            >
              <div className="flex items-center mb-4">
                <i
                  className={`fas ${skill.icon} text-3xl text-accent-cyan mr-3`}
                ></i>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    {skill.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {skill.category}
                  </p>
                </div>
              </div>
              <div className="relative pt-1">
                <div className="flex justify-between mb-1">
                  <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                    Proficiency
                  </span>
                  <span className="text-xs font-semibold text-accent-cyan">
                    {skill.level}%
                  </span>
                </div>
                <div className="overflow-hidden h-2 text-xs flex rounded-full bg-gray-200 dark:bg-navy-700">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.level}%` }}
                    transition={{ duration: 1, delay: 0.3 }}
                    viewport={{ once: true }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-accent-cyan to-accent-blue"
                  ></motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
