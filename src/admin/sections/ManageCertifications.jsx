import React, { useState } from "react";
import { usePortfolio } from "../../context/PortfolioContext";
import toast from "react-hot-toast";

const ManageCertifications = () => {
  const {
    portfolioData,
    addCertification,
    updateCertification,
    deleteCertification,
  } = usePortfolio();
  const { certifications } = portfolioData;
  const [isEditing, setIsEditing] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    issuer: "",
    date: "",
    badgeUrl: "#",
    verifyUrl: "#",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await updateCertification(isEditing, formData);
        toast.success("Certification saved to the server.");
      } else {
        await addCertification(formData);
        toast.success("Certification saved to the server.");
      }
      resetForm();
    } catch (error) {
      toast.error(error.message || "Certification was not saved.");
    }
  };

  const handleEdit = (cert) => {
    setIsEditing(cert.id);
    setFormData({
      name: cert.name,
      issuer: cert.issuer,
      date: cert.date,
      badgeUrl: cert.badgeUrl,
      verifyUrl: cert.verifyUrl,
    });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this certification?")) {
      deleteCertification(id)
        .then(() => toast.success("Certification deleted from the server."))
        .catch((error) =>
          toast.error(error.message || "Certification was not deleted."),
        );
    }
  };

  const resetForm = () => {
    setIsEditing(null);
    setFormData({
      name: "",
      issuer: "",
      date: "",
      badgeUrl: "#",
      verifyUrl: "#",
    });
  };

  return (
    <div className="space-y-8">
      <div className="glass-card p-6">
        <h3 className="text-xl font-bold mb-4">
          {isEditing ? "Edit" : "Add"} Certification
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Certification Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-lg bg-white dark:bg-navy-800 border border-gray-300 dark:border-navy-700"
          />
          <input
            type="text"
            name="issuer"
            placeholder="Issuing Organization"
            value={formData.issuer}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-lg bg-white dark:bg-navy-800 border border-gray-300 dark:border-navy-700"
          />
          <input
            type="text"
            name="date"
            placeholder="Date Earned (e.g., 2024)"
            value={formData.date}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-lg bg-white dark:bg-navy-800 border border-gray-300 dark:border-navy-700"
          />
          <input
            type="url"
            name="verifyUrl"
            placeholder="Verification URL"
            value={formData.verifyUrl}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-white dark:bg-navy-800 border border-gray-300 dark:border-navy-700"
          />

          <div className="flex gap-3">
            <button
              type="submit"
              className="px-6 py-2 bg-accent-cyan text-navy-900 rounded-lg font-semibold"
            >
              {isEditing ? "Update" : "Add"} Certification
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
        <h3 className="text-xl font-bold">Existing Certifications</h3>
        {certifications.map((cert) => (
          <div
            key={cert.id}
            className="glass-card p-6 flex justify-between items-center"
          >
            <div>
              <h4 className="font-bold">{cert.name}</h4>
              <p className="text-accent-cyan">{cert.issuer}</p>
              <p className="text-sm text-gray-500">{cert.date}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(cert)}
                className="text-blue-500"
              >
                <i className="fas fa-edit"></i>
              </button>
              <button
                onClick={() => handleDelete(cert.id)}
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

export default ManageCertifications;
