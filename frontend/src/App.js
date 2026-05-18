import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Register from './pages/user/Register';
import Login from './pages/user/Login';
import Dashboard from './pages/user/Dashboard';
import ProductDetails from './pages/products/ProductDetails';
import ProtectedRoute from './components/ProtectedRoute';
import Cart from "./pages/cart/Cart";

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/dashboard' element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/product/:id" element={<ProtectedRoute><ProductDetails /></ProtectedRoute>} />
          <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />

        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;