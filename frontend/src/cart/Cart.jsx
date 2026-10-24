import React from "react";
import "../CartStyles/Cart.css";
import Navbar from "../componant/Navbar";
import Footer from "../componant/Footer";
import PageTitle from "../componant/PageTitle";
import CartItem from "./CartItem";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
function Cart() {
  const navigate = useNavigate();
  const { cartItems } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.user);
  const subTotal = cartItems.reduce((acc, item)=> acc+item.price * item.quantity ,0)
  const tax = (subTotal * 0.18)
  const shippngCharges = subTotal >500 ? 0 :  100;
  const total = subTotal + tax + shippngCharges;
  
  const checkOutHandlier=()=>{
    if (isAuthenticated) {
      navigate('/shipping');
    } else {
      navigate('/login?redirect=/shipping');
    }
  }
  return (
   <>
      <Navbar />
      <PageTitle title="Your Cart" />

      {cartItems.length === 0 ? (
        <div className="min-h-screen bg-gradient-to-br from-[#f4fbf6] via-[#eaf7ed] to-[#f4fbf6] flex flex-col items-center justify-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-[#03541e]/10 border border-[#03541e]/20 flex items-center justify-center">
            <svg className="w-8 h-8 text-[#03541e]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
            </svg>
          </div>
          <p className="text-[#55705f] text-lg font-medium">Your cart is empty</p>
          <Link
            to="/products"
            className="cart-empty-button px-6 py-2.5 rounded-xl bg-[#03541e] hover:bg-[#12351f] text-[#ffffff] font-bold text-sm tracking-widest uppercase transition-all duration-200 shadow-lg shadow-[#03541e]/20"
          >
            Go To Products
          </Link>
        </div>
      ) : (
        <div className="min-h-screen bg-gradient-to-br from-[#f4fbf6] via-[#eaf7ed] to-[#f4fbf6] px-4 pt-6 pb-12">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 items-start">

            {/* ── Cart Items ── */}
            <div className="mt-20 flex-1 bg-[#ffffff] backdrop-blur-sm border border-[#d7eadb] rounded-2xl shadow-2xl shadow-[#03541e]/8 overflow-hidden">

              {/* Heading */}
              <div className="px-6 py-5 border-b border-[#d7eadb] flex items-center gap-2">
                <div className="w-1 h-5 rounded-full bg-[#03541e]" />
                <h2 className="text-lg font-bold text-[#12351f] tracking-tight">Your Cart</h2>
              </div>

              {/* Table Header */}
              <div className="hidden md:grid grid-cols-4 px-6 py-3 text-xs font-bold uppercase tracking-widest text-[#55705f] border-b border-[#d7eadb]">
                <div>Product</div>
                <div className="text-center">Quantity</div>
                <div className="text-center">Item Total</div>
                <div className="text-center">Actions</div>
              </div>

              {/* Cart Items */}
              <div className="divide-y divide-[#d7eadb]">
                {cartItems && cartItems.map((item) => (
                  <CartItem item={item} key={item.name} />
                ))}
              </div>
            </div>

            {/* ── Price Summary ── */}
            <div className="mt-20 w-full lg:w-80 shrink-0 bg-[#ffffff] backdrop-blur-sm border border-[#d7eadb] rounded-2xl shadow-2xl shadow-[#03541e]/8 overflow-hidden sticky top-6">

              {/* Heading */}
              <div className="px-6 py-5 border-b border-[#d7eadb] flex items-center gap-2">
                <div className="w-1 h-5 rounded-full bg-[#03541e]" />
                <h3 className="text-lg font-bold text-[#12351f] tracking-tight">Price Summary</h3>
              </div>

              <div className="px-6 py-5 flex flex-col gap-3">

                {/* Subtotal */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#55705f]">Subtotal</span>
                  <span className="text-[#12351f] font-medium">₹{subTotal.toFixed(2)}</span>
                </div>

                {/* Tax */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#55705f]">Tax (18%)</span>
                  <span className="text-[#12351f] font-medium">₹{tax.toFixed(2)}</span>
                </div>

                {/* Shipping */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#55705f]">Shipping Charge</span>
                  <span className="text-[#12351f] font-medium">{shippngCharges === 0 ? 'FREE' : `₹${shippngCharges}`}</span>
                </div>

                {/* Divider */}
                <div className="h-px bg-[#d7eadb] my-1" />

                {/* Total */}
                <div className="flex items-center justify-between">
                  <span className="text-[#12351f] font-bold text-base">Total</span>
                  <span className="text-[#03541e] font-extrabold text-xl">₹{total.toFixed(2)}</span>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={checkOutHandlier}
                  className="w-full mt-2 py-3.5 rounded-xl font-bold text-sm tracking-widest uppercase transition-all duration-200 bg-[#03541e] hover:bg-[#12351f] text-[#ffffff] shadow-lg shadow-[#03541e]/20 hover:shadow-[#03541e]/40 active:scale-[0.98]"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      <Footer />
    </>
  );
}

export default Cart;
