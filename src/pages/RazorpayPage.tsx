import React, { useState, useEffect } from 'react';
import PaymentCard from '../components/PaymentCard';
import { razorpayService, type RazorpayProduct } from '../services/paymentService';
import type { RazorpayOrderRequest } from '../types/payment';

declare global {
  interface Window {
    Razorpay: any;
  }
}

const RazorpayPage: React.FC = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message?: string } | null>(null);
  const [formData, setFormData] = useState({
    productId: 'product_1',
    amount: 1000,
    currency: 'INR',
  });

  const [products, setProducts] = useState<RazorpayProduct[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsData = await razorpayService.getProducts();
        setProducts(productsData);
      } catch (error) {
        console.error('Error fetching products:', error);
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

  const handleProductChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const productId = e.target.value;
    setFormData(prev => ({ ...prev, productId }));
    
    if (productId) {
      const selectedProduct = products.find(p => p.id === productId);
      if (selectedProduct) {
        setFormData(prev => ({ 
          ...prev, 
          productId,
          amount: selectedProduct.price
        }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setResult(null);
    
    try {
      // Check if Razorpay SDK is loaded
      if (typeof window.Razorpay === 'undefined') {
        throw new Error('Razorpay SDK not loaded');
      }

      const orderData: RazorpayOrderRequest = {
        amount: formData.amount,
        currency: formData.currency,
        productId: formData.productId,
      };

      // Create order on backend
      const response = await razorpayService.createOrder(orderData);
      
      if (response.success && response.id) {
        // Validate required fields
        if (!response.amount || !response.currency || !response.id) {
          throw new Error('Missing required order fields');
        }

        // Open Razorpay checkout
        const options = {
          key: 'rzp_test_RD4NzLzERhQBok',
          amount: response.amount,
          currency: response.currency,
          name: 'Payment Portal',
          description: response.product?.name || 'Product Purchase',
          order_id: response.id,
          handler: function (razorpayResponse: any) {
            console.log('Payment successful:', razorpayResponse);
            setResult({
              success: true,
              message: 'Payment successful!'
            });
            setIsProcessing(false);
          },
          prefill: {
            name: 'John Doe',
            email: 'john@example.com',
            contact: '9876543210'
          },
          theme: {
            color: '#3399cc'
          },
          modal: {
            ondismiss: function() {
              console.log('Payment modal closed');
              setIsProcessing(false);
            }
          }
        };

        const rzp = new window.Razorpay(options);
        
        rzp.on('payment.failed', function (response: any) {
          console.error('Payment failed:', response);
          setResult({
            success: false,
            message: 'Payment failed: ' + (response.error?.description || 'Unknown error')
          });
          setIsProcessing(false);
        });
        
        rzp.open();
      } else {
        throw new Error(response.message || 'Failed to create order');
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      setResult({
        success: false,
        message: error.message || 'An unexpected error occurred'
      });
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
        <p>{result.message}</p>
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
      <div className="form-group">
        <label htmlFor="productId">Select Product</label>
        <select 
          id="productId"
          name="productId" 
          value={formData.productId} 
          onChange={handleProductChange}
          required
        >
          <option value="">Select a product</option>
          {products.map(product => (
            <option key={product.id} value={product.id}>
              {product.name} - ₹{product.price/100}
            </option>
          ))}
        </select>
      </div>
      
      <div className="form-group">
        <label htmlFor="amount">Amount (in paise)</label>
        <input
          id="amount"
          type="number"
          name="amount"
          placeholder="Amount (in paise)"
          value={formData.amount}
          onChange={handleInputChange}
          required
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="currency">Currency</label>
        <input
          id="currency"
          type="text"
          name="currency"
          placeholder="Currency"
          value={formData.currency}
          onChange={handleInputChange}
          required
        />
      </div>
      
      <p className="info-text">
        Note: This will open the Razorpay checkout where you can enter your card details.
        Test with card number: 4111 1111 1111 1111, any future expiry date, and any 3-digit CVV.
      </p>
    </PaymentCard>
  );
};

export default RazorpayPage;