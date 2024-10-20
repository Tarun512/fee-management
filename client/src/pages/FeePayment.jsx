import React, { useState } from 'react';

const FeePaymentForm = () => {
  const year = new Date().getFullYear();
  const [verify,setVerify] = useState(false);
  const [error,setError] = useState(null);
  const [formData, setFormData] = useState({
    registerationId: '',
    amount: '',
    date: '',
    mode: '',
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if(name === 'regNo'){
      setVerify(false);
    }
  };
// handle verify
  const handleVerify = async(e)=>{
    const response = await fetch('/api/user/verify',{
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(verifyData)
    })
    if(response.success == true && response.rows[0] == true){
      setVerify(true);
    }else{
      setError(`${formData.regNo} is not exist`)
    }
  }
// handle form sunbmit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.registerationId || !formData.amount || !formData.date || !formData.mode) {
      alert('Please fill all the required fields from submit');
      return;
    }

    try {
      const response = await fetch('/api/payment/add-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit payment');
      }

      const data = await response.json();
      console.log('Payment submitted successfully:', data);
      setFormData({
        registerationId: '',
        amount: '',
        date: '',
        mode: '',
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
        className="bg-white shadow-lg rounded-lg p-8 w-full max-w-5xl"
      >
        <h2 className="text-2xl font-bold text-center mb-6">Fee Payment Form</h2>
          {/*  regis_number */}
          <div>
            <label className="block text-gray-700">Student Reg. No:</label>
            <div className='flex flex-row'>
              <input
                type="number"
                name="registerationId"
                value={formData.registerationId}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:outline-none focus:ring focus:ring-blue-300"
              />
              {verify==true?
              (<button onClick={handleVerify}
                className="text-white bg-blue-500 hover:bg-blue-400 px-5 py-2 rounded-md transition duration-200 ml-2">
                  Verified
                </button>):
              (<button onClick={handleVerify}
                className="text-white bg-blue-500 hover:bg-blue-400 px-5 py-2 rounded-md transition duration-200 ml-2">
                  Verify
                </button>)}
            </div>
            {error && verify == false && <p className='text-red-700'>${error}</p>}
          </div>
          {/*  Amount */}
          <div>
            <label className="block text-gray-700">Amount:</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>
          {/* Date */}
          <label className="block text-gray-700">Date: </label>
          <input 
          name='date'
          type="date" 
          value={formData.date}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:outline-none focus:ring focus:ring-blue-300"
          />
          {/*  payment mode */}
          <div>
            <label className="block text-gray-700">Payment Mode:</label>
            <select 
              name="mode" 
              value={formData.mode} 
              onChange={handleChange} 
              required
              className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:outline-none focus:ring focus:ring-blue-300"
            >
              <option value="">Select Payment Mode</option>
              <option value="cash">Cash</option>
              <option value="cheque">Cheque</option>
              <option value="online">Online</option>
            </select>
          </div>
          


        <button 
          type="submit" 
          className="w-full bg-blue-600 text-white text-lg font-semibold py-2 rounded-md hover:bg-blue-500 transition duration-200 mt-4"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default FeePaymentForm;
