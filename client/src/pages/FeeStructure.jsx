import React, { useState } from 'react';

const FeeStructureForm = () => {
  const year = new Date().getFullYear();
  const [formData, setFormData] = useState({
    school: '',
    branch: '',
    batch: '',
    year: '',
    totalFees: '',
  });
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if all fields are filled
    if (!formData.school || !formData.branch || !formData.batch || !formData.totalFees) {
      alert('Please fill all the fields');
      return;
    }
    // const url = 'api/user/add-fee-structure';
    try {
      const response = await fetch('/api/fees/create-fee-structure', {
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
      setFormData({
        school: '',
        branch: '',
        batch: '',
        year: '',
        totalFees: '',
      });
    } catch (error) {
      console.error('Error:', error);
      alert('Submission failed. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <form 
        onSubmit={handleSubmit} 
        className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full"
      >
        <h2 className="text-2xl font-bold text-center mb-6">Fee Structure Form</h2>

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
                <option value={`${year + 5}`}>{year + 5}</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Year:</label>
              <select 
                name="year" 
                value={formData.year} 
                onChange={handleChange} 
                required
                className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:outline-none focus:ring focus:ring-blue-300"
              >
                <option value="">Select Year</option>
                <option value={`first`}>first</option>
                <option value={`second`}>second</option>
                <option value={`third`}>third</option>
                <option value={`fourth`}>fourth</option>
                <option value={`fifth`}>fifth</option>
              </select>
            </div>    
        <div className="mb-4">
          <label className="block text-gray-700">Total Amount:</label>
          <input
            type="number"
            name="totalFees"
            value={formData.totalFees}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:outline-none focus:ring focus:ring-blue-300"
          />
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

export default FeeStructureForm;
