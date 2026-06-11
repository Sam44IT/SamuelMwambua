import React, { useState } from "react";
import { motion } from "framer-motion";
import { usePortfolio } from "../context/PortfolioContext";
import toast from "react-hot-toast";

const Contact = () => {
  const { portfolioData } = usePortfolio();
  const { personalInfo } = portfolioData;
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openMailApp = () => {
    const body = [
      `Name: ${formData.name}`,
      `Email: ${formData.email}`,
      "",
      formData.message,
    ].join("\n");
    const mailtoUrl = `mailto:${personalInfo.email}?subject=${encodeURIComponent(
      formData.subject,
    )}&body=${encodeURIComponent(body)}`;

    window.location.href = mailtoUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Contact email is not configured.");
      }

      toast.success("Message sent successfully.");
    } catch {
      openMailApp();
      toast.success("Opening your email app with the message ready to send.");
    } finally {
      setFormData({ name: "", email: "", subject: "", message: "" });
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-gray-100 dark:bg-navy-800/50">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="section-title">
            Get In <span className="gradient-text">Touch</span>
          </h2>
          <div className="w-20 h-1 bg-accent-cyan mx-auto rounded-full"></div>
          <p className="text-gray-600 dark:text-gray-400 mt-4 max-w-2xl mx-auto">
            Have a project in mind or want to discuss an opportunity? I'd love
            to hear from you!
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="glass-card p-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Contact Information
              </h3>

              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-accent-cyan/20 flex items-center justify-center mr-4">
                    <i className="fas fa-envelope text-accent-cyan"></i>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Email
                    </p>
                    <a
                      href={`mailto:${personalInfo.email}`}
                      className="text-gray-900 dark:text-white hover:text-accent-cyan"
                    >
                      {personalInfo.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-accent-cyan/20 flex items-center justify-center mr-4">
                    <i className="fas fa-phone text-accent-cyan"></i>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Phone
                    </p>
                    <a
                      href={`tel:${personalInfo.phone}`}
                      className="text-gray-900 dark:text-white hover:text-accent-cyan"
                    >
                      {personalInfo.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-accent-cyan/20 flex items-center justify-center mr-4">
                    <i className="fas fa-map-marker-alt text-accent-cyan"></i>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Location
                    </p>
                    <p className="text-gray-900 dark:text-white">
                      {personalInfo.location}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <div className="flex gap-4">
                  <a
                    href={personalInfo.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-gray-200 dark:bg-navy-700 flex items-center justify-center hover:bg-accent-cyan transition-all duration-300"
                  >
                    <i className="fab fa-linkedin-in text-gray-700 dark:text-white hover:text-white"></i>
                  </a>
                  <a
                    href={personalInfo.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-gray-200 dark:bg-navy-700 flex items-center justify-center hover:bg-accent-cyan transition-all duration-300"
                  >
                    <i className="fab fa-github text-gray-700 dark:text-white hover:text-white"></i>
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <form onSubmit={handleSubmit} className="glass-card p-6 space-y-4">
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2 font-semibold">
                  Your Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-lg bg-white dark:bg-navy-800 border border-gray-300 dark:border-navy-700 text-gray-900 dark:text-white focus:outline-none focus:border-accent-cyan"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2 font-semibold">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-lg bg-white dark:bg-navy-800 border border-gray-300 dark:border-navy-700 text-gray-900 dark:text-white focus:outline-none focus:border-accent-cyan"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2 font-semibold">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-lg bg-white dark:bg-navy-800 border border-gray-300 dark:border-navy-700 text-gray-900 dark:text-white focus:outline-none focus:border-accent-cyan"
                  placeholder="Job Opportunity / Project Inquiry"
                />
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2 font-semibold">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  className="w-full px-4 py-2 rounded-lg bg-white dark:bg-navy-800 border border-gray-300 dark:border-navy-700 text-gray-900 dark:text-white focus:outline-none focus:border-accent-cyan"
                  placeholder="Tell me about your project or opportunity..."
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-accent-cyan to-accent-blue text-white font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>Sending...
                  </>
                ) : (
                  <>
                    <i className="fas fa-paper-plane mr-2"></i>Send Message
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
