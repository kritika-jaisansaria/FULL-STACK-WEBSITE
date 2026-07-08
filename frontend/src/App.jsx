import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom';

import { WishlistProvider } from './context/WishlistContext';
import { CartProvider } from './context/CartContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Layout from './Components/Layout';

// User Pages
import Home from './Pages/User/home';
import Contact from './Pages/User/Contact';
import AllJewellery from './Pages/User/AllJewellery';
import ProductDetails from './Pages/User/ProductDetails';
import Wishlist from './Pages/User/Wishlist';
import Account from './Pages/User/account';
import Cart from './Pages/User/Cart';
import CheckoutAddress from './Pages/User/CheckoutAddress';
import PaymentPage from './Pages/User/PaymentPage';
import OrderSuccess from './Pages/User/OrderSuccess';
import LoginForm from './Pages/User/LoginForm';
import { CATEGORY_SLUG_MAP } from './utils/categoryRoutes';


// Admin Pages
import AdminHome from './Pages/admin/adminHome';
import AdminDashboard from "./Pages/admin/AdminDashboard";
import AdminUsers from "./Pages/admin/AdminUsers";
import AdminProducts from './Pages/admin/AdminProducts';
import AdminOrders from './Pages/admin/AdminOrders';

/* ================= ROUTES WITH MODAL SUPPORT ================= */

function AppRoutes() {
  const location = useLocation();

  // 🔥 Background location for modal routing
  const background = location.state && location.state.background;

  return (
    <>
      {/* ================= MAIN ROUTES ================= */}
      <Routes location={background || location}>
        {/* Home (NO layout) */}
        <Route path="/" element={<Home />} />

        {/* USER ROUTES (WITH LAYOUT) */}
        <Route element={<Layout />}>
          <Route path="/contact" element={<Contact />} />
          <Route path="/all-jewellery" element={<AllJewellery />} />
          <Route path="/:category" element={<AllJewellery />} />
           <Route path="/:category/:style" element={<AllJewellery />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/account" element={<Account />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout/address" element={<CheckoutAddress />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/order-success" element={<OrderSuccess />} />
         
        </Route>

        {/* ADMIN ROUTES */}
        <Route path="/admin" element={<AdminHome />}>
        <Route index element={<AdminDashboard />} />
<Route path="users" element={<AdminUsers />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
        </Route>
      </Routes>

      {/* ================= LOGIN MODAL ROUTE ================= */}
      {background && (
        <Routes>
          <Route path="/login" element={<LoginForm />} />
        </Routes>
      )}
    </>
  );
}

/* ================= ROOT APP ================= */

function App() {
  return (
    <BrowserRouter>
      <WishlistProvider>
        <CartProvider>
          <ToastContainer position="top-right" autoClose={2500} />
          <AppRoutes />
        </CartProvider>
      </WishlistProvider>
    </BrowserRouter>
  );
}

export default App;