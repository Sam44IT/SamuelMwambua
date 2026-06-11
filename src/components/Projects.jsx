import React from "react";
import { motion } from "framer-motion";
import { usePortfolio } from "../context/PortfolioContext";
import toast from "react-hot-toast";
import { normalizeExternalUrl } from "../utils/linkHelpers";

const Projects = () => {
  const { portfolioData } = usePortfolio();
  const { projects } = portfolioData;

  const handleGithub = (url) => {
    if (url && url !== "#") {
      window.open(normalizeExternalUrl(url), "_blank", "noopener,noreferrer");
    } else {
      toast.error("GitHub link coming soon!");
    }
  };

  const handleLiveDemo = (url) => {
    if (url && url !== "#") {
      window.open(normalizeExternalUrl(url), "_blank", "noopener,noreferrer");
    } else {
      toast.error("Live demo coming soon!");
    }
  };

  return (
    <section id="projects" className="py-20 bg-gray-100 dark:bg-navy-800/50">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="section-title">
            Featured <span className="gradient-text">Projects</span>
          </h2>
          <div className="w-20 h-1 bg-accent-cyan mx-auto rounded-full"></div>
          <p className="text-gray-600 dark:text-gray-400 mt-4 max-w-2xl mx-auto">
            Here are some projects I've worked on during my academic journey
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="glass-card overflow-hidden hover-lift"
            >
              <div className="h-48 bg-gradient-to-r from-accent-cyan/20 to-accent-blue/20 flex items-center justify-center">
                <i className="fas fa-laptop-code text-6xl text-accent-cyan/50"></i>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {project.title}
                  </h3>
                  <span className="px-2 py-1 rounded-md bg-accent-cyan/10 text-accent-cyan text-xs font-semibold">
                    {project.category}
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.techStack.map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 rounded-md bg-gray-200 dark:bg-navy-700 text-xs text-gray-600 dark:text-gray-400"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleGithub(project.githubLink)}
                    className="flex-1 px-3 py-2 rounded-lg bg-gray-200 dark:bg-navy-700 text-gray-700 dark:text-gray-300 text-sm font-semibold hover:bg-accent-cyan hover:text-white transition-all duration-300"
                  >
                    <i className="fab fa-github mr-1"></i>GitHub
                  </button>
                  <button
                    onClick={() => handleLiveDemo(project.liveDemo)}
                    className="flex-1 px-3 py-2 rounded-lg bg-gradient-to-r from-accent-cyan to-accent-blue text-white text-sm font-semibold hover:shadow-lg transition-all duration-300"
                  >
                    <i className="fas fa-external-link-alt mr-1"></i>Live Demo
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
