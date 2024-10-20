import React, { useState } from 'react'; 
import { useNavigate } from 'react-router-dom';

const RegisterStaff = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
  });
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(null);
  const navigate = useNavigate();

  // Handle form data change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Submit form data
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/staff/register', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
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
        navigate('/login');
      }
    } catch (error) {
      setLoading(false);
      setError('An error occurred, please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <form 
        onSubmit={handleSubmit} 
        className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full"
      >
        <h2 className="text-2xl font-bold text-center mb-6">Register</h2>

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
          <label className="block text-gray-700">Role:</label>
          <select 
            name="role" 
            value={formData.role} 
            onChange={handleChange} 
            required
            className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:outline-none focus:ring focus:ring-blue-300"
          >
            <option value="">Select Role</option>
            <option value="accountant">Accountant</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <button 
          type="submit" 
          className="w-full bg-blue-600 text-white text-lg font-semibold py-2 rounded-md hover:bg-blue-500 transition duration-200"
        >
          Register
        </button>
        <div>
          {error && <p className='text-red-700 text-sm'>{error}</p>}
        </div>
      </form>
    </div>
  );
};

export default RegisterStaff;
