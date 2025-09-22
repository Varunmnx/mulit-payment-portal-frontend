import React from 'react';
import { Link } from 'react-router-dom';
import './CustomCashfreeSuccess.css';

const CustomCashfreeSuccess: React.FC = () => {
  return (
    <div className="success-container">
      <div className="success-card">
        <div className="success-icon">✅</div>
        <h1>Payment Successful!</h1>
        <p>Your payment has been processed successfully.</p>
        <div className="transaction-details">
          <p><strong>Transaction ID:</strong> TXN-{Date.now()}</p>
          <p><strong>Amount:</strong> ₹1000.00</p>
          <p><strong>Status:</strong> Completed</p>
        </div>
        <div className="success-actions">
          <Link to="/" className="btn-primary">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CustomCashfreeSuccess;