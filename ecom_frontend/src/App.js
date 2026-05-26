import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

// USER PAGES
import Register from './pages/user/Register';
import Login from './pages/user/Login';
import Dashboard from './pages/user/Dashboard';
import ProductDetails from './pages/products/ProductDetails';
import Cart from './pages/cart/Cart';
import OrderPage from './pages/order/OrderPage';
import OrderSuccess from './pages/order/OrderSuccess';

// ADMIN PAGES
import AdminSignup from "./pages/admin/AdminSignup";
import AdminLogin from "./pages/admin/AdminLogin";
import AddProduct from './pages/products/AddProduct';

// PROTECTED ROUTES
import UserProtectedRoute from './components/UserProtectedRoute';
import AdminProtectedRoute from './components/AdminProtectedRoute';

function App() {

  const userEvent = (JSON.parse(localStorage.getItem("admin") || localStorage.getItem("user")));
  const role = userEvent?.role || "user";



  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* USER ROUTES */}
          {/* <Route path='/' element={role == "user" ? <Login /> : <AdminLogin />} /> */}
          <Route path='/' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/dashboard' element={<UserProtectedRoute><Dashboard /></UserProtectedRoute>} />
          <Route path="/product/:id" element={<UserProtectedRoute><ProductDetails /></UserProtectedRoute>} />
          <Route path="/cart" element={<UserProtectedRoute><Cart /></UserProtectedRoute>} />
          <Route path="/order" element={<UserProtectedRoute><OrderPage /></UserProtectedRoute>} />
          <Route path="/order-success" element={<UserProtectedRoute><OrderSuccess /></UserProtectedRoute>} />

          {/* ADMIN ROUTES */}
          <Route path="/admin/signup" element={<AdminSignup />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/addproduct" element={<AdminProtectedRoute><AddProduct /></AdminProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
