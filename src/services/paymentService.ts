import axios from 'axios';
import type { CashfreeOrderRequest, CashfreeOrderResponse, RazorpayOrderRequest, RazorpayOrderResponse } from '../types/payment';

const API_BASE_URL = 'http://localhost:3000'; // Change this to your NestJS backend URL

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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
      const response = await api.get('/cashfree/products');
      return response.data;
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
      const response = await api.get('/razorpay/products');
      return response.data;
    } catch (error) {
      console.error('Error fetching Razorpay products:', error);
      return [];
    }
  },
};