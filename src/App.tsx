import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage'; 
import RazorpayPage from './pages/RazorpayPage'; 
import './App.css';
import CashFreeBuildInExample from './pages/CashFreeBuildIn';
import CustomCashfreePayment from './pages/CustomCashfreePayment';
import CustomCashfreeSuccess from './pages/CustomCashfreeSuccess'; 
import CinemaThaterV3 from './components/theather/CinemaThaterV3';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/cashfree" element={<CashFreeBuildInExample />} />
          <Route path="/razorpay" element={<RazorpayPage />} />
          <Route path="/custom-cashfree" element={<CustomCashfreePayment />} />
          <Route path="/custom-cashfree/success" element={<CustomCashfreeSuccess />} />
          <Route path="/cashfree/payment/success" element={<CustomCashfreeSuccess />} />
          <Route path="/movies" element={<CinemaThaterV3 />} />
          <Route path="/moviesV2" element={<CinemaThaterV3 />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;