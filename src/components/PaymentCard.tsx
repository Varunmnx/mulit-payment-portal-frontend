import React from 'react';
import './PaymentCard.css';

interface PaymentCardProps {
  title: string;
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  isProcessing?: boolean;
}

const PaymentCard: React.FC<PaymentCardProps> = ({ title, children, onSubmit, isProcessing = false }) => {
  return (
    <div className="payment-card">
      <div className="payment-card-header">
        <h2>{title}</h2>
      </div>
      <div className="payment-card-body">
        <form onSubmit={onSubmit}>
          {children}
          <button 
            type="submit" 
            className="pay-button"
            disabled={isProcessing}
          >
            {isProcessing ? 'Processing...' : 'Pay Now'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentCard;