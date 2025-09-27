import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';
import { PaymentGateway } from '../utils/payment-gateways';

const HomePage: React.FC = () => {
  return (
    <div className="home-page">
      <div className="payment-options">
        <h1>Payment Portal</h1>
        <p>Select your preferred payment method:</p>
        
        <div className="payment-methods">
          <Link to={`/movies?paymentMethod=${PaymentGateway.Cashfree}`} className="payment-option cashfree">
            <h2>Cashfree</h2>
            <p>Pay using Cashfree payment gateway</p>
          </Link>
          
          {/* <Link to="/custom-cashfree" className="payment-option custom-cashfree">
            <h2>Custom Cashfree</h2>
            <p>Pay using our custom Cashfree interface</p>
          </Link> */}
          
          <Link to={`/movies?paymentMethod=${PaymentGateway.Razorpay}`} className="payment-option razorpay">
            <h2>Razorpay</h2>
            <p>Pay using Razorpay payment gateway</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;