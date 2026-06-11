import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { usePortfolio } from "../context/PortfolioContext";
import toast from "react-hot-toast";
import ManageSkills from "./sections/ManageSkills";
import ManageEducation from "./sections/ManageEducation";
import ManageExperience from "./sections/ManageExperience";
import ManageProjects from "./sections/ManageProjects";
import ManageCertifications from "./sections/ManageCertifications";
import ManageVolunteer from "./sections/ManageVolunteer";
import ManageHobbies from "./sections/ManageHobbies";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { portfolioData, updatePersonalInfo } = usePortfolio();
  const [activeSection, setActiveSection] = useState("overview");
  const [personalInfo, setPersonalInfo] = useState(portfolioData.personalInfo);
  const [isEditing, setIsEditing] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  useEffect(() => {
    fetch("/api/auth/session", { credentials: "include" })
      .then((response) => response.json())
      .then((session) => {
        if (!session.authenticated) navigate("/admin/login");
      })
      .catch(() => navigate("/admin/login"))
      .finally(() => setIsCheckingSession(false));
  }, [navigate]);

  useEffect(() => {
    setPersonalInfo(portfolioData.personalInfo);
  }, [portfolioData.personalInfo]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    }).catch(() => {});
    toast.success("Logged out successfully!");
    navigate("/admin/login");
  };

  const handlePersonalInfoUpdate = async (e) => {
    e.preventDefault();
    try {
      await updatePersonalInfo(personalInfo);
      setIsEditing(false);
      toast.success("Personal information saved to the server.");
    } catch (error) {
      toast.error(error.message || "Personal information was not saved.");
    }
  };

  const sections = [
    { id: "overview", name: "Overview", icon: "fa-chart-line" },
    { id: "personal", name: "Personal Info", icon: "fa-user" },
    { id: "skills", name: "Skills", icon: "fa-code" },
    { id: "education", name: "Education", icon: "fa-graduation-cap" },
    { id: "experience", name: "Experience", icon: "fa-briefcase" },
    { id: "projects", name: "Projects", icon: "fa-laptop-code" },
    { id: "certifications", name: "Certifications", icon: "fa-certificate" },
    { id: "volunteer", name: "Volunteer", icon: "fa-hand-holding-heart" },
    { id: "hobbies", name: "Hobbies", icon: "fa-heart" },
  ];

  const stats = {
    skills: portfolioData.skills.length,
    education: portfolioData.education.length,
    experience: portfolioData.experience.length,
    projects: portfolioData.projects.length,
    certifications: portfolioData.certifications.length,
    volunteer: portfolioData.volunteer.length,
    hobbies: portfolioData.hobbies.length,
  };

  if (isCheckingSession) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-navy-900 flex items-center justify-center">
        <div className="glass-card p-6 text-center">
          <i className="fas fa-spinner fa-spin text-3xl text-accent-cyan mb-3"></i>
          <p className="text-gray-700 dark:text-gray-200">
            Checking admin session...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard min-h-screen bg-gray-100 dark:bg-navy-900">
      {/* Sidebar */}
      <div className="lg:fixed left-0 top-0 lg:h-full w-full lg:w-64 bg-white dark:bg-navy-800 shadow-xl z-50 overflow-y-auto">
        <div className="p-6 border-b border-gray-200 dark:border-navy-700">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold gradient-text">Admin Panel</h2>
            <button
              onClick={handleLogout}
              className="text-red-500 hover:text-red-600"
            >
              <i className="fas fa-sign-out-alt"></i>
            </button>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Manage Portfolio Content
          </p>
        </div>

        <nav className="p-4 flex lg:block gap-2 overflow-x-auto">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`w-auto lg:w-full flex shrink-0 items-center gap-3 px-4 py-3 rounded-lg lg:mb-2 transition-all duration-300 ${
                activeSection === section.id
                  ? "bg-gradient-to-r from-accent-cyan to-accent-blue text-white"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-navy-700"
              }`}
            >
              <i className={`fas ${section.icon}`}></i>
              <span>{section.name}</span>
            </button>
          ))}
          <button
            onClick={() => navigate("/admin/audit-logs")}
            className="w-auto lg:w-full flex shrink-0 items-center gap-3 px-4 py-3 rounded-lg lg:mb-2 transition-all duration-300 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-navy-700"
          >
            <i className="fas fa-clipboard-list"></i>
            <span>Audit Logs</span>
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64 p-4 md:p-6 lg:p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {sections.find((s) => s.id === activeSection)?.name}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage and update your portfolio content from the server dashboard
          </p>
        </motion.div>

        {/* Overview Section */}
        {activeSection === "overview" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="glass-card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      Skills
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {stats.skills}
                    </p>
                  </div>
                  <i className="fas fa-code text-4xl text-accent-cyan"></i>
                </div>
              </div>
              <div className="glass-card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      Projects
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {stats.projects}
                    </p>
                  </div>
                  <i className="fas fa-laptop-code text-4xl text-accent-cyan"></i>
                </div>
              </div>
              <div className="glass-card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      Certifications
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {stats.certifications}
                    </p>
                  </div>
                  <i className="fas fa-certificate text-4xl text-accent-cyan"></i>
                </div>
              </div>
              <div className="glass-card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      Experience
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {stats.experience}
                    </p>
                  </div>
                  <i className="fas fa-briefcase text-4xl text-accent-cyan"></i>
                </div>
              </div>
            </div>

            <div className="glass-card p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Quick Tips
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li>
                  <i className="fas fa-check-circle text-green-500 mr-2"></i>{" "}
                  Use the sidebar to navigate between different sections
                </li>
                <li>
                  <i className="fas fa-check-circle text-green-500 mr-2"></i>{" "}
                  All changes are saved to the PostgreSQL database
                </li>
                <li>
                  <i className="fas fa-check-circle text-green-500 mr-2"></i>{" "}
                  Your portfolio updates instantly when you add/edit content
                </li>
                <li>
                  <i className="fas fa-check-circle text-green-500 mr-2"></i>{" "}
                  Every save creates a database backup before the update
                </li>
              </ul>
            </div>
          </motion.div>
        )}

        {/* Personal Info Section */}
        {activeSection === "personal" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card p-6"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Personal Information
              </h2>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-accent-cyan text-navy-900 rounded-lg font-semibold"
                >
                  <i className="fas fa-edit mr-2"></i>Edit
                </button>
              )}
            </div>

            {isEditing ? (
              <form onSubmit={handlePersonalInfoUpdate} className="space-y-4">
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={personalInfo.name}
                    onChange={(e) =>
                      setPersonalInfo({ ...personalInfo, name: e.target.value })
                    }
                    className="w-full px-4 py-2 rounded-lg bg-white dark:bg-navy-800 border border-gray-300 dark:border-navy-700"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={personalInfo.title}
                    onChange={(e) =>
                      setPersonalInfo({
                        ...personalInfo,
                        title: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 rounded-lg bg-white dark:bg-navy-800 border border-gray-300 dark:border-navy-700"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-2">
                    Tagline
                  </label>
                  <input
                    type="text"
                    value={personalInfo.tagline || ""}
                    onChange={(e) =>
                      setPersonalInfo({
                        ...personalInfo,
                        tagline: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 rounded-lg bg-white dark:bg-navy-800 border border-gray-300 dark:border-navy-700"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-2">
                    About Me
                  </label>
                  <textarea
                    value={personalInfo.about}
                    onChange={(e) =>
                      setPersonalInfo({
                        ...personalInfo,
                        about: e.target.value,
                      })
                    }
                    rows="5"
                    className="w-full px-4 py-2 rounded-lg bg-white dark:bg-navy-800 border border-gray-300 dark:border-navy-700"
                  ></textarea>
                </div>
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-2">
                    Fun Facts
                  </label>
                  <textarea
                    value={(personalInfo.funFacts || [])
                      .map((fact) => `${fact.icon}|${fact.text}`)
                      .join("\n")}
                    onChange={(e) =>
                      setPersonalInfo({
                        ...personalInfo,
                        funFacts: e.target.value
                          .split("\n")
                          .map((line) => line.trim())
                          .filter(Boolean)
                          .map((line) => {
                            const [icon, ...textParts] = line.split("|");
                            return {
                              icon: icon?.trim() || "fa-star",
                              text: textParts.join("|").trim(),
                            };
                          })
                          .filter((fact) => fact.text),
                      })
                    }
                    rows="4"
                    className="w-full px-4 py-2 rounded-lg bg-white dark:bg-navy-800 border border-gray-300 dark:border-navy-700"
                    placeholder="fa-location-dot|Based in Nairobi"
                  ></textarea>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Use one item per line in the format icon|text.
                  </p>
                </div>
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={personalInfo.email}
                    onChange={(e) =>
                      setPersonalInfo({
                        ...personalInfo,
                        email: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 rounded-lg bg-white dark:bg-navy-800 border border-gray-300 dark:border-navy-700"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-2">
                    Phone
                  </label>
                  <input
                    type="text"
                    value={personalInfo.phone}
                    onChange={(e) =>
                      setPersonalInfo({
                        ...personalInfo,
                        phone: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 rounded-lg bg-white dark:bg-navy-800 border border-gray-300 dark:border-navy-700"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={personalInfo.location}
                    onChange={(e) =>
                      setPersonalInfo({
                        ...personalInfo,
                        location: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 rounded-lg bg-white dark:bg-navy-800 border border-gray-300 dark:border-navy-700"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-2">
                    LinkedIn URL
                  </label>
                  <input
                    type="url"
                    value={personalInfo.linkedin}
                    onChange={(e) =>
                      setPersonalInfo({
                        ...personalInfo,
                        linkedin: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 rounded-lg bg-white dark:bg-navy-800 border border-gray-300 dark:border-navy-700"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-2">
                    GitHub URL
                  </label>
                  <input
                    type="url"
                    value={personalInfo.github}
                    onChange={(e) =>
                      setPersonalInfo({
                        ...personalInfo,
                        github: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 rounded-lg bg-white dark:bg-navy-800 border border-gray-300 dark:border-navy-700"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-accent-cyan text-navy-900 rounded-lg font-semibold"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setPersonalInfo(portfolioData.personalInfo);
                    }}
                    className="px-6 py-2 bg-gray-500 text-white rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-3">
                <p>
                  <strong>Name:</strong> {personalInfo.name}
                </p>
                <p>
                  <strong>Title:</strong> {personalInfo.title}
                </p>
                <p>
                  <strong>Tagline:</strong> {personalInfo.tagline}
                </p>
                <p>
                  <strong>Email:</strong> {personalInfo.email}
                </p>
                <p>
                  <strong>Phone:</strong> {personalInfo.phone}
                </p>
                <p>
                  <strong>Location:</strong> {personalInfo.location}
                </p>
                <p>
                  <strong>LinkedIn:</strong>{" "}
                  <a
                    href={personalInfo.linkedin}
                    className="text-accent-cyan"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {personalInfo.linkedin}
                  </a>
                </p>
                <p>
                  <strong>GitHub:</strong>{" "}
                  <a
                    href={personalInfo.github}
                    className="text-accent-cyan"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {personalInfo.github}
                  </a>
                </p>
                <div>
                  <strong>About:</strong>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">
                    {personalInfo.about}
                  </p>
                </div>
                <div>
                  <strong>Fun Facts:</strong>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {(personalInfo.funFacts || []).map((fact, index) => (
                      <span
                        key={`${fact.icon}-${index}`}
                        className="px-2 py-1 bg-accent-cyan/10 text-accent-cyan rounded-md text-sm"
                      >
                        <i className={`fas ${fact.icon} mr-1`}></i>
                        {fact.text}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Section Components */}
        {activeSection === "skills" && <ManageSkills />}
        {activeSection === "education" && <ManageEducation />}
        {activeSection === "experience" && <ManageExperience />}
        {activeSection === "projects" && <ManageProjects />}
        {activeSection === "certifications" && <ManageCertifications />}
        {activeSection === "volunteer" && <ManageVolunteer />}
        {activeSection === "hobbies" && <ManageHobbies />}
      </div>
    </div>
  );
};

export default AdminDashboard;
