import React, { useState } from "react";
import { usePortfolio } from "../../context/PortfolioContext";
import toast from "react-hot-toast";

const ManageEducation = () => {
  const { portfolioData, addEducation, updateEducation, deleteEducation } =
    usePortfolio();
  const { education } = portfolioData;
  const [isEditing, setIsEditing] = useState(null);
  const [formData, setFormData] = useState({
    institution: "",
    degree: "",
    period: "",
    description: "",
    courses: [],
  });
  const [courseInput, setCourseInput] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addCourse = () => {
    if (courseInput.trim()) {
      setFormData({
        ...formData,
        courses: [...formData.courses, courseInput.trim()],
      });
      setCourseInput("");
    }
  };

  const removeCourse = (index) => {
    const newCourses = formData.courses.filter((_, i) => i !== index);
    setFormData({ ...formData, courses: newCourses });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await updateEducation(isEditing, formData);
        toast.success("Education saved to the server.");
      } else {
        await addEducation(formData);
        toast.success("Education saved to the server.");
      }
      resetForm();
    } catch (error) {
      toast.error(error.message || "Education was not saved.");
    }
  };

  const handleEdit = (edu) => {
    setIsEditing(edu.id);
    setFormData({
      institution: edu.institution,
      degree: edu.degree,
      period: edu.period,
      description: edu.description,
      courses: edu.courses,
    });
  };

  const handleDelete = (id) => {
    if (
      window.confirm("Are you sure you want to delete this education entry?")
    ) {
      deleteEducation(id)
        .then(() => toast.success("Education deleted from the server."))
        .catch((error) =>
          toast.error(error.message || "Education was not deleted."),
        );
    }
  };

  const resetForm = () => {
    setIsEditing(null);
    setFormData({
      institution: "",
      degree: "",
      period: "",
      description: "",
      courses: [],
    });
    setCourseInput("");
  };

  return (
    <div className="space-y-8">
      <div className="glass-card p-6">
        <h3 className="text-xl font-bold mb-4">
          {isEditing ? "Edit" : "Add"} Education
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="institution"
            placeholder="Institution Name"
            value={formData.institution}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-lg bg-white dark:bg-navy-800 border border-gray-300 dark:border-navy-700"
          />
          <input
            type="text"
            name="degree"
            placeholder="Degree / Course"
            value={formData.degree}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-lg bg-white dark:bg-navy-800 border border-gray-300 dark:border-navy-700"
          />
          <input
            type="text"
            name="period"
            placeholder="Period (e.g., 2022 - 2026)"
            value={formData.period}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-lg bg-white dark:bg-navy-800 border border-gray-300 dark:border-navy-700"
          />
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            className="w-full px-4 py-2 rounded-lg bg-white dark:bg-navy-800 border border-gray-300 dark:border-navy-700"
          ></textarea>

          <div>
            <label className="block mb-2">Key Courses</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={courseInput}
                onChange={(e) => setCourseInput(e.target.value)}
                placeholder="Add a course"
                className="flex-1 px-4 py-2 rounded-lg bg-white dark:bg-navy-800 border border-gray-300 dark:border-navy-700"
              />
              <button
                type="button"
                onClick={addCourse}
                className="px-4 py-2 bg-accent-cyan text-navy-900 rounded-lg"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.courses.map((course, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 bg-accent-cyan/20 rounded-md flex items-center gap-2"
                >
                  {course}
                  <button
                    type="button"
                    onClick={() => removeCourse(idx)}
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
              {isEditing ? "Update" : "Add"} Education
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
        <h3 className="text-xl font-bold">Existing Education</h3>
        {education.map((edu) => (
          <div key={edu.id} className="glass-card p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h4 className="text-lg font-bold">{edu.degree}</h4>
                <p className="text-accent-cyan">{edu.institution}</p>
                <p className="text-sm text-gray-500">{edu.period}</p>
                <p className="mt-2">{edu.description}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {edu.courses.map((course, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-gray-200 dark:bg-navy-700 rounded-md text-xs"
                    >
                      {course}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(edu)}
                  className="text-blue-500"
                >
                  <i className="fas fa-edit"></i>
                </button>
                <button
                  onClick={() => handleDelete(edu.id)}
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

export default ManageEducation;
