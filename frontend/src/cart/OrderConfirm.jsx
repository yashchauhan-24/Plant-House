import React from "react";
import "../CartStyles/OrderConfirm.css";
import PageTitle from "../componant/PageTitle";
import Navbar from "../componant/Navbar";
import Footer from "../componant/Footer";
import CheckoutPath from "./CheckoutPath";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function OrderConfirm() {
  const { shippingInfo, cartItems } = useSelector((state) => state.cart);
  const subTotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  const tax = subTotal * 0.18;

  const shippingCharges = subTotal > 500 ? 0 : 100;

  const total = subTotal + tax + shippingCharges;
  const navigate = useNavigate();
  const { user = {} } = useSelector((state) => state.user);

  const proceedToPayment = () => {
    const data = {
      subTotal,
      tax,
      shippingCharges,
      total,
    };
    // save in session storeg
    sessionStorage.setItem("orderItem", JSON.stringify(data));
    navigate("/process/payment");
  };
  return (
<>
      <PageTitle title="Order Confirm" />
      <Navbar />
      <CheckoutPath activePath={1}  />

      <div className="min-h-screen bg-gradient-to-br from-[#f4fbf6] via-[#eaf7ed] to-[#f4fbf6] px-4 pt-4 pb-12">
        <div className="max-w-5xl mx-auto flex flex-col gap-6">

          {/* Page Heading */}
          <div className="flex items-center gap-2">
            <div className="w-1 h-6 rounded-full bg-[#03541e]" />
            <h1 className="text-2xl font-bold text-[#12351f] tracking-tight">Order Confirmation</h1>
          </div>

          {/* ── Shipping Details ── */}
          <div className="bg-[#ffffff] border border-[#d7eadb] rounded-2xl shadow-lg shadow-[#03541e]/10 overflow-hidden">
            <div className="px-6 py-4 border-b border-[#d7eadb]">
              <p className="text-xs font-bold uppercase tracking-widest text-[#55705f]">Shipping Details</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700/50">
                    <th className="text-left px-6 py-3 text-xs font-bold uppercase tracking-widest text-[#A67D5B]">Name</th>
                    <th className="text-left px-6 py-3 text-xs font-bold uppercase tracking-widest text-[#A67D5B]">Phone</th>
                    <th className="text-left px-6 py-3 text-xs font-bold uppercase tracking-widest text-[#A67D5B]">Address</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-6 py-4 text-[#12351f] font-medium">{user?.name || "-"}</td>
                    <td className="px-6 py-4 text-[#12351f]">{shippingInfo?.phoneNumber || "-"}</td>
                    <td className="px-6 py-4 text-[#12351f]">
                      {shippingInfo?.address || "-"}, {shippingInfo?.city || "-"},{" "}
                      {shippingInfo?.state || "-"}, {shippingInfo?.country || "-"},{" "}
                      {shippingInfo?.pincode || "-"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* ── Cart Items ── */}
          <div className="bg-[#ffffff] border border-[#d7eadb] rounded-2xl shadow-lg shadow-[#03541e]/10 overflow-hidden">
            <div className="px-6 py-4 border-b border-[#d7eadb]">
              <p className="text-xs font-bold uppercase tracking-widest text-[#55705f]">Cart Items</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#d7eadb]">
                    <th className="text-left px-6 py-3 text-xs font-bold uppercase tracking-widest text-[#A67D5B]">Image</th>
                    <th className="text-left px-6 py-3 text-xs font-bold uppercase tracking-widest text-[#A67D5B]">Product Name</th>
                    <th className="text-left px-6 py-3 text-xs font-bold uppercase tracking-widest text-[#A67D5B]">Price</th>
                    <th className="text-left px-6 py-3 text-xs font-bold uppercase tracking-widest text-[#A67D5B]">Quantity</th>
                    <th className="text-left px-6 py-3 text-xs font-bold uppercase tracking-widest text-[#A67D5B]">Total Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#d7eadb]">
                  {cartItems.map((item) => (
                    <tr key={item.product || item._id} className="hover:bg-[#f4fbf6] transition-all duration-150">
                      <td className="px-6 py-4">
                        <div className="w-12 h-12 rounded-xl overflow-hidden border border-[#d7eadb] bg-[#f4fbf6]">
                          <img
                            src={item?.image?.url || item?.image}
                            alt={item?.name || "product"}
                            className="w-full h-full object-cover object-center"
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[#12351f] font-medium">{item.name}</td>
                      <td className="px-6 py-4 text-[#12351f]">₹{Number(item.price).toFixed(2)}</td>
                      <td className="px-6 py-4 text-[#12351f]">{item.quantity}</td>
                      <td className="px-6 py-4 text-[#03541e] font-bold">₹{(Number(item.price) * item.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── Order Summary ── */}
          <div className="bg-[#ffffff] border border-[#d7eadb] rounded-2xl shadow-lg shadow-[#03541e]/10 overflow-hidden">
            <div className="px-6 py-4 border-b border-[#d7eadb]">
              <p className="text-xs font-bold uppercase tracking-widest text-[#55705f]">Order Summary</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#d7eadb]">
                    <th className="text-left px-6 py-3 text-xs font-bold uppercase tracking-widest text-[#A67D5B]">Subtotal</th>
                    <th className="text-left px-6 py-3 text-xs font-bold uppercase tracking-widest text-[#A67D5B]">Shipping</th>
                    <th className="text-left px-6 py-3 text-xs font-bold uppercase tracking-widest text-[#A67D5B]">GST</th>
                    <th className="text-left px-6 py-3 text-xs font-bold uppercase tracking-widest text-[#A67D5B]">Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-6 py-4 text-[#12351f]">₹{subTotal.toFixed(2)}</td>
                    <td className="px-6 py-4 text-[#12351f]">₹{shippingCharges.toFixed(2)}</td>
                    <td className="px-6 py-4 text-[#12351f]">₹{tax.toFixed(2)}</td>
                    <td className="px-6 py-4 text-[#03541e] font-extrabold text-base">₹{total.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* ── Proceed Button ── */}
          <div className="flex justify-end">
            <button
              onClick={proceedToPayment}
              className="px-10 py-3.5 rounded-xl font-bold text-sm tracking-widest uppercase transition-all duration-200 bg-[#03541e] hover:bg-[#12351f] text-[#12351f] shadow-lg shadow-[#03541e]/20 hover:shadow-[#03541e]/30 active:scale-[0.98]"
            >
              Proceed To Payment
            </button>
          </div>

        </div>
      </div>

      <Footer />
    </>
  );
}

export default OrderConfirm;
