// CustomCashfreePayment.tsx
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { load } from '@cashfreepayments/cashfree-js';
import '../components/payment/PaymentForm.css';

// types (adjust to what your backend returns)
type OrderResponse = {
  orderId: string;
  payment_session_id: string;
  // For UPI flows your backend may optionally return upi_deeplink or upi_qr_base64
  upi_deeplink?: string;
  upi_qr_base64?: string;
};

const CustomCashfreePayment: React.FC = () => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [customerDetails, setCustomerDetails] = useState({ name: '', email: '', phone: '' });
  const [errors, setErrors] = useState({ name: '', email: '', phone: '' });
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'card'|'upi'|'netbanking'>('card');

  // Cashfree element refs
  const cfRef = useRef<any>(null);
  const cardMountRef = useRef<HTMLDivElement | null>(null);

  // Order state (from backend)
  const [orderResp, setOrderResp] = useState<OrderResponse | null>(null);
  // optional UPI QR/deeplink if backend returns it
  const [upiQr, setUpiQr] = useState<string | null>(null);
  const [upiDeepLink, setUpiDeepLink] = useState<string | null>(null);

  // Load SDK once on mount (sandbox for dev)
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const cf = await load({ mode: 'sandbox' }); // or 'prod'
        if (!mounted) return;
        cfRef.current = cf;
      } catch (err) {
        console.error('Failed to load Cashfree SDK', err);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // create local simple validation
  const validateForm = () => {
    let isValid = true;
    const newErrors = { name: '', email: '', phone: '' };

    if (!customerDetails.name.trim()) { newErrors.name = 'Name required'; isValid = false; }
    if (!customerDetails.email.trim()) { newErrors.email = 'Email required'; isValid = false; }
    else if (!/\S+@\S+\.\S+/.test(customerDetails.email)) { newErrors.email = 'Email invalid'; isValid = false; }
    if (!customerDetails.phone.trim()) { newErrors.phone = 'Phone required'; isValid = false; }
    else if (!/^\d{10}$/.test(customerDetails.phone)) { newErrors.phone = 'Phone must be 10 digits'; isValid = false; }

    setErrors(newErrors);
    return isValid;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomerDetails(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  // Call backend to create order and return payment_session_id (server-side uses Cashfree secret)
  const createOrderOnServer = async (): Promise<OrderResponse> => {
    const resp = await fetch('/api/create-order', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        amount: 1000,
        currency: 'INR',
        productId: 'product_1',
        customer: { ...customerDetails }
      })
    });
    if (!resp.ok) throw new Error('create order failed');
    return resp.json();
  };

  // Mount card element into our custom UI
  const mountCardElement = async (paymentSessionId: string) => {
    if (!cfRef.current) throw new Error('Cashfree SDK not loaded');
    // create card element using Cashfree Elements APIs (create() → mount())
    // Exact API names may vary between SDK versions — this follows Cashfree docs for Elements.
    const cf = cfRef.current;
    // create() returns an element instance; use 'card' or name per docs
    const cardElement = cf.create('card', {
      // You can pass placeholder / styling options here. Styles are controlled by Cashfree.
      placeholder: {
        number: 'Card number',
        name: 'Name on card',
      },
      // supply the payment session id so that element is associated with the order/session if required
      paymentSessionId,
    });
    await cardElement.mount(cardMountRef.current);
    return cardElement;
  };

  // Main payment processing logic
  const processPayment = async () => {
    if (!validateForm()) return;
    setIsProcessing(true);

    try {
      // 1) Create order server-side (returns orderId + payment_session_id)
      const order = await createOrderOnServer();
      setOrderResp(order);

      // Behavior differs by payment method
      if (selectedPaymentMethod === 'card') {
        // 2) Mount card element (hosted fields) into our UI
        const cardElement = await mountCardElement(order.payment_session_id);

        // 3) Tokenize / pay using Cashfree SDK (we never read raw card data)
        // The SDK offers either a tokenization step or a pay() step; using pay() here for flow.
        // This call returns a token/response which you must send to your backend for confirmation/capture.
        const payResponse = await cfRef.current.pay({
          payment_session_id: order.payment_session_id,
          payment_method: 'card', // ensure matches your backend/order config
        });

        // payResponse structure varies; check docs. Many flows return a status and a transaction id/token.
        if (payResponse?.success) {
          // Let the server verify & confirm; you can call backend to verify status now
          // Optional: call backend to verify/payment capture using payResponse identifiers
          await fetch('/api/verify-payment', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ orderId: order.orderId, payload: payResponse })
          });
          setPaymentSuccess(true);
          setTimeout(() => navigate('/custom-cashfree/success'), 1500);
        } else {
          console.error('payResponse', payResponse);
          alert('Payment failed - try another card or method.');
        }
      } else if (selectedPaymentMethod === 'upi') {
        // Option A: server returns upi_qr_base64: display QR to user to scan (desktop)
        // Option B: server returns upi_deeplink: for mobile, open it to trigger UPI app

        // ask server to create UPI collect/pay link for this order
        // many merchants create the order then call a UPI-specific API which returns deeplink or qr
        const upiResp = await fetch('/api/create-upi-transaction', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ orderId: order.orderId, amount: 1000, vpa: '' /* optional */ })
        });
        if (!upiResp.ok) throw new Error('upi create failed');
        const upiData = await upiResp.json();
        // upiData may contain: upi_deeplink, upi_qr_base64, payment_status, etc.
        if (upiData.upi_qr_base64) setUpiQr(upiData.upi_qr_base64);
        if (upiData.upi_deeplink) setUpiDeepLink(upiData.upi_deeplink);

        // For mobile deep-link:
        if (upiData.upi_deeplink) {
          // open deeplink to let user complete payment in UPI app
          window.location.href = upiData.upi_deeplink;
        } else {
          // otherwise show QR and poll server/webhook for confirmation
          alert('Scan the QR with your UPI app to pay, or copy the UPI link.');
        }
      } else if (selectedPaymentMethod === 'netbanking') {
        // For netbanking: typically you call cfRef.current.pay or redirect to bank page via server
        // Example: call pay with payment_method: 'netbanking' and an optional bank code
        const nbResp = await cfRef.current.pay({
          payment_session_id: order.payment_session_id,
          payment_method: 'netbanking',
          // optionally: selected_bank: 'HDFC' or bank_code depending on Cashfree docs
        });

        if (nbResp?.success) {
          await fetch('/api/verify-payment', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ orderId: order.orderId, payload: nbResp })
          });
          setPaymentSuccess(true);
          setTimeout(() => navigate('/custom-cashfree/success'), 1500);
        } else {
          alert('Netbanking initiation failed.');
        }
      }
    } catch (err) {
      console.error('Payment error', err);
      alert('Payment error — check console and try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // UI when payment succeeded
  if (paymentSuccess) {
    return (
      <div className="payment-success-container">
        <div className="success-message">
          <h2>Payment Processing</h2>
          <p>Your payment is being processed. You will be redirected shortly...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="custom-payment-container">
      <div className="payment-card">
        <div className="payment-header">
          <h2>Secure Payment</h2>
          <p>Complete your purchase with our secure payment system</p>
        </div>

        <div className="product-summary">
          <div className="product-item">
            <span className="product-name">Premium Service</span>
            <span className="product-price">₹1000</span>
          </div>
          <div className="total-section">
            <span className="total-label">Total</span>
            <span className="total-amount">₹1000</span>
          </div>
        </div>

        <div className="customer-form">
          <h3>Billing Information</h3>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input type="text" id="name" name="name" value={customerDetails.name} onChange={handleInputChange}
              className={errors.name ? 'error' : ''} placeholder="Enter your full name" />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input type="email" id="email" name="email" value={customerDetails.email} onChange={handleInputChange}
              className={errors.email ? 'error' : ''} placeholder="Enter your email address" />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input type="tel" id="phone" name="phone" value={customerDetails.phone} onChange={handleInputChange}
              className={errors.phone ? 'error' : ''} placeholder="Enter your 10-digit phone number" />
            {errors.phone && <span className="error-message">{errors.phone}</span>}
          </div>
        </div>

        <div className="payment-methods">
          <h3>Payment Method</h3>
          <div className="method-selector">
            <div className={`method-option ${selectedPaymentMethod === 'card' ? 'selected' : ''}`}
                 onClick={() => setSelectedPaymentMethod('card')}>
              <div className="method-icon">💳</div>
              <div className="method-details">
                <span className="method-name">Credit/Debit Card</span>
                <span className="method-description">Pay with your card</span>
              </div>
            </div>

            <div className={`method-option ${selectedPaymentMethod === 'upi' ? 'selected' : ''}`}
                 onClick={() => setSelectedPaymentMethod('upi')}>
              <div className="method-icon">📱</div>
              <div className="method-details">
                <span className="method-name">UPI</span>
                <span className="method-description">Pay with any UPI app</span>
              </div>
            </div>

            <div className={`method-option ${selectedPaymentMethod === 'netbanking' ? 'selected' : ''}`}
                 onClick={() => setSelectedPaymentMethod('netbanking')}>
              <div className="method-icon">🏦</div>
              <div className="method-details">
                <span className="method-name">Net Banking</span>
                <span className="method-description">Pay from your bank account</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card element mount point (Cashfree will insert secure inputs here) */}
        {selectedPaymentMethod === 'card' && (
          <div className="card-element-wrapper">
            <h4>Card details</h4>
            <div id="card-mount" ref={cardMountRef} style={{ minHeight: 56 }} />
            <small className="hint">Card inputs are securely handled by Cashfree.</small>
          </div>
        )}

        {/* UPI QR / deeplink UI */}
        {selectedPaymentMethod === 'upi' && (
          <div className="upi-area">
            <h4>Pay with UPI</h4>
            {upiQr ? (
              <div>
                <img alt="UPI QR" src={`data:image/png;base64,${upiQr}`} style={{ width: 220, height: 220 }} />
                <p>Scan the QR using your UPI app</p>
              </div>
            ) : upiDeepLink ? (
              <div>
                <button onClick={() => { if (upiDeepLink) window.location.href = upiDeepLink; }}>Open UPI app</button>
                <p>If nothing happens, copy/paste this link into your UPI app: <code>{upiDeepLink}</code></p>
              </div>
            ) : (
              <p>After you click Pay, we'll show a QR or open your UPI app to complete payment.</p>
            )}
          </div>
        )}

        <div className="payment-footer">
          <p className="security-note">🔒 Your payment details are securely encrypted</p>
          <button onClick={processPayment} disabled={isProcessing} className="pay-button">
            {isProcessing ? 'Processing...' : 'Pay ₹1000'}
          </button>
        </div>
      </div>

      <div className="payment-assurance">
        <div className="assurance-item"><span className="assurance-icon">🛡️</span><span>100% Secure Payments</span></div>
        <div className="assurance-item"><span className="assurance-icon">🔄</span><span>Easy Refunds</span></div>
        <div className="assurance-item"><span className="assurance-icon">✅</span><span>Verified by Experts</span></div>
      </div>
    </div>
  );
};

export default CustomCashfreePayment;
