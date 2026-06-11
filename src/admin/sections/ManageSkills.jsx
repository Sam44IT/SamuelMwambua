import React, { useState } from "react";
import { usePortfolio } from "../../context/PortfolioContext";
import toast from "react-hot-toast";

const ManageSkills = () => {
  const { portfolioData, addSkill, updateSkill, deleteSkill } = usePortfolio();
  const { skills } = portfolioData;
  const [isEditing, setIsEditing] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    level: 50,
    icon: "fa-code",
  });

  const categories = [
    "IT Support",
    "Networking",
    "Operating Systems",
    "Software",
    "Development",
    "Soft Skills",
  ];
  const icons = [
    "fa-code",
    "fa-desktop",
    "fa-network-wired",
    "fa-database",
    "fa-cloud",
    "fa-shield-alt",
    "fa-users",
    "fa-comments",
    "fa-puzzle-piece",
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await updateSkill(isEditing, formData);
        toast.success("Skill saved to the server.");
      } else {
        await addSkill(formData);
        toast.success("Skill saved to the server.");
      }
      resetForm();
    } catch (error) {
      toast.error(error.message || "Skill was not saved.");
    }
  };

  const handleEdit = (skill) => {
    setIsEditing(skill.id);
    setFormData({
      name: skill.name,
      category: skill.category,
      level: skill.level,
      icon: skill.icon,
    });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this skill?")) {
      deleteSkill(id)
        .then(() => toast.success("Skill deleted from the server."))
        .catch((error) =>
          toast.error(error.message || "Skill was not deleted."),
        );
    }
  };

  const resetForm = () => {
    setIsEditing(null);
    setFormData({
      name: "",
      category: "",
      level: 50,
      icon: "fa-code",
    });
  };

  return (
    <div className="space-y-8">
      <div className="glass-card p-6">
        <h3 className="text-xl font-bold mb-4">
          {isEditing ? "Edit" : "Add"} Skill
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Skill Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-lg bg-white dark:bg-navy-800 border border-gray-300 dark:border-navy-700"
          />

          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-lg bg-white dark:bg-navy-800 border border-gray-300 dark:border-navy-700"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            name="icon"
            value={formData.icon}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-white dark:bg-navy-800 border border-gray-300 dark:border-navy-700"
          >
            {icons.map((icon) => (
              <option key={icon} value={icon}>
                <i className={`fas ${icon}`}></i> {icon}
              </option>
            ))}
          </select>

          <div>
            <label className="block mb-2">
              Proficiency Level: {formData.level}%
            </label>
            <input
              type="range"
              name="level"
              min="0"
              max="100"
              value={formData.level}
              onChange={handleChange}
              className="w-full"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="px-6 py-2 bg-accent-cyan text-navy-900 rounded-lg font-semibold"
            >
              {isEditing ? "Update" : "Add"} Skill
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
        <h3 className="text-xl font-bold">Existing Skills</h3>
        {skills.map((skill) => (
          <div
            key={skill.id}
            className="glass-card p-6 flex justify-between items-center"
          >
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <i
                  className={`fas ${skill.icon} text-2xl text-accent-cyan`}
                ></i>
                <div>
                  <h4 className="font-bold">{skill.name}</h4>
                  <p className="text-sm text-gray-500">{skill.category}</p>
                  <div className="w-32 mt-1">
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-accent-cyan rounded-full"
                        style={{ width: `${skill.level}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(skill)}
                className="text-blue-500"
              >
                <i className="fas fa-edit"></i>
              </button>
              <button
                onClick={() => handleDelete(skill.id)}
                className="text-red-500"
              >
                <i className="fas fa-trash"></i>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageSkills;
