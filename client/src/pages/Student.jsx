import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Student = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    registerationId: "",
    school: "",
    branch: "",
    batch: "",
    year: "",
  });
  
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(null);
  const year = new Date().getFullYear();
  const navigate = useNavigate();
  // Handle form data change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Submit form data
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure password and confirmPassword match
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch("/api/staff/register-students", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.success === false) {
        setLoading(false);
        setError(data.message);
      } else {
        setError(null);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      setError("An error occurred, please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full"
      >
        <h2 className="text-2xl font-bold text-center mb-6">{'Add Student'}</h2>

        {error && <div className="text-red-500 text-center mb-4">{error}</div>}

        <div className="mb-4">
          <label className="block text-gray-700">Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Confirm Password:</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Role:</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:outline-none focus:ring focus:ring-blue-300"
          >
            <option value="">Select Role</option>
            <option value="student">Student</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Registration No:</label>
          <input
            type="text"
            name="registerationId"
            value={formData.registerationId}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">School:</label>
          <select
            name="school"
            value={formData.school}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:outline-none focus:ring focus:ring-blue-300"
          >
            <option value="">Select School</option>
            <option value="soet">SOET</option>
            <option value="som">SOM</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Branch:</label>
          <select
            name="branch"
            value={formData.branch}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:outline-none focus:ring focus:ring-blue-300"
          >
            <option value="">Select Branch</option>
            {formData.school === "soet" && (
              <>
                <option value="btech">BTech</option>
                <option value="mtech">MTech</option>
                <option value="phd">PhD</option>
              </>
            )}
            {formData.school === "som" && (
              <>
                <option value="bba">BBA</option>
                <option value="mba">MBA</option>
              </>
            )}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Batch:</label>
          <select
            name="batch"
            value={formData.batch}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:outline-none focus:ring focus:ring-blue-300"
          >
            <option value="">Select Batch</option>
            <option value={`${year - 1}`}>{year - 1}</option>
            <option value={`${year}`}>{year}</option>
            <option value={`${year + 1}`}>{year + 1}</option>
            <option value={`${year + 2}`}>{year + 2}</option>
            <option value={`${year + 3}`}>{year + 3}</option>
            <option value={`${year + 4}`}>{year + 4}</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Batch:</label>
          <select
            name="year"
            value={formData.year}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:outline-none focus:ring focus:ring-blue-300"
          >
            <option value="">Select Batch</option>
            <option value={`first`}>first</option>
            <option value={`second`}>second</option>
            <option value={`third`}>third</option>
            <option value={`fourth`}>fourth</option>
            <option value={`fifth`}>fifth</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white text-lg font-semibold py-2 rounded-md hover:bg-blue-500 transition duration-200"
        >
          {'Submit'}
        </button>
      </form>
    </div>
  );
};

export default Student;
