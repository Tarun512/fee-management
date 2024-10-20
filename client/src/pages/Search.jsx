import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function Search() {
  const { role } = useSelector((state) => state.user);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [cardError, setCardError] = useState(null);
  const [csv, setCsv] = useState(null);
  const year = new Date().getFullYear();
  const [formtype,setFormType] = useState(null);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    school: '',
    branch: '',
    batch: '',
    year: '',
    feeStructureName:'',
    regNo: '',
    startDate: '',
    endDate: '',
    feeStructure: false
  });

  const handleFormType = (e) =>{
    setFormType(e.target.value);
    console.log(formtype);
  }

  const handleChange = (e) => {
    const {name,value} = e.target;

    setFormData((prevFormData) => {
      let updatedFormData = { ...prevFormData, [name]: value };
    
      if (name === 'feeStructure') {
        updatedFormData.feeStructure = !prevFormData.feeStructure;
      }
    
      if (['school', 'branch', 'batch', 'year'].includes(name)) {
        updatedFormData.feeStructureName = `${updatedFormData.school}_${updatedFormData.branch}_${updatedFormData.batch}_${updatedFormData.year}`;
      }
      return updatedFormData;
    });
    
  };

  const handleEdit = async (index) => {
      console.log(data[index]?._id);
      console.log(formtype);
      if(formtype == 'payment'){
        navigate(`/edit-payment/${data[index]?._id}`)
        } 
      if(formtype == 'structure'){
        navigate(`/edit-structure/${data[index]?._id}`)
        } 
      if(formtype == 'student'){
        navigate(`/edit-student/${data[index]?._id}`)
        }     
  };

  const handleDelete = async (index) => {
    try {
      alert("Are you sure you want to delete");
      if(formtype == 'student'){
        console.log(data[index]?._id);
        
        const response = await fetch(`/api/staff/delete-student/${data[index]?._id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const result = await response.json();
        if (response.ok) {
          const updatedCards = data.filter((_, i) => i !== index);
          setData(updatedCards);
        } else {
          setCardError(result.message);
        }
      }
      if(formtype == 'structure'){
        const response = await fetch(`/api/fees/delete-fee-structure/${data[index]?._id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const result = await response.json();
        if (response.ok) {
          const updatedCards = data.filter((_, i) => i !== index);
          setData(updatedCards);
        } else {
          setCardError(result.message);
        }
      }
      if(formtype == 'payment'){
        const response = await fetch(`/api/payment/delete-payment/${data[index]?._id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const result = await response.json();
        if (response.ok) {
          const updatedCards = data.filter((_, i) => i !== index);
          setData(updatedCards);
        } else {
          setCardError(result.message);
        }
      }
      
    } catch (error) {
      setCardError(error.message);
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

  // const handleSearch = ()=>{
  //   let query = `?`;
  //   if (formData.startDate) query += `startDate=${formData.startDate}&`;
  //   if (formData.endDate) query += `endDate=${formData.endDate}&`;
  //   if (formData.regNo) query += `registerationId=${formData.regNo}`;
    
  //   // Trim any trailing '&' or '?' if unnecessary
  //    query = query.endsWith('&') ? query.slice(0, -1) : query;
  //    return query;
  // }
  const handleSubmit = async (e) => {
    e.preventDefault(); 
    console.log(formData); 
    try {
      if(formtype == 'student'){
        const response = await fetch('/api/staff/get-student-by-form', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body:JSON.stringify(formData)
        });
    
        const result = await response.json();
        console.log(result);
        
        if (response.ok) {
          setData([result.data]);
        } else {
          const errorText = await response.text();
          console.error('Error:',errorText)
          setError(errorText || 'Something went wrong');
        }
      }else if(formtype == 'structure' && !formData.feeStructure){
        const response = await fetch('/api/fees/get-fee-structure-by-form', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
    
        const result = await response.json();
    
        if (response.ok) {
          setData([result.data]);
          setError(null);
        } else {
          const errorText = await response.text();
          console.error('Error:',errorText)
          setError(errorText || 'Something went wrong');
        }
      }else if(formtype == 'payment'){
        // const query = handleSearch();
        // const search = query.toString();
        // console.log(search);
        
        const response = await fetch('/api/payment/get-payments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
    
        const result = await response.json();
        console.log(result);
        
        if (response.ok) {
          setData(result.data);
        } else {
          const errorText = await response.text();
          console.error('Error:',errorText)
          setError(errorText || 'Something went wrong');
        }
      }else if(formData.feeStructure){
        const response = await fetch('/api/fees/all-fee-structures', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
    
        const result = await response.json();
    
        if (response.ok) {
          setData(result.data);
        } else {
          const errorText = await response.text();
          console.error('Error:',errorText)
          setError(errorText || 'Something went wrong');
        }
      }
      else{
        console.log('select formtype');
      }
      
    } catch (error) {
      setError(`Fetch error: ${error.message}`);
      console.error('Error during fetch:', error);
    }
  };
  

  return (
    <>
      <form onSubmit={handleSubmit} className="p-4 bg-white shadow-md rounded-md">
      <p>Please select Search Type:</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         
          <div className='mb-4 '>
          <input type="radio" id="type1" name="type" value="student" onChange={handleFormType}/>
          <label htmlFor="type1">Student</label><br/>
          </div>
          <div className='mb-4 '>
          <input type="radio" id="type2" name="type" value="structure" onChange={handleFormType}/>
          <label htmlFor="type2">Fee Structure</label><br/> 
          </div> 
          <div className='mb-4 '>
          <input type="radio" id="type3" name="type" value="payment" onChange={handleFormType}/>
          <label htmlFor="type3">Fee Payment</label>
          </div>
        </div>
        
        {/* First Row: School, Branch, Batch, year, FeeStructureName*/}
        {(formtype == 'structure') && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="mb-4">
            <label className="block text-gray-700">School:</label>
            <select
              name="school"
              value={formData.school}
              onChange={handleChange}
              required = {!formData.feeStructure}
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
              required = {!formData.feeStructure}
              className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:outline-none focus:ring focus:ring-blue-300"
            >
              <option value="">Select Branch</option>
              {formData.school == 'soet' && (
                <>
                  <option value="btech">BTech</option>
                  <option value="mtech">MTech</option>
                  <option value="phd">PhD</option>
                </>
              )}
              {formData.school == 'som' && (
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
              required = {!formData.feeStructure}
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
            <label className="block text-gray-700">Year:</label>
            <select
              name="year"
              value={formData.year}
              onChange={handleChange}
              required = {!formData.feeStructure}
              className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:outline-none focus:ring focus:ring-blue-300"
            >
              <option value="">Select Batch</option>
              <option value="first">First</option>
              <option value="second">Second</option>
              <option value="third">Third</option>
              <option value="fourth">Fourth</option>
              <option value="fifth">Fifth</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Fee Structure Name</label>
            <input
              type="name"
              name="feeStructureName"
              onChange={handleChange}
              value={`${formData.school}_${formData.branch}_${formData.batch}_${formData.year}`}
              required
              readOnly
              className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>
          {formtype == 'structure' && 
            <div className='mb-4 mt-8'>
              <input type="checkbox" name="feeStructure" value={formData.feeStructure} onChange={handleChange}/>
              <label htmlFor="feeStructure">Get All Fee Structures</label>
            </div>
          }
        </div>
        )}
        {/* Second Row: Start Date, End Date */}
        {(formtype == 'payment') && (
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
        )}
        {formData.startDate && formData.endDate && formData.endDate < formData.startDate && (
          <p className="text-red-600">End date must be greater than Start date</p>
        )}
        
        {/* Registration Number */}
        {(formtype == 'student' || formtype == 'payment') && 
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
        }
        
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
        {/* <button onClick={() => { handleConvertToCSV(); downloadCsv(); }} className="bg-green-500 text-white p-2 rounded-md hover:bg-green-600">
          Download in CSV
        </button> */}

        {Array.isArray(data) && data.length > 0 && data.map((object, index) => (
          <div className="card p-4 mb-4 border border-gray-300 rounded-md shadow-sm" key={index}>
            {Object.keys(object).map((key) => (
              (key !== '_id' && key !== 'createdAt' && key !== 'updatedAt' && key !== 'password' && key !== '__v' && key !== 'refreshToken') && (
                <div key={key} className="mb-2">
                  <label className="font-semibold">{key}:</label>
                  <span className="ml-2">{object[key]}</span>
                </div>
              )
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
              {(role === 'admin' || (role === 'accountant' && formData.regNo != '')) && (
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
