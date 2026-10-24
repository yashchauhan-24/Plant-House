import React, { useEffect } from "react";
import Navbar from "../componant/Navbar";
import PageTitle from "../componant/PageTitle";
import Footer from "../componant/Footer";
import { Link } from "react-router-dom";
import { LaunchOutlined } from "@mui/icons-material";
import "../OrderStyles/MyOrders.css";
import { useDispatch, useSelector } from "react-redux";
import { getMyAllOrders, deleteUserOrder } from "../feature/order/orderSlice";
import { toast } from "react-toastify";
import Loader from "../componant/Loader";

function MyOrder() {
  const { orders: storedOrders, loading, error, success } = useSelector((state) => state.order);
  const orders = Array.isArray(storedOrders) ? storedOrders : [];
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getMyAllOrders());
  }, [dispatch]);

  // Handle delete order
  const handleDeleteOrder = (orderId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this order? This action cannot be undone.");
    if (confirmDelete) {
      dispatch(deleteUserOrder(orderId));
    }
  };

  // Show success/error messages
  useEffect(() => {
    if (error) {
      toast.error(error?.message || error, { position: "top-right", autoClose: 3000 });
    }
    if (success) {
      toast.success("Order deleted successfully", { position: "top-right", autoClose: 2000 });
      dispatch(getMyAllOrders());
    }
  }, [error, success, dispatch]);
  return (
<>
  <Navbar />
  <PageTitle title="My Orders" />

  {loading ? (<Loader />  ) : error ? (
    <div className="min-h-screen flex items-center justify-center px-4">
      <p role="alert">{error?.message || error || "Failed to load orders"}</p>
    </div>
  ) : orders.length > 0 ? (

    <div className="min-h-screen bg-gradient-to-br from-[#f4fbf6] via-[#eaf7ed] to-[#f4fbf6] px-4 py-16">
      <div className="max-w-5xl mx-auto">

        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-1 h-6 rounded-full bg-[#03541e]" />
            <h1 className="text-2xl font-bold text-[#12351f] tracking-tight">My Orders</h1>
          </div>
          <p className="text-[#6B4C36] text-sm ml-4">
            You have <span className="text-[#03541e] font-semibold">{orders.length}</span> order{orders.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Table Card */}
        <div className="bg-[#ffffff] backdrop-blur-sm border border-[#d7eadb] rounded-2xl shadow-2xl shadow-[#03541e]/8 overflow-hidden">

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">

              {/* Head */}
              <thead>
                <tr className="border-b border-[#d7eadb]">
                  <th className="text-left px-5 py-4 text-xs font-bold uppercase tracking-widest text-[#03541e]/80">Order ID</th>
                  <th className="text-center px-5 py-4 text-xs font-bold uppercase tracking-widest text-[#03541e]/80">Items</th>
                  <th className="text-center px-5 py-4 text-xs font-bold uppercase tracking-widest text-[#03541e]/80">Status</th>
                  <th className="text-center px-5 py-4 text-xs font-bold uppercase tracking-widest text-[#03541e]/80">Total Price</th>
                  <th className="text-center px-5 py-4 text-xs font-bold uppercase tracking-widest text-[#03541e]/80">Actions</th>
                </tr>
              </thead>

              {/* Body */}
              <tbody>
                {orders.map((order, index) => (
                  <tr
                    key={order?._id || index}
                    className={`border-b border-[#d7eadb]/60 hover:bg-[#f4fbf6] transition-colors duration-150 ${
                      index === orders.length - 1 ? "border-b-0" : ""
                    }`}
                  >
                    {/* Order ID */}
                    <td className="px-5 py-4">
                      <span className="text-xs font-mono text-[#55705f] bg-[#f4fbf6] border border-[#d7eadb] px-2 py-1 rounded-lg">
                        #{(order?._id || "").slice(-8).toUpperCase() || "UNKNOWN"}
                      </span>
                    </td>

                    {/* Items Count */}
                    <td className="px-5 py-4 text-center">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-[#f4fbf6] border border-[#d7eadb] text-xs font-bold text-[#12351f]">
                        {(order.orderItem || order.orderItems || []).length}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold
                        ${order.orderStatus === "Delivered"
                          ? "bg-green-400/10 border border-green-400/20 text-green-600"
                          : order.orderStatus === "Shipped"
                          ? "bg-blue-400/10 border border-blue-400/20 text-blue-600"
                          : order.orderStatus === "Processing"
                          ? "bg-[#03541e]/10 border border-[#03541e]/20 text-[#03541e]"
                          : "bg-[#eaf7ed] border border-[#d7eadb] text-[#55705f]"
                        }`}>
                        <span className={`w-1.5 h-1.5 rounded-full
                          ${order.orderStatus === "Delivered" ? "bg-green-500"
                          : order.orderStatus === "Shipped" ? "bg-blue-500"
                          : order.orderStatus === "Processing" ? "bg-[#03541e] animate-pulse"
                          : "bg-[#55705f]"}`}
                        />
                        {order?.orderStatus || "Processing"}
                      </span>
                    </td>

                    {/* Total Price */}
                    <td className="px-5 py-4 text-center">
                      <span className="text-[#03541e] font-bold text-sm">
                        ₹{order?.totalPrice ?? 0}
                      </span>
                    </td>

                    {/* Actions - View & Delete */}
                    <td className="px-5 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {/* View Button */}
                        <Link
                          to={`/order/${order?._id || ""}`}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-[#03541e]/10 border border-[#03541e]/20 text-[#03541e] hover:bg-[#03541e]/20 hover:border-[#03541e]/40 hover:text-[#03541e] transition-all duration-200"
                          title="View order details"
                        >
                          <LaunchOutlined style={{ fontSize: 15 }} />
                        </Link>

                        {/* Delete Button - Only show if order is not delivered */}
                        {(order?.orderStatus || "").toLowerCase() !== "delivered" && order?._id && (
                          <button
                            onClick={() => handleDeleteOrder(order?._id)}
                            disabled={loading}
                            className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-red-400/10 border border-red-400/20 text-red-500 hover:bg-red-400/20 hover:border-red-400/40 hover:text-red-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Delete order"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

  ) : (

    /* No Orders */
    <div className="min-h-screen bg-gradient-to-br from-[#f4fbf6] via-[#eaf7ed] to-[#f4fbf6] flex items-center justify-center px-4">
      <div className="flex flex-col items-center gap-5 text-center max-w-sm">
        <div className="w-20 h-20 rounded-2xl bg-[#03541e]/10 border border-[#03541e]/20 flex items-center justify-center shadow-lg shadow-[#03541e]/10">
          <svg className="w-9 h-9 text-[#03541e]/60" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
          </svg>
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="text-xl font-bold text-[#12351f] tracking-tight">No Orders Found</h3>
          <p className="text-sm text-[#6B4C36]">You haven't placed any orders yet.</p>
        </div>
        <div className="flex items-center gap-3 w-full">
          <div className="flex-1 h-px bg-[#d7eadb]" />
          <div className="w-1.5 h-1.5 rotate-45 bg-[#03541e]/30 flex-shrink-0" />
          <div className="flex-1 h-px bg-[#d7eadb]" />
        </div>
        <Link
          to="/products"
          className="px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest bg-[#03541e] hover:bg-[#12351f] text-[#ffffff] shadow-lg shadow-[#03541e]/20 hover:shadow-[#03541e]/40 active:scale-[0.98] transition-all duration-200"
        >
          Browse Products
        </Link>
      </div>
    </div>

  )}

  <Footer />
</>
  );
}

export default MyOrder;
