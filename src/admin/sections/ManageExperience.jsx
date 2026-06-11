import React, { useState } from "react";
import { usePortfolio } from "../../context/PortfolioContext";
import toast from "react-hot-toast";

const ManageExperience = () => {
  const { portfolioData, addExperience, updateExperience, deleteExperience } =
    usePortfolio();
  const { experience } = portfolioData;
  const [isEditing, setIsEditing] = useState(null);
  const [formData, setFormData] = useState({
    company: "",
    role: "",
    period: "",
    type: "Internship",
    responsibilities: [],
    skillsGained: [],
  });
  const [respInput, setRespInput] = useState("");
  const [skillInput, setSkillInput] = useState("");

  const types = ["Internship", "Part-time", "Full-time", "Contract"];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addResponsibility = () => {
    if (respInput.trim()) {
      setFormData({
        ...formData,
        responsibilities: [...formData.responsibilities, respInput.trim()],
      });
      setRespInput("");
    }
  };

  const removeResponsibility = (index) => {
    const newResp = formData.responsibilities.filter((_, i) => i !== index);
    setFormData({ ...formData, responsibilities: newResp });
  };

  const addSkill = () => {
    if (skillInput.trim()) {
      setFormData({
        ...formData,
        skillsGained: [...formData.skillsGained, skillInput.trim()],
      });
      setSkillInput("");
    }
  };

  const removeSkill = (index) => {
    const newSkills = formData.skillsGained.filter((_, i) => i !== index);
    setFormData({ ...formData, skillsGained: newSkills });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await updateExperience(isEditing, formData);
        toast.success("Experience saved to the server.");
      } else {
        await addExperience(formData);
        toast.success("Experience saved to the server.");
      }
      resetForm();
    } catch (error) {
      toast.error(error.message || "Experience was not saved.");
    }
  };

  const handleEdit = (exp) => {
    setIsEditing(exp.id);
    setFormData({
      company: exp.company,
      role: exp.role,
      period: exp.period,
      type: exp.type,
      responsibilities: exp.responsibilities,
      skillsGained: exp.skillsGained,
    });
  };

  const handleDelete = (id) => {
    if (
      window.confirm("Are you sure you want to delete this experience entry?")
    ) {
      deleteExperience(id)
        .then(() => toast.success("Experience deleted from the server."))
        .catch((error) =>
          toast.error(error.message || "Experience was not deleted."),
        );
    }
  };

  const resetForm = () => {
    setIsEditing(null);
    setFormData({
      company: "",
      role: "",
      period: "",
      type: "Internship",
      responsibilities: [],
      skillsGained: [],
    });
    setRespInput("");
    setSkillInput("");
  };

  return (
    <div className="space-y-8">
      <div className="glass-card p-6">
        <h3 className="text-xl font-bold mb-4">
          {isEditing ? "Edit" : "Add"} Experience
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="company"
            placeholder="Company Name"
            value={formData.company}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-lg bg-white dark:bg-navy-800 border border-gray-300 dark:border-navy-700"
          />
          <input
            type="text"
            name="role"
            placeholder="Role / Position"
            value={formData.role}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-lg bg-white dark:bg-navy-800 border border-gray-300 dark:border-navy-700"
          />
          <input
            type="text"
            name="period"
            placeholder="Period (e.g., 2024 - Present)"
            value={formData.period}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-lg bg-white dark:bg-navy-800 border border-gray-300 dark:border-navy-700"
          />

          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-white dark:bg-navy-800 border border-gray-300 dark:border-navy-700"
          >
            {types.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          {/* Responsibilities */}
          <div>
            <label className="block mb-2">Responsibilities</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={respInput}
                onChange={(e) => setRespInput(e.target.value)}
                placeholder="Add a responsibility"
                className="flex-1 px-4 py-2 rounded-lg bg-white dark:bg-navy-800 border border-gray-300 dark:border-navy-700"
              />
              <button
                type="button"
                onClick={addResponsibility}
                className="px-4 py-2 bg-accent-cyan text-navy-900 rounded-lg"
              >
                Add
              </button>
            </div>
            <ul className="list-disc list-inside space-y-1">
              {formData.responsibilities.map((resp, idx) => (
                <li key={idx} className="flex justify-between items-center">
                  <span>{resp}</span>
                  <button
                    type="button"
                    onClick={() => removeResponsibility(idx)}
                    className="text-red-500 ml-2"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Skills Gained */}
          <div>
            <label className="block mb-2">Skills Gained</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                placeholder="Add a skill"
                className="flex-1 px-4 py-2 rounded-lg bg-white dark:bg-navy-800 border border-gray-300 dark:border-navy-700"
              />
              <button
                type="button"
                onClick={addSkill}
                className="px-4 py-2 bg-accent-cyan text-navy-900 rounded-lg"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.skillsGained.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 bg-accent-cyan/20 rounded-md flex items-center gap-2"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(idx)}
                    className="text-red-500"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="px-6 py-2 bg-accent-cyan text-navy-900 rounded-lg font-semibold"
            >
              {isEditing ? "Update" : "Add"} Experience
            </button>
            {isEditing && (
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 bg-gray-500 text-white rounded-lg"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-bold">Existing Experience</h3>
        {experience.map((exp) => (
          <div key={exp.id} className="glass-card p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="text-lg font-bold">{exp.role}</h4>
                  <span className="px-2 py-1 bg-accent-cyan/10 text-accent-cyan text-xs rounded-md">
                    {exp.type}
                  </span>
                </div>
                <p className="text-accent-cyan">{exp.company}</p>
                <p className="text-sm text-gray-500">{exp.period}</p>
                <ul className="mt-2 list-disc list-inside">
                  {exp.responsibilities.map((resp, idx) => (
                    <li key={idx} className="text-sm">
                      {resp}
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-2 mt-2">
                  {exp.skillsGained.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-gray-200 dark:bg-navy-700 rounded-md text-xs"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(exp)}
                  className="text-blue-500"
                >
                  <i className="fas fa-edit"></i>
                </button>
                <button
                  onClick={() => handleDelete(exp.id)}
                  className="text-red-500"
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageExperience;
