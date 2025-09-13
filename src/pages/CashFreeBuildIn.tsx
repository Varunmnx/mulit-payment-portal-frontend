// 1. Basic Payment Component Example
import React, { useState } from 'react';  
import { cashfreeService } from '../services/paymentService';
import {load} from '@cashfreepayments/cashfree-js';

const CashFreeBuildInExample: React.FC = ( ) => { 
  const [isProcessing, setIsProcessing] = useState(false);
  const [customerDetails, setCustomerDetails] = useState({
    name: '',
    email: '',
    phone: ''
  });
 

  const processPayment = async () => { 

    if (!customerDetails.name || !customerDetails.email || !customerDetails.phone) {
      alert('Please fill all customer details');
      return;
    }

    setIsProcessing(true);
   
    const response = await cashfreeService.createOrder({
    "customerName": "Varun Narayanan",
    "customerEmail": "varunneo380@gmail.com",
    "customerPhone": "7349164543",
    "productId":"product_1"
})
    try {
      const paymentData = {
        order_id: response?.orderId, // create order from backend
        order_amount: 1000,
        paymentSessionId:response?.payment_session_id,
        order_currency: "INR",
        customer_details: {
          customer_id: `CUST_${Date.now()}`,
          customer_name: customerDetails.name,
          customer_email: customerDetails.email,
          customer_phone: customerDetails.phone
        }
      };
      const cashfree = load({mode:"sandbox"})
      const result = await cashfree.checkout(paymentData);
      
      if (result.success) {
          alert("Payment Successfull")
        }
    } catch (err) {
      console.log(err);
      alert("Payment Failed")
    } finally {
      setIsProcessing(false);
    }
  };

  if (error) {
    return <div>Payment system error: {error.message}</div>;
  }

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>
      
 

      {/* Customer Details Form */}
      <div className="customer-form">
        <h3>Customer Details</h3>
        <input
          type="text"
          placeholder="Full Name"
          value={customerDetails.name}
          onChange={(e) => setCustomerDetails(prev => ({...prev, name: e.target.value}))}
        />
        <input
          type="email"
          placeholder="Email"
          value={customerDetails.email}
          onChange={(e) => setCustomerDetails(prev => ({...prev, email: e.target.value}))}
        />
        <input
          type="tel"
          placeholder="Phone Number"
          value={customerDetails.phone}
          onChange={(e) => setCustomerDetails(prev => ({...prev, phone: e.target.value}))}
        />
      </div>

      {/* Payment Button */}
      <button
        onClick={processPayment}
        disabled={isLoading || isProcessing || !cashfree}
        className="checkout-button"
      > 
         pay now 
      </button>
    </div>
  );
};
 
export default CashFreeBuildInExample;