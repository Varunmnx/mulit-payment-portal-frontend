import axios from 'axios';
import type { CashfreeOrderRequest, CashfreeOrderResponse, RazorpayOrderRequest, RazorpayOrderResponse } from '../types/payment';
import type { ApiResponse } from '../types/ApiResponse';

const API_BASE_URL = 'http://localhost:4800/api/payment-service'; // Change this to your NestJS backend URL

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface CashFreeProduct {
  id:string;
  name:string;
  price:number;
  priceInRupees:string;
}

export interface RazorpayProduct {
  id:string;
  name:string;
  price:number; 
}

export const cashfreeService = {
  createOrder: async (orderData: CashfreeOrderRequest): Promise<CashfreeOrderResponse> => {
    try {
      const response = await api.post('/cashfree/order', orderData);
      return {
        success: true,
        ...response.data,
      };
    } catch (error) {
      console.error('Cashfree order creation error:', error);
      return {
        success: false,
        message: 'Failed to create Cashfree order',
      };
    }
  },

  getProducts: async () => {
    try {
      const response = await api.get<ApiResponse<CashFreeProduct[]>>('/cashfree/products');
      return response.data.result
    } catch (error) {
      console.error('Error fetching Cashfree products:', error);
      return [];
    }
  },
};

export const razorpayService = {
  createOrder: async (orderData: RazorpayOrderRequest): Promise<RazorpayOrderResponse> => {
    try {
      const response = await api.post('/razorpay/order', orderData);
      return {
        success: true,
        ...response.data,
      };
    } catch (error) {
      console.error('Razorpay order creation error:', error);
      return {
        success: false,
        message: 'Failed to create Razorpay order',
      };
    }
  },

  getProducts: async () => {
    try {
      const response = await api.get<ApiResponse<RazorpayProduct[]>>('/razorpay/products');
      return response.data?.result;
    } catch (error) {
      console.error('Error fetching Razorpay products:', error);
      return [];
    }
  },
  
  verifyPayment: async (verificationData: { 
    razorpay_order_id: string; 
    razorpay_payment_id: string; 
    razorpay_signature: string 
  }) => {
    try {
      const response = await api.post('/razorpay/verify', verificationData);
      return {
        success: true,
        ...response.data,
      };
    } catch (error) {
      console.error('Razorpay payment verification error:', error);
      return {
        success: false,
        message: 'Failed to verify Razorpay payment',
      };
    }
  },
};