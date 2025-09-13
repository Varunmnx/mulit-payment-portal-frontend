export interface CashfreeOrderRequest {
  productId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
}

export interface RazorpayOrderRequest {
  amount: number;
  currency: string;
  productId: string;
}

export interface CashfreeOrderResponse { 
  order_id?: string;
  paymentLink?: string;
  message?: string;
}

export interface RazorpayOrderResponse {
  success: boolean;
  id?: string;
  amount?: number;
  currency?: string;
  message?: string;
  product?: {
    name: string;
    price: number;
  };
}

export interface RazorpayVerificationRequest {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface RazorpayVerificationResponse {
  success: boolean;
  message?: string;
  paymentDetails?: any;
}