import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages';
import ForgetPassword from './pages/ForgetPass';
import Dashboard from './pages/Dashboard';
// import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<Index />} />
          
          <Route path='/ForgetPassword' element={<ForgetPassword />} />
          <Route path="/dashboard/*" element={<Dashboard />} />
          {/* <Route path="/admin/*" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } /> */}
          </Routes>
      </Router>
    </>
  );
}

export default App;
