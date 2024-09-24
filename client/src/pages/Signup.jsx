import React, { useState } from 'react';

const SignupForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
    regNo: '',
    school: '',
    branch: '',
    batch: '',
  });

  const [showStudentFields, setShowStudentFields] = useState(false);
  const year = new Date().getFullYear();

  // Handle form data change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // If role is 'student', show additional fields
    if (name === 'role' && value === 'student') {
      setShowStudentFields(true);
    } else if (name === 'role') {
      setShowStudentFields(false);
      // Reset student-specific fields when role changes
      setFormData({ ...formData, regNo: '', school: '', branch: '', batch: '' });
    }
  };

  // Submit form data
  const handleSubmit = (e) => {
    e.preventDefault();

    // Ensure password and confirmPassword match
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    // Simulate API call to backend
    console.log('Submitting Form Data:', formData);

    // You can replace this with an actual API call
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Signup Form</h2>

      <div>
        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label>Password:</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label>Confirm Password:</label>
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label>Role:</label>
        <select name="role" value={formData.role} onChange={handleChange} required>
          <option value="">Select Role</option>
          <option value="student">Student</option>
          <option value="accountant">Accountant</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {/* Conditionally render student-specific fields */}
      {showStudentFields && (
        <>
          <div>
            <label>Registration No:</label>
            <input
              type="text"
              name="regNo"
              value={formData.regNo}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label>School:</label>
            <select name="school" value={formData.school} onChange={handleChange} required>
              <option value="">Select School</option>
              <option value="soet">SOET</option>
              <option value="som">SOM</option>
            </select>
          </div>

          <div>
            <label>Batch:</label>
            <select name="branch" value={formData.branch} onChange={handleChange} required>
              <option value="">Select Batch</option>
              {formData.school === 'soet' && (
                <>
                  <option value="btech">BTech</option>
                  <option value="mtech">MTech</option>
                  <option value="phd">PhD</option>
                </>
              )}
              {formData.school === 'som' && (
                <>
                  <option value="bba">BBA</option>
                  <option value="mba">MBA</option>
                </>
              )}
            </select>
          </div>
          <div>
            <label>Batch:</label>
            <select name="batch" value={formData.batch} onChange={handleChange} required>
                <option value="">Select Batch</option>
                <option value={`${year-1}`}> ${year-1}</option>
                <option value={`${year}`}>${year}</option>
                <option value={`${year+1}`}>${year+1}</option>
                <option value={`${year+2}`}>${year+2}</option>
                <option value={`${year+3}`}>${year+3}</option>
                <option value={`${year+4}`}>${year+4}</option>
            </select>
          </div>
          
        </>
      )}

      <button type="submit">Submit</button>
    </form>
  );
};

export default SignupForm;
