import React, { useEffect, useState } from "react";
import "../AdminStyles/UpdateOrder.css";
import PageTitle from "../componant/PageTitle";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  updateOrderStatus,
  removeError,
  removeSuccess,
  clearMessage,
} from "../feature/admin/adminSlice";
import Loader from "../componant/Loader";
import { toast } from "react-toastify";
import AdminShell from "./components/AdminShell";

function UpdateOrder() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { orders, loading, error, success, message } = useSelector(
    (state) => state.admin
  );

  const order = orders.find((o) => o._id === id);

  const [status, setStatus] = useState("");

  useEffect(() => {
    if (order) {
      setStatus(order.orderStatus);
    }
  }, [order]);

  useEffect(() => {
    if (error) {
      toast.error(error?.message || error, {
        position: "top-right",
        autoClose: 2000,
        toastId: "update-order-error",
      });
      dispatch(removeError());
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (success) {
      toast.success(message || "Order updated", {
        position: "top-right",
        autoClose: 2000,
      });
      dispatch(removeSuccess());
      dispatch(clearMessage());
      navigate("/admin/orders");
    }
  }, [success, message, dispatch, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const validStatuses = ["Processing", "Shipped", "Delivered"];
    if (!validStatuses.includes(status)) {
      toast.error("Please select a valid order status", {
        position: "top-right",
        autoClose: 2000,
      });
      return;
    }
    dispatch(updateOrderStatus({ id, status }));
  };

  if (!order) {
    return (
      <>
        <PageTitle title="Update Order" />
        <AdminShell>
          <div className="order-container">
            <p>Order not found. <Link to="/admin/orders">Go back</Link></p>
          </div>
        </AdminShell>
      </>
    );
  }

  return (
<>
      <PageTitle title="Update Order" />
      <AdminShell>
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="px-0">
            <div className="max-w-3xl mx-auto flex flex-col gap-6">

              {/* Heading */}
              <div className="flex items-center gap-2">
                <div className="w-1 h-6 rounded-full bg-[#03541e]" />
                <h1 className="text-2xl font-bold text-[#12351f] tracking-tight">Update Order</h1>
              </div>

              {/* ── Order Info ── */}
              <div className="bg-[#ffffff] backdrop-blur-sm border border-[#d7eadb] rounded-2xl shadow-2xl shadow-[#03541e]/8 overflow-hidden">
                <div className="px-6 py-4 border-b border-[#d7eadb]">
                  <p className="text-xs font-bold uppercase tracking-widest text-[#55705f]">Order Info</p>
                </div>
                <div className="px-6 py-5 flex flex-col gap-3">

                  <div className="flex items-center justify-between py-2 border-b border-[#d7eadb]">
                    <span className="text-xs font-bold uppercase tracking-widest text-[#55705f]">Order ID</span>
                    <span className="text-[#12351f] font-mono text-xs">{order._id}</span>
                  </div>

                  <div className="flex items-center justify-between py-2 border-b border-[#d7eadb]">
                    <span className="text-xs font-bold uppercase tracking-widest text-[#55705f]">Total Price</span>
                    <span className="text-[#03541e] font-bold">₹{order.totalPrice?.toFixed(2)}</span>
                  </div>

                  <div className="flex items-center justify-between py-2 border-b border-[#d7eadb]">
                    <span className="text-xs font-bold uppercase tracking-widest text-[#55705f]">Current Status</span>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold
                      ${order.orderStatus?.toLowerCase() === 'delivered'
                        ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-600'
                        : order.orderStatus?.toLowerCase() === 'processing'
                          ? 'bg-[#03541e]/10 border border-[#03541e]/20 text-[#03541e]'
                          : order.orderStatus?.toLowerCase() === 'shipped'
                            ? 'bg-blue-500/10 border border-blue-500/20 text-blue-500'
                            : 'bg-red-500/10 border border-red-500/20 text-red-500'
                      }`}>
                      <span className={`w-1.5 h-1.5 rounded-full
                        ${order.orderStatus?.toLowerCase() === 'delivered' ? 'bg-emerald-500'
                          : order.orderStatus?.toLowerCase() === 'processing' ? 'bg-[#03541e] animate-pulse'
                          : order.orderStatus?.toLowerCase() === 'shipped' ? 'bg-blue-500'
                          : 'bg-red-500'}`}
                      />
                      {order.orderStatus}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-2">
                    <span className="text-xs font-bold uppercase tracking-widest text-[#55705f]">Paid At</span>
                    <span className="text-[#12351f] text-sm">{new Date(order.paidAt).toLocaleDateString()}</span>
                  </div>

                </div>
              </div>

              {/* ── Order Items ── */}
              <div className="bg-[#ffffff] backdrop-blur-sm border border-[#d7eadb] rounded-2xl shadow-2xl shadow-[#03541e]/8 overflow-hidden">
                <div className="px-6 py-4 border-b border-[#d7eadb]">
                  <p className="text-xs font-bold uppercase tracking-widest text-[#55705f]">Order Items</p>
                </div>
                <div className="divide-y divide-[#d7eadb]">
                  {order.orderItem?.map((item, i) => (
                    <div key={i} className="px-6 py-4 flex items-center justify-between hover:bg-[#f4fbf6] transition-all duration-150">
                      <span className="text-[#12351f] font-medium text-sm">{item.name}</span>
                      <div className="flex items-center gap-4">
                        <span className="text-xs text-[#55705f]">× {item.quantity}</span>
                        <span className="text-[#03541e] font-bold text-sm">₹{item.price}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Update Status ── */}
              <div className="bg-[#ffffff] backdrop-blur-sm border border-[#d7eadb] rounded-2xl shadow-2xl shadow-[#03541e]/8 overflow-hidden">
                <div className="px-6 py-4 border-b border-[#d7eadb]">
                  <p className="text-xs font-bold uppercase tracking-widest text-[#55705f]">Update Status</p>
                </div>
                <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col sm:flex-row gap-4">
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="flex-1 bg-[#f4fbf6] border border-[#d7eadb] rounded-xl px-4 py-2.5 text-sm text-[#12351f] outline-none focus:border-[#03541e]/50 focus:ring-1 focus:ring-[#03541e]/20 transition-all duration-200 cursor-pointer"
                  >
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                  <button
                    type="submit"
                    className="px-8 py-2.5 rounded-xl font-bold text-sm tracking-widest uppercase transition-all duration-200 bg-[#03541e] hover:bg-[#12351f] text-[#f4fbf6] shadow-lg shadow-[#03541e]/20 hover:shadow-[#03541e]/40 active:scale-[0.98]"
                  >
                    Update Status
                  </button>
                </form>
              </div>

            </div>
          </div>
        </>
      )}
      </AdminShell>
    </>
  );
}

export default UpdateOrder;
