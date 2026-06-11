import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { PortfolioProvider } from "./context/PortfolioContext";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Skills from "./components/Skills";
import Education from "./components/Education";
import Experience from "./components/Experience";
import Projects from "./components/Projects";
import Certifications from "./components/Certifications";
import Volunteer from "./components/Volunteer";
import Hobbies from "./components/Hobbies";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import AdminLogin from "./admin/AdminLogin";
import AdminDashboard from "./admin/AdminDashboard";
import AuditLogs from "./admin/pages/AuditLogs";

const safeJsonParse = (value, fallback) => {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    localStorage.removeItem("darkMode");
    return fallback;
  }
};

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return safeJsonParse(saved, true);
  });

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <PortfolioProvider>
      <Router>
        <div className={darkMode ? "dark" : ""}>
          <div className="min-h-screen bg-gray-50 dark:bg-navy-900 transition-colors duration-300">
            <Toaster position="top-right" />
            <Routes>
              <Route
                path="/admin/login"
                element={
                  <AdminLogin
                    toggleDarkMode={toggleDarkMode}
                    darkMode={darkMode}
                  />
                }
              />
              <Route
                path="/admin"
                element={<Navigate to="/admin/login" replace />}
              />
              <Route
                path="/admin/dashboard"
                element={
                  <AdminDashboard
                    toggleDarkMode={toggleDarkMode}
                    darkMode={darkMode}
                  />
                }
              />
              <Route
                path="/admin/audit-logs"
                element={<AuditLogs />}
              />
              <Route
                path="/"
                element={
                  <>
                    <Navbar
                      toggleDarkMode={toggleDarkMode}
                      darkMode={darkMode}
                    />
                    <main>
                      <Hero />
                      <About />
                      <Skills />
                      <Education />
                      <Experience />
                      <Projects />
                      <Certifications />
                      <Volunteer />
                      <Hobbies />
                      <Contact />
                      <Footer />
                    </main>
                  </>
                }
              />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </div>
      </Router>
    </PortfolioProvider>
  );
}

export default App;
