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
  success: boolean;
  orderId?: string;
  paymentLink?: string;
  message?: string;
}

export interface RazorpayOrderResponse {
  success: boolean;
  orderId?: string;
  amount?: number;
  currency?: string;
  message?: string;
}