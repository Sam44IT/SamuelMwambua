import React, { useState } from "react";
import { usePortfolio } from "../../context/PortfolioContext";
import toast from "react-hot-toast";

const ManageVolunteer = () => {
  const { portfolioData, addVolunteer, updateVolunteer, deleteVolunteer } =
    usePortfolio();
  const { volunteer } = portfolioData;
  const [isEditing, setIsEditing] = useState(null);
  const [formData, setFormData] = useState({
    organization: "",
    role: "",
    period: "",
    impact: "",
    skills: [],
  });
  const [skillInput, setSkillInput] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addSkill = () => {
    if (skillInput.trim()) {
      setFormData({
        ...formData,
        skills: [...formData.skills, skillInput.trim()],
      });
      setSkillInput("");
    }
  };

  const removeSkill = (index) => {
    const newSkills = formData.skills.filter((_, i) => i !== index);
    setFormData({ ...formData, skills: newSkills });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await updateVolunteer(isEditing, formData);
        toast.success("Volunteer work saved to the server.");
      } else {
        await addVolunteer(formData);
        toast.success("Volunteer work saved to the server.");
      }
      resetForm();
    } catch (error) {
      toast.error(error.message || "Volunteer work was not saved.");
    }
  };

  const handleEdit = (vol) => {
    setIsEditing(vol.id);
    setFormData({
      organization: vol.organization,
      role: vol.role,
      period: vol.period,
      impact: vol.impact,
      skills: vol.skills,
    });
  };

  const handleDelete = (id) => {
    if (
      window.confirm("Are you sure you want to delete this volunteer work?")
    ) {
      deleteVolunteer(id)
        .then(() => toast.success("Volunteer work deleted from the server."))
        .catch((error) =>
          toast.error(error.message || "Volunteer work was not deleted."),
        );
    }
  };

  const resetForm = () => {
    setIsEditing(null);
    setFormData({
      organization: "",
      role: "",
      period: "",
      impact: "",
      skills: [],
    });
    setSkillInput("");
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
        Manage Volunteer Work
      </h2>

      {/* Form */}
      <div className="glass-card p-6">
        <h3 className="text-xl font-bold mb-4">
          {isEditing ? "Edit" : "Add"} Volunteer Work
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="organization"
            placeholder="Organization Name"
            value={formData.organization}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-lg bg-white dark:bg-navy-800 border border-gray-300 dark:border-navy-700"
          />
          <input
            type="text"
            name="role"
            placeholder="Role"
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
          <textarea
            name="impact"
            placeholder="Impact / Achievements"
            value={formData.impact}
            onChange={handleChange}
            required
            rows="3"
            className="w-full px-4 py-2 rounded-lg bg-white dark:bg-navy-800 border border-gray-300 dark:border-navy-700"
          ></textarea>

          {/* Skills */}
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
              {formData.skills.map((skill, idx) => (
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
              {isEditing ? "Update" : "Add"} Volunteer Work
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

      {/* List */}
      <div className="space-y-4">
        {volunteer.map((vol) => (
          <div
            key={vol.id}
            className="glass-card p-6 flex justify-between items-start"
          >
            <div>
              <h3 className="text-lg font-bold">{vol.organization}</h3>
              <p className="text-accent-cyan">{vol.role}</p>
              <p className="text-sm text-gray-500">{vol.period}</p>
              <p className="mt-2">{vol.impact}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {vol.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-accent-cyan/10 rounded-md text-xs"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(vol)} className="text-blue-500">
                <i className="fas fa-edit"></i>
              </button>
              <button
                onClick={() => handleDelete(vol.id)}
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

export default ManageVolunteer;
