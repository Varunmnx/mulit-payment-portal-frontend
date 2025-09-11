import React from 'react';
import type { ReactNode } from 'react';

interface PaymentCardProps {
  title: string;
  onSubmit: (e: React.FormEvent) => void;
  isProcessing: boolean;
  children: ReactNode;
}

const PaymentCard: React.FC<PaymentCardProps> = ({
  title,
  onSubmit,
  isProcessing,
  children
}) => {
  return (
    <div className="payment-card">
      <div className="payment-header">
        <h2>{title}</h2>
      </div>
      
      <form className="payment-form" onSubmit={onSubmit}>
        <div className="form-fields">
          {children}
        </div>
        
        <button 
          type="submit" 
          className="pay-button"
          disabled={isProcessing}
        >
          {isProcessing ? 'Processing...' : 'Pay Now'}
        </button>
      </form>
    </div>
  );
};

export default PaymentCard;