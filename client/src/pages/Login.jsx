import React, { useState } from 'react';
import {useNavigate} from 'react-router-dom';
import { signInStart,signInSuccess,signInFailure,signOutStart,signOutSuccess,signOutFailure } from '../redux/user/userSlice';
import { useDispatch,useSelector } from 'react-redux';
const Login = () => {
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
    role: '',
  });
  const dispatch = useDispatch()
  const navigate = useNavigate();
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData({
      ...loginData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if all fields are filled
    if (!loginData.email || !loginData.password || !loginData.role) {
      alert('Please fill all the fields');
      return;
    }
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      const responseData = await response.json();
      if (responseData.success === false) {
        dispatch(signInFailure(responseData.message));
        return;
      }
      const { data } = responseData;
      if(data.role === 'student'){
        navigate('/fee-details');
      }else{
        navigate('/dashboard');
      }
      
      dispatch(signInSuccess(data));
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };
    
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <form 
        onSubmit={handleSubmit} 
        className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full"
      >
        <h2 className="text-2xl font-bold text-center mb-6">Login Form</h2>

        <div className="mb-4">
          <label className="block text-gray-700">Email:</label>
          <input
            type="email"
            name="email"
            value={loginData.email}
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
            value={loginData.password}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Role:</label>
          <select 
            name="role" 
            value={loginData.role} 
            onChange={handleChange} 
            required
            className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:outline-none focus:ring focus:ring-blue-300"
          >
            <option value="">Select Role</option>
            <option value="student">Student</option>
            <option value="accountant">Accountant</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <button 
          type="submit" 
          className="w-full bg-blue-600 text-white text-lg font-semibold py-2 rounded-md hover:bg-blue-500 transition duration-200"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default Login;
