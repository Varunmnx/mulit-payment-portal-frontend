import React, { useState, useEffect } from 'react';
import PaymentCard from '../components/PaymentCard';
import { razorpayService } from '../services/paymentService';
import type { RazorpayOrderRequest } from '../types/payment';

const RazorpayPage: React.FC = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message?: string } | null>(null);
  const [formData, setFormData] = useState({
    productId: '',
    amount: 100,
    currency: 'INR',
  });

  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const productsData = await razorpayService.getProducts();
      setProducts(productsData);
      if (productsData.length > 0) {
        setFormData(prev => ({
          ...prev,
          productId: productsData[0]._id || productsData[0].id,
          amount: productsData[0].price || 100
        }));
      }
    };

    fetchProducts();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    try {
      const orderData: RazorpayOrderRequest = {
        amount: formData.amount,
        currency: formData.currency,
        productId: formData.productId,
      };

      const response = await razorpayService.createOrder(orderData);
      setResult(response);
    } catch (error) {
      setResult({
        success: false,
        message: 'An unexpected error occurred'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBack = () => {
    setResult(null);
  };

  if (result) {
    return (
      <div className={`payment-result ${result.success ? 'payment-success' : 'payment-failure'}`}>
        <h2>{result.success ? 'Payment Successful!' : 'Payment Failed'}</h2>
        <p>{result.message || (result.success ? 'Your payment has been processed successfully.' : 'There was an issue processing your payment.')}</p>
        <button className="back-button" onClick={handleBack}>
          Make Another Payment
        </button>
      </div>
    );
  }

  return (
    <PaymentCard 
      title="Razorpay Payment" 
      onSubmit={handleSubmit}
      isProcessing={isProcessing}
    >
      <select 
        name="productId" 
        value={formData.productId} 
        onChange={handleInputChange}
        required
      >
        {products.map(product => (
          <option key={product._id || product.id} value={product._id || product.id}>
            {product.name} - ${product.price}
          </option>
        ))}
      </select>
      
      <input
        type="number"
        name="amount"
        placeholder="Amount"
        value={formData.amount}
        onChange={handleInputChange}
        required
      />
      
      <input
        type="text"
        name="currency"
        placeholder="Currency"
        value={formData.currency}
        onChange={handleInputChange}
        required
      />
    </PaymentCard>
  );
};

export default RazorpayPage;