import React, { useState } from "react";
import {
  Cashfree,
  CardNumber,
  CardHolder,
  CardExpiry,
  CardCvv,
  SaveInstrument,
} from "@cashfreepayments/pg-react";

const App: React.FC = () => {
  const [isComplete, setIsComplete] = useState(false);

  const handlePay = () => {
    alert("Payment processing...");
    // Trigger your payment logic here
  };

  return (
    <Cashfree
    
      theme="pastel"
      onComplete={(status) => {
        setIsComplete(status); // this is your local app state
      }}
    >
      <CardNumber />
      <CardHolder />
      <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
        <CardExpiry />
        <CardCvv />
      </div>
      <SaveInstrument />
      <div style={{ marginTop: "20px" }}>
        <button
          onClick={handlePay}
          disabled={!isComplete}
          style={{
            padding: "12px 24px",
            fontSize: "16px",
            cursor: isComplete ? "pointer" : "not-allowed",
            backgroundColor: isComplete ? "#2361d5" : "#a0a0a0",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            transition: "background-color 0.3s ease",
          }}
        >
          Pay Now
        </button>
      </div>
    </Cashfree>
  );
};

export default App;
