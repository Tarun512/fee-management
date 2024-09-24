import React, { useState, useEffect } from 'react';

const FeeSummaryPage = ({ email }) => {
  const [totalFees, setTotalFees] = useState(0); // Total course fees
  const [totalPaid, setTotalPaid] = useState(0); // Total paid by student
  const [paymentHistory, setPaymentHistory] = useState([]); // Payment history

  // Fetch payment history and total fees from backend
  useEffect(() => {
    const fetchFeeData = async () => {
      try {
        const response = await fetch('https://your-backend-api.com/fee-summary', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }), // Send the email in the request body
        });

        if (!response.ok) {
          throw new Error('Failed to fetch fee data');
        }

        const data = await response.json();

        // Update state with fetched data
        setTotalFees(data.totalFees); // Set total course fees
        setTotalPaid(data.totalPaid); // Set total amount paid by student
        setPaymentHistory(data.paymentHistory); // Set payment history
      } catch (error) {
        console.error('Error fetching fee data:', error);
      }
    };

    fetchFeeData();
  }, [email]);

  return (
    <div className="fee-summary-page">
      <h2>Fee Summary</h2>

      <div className="fee-summary">
        <div className="total-fees">
          <h3>Total Course Fees: </h3>
          <p>${totalFees}</p>
        </div>

        <div className="total-paid">
          <h3>Total Fees Paid: </h3>
          <p>${totalPaid}</p>
        </div>

        <div className="balance-due">
          <h3>Balance Due: </h3>
          <p>${totalFees - totalPaid}</p>
        </div>
      </div>

      <h3>Payment History</h3>
      <div className="payment-history">
        {paymentHistory.length > 0 ? (
          paymentHistory.map((payment) => (
            <div className="payment-card" key={payment.id}>
              <h4>Payment Date: {payment.date}</h4>
              <p>Amount Paid: ${payment.amount}</p>
              <p>Payment Mode: {payment.mode}</p>

              {/* Conditionally display cheque or transaction ID based on payment mode */}
              {payment.mode === 'Cheque' && <p>Cheque No: {payment.chequeNo}</p>}
              {payment.mode === 'Online' && <p>Transaction ID: {payment.transactionId}</p>}
            </div>
          ))
        ) : (
          <p>No payment history found.</p>
        )}
      </div>
    </div>
  );
};


export default FeeSummaryPage;
