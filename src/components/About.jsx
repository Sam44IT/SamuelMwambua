import React from "react";
import { motion } from "framer-motion";
import { usePortfolio } from "../context/PortfolioContext";

const About = () => {
  const { portfolioData } = usePortfolio();
  const { personalInfo } = portfolioData;

  return (
    <section id="about" className="py-20 bg-gray-100 dark:bg-navy-800/50">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="section-title">
            About <span className="gradient-text">Me</span>
          </h2>
          <div className="w-20 h-1 bg-accent-cyan mx-auto rounded-full"></div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Who is{" "}
              <span className="gradient-text">
                {personalInfo.name.split(" ")[0]}
              </span>
              ?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
              {personalInfo.about}
            </p>
            <div className="grid grid-cols-2 gap-4 mt-6">
              {personalInfo.funFacts.map((fact, index) => (
                <div key={index} className="glass-card p-4 text-center">
                  <i
                    className={`fas ${fact.icon} text-2xl text-accent-cyan mb-2`}
                  ></i>
                  <p className="text-gray-700 dark:text-gray-300 font-semibold">
                    {fact.text}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <div className="glass-card p-6">
              <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                <i className="fas fa-bullseye text-accent-cyan mr-2"></i>
                Short-term Goal
              </h4>
              <p className="text-gray-600 dark:text-gray-400">
                Secure an IT Support or Helpdesk role where I can apply my
                technical skills and grow professionally.
              </p>
            </div>
            <div className="glass-card p-6">
              <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                <i className="fas fa-chart-line text-accent-cyan mr-2"></i>
                Long-term Vision
              </h4>
              <p className="text-gray-600 dark:text-gray-400">
                Become a Cloud Engineer or IT Manager, leading teams to
                implement innovative technology solutions.
              </p>
            </div>
            <div className="glass-card p-6">
              <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                <i className="fas fa-heart text-accent-cyan mr-2"></i>What
                Drives Me
              </h4>
              <p className="text-gray-600 dark:text-gray-400">
                Passion for solving problems through technology and helping
                people leverage tech for better outcomes.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
