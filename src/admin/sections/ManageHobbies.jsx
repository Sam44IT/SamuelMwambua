import React, { useState } from "react";
import { usePortfolio } from "../../context/PortfolioContext";
import toast from "react-hot-toast";

const ManageHobbies = () => {
  const { portfolioData, addHobby, updateHobby, deleteHobby } = usePortfolio();
  const { hobbies } = portfolioData;
  const [isEditing, setIsEditing] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    icon: "fa-heart",
    description: "",
  });

  const icons = [
    "fa-gamepad",
    "fa-blog",
    "fa-futbol",
    "fa-headphones",
    "fa-book",
    "fa-music",
    "fa-camera",
    "fa-palette",
    "fa-bicycle",
    "fa-hiking",
    "fa-swimmer",
    "fa-dumbbell",
    "fa-heart",
    "fa-star",
    "fa-smile",
    "fa-coffee",
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await updateHobby(isEditing, formData);
        toast.success("Hobby saved to the server.");
      } else {
        await addHobby(formData);
        toast.success("Hobby saved to the server.");
      }
      resetForm();
    } catch (error) {
      toast.error(error.message || "Hobby was not saved.");
    }
  };

  const handleEdit = (hobby) => {
    setIsEditing(hobby.id);
    setFormData({
      name: hobby.name,
      icon: hobby.icon,
      description: hobby.description,
    });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this hobby?")) {
      deleteHobby(id)
        .then(() => toast.success("Hobby deleted from the server."))
        .catch((error) =>
          toast.error(error.message || "Hobby was not deleted."),
        );
    }
  };

  const resetForm = () => {
    setIsEditing(null);
    setFormData({
      name: "",
      icon: "fa-heart",
      description: "",
    });
  };

  return (
    <div className="space-y-8">
      <div className="glass-card p-6">
        <h3 className="text-xl font-bold mb-4">
          {isEditing ? "Edit" : "Add"} Hobby
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Hobby Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-lg bg-white dark:bg-navy-800 border border-gray-300 dark:border-navy-700"
          />

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

          <input
            type="text"
            name="description"
            placeholder="Short Description"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-white dark:bg-navy-800 border border-gray-300 dark:border-navy-700"
          />

          <div className="flex gap-3">
            <button
              type="submit"
              className="px-6 py-2 bg-accent-cyan text-navy-900 rounded-lg font-semibold"
            >
              {isEditing ? "Update" : "Add"} Hobby
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
        <h3 className="text-xl font-bold">Existing Hobbies</h3>
        <div className="grid grid-cols-2 gap-4">
          {hobbies.map((hobby) => (
            <div
              key={hobby.id}
              className="glass-card p-4 flex justify-between items-center"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent-cyan/20 flex items-center justify-center">
                  <i className={`fas ${hobby.icon} text-accent-cyan`}></i>
                </div>
                <div>
                  <h4 className="font-bold">{hobby.name}</h4>
                  <p className="text-sm text-gray-500">{hobby.description}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(hobby)}
                  className="text-blue-500"
                >
                  <i className="fas fa-edit"></i>
                </button>
                <button
                  onClick={() => handleDelete(hobby.id)}
                  className="text-red-500"
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManageHobbies;
