import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CashfreePage from './pages/CashfreePage';
import RazorpayPage from './pages/RazorpayPage';
import Success from './pages/Success';
import './App.css';
import CashFreeBuildInExample from './pages/CashFreeBuildIn';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/cashfree" element={<CashFreeBuildInExample />} />
          <Route path="/razorpay" element={<RazorpayPage />} />
          <Route path="/success" element={<Success />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;