import React, { useState } from 'react';

const FeeStructureForm = () => {
  const [formData, setFormData] = useState({
    school: '',
    branch: '',
    year: '',
    totalAmount: '',
    regFees: '',
    fine: ''
  });

  const [branches, setBranches] = useState([]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Update branch options when school changes
    if (name === 'school') {
      if (value === 'soet') {
        setBranches(['btech', 'mtech', 'phd']);
      } else if (value === 'som') {
        setBranches(['bba', 'mba']);
      } else {
        setBranches([]);
      }
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if all fields are filled
    if (!formData.school || !formData.branch || !formData.year || !formData.totalAmount || !formData.regFees || !formData.fine) {
      alert('Please fill all the fields');
      return;
    }

    // Simulate API POST request
    try {
      const response = await fetch('https://your-backend-api.com/fee-structure', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit fee structure');
      }

      const data = await response.json();
      console.log('Fee structure submitted successfully:', data);

      // Handle successful submission (e.g., reset form, show confirmation)
    } catch (error) {
      console.error('Error:', error);
      alert('Submission failed. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Fee Structure Form</h2>

      <div>
        <label>School:</label>
        <select name="school" value={formData.school} onChange={handleChange} required>
          <option value="">Select School</option>
          <option value="soet">SOET</option>
          <option value="som">SOM</option>
        </select>
      </div>

      <div>
        <label>Branch:</label>
        <select name="branch" value={formData.branch} onChange={handleChange} required>
          <option value="">Select Branch</option>
          {branches.map((branch) => (
            <option key={branch} value={branch}>
              {branch.toUpperCase()}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Year:</label>
        <select name="year" value={formData.year} onChange={handleChange} required>
          <option value="">Select Year</option>
          <option value="previous">Previous Year</option>
          <option value="current">Current Year</option>
          <option value="next">Next 5 Years</option>
        </select>
      </div>

      <div>
        <label>Total Amount:</label>
        <input
          type="number"
          name="totalAmount"
          value={formData.totalAmount}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label>Registration Fees:</label>
        <input
          type="number"
          name="regFees"
          value={formData.regFees}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label>Fine:</label>
        <input
          type="number"
          name="fine"
          value={formData.fine}
          onChange={handleChange}
          required
        />
      </div>

      <button type="submit">Submit</button>
    </form>
  );
};

export default FeeStructureForm;
