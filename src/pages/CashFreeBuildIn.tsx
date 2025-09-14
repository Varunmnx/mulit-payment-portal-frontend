// 1. Basic Payment Component Example
import React, { useState } from 'react';
import { cashfreeService } from '../services/paymentService';
import { load } from '@cashfreepayments/cashfree-js';

const CashFreeBuildInExample: React.FC = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [customerDetails, setCustomerDetails] = useState({
 "name": "Varun Narayanan",
    "email": "varunneo380@gmail.com",
    "phone": "7349164543"
  });


  const processPayment = async () => {

    if (!customerDetails.name || !customerDetails.email || !customerDetails.phone) {
      alert('Please fill all customer details');
      return;
    }

    setIsProcessing(true);

    const response = await cashfreeService.createOrder({
      "customerName": "Varun Narayanan2",
      "customerEmail": "varunneo3802@gmail.com",
      "customerPhone": "7349164542",
      "productId": "product_1"
    })
    try {
      const paymentData = {
        order_id: response?.orderId, // create order from backend
        order_amount: 1000,
        paymentSessionId: response?.payment_session_id,
        order_currency: "INR",
        customer_details: {
          customer_id: `CUST_${Date.now()}`,
          customer_name: customerDetails.name,
          customer_email: customerDetails.email,
          customer_phone: customerDetails.phone
        }
      };
      const cashfree = await load({ mode: "sandbox" })
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


  return (
    <div className="checkout-container">
      <h2>Checkout</h2>



      {/* Customer Details Form */}
      <div className="customer-form">
        <h3>Customer Details</h3>
     
      </div>

      {/* Payment Button */}
      <button
        onClick={processPayment}
        disabled={isProcessing }
        className="checkout-button"
      >
        pay now
      </button>
    </div>
  );
};

export default CashFreeBuildInExample;