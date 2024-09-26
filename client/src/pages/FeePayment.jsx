import React, { useState } from 'react';

const FeePaymentForm = () => {
  const year = new Date().getFullYear();
  const [verify,setVerify] = useState(false);
  const [error,setError] = useState(null);
  const [formData, setFormData] = useState({
    school: '',
    branch: '',
    batch: '',
    paymentId: '',
    regNo: '',
    semFees: '',
    regFees: '',
    fine: '',
    paymentMode: '',
    chequeNo: '',
    transactionId: '',
    bankName: '',
    status: ''
  });
  const [verifyData,setVerifyData] = useState({
    school: formData.school,
    branch: formData.branch,
    batch: formData.batch,
    regNo: formData.regNo
  })

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if(name === 'regNo'){
      setVerify(false);
    }

    if (name === 'paymentMode') {
      setFormData({
        ...formData,
        paymentMode: value,
        chequeNo: '',
        transactionId: '',
        bankName: '',
      });
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

    if (!formData.paymentId || !formData.regNo || !formData.amountPaid || !formData.paymentMode || !formData.status) {
      alert('Please fill all the required fields');
      return;
    }

    try {
      const response = await fetch('https://your-backend-api.com/fee-payment', {
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
        school: '',
        branch: '',
        batch: '',
        paymentId: '',
        regNo: '',
        semFees: '',
        regFees: '',
        fine: '',
        paymentMode: '',
        chequeNo: '',
        transactionId: '',
        bankName: '',
        status: ''
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
        <div className="grid grid-cols-2 gap-6">
          {/*  School */}
          <div>
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
          {/*  Branch */}
          <div>
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
          {/*  Batch */}
          <div>
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
          {/* payment id */}
          <div>
            <label className="block text-gray-700">Payment ID:</label>
            <input
              type="text"
              name="paymentId"
              value={`${formData.school}/${formData.branch}/${formData.batch}/${(formData.regNo).substring(0,2)+(formData.regNo).substring(7,10)}`}
              onChange={handleChange}
              required
              readOnly
              className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>
          {/*  regis_number */}
          <div>
            <label className="block text-gray-700">Student Reg. No:</label>
            <div className='flex flex-row'>
              <input
                type="number"
                name="regNo"
                value={formData.regNo}
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
          {/*  Semester fees */}
          <div>
            <label className="block text-gray-700">Semester Fees:</label>
            <input
              type="number"
              name="amountPaid"
              value={formData.semFees}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>
          {/*  registeration fees */}    
          <div>
            <label className="block text-gray-700">Registration Fees:</label>
            <input
              type="number"
              name="amountPaid"
              value={formData.regFees}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>
          {/*  fine */}    
          <div>
            <label className="block text-gray-700">Fine:</label>
            <input
              type="number"
              name="fine"
              value={formData.fine}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>
          {/*  payment mode */}
          <div>
            <label className="block text-gray-700">Payment Mode:</label>
            <select 
              name="paymentMode" 
              value={formData.paymentMode} 
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
          {/*  payment options */}
          {formData.paymentMode === 'cheque' && (
            <>
              <div>
                <label className="block text-gray-700">Cheque No:</label>
                <input
                  type="text"
                  name="chequeNo"
                  value={formData.chequeNo}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:outline-none focus:ring focus:ring-blue-300"
                />
              </div>
              <div>
                <label className="block text-gray-700">Bank Name:</label>
                <input
                  type="text"
                  name="bankName"
                  value={formData.bankName}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:outline-none focus:ring focus:ring-blue-300"
                />
              </div>
            </>
          )}

          {formData.paymentMode === 'online' && (
            <>
              <div>
                <label className="block text-gray-700">Transaction ID:</label>
                <input
                  type="text"
                  name="transactionId"
                  value={formData.transactionId}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:outline-none focus:ring focus:ring-blue-300"
                />
              </div>
              <div>
                <label className="block text-gray-700">Bank Name:</label>
                <input
                  type="text"
                  name="bankName"
                  value={formData.bankName}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:outline-none focus:ring focus:ring-blue-300"
                />
              </div>
            </>
          )}
          {/*  Status of payment */}
          <div>
            <label className="block text-gray-700">Status:</label>
            <select 
              name="status" 
              value={formData.status} 
              onChange={handleChange} 
              required
              className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:outline-none focus:ring focus:ring-blue-300"
            >
              <option value="">Select Status</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
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
