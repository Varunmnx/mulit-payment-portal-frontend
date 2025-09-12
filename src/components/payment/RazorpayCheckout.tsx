import { useState } from "react";
import type { CurrencyCode } from "../../hooks/razorpay/constants/currency";
import type { RazorpayOptions } from "../../hooks/razorpay/razorpay-service.types";
import { useRazorpay } from "../../hooks/razorpay/useRazorpay";
import { razorpayService } from "../../services/paymentService"; 

const RazorpayCheckout = () => {
    const { error, isLoading, Razorpay } = useRazorpay();
    const [serverOrderId, setServerOrderId] = useState<string | null>(null);
   async function verifyPayment(body:{
        razorpay_order_id: string;
        razorpay_payment_id: string;
        razorpay_signature: string
    }){
        const response = await razorpayService.verifyPayment(body)
        if(response === "SUCCESS"){
            alert("Payment Successful!")
        }else {
            alert("Payment Failed!")
        }
    }
    const handlePayment = async () => {
        const data = await razorpayService.createOrder({ amount: 1000, currency: 'INR', productId: 'product_1' })
        if(data.id){
            localStorage.setItem("razorpay_order_id", data.id)
            setServerOrderId(data.id)
        }
        console.log("data",data)

        const options: RazorpayOptions = {
            key: import.meta.env.VITE_RAZORPAY_API_KEY,
            amount: data?.amount as number, // Amount in paise
            currency: data?.currency as CurrencyCode,
            name: "Test Company",
            description: "Test Transaction",
            image: "https://github.com/Varunmnx/chotta_mumbai/blob/master/public/doge.png?raw=true",
            order_id: data?.id as string, // Generate order_id on server
            modal:{ //https://razorpay.com/docs/payments/payment-gateway/web-integration/standard/integration-steps/#121-handler-function-or-callback-url
                ondismiss: () => {
                    console.log("dismissed")
                    // console.log(param)

                },
                confirm_close: true,
                backdropclose:true,
                animation:true,
                escape:true,
                handleback:true
            },
            handler: (response) => { 
                const orderII_d = localStorage.getItem("razorpay_order_id")
                console.log("serverOrderID",serverOrderId)
                console.log("response", response)
                // if the orders are not matched the payment verification will fail because we will only receive order_id from razorpay
                if (response.razorpay_payment_id && response.razorpay_signature && response.razorpay_order_id) {
                    verifyPayment({
                        razorpay_order_id: orderII_d as string,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature,
                    })
                }else {
                    alert("Order mismatch")
                }
            },
            prefill: {
                name: "John Doe",
                email: "john.doe@example.com",
                contact: "9999999999",
            },
            theme: {
                color: "#F37254",
            },
            // callback_url: "https://zion-unchallenging-annika.ngrok-free.app/api/payment-service/razorpay/verify",
            // redirect: true,
            remember_customer: true,
            // config: onlyUsingCertainBanks.config
        };

        const razorpayInstance = new Razorpay(options);

        razorpayInstance.open();

        razorpayInstance.on("payment.failed", (response) => {
            console.log(response);
            alert("Payment Failed!");
        })
 
    };

    return (
        <div>
            <h1>Payment Page</h1>
            {isLoading && <p>Loading Razorpay...</p>}
            {error && <p>Error loading Razorpay: {error}</p>}
            <button onClick={handlePayment} disabled={isLoading}>
                Pay Now
            </button>
        </div>
    );
};

export default RazorpayCheckout;