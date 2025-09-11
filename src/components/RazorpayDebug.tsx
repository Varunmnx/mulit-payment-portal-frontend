// Debug component to test the flow
import React, { useState, useEffect } from 'react';

const RazorpayDebug = () => {
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createTestOrder = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:4800/api/payment-service/razorpay/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: 1000,
          currency: 'INR',
          productId: 'product_1'
        })
      });
      
      const data = await response.json();
      console.log('Raw response:', data);
      setOrderData(data);
      
      if (data.status === 'SUCCESS' && data.result && data.result.id) {
        // Try to open Razorpay
        if (typeof window.Razorpay !== 'undefined') {
          const options = {
            key: 'rzp_test_RD4NzLzERhQBok',
            amount: data.result.amount,
            currency: data.result.currency,
            name: 'Test Payment',
            description: 'Test Transaction',
            order_id: data.result.id,
            handler: function (response) {
              console.log('Payment response:', response);
              alert('Payment successful!');
            },
            prefill: {
              name: 'Test User',
              email: 'test@example.com',
              contact: '9999999999'
            },
            theme: {
              color: '#3399cc'
            }
          };
          
          console.log('Razorpay options:', options);
          try {
            var rzp = new window.Razorpay(options);
            rzp.on('payment.failed', function (response) {
              console.log('Payment failed:', response);
              alert('Payment failed!');
            });
            rzp.open();
          } catch (e) {
            console.error('Error opening Razorpay:', e);
            setError('Error opening Razorpay: ' + e.message);
          }
        } else {
          setError('Razorpay SDK not loaded');
        }
      } else {
        setError('Order creation failed: ' + JSON.stringify(data));
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Razorpay Debug Test</h2>
      <button onClick={createTestOrder} disabled={loading}>
        {loading ? 'Creating Order...' : 'Create Test Order & Open Razorpay'}
      </button>
      
      {error && (
        <div style={{ color: 'red', marginTop: '10px' }}>
          Error: {error}
        </div>
      )}
      
      {orderData && (
        <div style={{ marginTop: '20px' }}>
          <h3>Order Data:</h3>
          <pre>{JSON.stringify(orderData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default RazorpayDebug;