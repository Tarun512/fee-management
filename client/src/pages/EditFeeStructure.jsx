import React, { useEffect,useState } from 'react';
import {useParams} from 'react-router-dom';
const EditFeeStructureForm = () => {
  const year = new Date().getFullYear();
  const params = useParams();
  const [formData, setFormData] = useState({
    feeStructureName: '',
    school: '',
    branch: '',
    batch: '',
    year: '',
    totalFees: ''
  });
  useEffect(() => {
    const fetchFeeStructure = async () => {
      const listingId = params.id;  
      const response = await fetch(`/api/fees/get-fee-structure/${listingId}`);
      const responseData = await response.json();
      const data = responseData.data;
      if (responseData.success === false) {
        console.log(data.message);
        return;
      }
      console.log(data);
      setFormData(data);
    };

    fetchFeeStructure();
    }, []);
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
    if (!formData.feeStructureName || !formData.school || !formData.branch || !formData.batch || !formData.totalFees || !formData.year ) {
      alert('Please fill all the fields');
      return;
    }
    const id = params.id
    console.log(id);
    
    // const url =  `api/fees/edit-fee-structure/${id}`;
    try {
      const response = await fetch(`/api/fees/edit-fee-structure/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      console.log(response);
      
      if (!response.ok) {
        throw new Error('Failed to update fee structure');
      }

      const data = await response.json();
      console.log('Fee structure submitted successfully:', data);

      // Handle successful submission (e.g., reset form, show confirmation)
      setFormData({
        feeStructureName: '',
        school: '',
        branch: '',
        batch: '',
        totalFees: '',
        year: '',
      });
    } catch (error) {
      console.error('Error:', error);
      alert('Updation failed. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <form 
        onSubmit={handleSubmit} 
        className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full"
      >
        <h2 className="text-2xl font-bold text-center mb-6">Fee Structure Form</h2>

        {/* fee Structure Name */}
        <label className='block text-gray-700'>Fee Structure Name:</label>
        <input 
        type="text" 
        name='feeStructureName'
        value={formData.feeStructureName}
        required
        onChange={handleChange}
        className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:outline-none focus:ring focus:ring-blue-300"
        />

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
                <option value="">Select School</option>
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
                <option value={`${year + 5}`}>{year + 5}</option>
              </select>
            </div>
            {/* Year */}
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
            {/* Total Fees */}
            <div className="mb-4">
              <label className="block text-gray-700">Total Fees:</label>
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
            Update
          </button>
      </form>
    </div>
  );
};

export default EditFeeStructureForm;
