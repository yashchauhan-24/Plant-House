import React, { useRef } from "react";
import "../CartStyles/PaymentSuccess.css";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import PageTitle from "../componant/PageTitle";
import Navbar from "../componant/Navbar";
import Footer from "../componant/Footer";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { toast } from "react-toastify";
import {
  createOder,
  removeError,
  removeSuccess,
} from "../feature/order/orderSlice";
import { clearCart } from "../feature/cart/cartSlice";
import Loader from "../componant/Loader";

function PaymentSuccess() {
  const [serchparams] = useSearchParams();
  const reference = serchparams.get("reference");
  const { shippingInfo, cartItems } = useSelector((state) => state.cart);
  const { loading, error, success } = useSelector((state) => state.order);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const orderCreatedRef = useRef(false);

  useEffect(() => {
    const createOrderData = async () => {
      try {
        if (orderCreatedRef.current) {
          return;
        }

        if (!reference) {
          console.error("❌ Payment reference not found");
          toast.error("Payment reference not found. Please contact support.", {
            position: "top-right",
            autoClose: 3000,
          });
          return;
        }

        const orderItem = JSON.parse(sessionStorage.getItem("orderItem"));
        if (!orderItem) {
          console.error("❌ Order item not found in sessionStorage");
          toast.error("Order summary missing. Please try checkout again.", {
            position: "top-left",
            autoClose: 3000,
          });
          return;
        }
        if (!cartItems || cartItems.length === 0) {
          console.error("❌ Cart items empty:", cartItems);
          toast.error("Cart items missing. Please try checkout again.", {
            position: "top-left",
            autoClose: 3000,
          });
          return;
        }
        // Validate all cart items have required fields
        const invalidItems = cartItems.filter(
          (item) =>
            !item.product || !item.name || !item.price || !item.quantity,
        );
        if (invalidItems.length > 0) {
          console.error("Invalid cart items:", invalidItems);
          toast.error("Invalid items in cart", {
            position: "top-left",
            autoClose: 3000,
          });
          return;
        }
        console.log(
          "Cart items with images:",
          cartItems.map((item) => ({ ...item, hasImage: !!item.image })),
        );
        if (!shippingInfo?.address || !shippingInfo?.city || !shippingInfo?.state || !shippingInfo?.country || !shippingInfo?.pincode || !shippingInfo?.phoneNumber) {
          console.log("Shipping info missing", shippingInfo);
          toast.error("Shipping information is incomplete.", {
            position: "top-left",
            autoClose: 3000,
          });
          return;
        }

        const orderData = {
          shipingInfo: {
            country: shippingInfo.country,
            address: shippingInfo.address,
            city: shippingInfo.city,
            state: shippingInfo.state,
            pincode: shippingInfo.pincode,
            phoneNo: shippingInfo.phoneNumber,
          },
          orderItem: cartItems.map((item) => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image || "",
            product: item.product,
          })),
          paymentInfo: {
            id: reference,
            status: "succeeded",
          },
          itemPrice: orderItem.subTotal,
          taxPrice: orderItem.tax,
          shippingPrice: orderItem.shippingCharges,
          totalPrice: orderItem.total,
        };

        console.log("✅ Creating order with data:", orderData);
        orderCreatedRef.current = true;
        const result = await dispatch(createOder(orderData)).unwrap();
        console.log("✅ Order created successfully:", result);
        dispatch(clearCart());
        sessionStorage.removeItem("orderItem");
      } catch (error) {
        orderCreatedRef.current = false;
        console.error("❌ Order creation error:", error);
        const errorMsg = error?.message || error?.error || "Order creation failed. Please try again.";
        toast.error(errorMsg, {
          position: "top-left",
          autoClose: 4000,
        });
      }
    };
    createOrderData();
  }, [dispatch, reference, cartItems, shippingInfo]);

  useEffect(() => {
    if (success) {
      toast.success("Order Placed", { position: "top-right", autoClose: 2000 });
      dispatch(removeSuccess());
      navigate("/orders/user");
    }
  }, [dispatch, success, navigate]);
  useEffect(() => {
    if (error) {
      console.error("❌ Redux error state:", error);
      toast.error(error || "Something went wrong", { position: "top-right", autoClose: 3000 });
      dispatch(removeError());
    }
  }, [dispatch, error]);
  return (
 <>
      <PageTitle title="Payment Status" />
      <Navbar />
      {loading ? (
        <Loader />
      ) : (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4 py-16">
          <div className="w-full max-w-md bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden">

            {/* Success Icon */}
            <div className="flex flex-col items-center px-8 pt-10 pb-8 gap-5">

              <div className="w-20 h-20 rounded-full bg-emerald-500/15 border-2 border-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <svg className="w-9 h-9 text-emerald-400" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>

              {/* Title */}
              <div className="text-center">
                <h1 className="text-2xl font-bold text-white tracking-tight mb-2">Order Confirmed!</h1>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Your payment was successful.
                </p>
              </div>

              {/* Reference ID */}
              <div className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-5 py-4 flex flex-col gap-1 text-center">
                <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Reference ID</span>
                <span className="text-amber-400 font-bold text-base tracking-wide">{reference}</span>
              </div>

              {/* Divider */}
              <div className="w-full h-px bg-slate-700/50" />

              {/* View Orders Button */}
              <Link
                to="/orders/user"
                className="w-full py-3.5 rounded-xl font-bold text-sm tracking-widest uppercase text-center transition-all duration-200 bg-amber-400 hover:bg-amber-300 text-slate-900 shadow-lg shadow-amber-400/20 hover:shadow-amber-400/40 active:scale-[0.98]"
              >
                View Orders
              </Link>

            </div>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
}

export default PaymentSuccess;
