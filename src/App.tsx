import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage'; 
import RazorpayPage from './pages/RazorpayPage';
import Success from './pages/Success';
import './App.css';
import CashFreeBuildInExample from './pages/CashFreeBuildIn';
import CustomCashfreePayment from './pages/CustomCashfreePayment';
import CustomCashfreeSuccess from './pages/CustomCashfreeSuccess';
import CinemaTheather from './components/theather/CinemaTheather';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/cashfree" element={<CashFreeBuildInExample />} />
          <Route path="/custom-cashfree" element={<CustomCashfreePayment />} />
          <Route path="/custom-cashfree/success" element={<CustomCashfreeSuccess />} />
          <Route path="/razorpay" element={<RazorpayPage />} />
          <Route path="/razorpay/payment/success" element={<Success />} />
          <Route path="/movies" element={<CinemaTheather />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;