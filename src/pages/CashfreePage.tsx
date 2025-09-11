import React, { useState, useEffect } from 'react';
import PaymentCard from '../components/PaymentCard';
import { cashfreeService, type CashFreeProduct } from '../services/paymentService';
import type { CashfreeOrderRequest } from '../types/payment';

const CashfreePage: React.FC = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message?: string } | null>(null);
  const [formData, setFormData] = useState({
    productId: '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
  });

  const [products, setProducts] = useState<CashFreeProduct[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const productsData = await cashfreeService.getProducts();
      console.log("productsData", productsData);
      setProducts(productsData);
    };

    fetchProducts();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    try {
      const orderData: CashfreeOrderRequest = {
        productId: formData.productId,
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
      };

      const response = await cashfreeService.createOrder(orderData);
      setResult(response);
    } catch  {
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
      title="Cashfree Payment" 
      onSubmit={handleSubmit}
      isProcessing={isProcessing}
    >
      <select 
        name="productId" 
        value={formData.productId} 
        onChange={handleInputChange}
        required
      >
        {products?.map(product => (
          <option key={product.id} value={product.id}>
            {product.name} - ${product.price}
          </option>
        ))}
      </select>
      
      <input
        type="text"
        name="customerName"
        placeholder="Full Name"
        value={formData.customerName}
        onChange={handleInputChange}
        required
      />
      
      <input
        type="email"
        name="customerEmail"
        placeholder="Email Address"
        value={formData.customerEmail}
        onChange={handleInputChange}
        required
      />
      
      <input
        type="tel"
        name="customerPhone"
        placeholder="Phone Number"
        value={formData.customerPhone}
        onChange={handleInputChange}
        required
      />
    </PaymentCard>
  );
};

export default CashfreePage;