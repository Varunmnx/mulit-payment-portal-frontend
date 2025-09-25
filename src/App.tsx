import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage'; 
import RazorpayPage from './pages/RazorpayPage';
import Success from './pages/Success';
import './App.css';
import CashFreeBuildInExample from './pages/CashFreeBuildIn';
import CustomCashfreePayment from './pages/CustomCashfreePayment';
import CustomCashfreeSuccess from './pages/CustomCashfreeSuccess';
import CinemaTheather from './components/theather/CinemaTheather';
import CinemaTheatherV2 from './components/theather/CinemaTheatherV2';

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
          <Route path="/cashfree/payment/success" element={<CustomCashfreeSuccess />} />
          <Route path="/movies" element={<CinemaTheather />} />
          <Route path="/moviesV2" element={<CinemaTheatherV2 />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;