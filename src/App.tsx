import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CashfreePage from './pages/CashfreePage';
import RazorpayPage from './pages/RazorpayPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/cashfree" element={<CashfreePage />} />
          <Route path="/razorpay" element={<RazorpayPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;