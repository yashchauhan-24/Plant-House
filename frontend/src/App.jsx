import { BrowserRouter as Router, Routes, Route, useLocation} from "react-router-dom";
import Home from './Pages/Home';
import ProductDetails from "./Pages/ProductDetails";
import Products from "./Pages/Products";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { clearClientSession, loadUser } from "./feature/user/userSlice";
import Profile from "./User/Profile";
import ProtectedRoutes, { PublicAuthRoute } from "./componant/ProtectedRoutes";
import UpdateProfile from "./User/UpdateProfile";
import UpdatePassword from "./User/UpdatePassword";
import ForgotPassword from "./User/ForgotPassword";
import ResetPassword from "./User/ResetPassword";
import Cart from "./cart/Cart";
import Shipping from "./cart/Shipping";
import OrderConfirm from "./cart/OrderConfirm";
import Payment from "./cart/Payment";
import PaymentSuccess from "./cart/PaymentSuccess";
import MyOrder from "./order/Myorder";
import OrderDetails from "./order/OrderDetails";
import Dashboard from "./Admin/Dashboard";
import ProductList from "./Admin/ProductList";
import CreateProduct from "./Admin/CreateProduct";
import UpdateProducts from "./Admin/UpdateProducts";
import UserList from "./Admin/UserList";
import UpdateRole from "./Admin/UpdateRole";
import Register from "./User/Register";
import Login from "./User/Login";
import OrderList from "./Admin/OrderList";
import UpdateOrderStatus from "./Admin/UpdateOrderStatus";
import UpdateOrder from "./Admin/UpdateOrder";
import ReviewsList from "./Admin/ReviewsList";
import AboutUs from "./componant/AboutU";
import ContactUs from "./componant/ContactUs";
import AddCategory from "./Admin/AddCategory";
import EditCategory from "./Admin/EditCategory";
import AdminLogin from "./Admin/AdminLogin";
import Wishlist from "./Pages/Wishlist";

function AuthSync() {
  const dispatch = useDispatch();
  const location = useLocation();
  const isPrivateRoute = ["/profile", "/cart", "/wishlist", "/shipping", "/order", "/orders", "/process", "/paymentSuccess", "/admin"].some((path) => location.pathname.startsWith(path));

  useEffect(() => {
    const expectedRole = location.pathname.startsWith('/admin') ? 'admin' : 'user';
    dispatch(loadUser({ expectedRole }));
  }, [dispatch, location.pathname]);

  useEffect(() => {
    const getToken = () => localStorage.getItem(location.pathname.startsWith("/admin") ? "adminToken" : "userToken");
    const redirectIfUnauthenticated = () => {
      if (isPrivateRoute && !getToken()) {
        window.location.replace(location.pathname.startsWith("/admin") ? "/admin/login" : "/login");
      }
    };
    const handlePageShow = (event) => {
      const navigation = performance.getEntriesByType("navigation")[0];
      if (event.persisted || navigation?.type === "back_forward") redirectIfUnauthenticated();
    };
    const handleStorage = (event) => {
      if (["authRole", "adminToken", "userToken", "adminUser", "userData", "isAuthenticated"].includes(event.key)) {
        if (!localStorage.getItem("adminToken") && !localStorage.getItem("userToken")) {
          clearClientSession(dispatch);
        }
        redirectIfUnauthenticated();
      }
    };
    window.addEventListener("pageshow", handlePageShow);
    window.addEventListener("storage", handleStorage);
    return () => {
      window.removeEventListener("pageshow", handlePageShow);
      window.removeEventListener("storage", handleStorage);
    };
  }, [isPrivateRoute, location.pathname]);

  return null;
}

function App() {
  return (
    <>
    <Router>
      <AuthSync />
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/product/:id" element={<ProductDetails />}/>
        <Route path="/products" element={<Products />}/>
        <Route path="/about-us" element={<AboutUs />}/>
        <Route path="/contact-us" element={<ContactUs />}/>
        <Route path="/products/:keyword" element={<Products />}/>
        <Route path="/register" element={<PublicAuthRoute element={<Register />} />}/>
        {/* <Route path="/register" element={<Registers />}/> */}
        <Route path="/login" element={<PublicAuthRoute element={<Login />} />}/>
        <Route path="/admin/login" element={<PublicAuthRoute element={<AdminLogin />} adminOnly />}/>
        {/* <Route path="/login" element={<Logins />}/> */}
        <Route path="/forgot/password" element={<ForgotPassword />}/>
        <Route path="/profile" element={<ProtectedRoutes element={<Profile />}  />}/>
        <Route path="/profile/update" element={<ProtectedRoutes element={<UpdateProfile />}  />}/>
        <Route path="/password/update" element={<ProtectedRoutes element={<UpdatePassword />}  />}/>
        <Route path="/reset/:token" element={<ResetPassword />}/>
        <Route path="/cart" element={<ProtectedRoutes element={<Cart />} />}/>
        <Route path="/wishlist" element={<ProtectedRoutes element={<Wishlist />} />}/>
        <Route path="/shipping" element={<ProtectedRoutes element={<Shipping />}  />}/>
        <Route path="/order/confirm" element={<ProtectedRoutes element={<OrderConfirm />}  />}/>
        <Route path="/process/payment" element={<ProtectedRoutes element={<Payment />}  />}/>
        <Route path="/paymentSuccess" element={<ProtectedRoutes element={<PaymentSuccess  />}  />}/>
        <Route path="/orders/user" element={<ProtectedRoutes element={<MyOrder  />}  />}/>
        <Route path="/order/:orderId" element={<ProtectedRoutes element={<OrderDetails  />}  />}/>

{/* Admin Routes */}
        <Route path="/admin/dashboard" element={<ProtectedRoutes element={<Dashboard  />}  adminOnly={true} />}/>
        <Route path="/admin/products" element={<ProtectedRoutes element={<ProductList  />}  adminOnly={true} />}/>
        <Route path="/admin/product/create" element={<ProtectedRoutes element={<CreateProduct  />}  adminOnly={true} />}/>
        <Route path="/admin/category/create" element={<ProtectedRoutes element={<AddCategory />} adminOnly={true} />}/>
        <Route path="/admin/category/:id/edit" element={<ProtectedRoutes element={<EditCategory />} adminOnly={true} />}/>
        <Route path="/admin/create" element={<ProtectedRoutes element={<CreateProduct  />}  adminOnly={true} />}/>
        <Route path="/admin/product/:updateId" element={<ProtectedRoutes element={<UpdateProducts  />}  adminOnly={true} />}/>
        <Route path="/admin/users" element={<ProtectedRoutes element={<UserList  />}  adminOnly={true} />}/>
        <Route path="/admin/user/:id" element={<ProtectedRoutes element={<UpdateRole  />}  adminOnly={true} />}/>
        <Route path="/admin/orders" element={<ProtectedRoutes element={<OrderList  />}  adminOnly={true} />}/>
        <Route path="/admin/orders/confirmed" element={<ProtectedRoutes element={<OrderList  />}  adminOnly={true} />}/>
        <Route path="/admin/orders/cancelled" element={<ProtectedRoutes element={<OrderList  />}  adminOnly={true} />}/>
        <Route path="/admin/order/:orderId" element={<ProtectedRoutes element={<UpdateOrderStatus />} adminOnly={true} />}/>
        <Route path="/admin/reviews" element={<ProtectedRoutes element={<ReviewsList  />}  adminOnly={true} />}/>

      </Routes>
    </Router>
    </>
  )
}

export default App
