import React, { useState } from 'react';

const FeePaymentForm = () => {
  const [formData, setFormData] = useState({
    paymentId: '',
    regNo: '',
    amountPaid: '',
    paymentMode: '',
    chequeNo: '',
    transactionId: '',
    bankName: '',
    status: ''
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Reset bank details when payment mode changes
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

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if required fields are filled
    if (!formData.paymentId || !formData.regNo || !formData.amountPaid || !formData.paymentMode || !formData.status) {
      alert('Please fill all the required fields');
      return;
    }

    // Simulate API POST request
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

      // Handle successful submission (e.g., reset form, show confirmation)
    } catch (error) {
      console.error('Error:', error);
      alert('Submission failed. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Fee Payment Form</h2>

      <div>
        <label>Payment ID:</label>
        <input
          type="text"
          name="paymentId"
          value={formData.paymentId}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label>Student Reg. No:</label>
        <input
          type="text"
          name="regNo"
          value={formData.regNo}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label>Amount Paid:</label>
        <input
          type="number"
          name="amountPaid"
          value={formData.amountPaid}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label>Payment Mode:</label>
        <select name="paymentMode" value={formData.paymentMode} onChange={handleChange} required>
          <option value="">Select Payment Mode</option>
          <option value="cash">Cash</option>
          <option value="cheque">Cheque</option>
          <option value="online">Online</option>
        </select>
      </div>

      {/* Conditionally render cheque-specific fields */}
      {formData.paymentMode === 'cheque' && (
        <>
          <div>
            <label>Cheque No:</label>
            <input
              type="text"
              name="chequeNo"
              value={formData.chequeNo}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Bank Name:</label>
            <input
              type="text"
              name="bankName"
              value={formData.bankName}
              onChange={handleChange}
              required
            />
          </div>
        </>
      )}

      {/* Conditionally render online-specific fields */}
      {formData.paymentMode === 'online' && (
        <>
          <div>
            <label>Transaction ID:</label>
            <input
              type="text"
              name="transactionId"
              value={formData.transactionId}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Bank Name:</label>
            <input
              type="text"
              name="bankName"
              value={formData.bankName}
              onChange={handleChange}
              required
            />
          </div>
        </>
      )}

      <div>
        <label>Status:</label>
        <select name="status" value={formData.status} onChange={handleChange} required>
          <option value="">Select Status</option>
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
          <option value="overdue">Overdue</option>
        </select>
      </div>

      <button type="submit">Submit</button>
    </form>
  );
};

export default FeePaymentForm;
