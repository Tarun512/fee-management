import React, { useState } from 'react';
import { useSelector } from 'react-redux';

function Search() {
  const { role } = useSelector((state) => state.user);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [cardError, setCardError] = useState(null);
  const [csv, setCsv] = useState(null);
  const year = new Date().getFullYear();
  const [formData, setFormData] = useState({
    school: '',
    branch: '',
    batch: '',
    regNo: '',
    startDate: '',
    endDate: '',
    feeStructure: false
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: [e.target.value] });
    if(e.target.name == 'feeStructure'){
      formData.feeStructure = !formData.feeStructure
    }
  };

  const handleEdit = async (index) => {
    try {
      const response = await fetch('/api/user/fee-payment/edit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data[index]),
      });
      const result = await response.json();
      if (response.ok) {
        setData(() => {
          data[index] = result.rows[0];
        });
      } else {
        setCardError(result.message);
      }
    } catch (error) {
      setCardError(error.message);
    }
  };

  const handleDelete = async (index) => {
    try {
      const response = await fetch('/api/user/fee-payment/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data[index]),
      });
      const result = await response.json();
      if (response.ok) {
        const updatedCards = data.filter((_, i) => i !== index);
        setData(updatedCards);
      } else {
        setCardError(result.message);
      }
    } catch (error) {
      setCardError(result.message);
    }
  };

  const handleConvertToCSV = () => {
    const array = typeof data !== 'object' ? JSON.parse(data) : data;
    const headers = Object.keys(array[0]);
    const csvContent = [
      headers.join(','),
      ...array.map((row) => headers.map((header) => row[header] || '').join(',')),
    ].join('\n');
    setCsv(csvContent);
  };

  const downloadCsv = () => {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'data.csv');
    document.body.appendChild(link);
    link.click();
    document.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission
    console.log(formData); // Log the form data for debugging
    try {
      const response = await fetch('/api/user/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        setData(result);
      } else {
        const errorText = await response.text();
        console.error('Error:',errorText)
        setError(errorText || 'Something went wrong');
      }
    } catch (error) {
      setError(`Fetch error: ${error.message}`);
      console.error('Error during fetch:', error);
    }
  };
  

  return (
    <>
      <form onSubmit={handleSubmit} className="p-4 bg-white shadow-md rounded-md">
        {/* First Row: School, Branch, Batch */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
        </div>

        {/* Second Row: Start Date, End Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          <div className="mb-4">
            <label className="block text-gray-700">End Date:</label>
            <input
              type="date"
              name="endDate"
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>
        </div>
        {formData.startDate && formData.endDate && formData.endDate < formData.startDate && (
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
            className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>
        {/* Fee structure check box */}
        <input type="checkbox" name="feeStructure" value={formData.feeStructure} onChange={handleChange}/>
        <label for="feeStructure">Fee Structure</label>
        {/* Submit button */}
        {error && <p className="text-red-600">{error}</p>}
        <button
          type="submit"
          className="mt-4 bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
        >
          Submit
        </button>
      
      </form>

      {/* Display Data */}
      <div className="mt-6">
        <button onClick={() => { handleConvertToCSV(); downloadCsv(); }} className="bg-green-500 text-white p-2 rounded-md hover:bg-green-600">
          Download in CSV
        </button>

        {data && data.map((object, index) => (
          <div className="card p-4 mb-4 border border-gray-300 rounded-md shadow-sm" key={index}>
            {Object.keys(object).map((key) => (
              <div key={key} className="mb-2">
                <label className="font-semibold">{key}:</label>
                <span className="ml-2">{object[key]}</span>
              </div>
            ))}

            <div className="flex justify-between mt-4">
              {(role === 'admin' || role === 'accountant') && (
                <button
                  onClick={() => handleEdit(index)}
                  className="bg-green-500 text-white p-2 rounded-md hover:bg-green-600"
                >
                  Edit
                </button>
              )}
              {role === 'admin' && (
                <button
                  onClick={() => handleDelete(index)}
                  className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600"
                >
                  Delete
                </button>
              )}
            </div>

            {cardError && <p className="text-red-700">{cardError}</p>}
          </div>
        ))}
      </div>
      
    </>
  );
}

export default Search;
