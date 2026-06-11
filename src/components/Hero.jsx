import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { usePortfolio } from "../context/PortfolioContext";
import toast from "react-hot-toast";
import samuelImage from "../Samuel.jpeg";
import { normalizeEmailHref, normalizeExternalUrl } from "../utils/linkHelpers";

const escapeHtml = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const escapePdfText = (value) =>
  String(value ?? "")
    .replace(/[^\x09\x0A\x0D\x20-\x7E]/g, "")
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)");

const createPdfBlob = (lines) => {
  const content = [];
  let y = 790;

  lines.forEach(({ text, size = 11, gap = 8 }) => {
    if (!text) return;
    content.push(`BT /F1 ${size} Tf 54 ${y} Td (${escapePdfText(text)}) Tj ET`);
    y -= size + gap;
  });

  const stream = content.join("\n");
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`,
  ];

  let pdf = "%PDF-1.4\n";
  const offsets = [0];

  objects.forEach((object, index) => {
    offsets.push(pdf.length);
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });

  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.slice(1).forEach((offset) => {
    pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
  });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  return new Blob([pdf], { type: "application/pdf" });
};

const Hero = () => {
  const { portfolioData } = usePortfolio();
  const { personalInfo } = portfolioData;
  const [currentTagline, setCurrentTagline] = useState(0);

  const taglines = useMemo(
    () =>
      [
        personalInfo.tagline,
        "BSc. ICT Graduate",
        "Tech Problem Solver",
        "Open to Opportunities",
      ].filter(Boolean),
    [personalInfo.tagline],
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTagline((prev) => (prev + 1) % taglines.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [taglines.length]);

  const buildCvLines = () => [
    { text: personalInfo.name, size: 22, gap: 10 },
    { text: `${personalInfo.title} | ${personalInfo.location}`, size: 12, gap: 5 },
    { text: `Email: ${personalInfo.email} | Phone: ${personalInfo.phone}`, size: 11, gap: 18 },
    { text: "Profile", size: 15, gap: 8 },
    { text: personalInfo.about, size: 10, gap: 16 },
    { text: "Education", size: 15, gap: 8 },
    ...portfolioData.education.map((edu) => ({
      text: `- ${edu.degree} - ${edu.institution} (${edu.period})`,
      size: 10,
      gap: 6,
    })),
    { text: "Experience", size: 15, gap: 8 },
    ...portfolioData.experience.map((exp) => ({
      text: `- ${exp.role} - ${exp.company} (${exp.period})`,
      size: 10,
      gap: 6,
    })),
    { text: "Skills", size: 15, gap: 8 },
    { text: portfolioData.skills.map((skill) => skill.name).join(", "), size: 10, gap: 16 },
    { text: "Certifications", size: 15, gap: 8 },
    ...portfolioData.certifications.map((cert) => ({
      text: `- ${cert.name} - ${cert.issuer} (${cert.date})`,
      size: 10,
      gap: 6,
    })),
  ];

  const handleDownloadCV = () => {
    const cvLines = buildCvLines();
    const pdfUrl = URL.createObjectURL(createPdfBlob(cvLines));
    const htmlList = (items) =>
      items.map((item) => `<li>${escapeHtml(item)}</li>`).join("");

    const cvContent = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(personalInfo.name)} - CV</title>
    <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;800&family=Syne:wght@600;700;800&display=swap" rel="stylesheet" />
    <style>
      :root { color-scheme: light; --ink: #172033; --muted: #64748b; --line: #dbeafe; --blue: #5FB7F7; --peach: #F59E7B; }
      * { box-sizing: border-box; }
      body { margin: 0; font-family: 'DM Sans', Arial, sans-serif; color: var(--ink); background: linear-gradient(135deg, #eff6ff, #fff7ed); }
      .toolbar { position: sticky; top: 0; z-index: 2; display: flex; justify-content: center; gap: 12px; padding: 16px; background: rgba(255,255,255,.78); backdrop-filter: blur(14px); border-bottom: 1px solid rgba(148,163,184,.25); }
      .toolbar a, .toolbar button { border: 0; border-radius: 999px; padding: 12px 18px; font-weight: 800; font-family: 'DM Sans', Arial, sans-serif; cursor: pointer; text-decoration: none; }
      .primary { background: linear-gradient(135deg, var(--blue), var(--peach)); color: white; box-shadow: 0 14px 30px rgba(95,183,247,.25); }
      .secondary { background: white; color: var(--ink); border: 1px solid #dbeafe !important; }
      .sheet { width: min(900px, calc(100% - 32px)); margin: 28px auto; padding: clamp(28px, 5vw, 56px); background: white; border-radius: 28px; box-shadow: 0 24px 80px rgba(30,41,59,.14); }
      h1, h2 { font-family: 'Syne', Arial, sans-serif; }
      h1 { margin: 0; font-size: clamp(34px, 5vw, 56px); letter-spacing: -.04em; }
      h2 { margin: 32px 0 12px; padding-bottom: 8px; border-bottom: 2px solid var(--line); color: #1e3a5f; }
      p { line-height: 1.65; }
      .muted { color: var(--muted); }
      .contact { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 16px; }
      .pill { padding: 8px 12px; border-radius: 999px; background: #eff6ff; color: #1e3a5f; font-weight: 700; }
      ul { padding-left: 20px; line-height: 1.7; }
      @media print { body { background: white; } .toolbar { display: none; } .sheet { width: 100%; margin: 0; box-shadow: none; border-radius: 0; } }
    </style>
  </head>
  <body>
    <div class="toolbar">
      <a class="primary" href="${pdfUrl}" download="Samuel_Mwambua_CV.pdf">Download PDF</a>
      <button class="secondary" type="button" onclick="window.print()">Print / Save as PDF</button>
    </div>
    <main class="sheet">
      <h1>${escapeHtml(personalInfo.name)}</h1>
      <p class="muted">${escapeHtml(personalInfo.title)} | ${escapeHtml(personalInfo.location)}</p>
      <div class="contact">
        <span class="pill">${escapeHtml(personalInfo.email)}</span>
        <span class="pill">${escapeHtml(personalInfo.phone)}</span>
      </div>
      <h2>Profile</h2>
      <p>${escapeHtml(personalInfo.about)}</p>
      <h2>Education</h2>
      <ul>${htmlList(portfolioData.education.map((edu) => `${edu.degree} - ${edu.institution} (${edu.period})`))}</ul>
      <h2>Experience</h2>
      <ul>${htmlList(portfolioData.experience.map((exp) => `${exp.role} - ${exp.company} (${exp.period})`))}</ul>
      <h2>Skills</h2>
      <ul>${htmlList(portfolioData.skills.map((skill) => skill.name))}</ul>
      <h2>Certifications</h2>
      <ul>${htmlList(portfolioData.certifications.map((cert) => `${cert.name} - ${cert.issuer} (${cert.date})`))}</ul>
    </main>
  </body>
</html>`;

    const cvWindow = window.open("", "_blank");
    if (cvWindow) {
      cvWindow.document.write(cvContent);
      cvWindow.document.close();
      cvWindow.focus();
      toast.success("CV opened with Download PDF and print options.");
      return;
    }

    const a = document.createElement("a");
    a.href = pdfUrl;
    a.download = "Samuel_Mwambua_CV.pdf";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast.success("CV downloaded as PDF.");
  };

  const handleContact = () => {
    document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center pt-28 relative overflow-hidden"
    >
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute top-20 left-10 w-72 h-72 bg-accent-cyan/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-blue/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex-1 text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="inline-block px-4 py-2 rounded-full bg-accent-cyan/10 text-accent-cyan text-sm font-semibold mb-4">
                <i className="fas fa-user-graduate mr-2"></i>Available for Work
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-6xl lg:text-7xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight"
            >
              Hi, I'm <span className="gradient-text">{personalInfo.name}</span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl md:text-2xl text-slate-600 dark:text-slate-200 mb-6 h-16"
            >
              <span className="font-mono">{taglines[currentTagline]}</span>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-slate-600 dark:text-slate-300 mb-8 max-w-lg lg:mx-0 mx-auto"
            >
              {personalInfo.about.substring(0, 150)}...
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <button
                onClick={handleDownloadCV}
                className="px-8 py-3 rounded-2xl bg-gradient-to-r from-accent-cyan to-accent-blue text-white font-bold hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                <i className="fas fa-download mr-2"></i>Download CV
              </button>
              <button
                onClick={handleContact}
                className="px-8 py-3 rounded-2xl border-2 border-accent-cyan text-accent-cyan font-bold hover:bg-accent-cyan hover:text-white transition-all duration-300"
              >
                <i className="fas fa-envelope mr-2"></i>Contact Me
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex gap-4 mt-8 justify-center lg:justify-start"
            >
              <a
                href={normalizeExternalUrl(personalInfo.linkedin)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open Samuel's LinkedIn profile"
                className="w-10 h-10 rounded-full bg-white/80 dark:bg-white/10 flex items-center justify-center hover:bg-accent-cyan hover:text-white transition-all duration-300"
              >
                <i className="fab fa-linkedin-in"></i>
              </a>
              <a
                href={normalizeExternalUrl(personalInfo.github)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open Samuel's GitHub profile"
                className="w-10 h-10 rounded-full bg-white/80 dark:bg-white/10 flex items-center justify-center hover:bg-accent-cyan hover:text-white transition-all duration-300"
              >
                <i className="fab fa-github"></i>
              </a>
              <a
                href={normalizeEmailHref(personalInfo.email)}
                aria-label="Email Samuel"
                className="w-10 h-10 rounded-full bg-white/80 dark:bg-white/10 flex items-center justify-center hover:bg-accent-cyan hover:text-white transition-all duration-300"
              >
                <i className="fas fa-envelope"></i>
              </a>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="flex-1 flex justify-center"
          >
            <div className="relative">
              <div className="w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-full bg-gradient-to-r from-accent-cyan to-accent-blue p-1 animate-float">
                <div className="w-full h-full rounded-full bg-navy-800 overflow-hidden">
                  <img
                    src={samuelImage}
                    alt="Samuel Mwambua"
                    className="h-full w-full object-cover object-center"
                  />
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 bg-accent-blue rounded-2xl px-4 py-2 shadow-lg">
                <p className="text-white font-bold">Open to Work</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
