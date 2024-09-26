import React, { useState } from 'react';

function Search() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const year = new Date().getFullYear();
  const [formData, setFormData] = useState({
    school: '',
    branch: '',
    batch: '',
    regNo: '',
    startDate: '',
    endDate: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Edit Function
  const handleEdit = (index) => {
    const newTitle = prompt('Edit the card title:', data[index].title);
    if (newTitle) {
      const updatedCards = [...data];
      updatedCards[index] = { ...updatedCards[index], title: newTitle };
      setData(updatedCards);
    }
  };

  // Handle Delete Function
  const handleDelete = (index) => {
    const updatedCards = data.filter((_, i) => i !== index);
    setData(updatedCards);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission
    try {
      const response = await fetch('/api/user/search', {
        method: 'POST', // Specify the method
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const result = await response.json(); // Parse the JSON response
      if (response.ok) {
        setData(result); // Store the returned data
      } else {
        setError(result.message); // Display error message
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="p-4 bg-white shadow-md rounded-md">
        {/* School */}
        <div className="mb-4">
          <label className="block text-gray-700">School:</label>
          <select
            name="school"
            value={formData.school}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:outline-none focus:ring focus:ring-blue-300"
          >
            <option value="">School</option>
            <option value="soet">SOET</option>
            <option value="som">SOM</option>
          </select>
        </div>
        {/* Branch */}
        <div className="mb-4">
          <label className="block text-gray-700">Branch:</label>
          <select
            name="branch"
            value={formData.branch}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:outline-none focus:ring focus:ring-blue-300"
          >
            <option value="">Branch</option>
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
        {/* Batch */}
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
        {/* Start Date */}
        <div className="mb-4">
          <label className="block text-gray-700">Start Date:</label>
          <input
            type="date"
            name="startDate"
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>
        {/* End Date */}
        <div className="mb-4">
          <label className="block text-gray-700">End Date:</label>
          <input
            type="date"
            name="endDate"
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>
        {formData.endDate < formData.startDate && (
          <p className="text-red-600">End date must be greater than Start date</p>
        )}
        {/* Registration Number */}
        <div className="mb-4">
          <label className="block text-gray-700">Registration Number:</label>
          <input
            type="number"
            name="regNo"
            value={formData.regNo}
            onChange={handleChange}
            min={10}
            required
            className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>

        {error && <p className="text-red-600">{error}</p>}
        <button
          type="submit"
          className="mt-4 bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
        >
          Submit
        </button>
      </form>
      
      <div className="mt-6">
        {data && data.map((object, index) => (
          <div className="card p-4 mb-4 border border-gray-300 rounded-md shadow-sm" key={index}>
            {Object.keys(object).map((key) => (
              <div key={key} className="mb-2">
                <label className="font-semibold">{key}:</label>
                <span className="ml-2">{object[key]}</span>
              </div>
            ))}

            {/* Edit and Delete buttons */}
            <div className="flex justify-between mt-4">
              <button
                onClick={() => handleEdit(index)}
                className="bg-green-500 text-white p-2 rounded-md hover:bg-green-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(index)}
                className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default Search;
