import React, { createContext, useState, useContext, useEffect } from "react";
import { initialData } from "../data/initialData";

const PortfolioContext = createContext();
const STORAGE_KEY = "portfolioData";
const arraySections = [
  "skills",
  "education",
  "experience",
  "projects",
  "certifications",
  "volunteer",
  "hobbies",
];

const normalizePortfolioData = (data) => {
  const source = data && typeof data === "object" ? data : {};
  const normalized = {
    ...initialData,
    ...source,
    personalInfo: {
      ...initialData.personalInfo,
      ...(source.personalInfo && typeof source.personalInfo === "object"
        ? source.personalInfo
        : {}),
    },
  };

  arraySections.forEach((section) => {
    normalized[section] = Array.isArray(source[section])
      ? source[section]
      : initialData[section];
  });

  return normalized;
};

const safeJsonParse = (value, fallback) => {
  try {
    return value ? normalizePortfolioData(JSON.parse(value)) : fallback;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return fallback;
  }
};

const readApiError = async (response) => {
  try {
    const result = await response.json();
    return result.error || "Remote save failed.";
  } catch {
    return "Remote save failed.";
  }
};

export const usePortfolio = () => useContext(PortfolioContext);

export const PortfolioProvider = ({ children }) => {
  const [portfolioData, setPortfolioData] = useState(() => {
    return normalizePortfolioData(
      safeJsonParse(localStorage.getItem(STORAGE_KEY), initialData),
    );
  });
  const [isRemoteDataLoaded, setIsRemoteDataLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;

    fetch("/api/portfolio", { credentials: "include" })
      .then((response) => {
        if (!response.ok) throw new Error("Unable to load remote portfolio data");
        return response.json();
      })
      .then(({ data }) => {
        if (!isMounted || !data) return;
        const normalizedData = normalizePortfolioData(data);
        setPortfolioData(normalizedData);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizedData));
      })
      .catch(() => {
        const saved = normalizePortfolioData(
          safeJsonParse(localStorage.getItem(STORAGE_KEY), initialData),
        );
        if (isMounted) setPortfolioData(saved);
      })
      .finally(() => {
        if (isMounted) setIsRemoteDataLoaded(true);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const persistPortfolioSection = async (section, content) => {
    const response = await fetch(`/api/portfolio/${section}`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });

    if (!response.ok) {
      throw new Error(await readApiError(response));
    }

    return response.json();
  };

  const commitPortfolioSection = async (section, updater) => {
    const previousData = normalizePortfolioData(portfolioData);
    const currentSection = previousData[section] ?? initialData[section];
    const nextContent =
      typeof updater === "function" ? updater(currentSection) : updater;
    const nextData = normalizePortfolioData({
      ...previousData,
      [section]: nextContent,
    });

    setPortfolioData(nextData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextData));

    try {
      const result = await persistPortfolioSection(section, nextContent);
      const savedData = normalizePortfolioData({
        ...nextData,
        [section]: result.content,
      });
      setPortfolioData(savedData);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedData));
      return savedData;
    } catch (error) {
      setPortfolioData(previousData);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(previousData));
      throw error;
    }
  };

  // Admin functions
  const updatePersonalInfo = (info) => {
    return commitPortfolioSection("personalInfo", (current) => ({
      ...current,
      ...info,
    }));
  };

  const addSkill = (skill) => {
    return commitPortfolioSection("skills", (current) => [
      ...current,
      { ...skill, id: Date.now() },
    ]);
  };

  const updateSkill = (id, updatedSkill) => {
    return commitPortfolioSection("skills", (current) =>
      current.map((skill) =>
        skill.id === id ? { ...skill, ...updatedSkill } : skill,
      ),
    );
  };

  const deleteSkill = (id) => {
    return commitPortfolioSection("skills", (current) =>
      current.filter((skill) => skill.id !== id),
    );
  };

  const addEducation = (education) => {
    return commitPortfolioSection("education", (current) => [
      ...current,
      { ...education, id: Date.now() },
    ]);
  };

  const updateEducation = (id, updatedEducation) => {
    return commitPortfolioSection("education", (current) =>
      current.map((edu) =>
        edu.id === id ? { ...edu, ...updatedEducation } : edu,
      ),
    );
  };

  const deleteEducation = (id) => {
    return commitPortfolioSection("education", (current) =>
      current.filter((edu) => edu.id !== id),
    );
  };

  const addExperience = (experience) => {
    return commitPortfolioSection("experience", (current) => [
      ...current,
      { ...experience, id: Date.now() },
    ]);
  };

  const updateExperience = (id, updatedExperience) => {
    return commitPortfolioSection("experience", (current) =>
      current.map((exp) =>
        exp.id === id ? { ...exp, ...updatedExperience } : exp,
      ),
    );
  };

  const deleteExperience = (id) => {
    return commitPortfolioSection("experience", (current) =>
      current.filter((exp) => exp.id !== id),
    );
  };

  const addProject = (project) => {
    return commitPortfolioSection("projects", (current) => [
      ...current,
      { ...project, id: Date.now() },
    ]);
  };

  const updateProject = (id, updatedProject) => {
    return commitPortfolioSection("projects", (current) =>
      current.map((proj) =>
        proj.id === id ? { ...proj, ...updatedProject } : proj,
      ),
    );
  };

  const deleteProject = (id) => {
    return commitPortfolioSection("projects", (current) =>
      current.filter((proj) => proj.id !== id),
    );
  };

  const addCertification = (certification) => {
    return commitPortfolioSection("certifications", (current) => [
      ...current,
      { ...certification, id: Date.now() },
    ]);
  };

  const updateCertification = (id, updatedCertification) => {
    return commitPortfolioSection("certifications", (current) =>
      current.map((cert) =>
        cert.id === id ? { ...cert, ...updatedCertification } : cert,
      ),
    );
  };

  const deleteCertification = (id) => {
    return commitPortfolioSection("certifications", (current) =>
      current.filter((cert) => cert.id !== id),
    );
  };

  const addVolunteer = (volunteer) => {
    return commitPortfolioSection("volunteer", (current) => [
      ...current,
      { ...volunteer, id: Date.now() },
    ]);
  };

  const updateVolunteer = (id, updatedVolunteer) => {
    return commitPortfolioSection("volunteer", (current) =>
      current.map((vol) =>
        vol.id === id ? { ...vol, ...updatedVolunteer } : vol,
      ),
    );
  };

  const deleteVolunteer = (id) => {
    return commitPortfolioSection("volunteer", (current) =>
      current.filter((vol) => vol.id !== id),
    );
  };

  const addHobby = (hobby) => {
    return commitPortfolioSection("hobbies", (current) => [
      ...current,
      { ...hobby, id: Date.now() },
    ]);
  };

  const updateHobby = (id, updatedHobby) => {
    return commitPortfolioSection("hobbies", (current) =>
      current.map((hobby) =>
        hobby.id === id ? { ...hobby, ...updatedHobby } : hobby,
      ),
    );
  };

  const deleteHobby = (id) => {
    return commitPortfolioSection("hobbies", (current) =>
      current.filter((hobby) => hobby.id !== id),
    );
  };

  return (
    <PortfolioContext.Provider
      value={{
        portfolioData,
        isRemoteDataLoaded,
        updatePersonalInfo,
        addSkill,
        updateSkill,
        deleteSkill,
        addEducation,
        updateEducation,
        deleteEducation,
        addExperience,
        updateExperience,
        deleteExperience,
        addProject,
        updateProject,
        deleteProject,
        addCertification,
        updateCertification,
        deleteCertification,
        addVolunteer,
        updateVolunteer,
        deleteVolunteer,
        addHobby,
        updateHobby,
        deleteHobby,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};
