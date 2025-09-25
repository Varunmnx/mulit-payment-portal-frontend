import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './CustomCashfreeSuccess.css';
import { cashfreeService } from '../services/paymentService';
import { load } from '@cashfreepayments/cashfree-js';


const CustomCashfreeSuccess: React.FC = () => {
  const location = useLocation();
  const orderId = new URLSearchParams(location.search).get('orderId');

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'pending' | 'failed' | 'expired' | 'error'>('loading');
  const [paymentDetails, setPaymentDetails] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate()
  const verifyPayment = async (orderId: string) => {
    try {
      const response = await cashfreeService.verifyPayment(orderId);
      setPaymentDetails(response);

      if (!response) {
        throw new Error('No response from verification');
      }

      const orderStatus = response.order_status;

      switch (orderStatus) {
        case 'PAID':
          setStatus('success');
          break;
        case 'ACTIVE':
          setStatus('pending');
          break;
        case 'EXPIRED':
          setStatus('expired');
          break;
        case 'FAILED':
        case 'TERMINATED':
        case 'TERMINATION_REQUESTED':
          setStatus('failed');
          break;
        default:
          setStatus('failed');
          setErrorMessage(`Unexpected status: ${orderStatus}`);
      }
    } catch (err: any) {
      console.error('Payment verification failed:', err);
      setStatus('error');
      setErrorMessage(err.message || 'Unable to verify payment. Please try again later.');
    }
  };

  useEffect(() => {
    if (orderId) {
      verifyPayment(orderId);
    } else {
      setStatus('error');
      setErrorMessage('Order ID is missing in the URL.');
    }
  }, [orderId])

  
  async function handleRetryPayment() {
    if(paymentDetails?.session_id){
        const cashfree = await load({ mode: "sandbox" }); // or "production"

// Only pass paymentSessionId — no need for order_id, amount, etc.
const result = await cashfree.checkout({
  paymentSessionId:  paymentDetails?.session_id
});
      }
  }

  // Loading state
  if (status === 'loading') {
    return (
      <div className="success-container">
        <div className="success-card">
          <div className="spinner">⏳</div>
          <h2>Verifying Payment...</h2>
          <p>Please wait while we confirm your transaction.</p>
        </div>
      </div>
    );
  }

  // Error state (network/backend issue)
  if (status === 'error') {
    return (
      <div className="success-container">
        <div className="success-card">
          <div className="error-icon">⚠️</div>
          <h1>Verification Failed</h1>
          <p>{errorMessage || 'An unexpected error occurred.'}</p>
          <div className="success-actions">
            <Link to="/" className="btn-primary">Back to Home</Link>
          </div>
        </div>
      </div>
    );
  }

  // Success state
  if (status === 'success') {
    return (
      <div className="success-container">
        <div className="success-card">
          <div className="success-icon">✅</div>
          <h1>Payment Successful!</h1>
          <p>Thank you! Your payment has been processed.</p>
          <div className="transaction-details">
            <p><strong>Order ID:</strong> {paymentDetails?.order_id}</p>
            <p><strong>Amount:</strong> ₹{(paymentDetails?.order_amount / 100).toFixed(2)}</p>
            <p><strong>Status:</strong> Completed</p>
            {paymentDetails?.payment?.cf_payment_id && (
              <p><strong>Transaction ID:</strong> {paymentDetails.payment.cf_payment_id}</p>
            )}
          </div>
          <div className="success-actions">
            <Link to="/" className="btn-primary">Back to Home</Link>
          </div>
        </div>
      </div>
    );
  }

  // Pending state
  if (status === 'pending') {
    return (
      <div className="success-container">
        <div className="success-card">
          <div className="pending-icon">🕒</div>
          <h1>Payment Pending</h1>
          <p>Your payment is still being processed. We’ll notify you once it’s confirmed.</p>
          <div className="success-actions">
                        <span onClick={handleRetryPayment} className="btn-primary">Retry Payment</span>

          </div>
        </div>
      </div>
    );
  }

  // Expired state
  if (status === 'expired') {
    return (
      <div className="success-container">
        <div className="success-card">
          <div className="error-icon">🕒</div>
          <h1>Payment Expired</h1>
          <p>This payment link has expired. Please try placing your order again.</p>
          <div className="success-actions">
            <span onClick={handleRetryPayment} className="btn-primary">Retry Payment</span>
          </div>
        </div>
      </div>
    );
  }

  // Failed / Terminated / Unknown failure
  return (
    <div className="success-container">
      <div className="success-card">
        <div className="error-icon">❌</div>
        <h1>Payment Failed</h1>
        <p>We couldn’t complete your payment. Please try again or contact support.</p>
        {paymentDetails?.order_id && (
          <p><strong>Order ID:</strong> {paymentDetails.order_id}</p>
        )}
        <div className="success-actions">
          <Link to="/" className="btn-primary">Try Again</Link>
        </div>
      </div>
    </div>
  );
};

export default CustomCashfreeSuccess;