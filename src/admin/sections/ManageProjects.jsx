import React, { useState } from "react";
import { usePortfolio } from "../../context/PortfolioContext";
import toast from "react-hot-toast";

const ManageProjects = () => {
  const { portfolioData, addProject, updateProject, deleteProject } =
    usePortfolio();
  const { projects } = portfolioData;
  const [isEditing, setIsEditing] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    techStack: [],
    category: "Academic",
    githubLink: "",
    liveDemo: "",
  });
  const [techInput, setTechInput] = useState("");

  const categories = ["Academic", "Personal", "Professional"];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addTech = () => {
    if (techInput.trim()) {
      setFormData({
        ...formData,
        techStack: [...formData.techStack, techInput.trim()],
      });
      setTechInput("");
    }
  };

  const removeTech = (index) => {
    const newTech = formData.techStack.filter((_, i) => i !== index);
    setFormData({ ...formData, techStack: newTech });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await updateProject(isEditing, formData);
        toast.success("Project saved to the server.");
      } else {
        await addProject(formData);
        toast.success("Project saved to the server.");
      }
      resetForm();
    } catch (error) {
      toast.error(error.message || "Project was not saved.");
    }
  };

  const handleEdit = (proj) => {
    setIsEditing(proj.id);
    setFormData({
      title: proj.title,
      description: proj.description,
      techStack: proj.techStack,
      category: proj.category,
      githubLink: proj.githubLink,
      liveDemo: proj.liveDemo,
    });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      deleteProject(id)
        .then(() => toast.success("Project deleted from the server."))
        .catch((error) =>
          toast.error(error.message || "Project was not deleted."),
        );
    }
  };

  const resetForm = () => {
    setIsEditing(null);
    setFormData({
      title: "",
      description: "",
      techStack: [],
      category: "Academic",
      githubLink: "",
      liveDemo: "",
    });
    setTechInput("");
  };

  return (
    <div className="space-y-8">
      <div className="glass-card p-6">
        <h3 className="text-xl font-bold mb-4">
          {isEditing ? "Edit" : "Add"} Project
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="title"
            placeholder="Project Title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-lg bg-white dark:bg-navy-800 border border-gray-300 dark:border-navy-700"
          />
          <textarea
            name="description"
            placeholder="Project Description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="3"
            className="w-full px-4 py-2 rounded-lg bg-white dark:bg-navy-800 border border-gray-300 dark:border-navy-700"
          ></textarea>

          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-white dark:bg-navy-800 border border-gray-300 dark:border-navy-700"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <div>
            <label className="block mb-2">Tech Stack</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                placeholder="Add technology (e.g., React, Node.js)"
                className="flex-1 px-4 py-2 rounded-lg bg-white dark:bg-navy-800 border border-gray-300 dark:border-navy-700"
              />
              <button
                type="button"
                onClick={addTech}
                className="px-4 py-2 bg-accent-cyan text-navy-900 rounded-lg"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.techStack.map((tech, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 bg-accent-cyan/20 rounded-md flex items-center gap-2"
                >
                  {tech}
                  <button
                    type="button"
                    onClick={() => removeTech(idx)}
                    className="text-red-500"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </span>
              ))}
            </div>
          </div>

          <input
            type="url"
            name="githubLink"
            placeholder="GitHub Repository Link"
            value={formData.githubLink}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-white dark:bg-navy-800 border border-gray-300 dark:border-navy-700"
          />
          <input
            type="url"
            name="liveDemo"
            placeholder="Live Demo Link"
            value={formData.liveDemo}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-white dark:bg-navy-800 border border-gray-300 dark:border-navy-700"
          />

          <div className="flex gap-3">
            <button
              type="submit"
              className="px-6 py-2 bg-accent-cyan text-navy-900 rounded-lg font-semibold"
            >
              {isEditing ? "Update" : "Add"} Project
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
        <h3 className="text-xl font-bold">Existing Projects</h3>
        {projects.map((proj) => (
          <div key={proj.id} className="glass-card p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="text-lg font-bold">{proj.title}</h4>
                  <span className="px-2 py-1 bg-accent-cyan/10 text-accent-cyan text-xs rounded-md">
                    {proj.category}
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  {proj.description}
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {proj.techStack.map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-gray-200 dark:bg-navy-700 rounded-md text-xs"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="flex gap-3 mt-2">
                  {proj.githubLink && (
                    <a
                      href={proj.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent-cyan text-sm"
                    >
                      GitHub
                    </a>
                  )}
                  {proj.liveDemo && (
                    <a
                      href={proj.liveDemo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent-cyan text-sm"
                    >
                      Live Demo
                    </a>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(proj)}
                  className="text-blue-500"
                >
                  <i className="fas fa-edit"></i>
                </button>
                <button
                  onClick={() => handleDelete(proj.id)}
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

export default ManageProjects;
