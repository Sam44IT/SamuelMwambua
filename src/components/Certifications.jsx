import React from "react";
import { motion } from "framer-motion";
import { usePortfolio } from "../context/PortfolioContext";
import toast from "react-hot-toast";

const Certifications = () => {
  const { portfolioData } = usePortfolio();
  const { certifications } = portfolioData;

  const verifyCertificate = (url) => {
    if (url && url !== "#") {
      window.open(url, "_blank", "noopener,noreferrer");
    } else {
      toast.error("Verification link coming soon!");
    }
  };

  return (
    <section id="certifications" className="py-20">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="section-title">
            Certifications & <span className="gradient-text">Achievements</span>
          </h2>
          <div className="w-20 h-1 bg-accent-cyan mx-auto rounded-full"></div>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certifications.map((cert, index) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="glass-card p-6 hover-lift cursor-pointer"
              onClick={() => verifyCertificate(cert.verifyUrl)}
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-accent-cyan/20 flex items-center justify-center mr-4">
                  <i className="fas fa-certificate text-2xl text-accent-cyan"></i>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    {cert.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {cert.issuer}
                  </p>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  <i className="far fa-calendar-alt mr-1"></i>
                  {cert.date}
                </span>
                <span className="text-xs text-accent-cyan">
                  <i className="fas fa-external-link-alt mr-1"></i>Verify
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Certifications;
