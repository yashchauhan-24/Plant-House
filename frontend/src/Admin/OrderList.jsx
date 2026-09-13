import React, { useEffect, useState } from "react";
import "../AdminStyles/OrdersList.css";
import PageTitle from "../componant/PageTitle";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Delete, Download, Edit } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { clearMessage, deleteOrder, fetchAllOrders, removeError, removeSuccess, confirmOrderCancellation } from "../feature/admin/adminSlice";
import { toast } from "react-toastify";
import Loader from "../componant/Loader";
import AdminShell from "./components/AdminShell";

function OrderList() {
  const [activeTab, setActiveTab] = useState("all"); // "all" or "cancelled"
  const { orders, loading, error, success, message } = useSelector((state) => state.admin);
  console.log(orders);

  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);

  useEffect(() => {
    if (location.pathname.includes("/admin/orders/cancelled")) {
      setActiveTab("cancelled");
    } else {
      setActiveTab("all");
    }
  }, [location.pathname]);

  useEffect(() => {
    if (error) {
      toast.error(error?.message || error, {
        position: "top-right",
        autoClose: 2000,
        toastId: "order-fetch-error",
      });
      dispatch(removeError());
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (success) {
      toast.success(message, {
        position: "top-right",
        autoClose: 2000,
      });
      dispatch(removeSuccess());
      dispatch(clearMessage());
      dispatch(fetchAllOrders());
    }
  }, [success, message, dispatch]);

  const handleDelete = (id) => {
    const confirm = window.confirm("Are You sure want to delete this order?");
    if (confirm) {
      dispatch(deleteOrder(id));
    }
  };

  const handleConfirmCancellation = (id) => {
    const confirm = window.confirm("Confirm cancellation for this order?");
    if (confirm) {
      dispatch(confirmOrderCancellation(id));
    }
  };

  const handleChangeTab = (tab) => {
    setActiveTab(tab);
    if (tab === "cancelled") {
      navigate("/admin/orders/cancelled");
      return;
    }
    navigate("/admin/orders/confirmed");
  };

  // Filter orders based on tab
  const activeOrders = orders?.filter(order => !order.isCancelled) || [];
  const cancelledOrders = orders?.filter(order => order.isCancelled) || [];
  const displayedOrders = activeTab === "all" ? activeOrders : cancelledOrders;

  const handleDownloadExcel = () => {
    if (!displayedOrders.length) {
      toast.error("No orders available to download", {
        position: "top-right",
        autoClose: 2000,
      });
      return;
    }

    const isCancelledTab = activeTab === "cancelled";
    const fileName = isCancelledTab ? "cancelled-orders.xls" : "confirmed-orders.xls";
    const title = isCancelledTab ? "Cancelled Orders" : "Confirmed Orders";

    const headerCells = isCancelledTab
      ? ["Sl No.", "Order ID", "Status", "Cancelled By", "Total Price", "Items"]
      : ["Sl No.", "Order ID", "Status", "Total Price", "Items"];

    const rows = displayedOrders
      .map((order, index) => {
        const baseCells = [
          index + 1,
          order._id,
          order.orderStatus,
          Number(order.totalPrice || 0).toFixed(2),
          (order.orderItem || []).length,
        ];

        const finalCells = isCancelledTab
          ? [
              baseCells[0],
              baseCells[1],
              baseCells[2],
              order.cancelledBy === "user" ? "User" : "Admin",
              baseCells[3],
              baseCells[4],
            ]
          : baseCells;

        return `<tr>${finalCells.map((cell) => `<td>${cell}</td>`).join("")}</tr>`;
      })
      .join("");

    const tableHtml = `
      <table border="1">
        <thead>
          <tr><th colspan="${headerCells.length}">${title}</th></tr>
          <tr>${headerCells.map((header) => `<th>${header}</th>`).join("")}</tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    `;

    const blob = new Blob([tableHtml], {
      type: "application/vnd.ms-excel;charset=utf-8;",
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };
  return (
<>
      <PageTitle title="All Orders" />
      <AdminShell>
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="px-0">
            <div className="w-full flex flex-col gap-6">

              {/* Heading */}
              <div className="flex items-center gap-2">
                <div className="w-1 h-6 rounded-full bg-[#03541e]" />
                <h1 className="text-2xl font-bold text-[#12351f] tracking-tight">All Orders</h1>
              </div>

              {/* Tab Navigation */}
              <div className="flex items-end justify-between gap-3 border-b border-[#03541e]/20">
                <div className="flex gap-3">
                  <button
                    onClick={() => handleChangeTab("all")}
                    className={`px-4 py-3 text-sm font-bold uppercase tracking-widest transition-all duration-200 border-b-2 ${
                      activeTab === "all"
                        ? "border-[#03541e] text-[#03541e]"
                        : "border-transparent text-[#55705f] hover:text-[#12351f]"
                    }`}
                  >
                    ✓ Confirmed Orders <span className="ml-2 text-xs opacity-70">({activeOrders.length})</span>
                  </button>
                  <button
                    onClick={() => handleChangeTab("cancelled")}
                    className={`px-4 py-3 text-sm font-bold uppercase tracking-widest transition-all duration-200 border-b-2 ${
                      activeTab === "cancelled"
                        ? "border-red-500 text-red-500"
                        : "border-transparent text-[#55705f] hover:text-[#12351f]"
                    }`}
                  >
                    ✕ Cancelled Orders <span className="ml-2 text-xs opacity-70">({cancelledOrders.length})</span>
                  </button>
                </div>

                <button
                  onClick={handleDownloadExcel}
                  className="mb-2 inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-emerald-500/30 text-emerald-600 hover:bg-emerald-500/10 transition-all duration-200 text-xs font-bold uppercase tracking-widest"
                  title={`Download ${activeTab === "all" ? "Confirmed" : "Cancelled"} Orders`}
                >
                  <Download style={{ fontSize: 14 }} />
                  Download Excel
                </button>
              </div>

              {/* Empty State */}
              {displayedOrders && displayedOrders.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-[#eaf7ed] border border-[#d7eadb] flex items-center justify-center">
                    <svg className="w-6 h-6 text-[#55705f]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694 4.125-8.25 4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m0 0C5.25 5.547 8.694 5 12 5c3.306 0 6.75.547 8.25 1.375" />
                    </svg>
                  </div>
                  <p className="text-sm text-[#55705f]">
                    {activeTab === "all" ? "No confirmed orders" : "No cancelled orders"}
                  </p>
                </div>
              )}

              {/* Table */}
              {displayedOrders && displayedOrders.length > 0 && (
                <div className="bg-[#ffffff] backdrop-blur-sm border border-[#d7eadb] rounded-2xl shadow-2xl shadow-[#03541e]/8 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-[#d7eadb]">
                          <th className="text-left px-6 py-3 text-xs font-bold uppercase tracking-widest text-[#03541e]/80">Sl No.</th>
                          <th className="text-left px-6 py-3 text-xs font-bold uppercase tracking-widest text-[#03541e]/80">Order ID</th>
                          <th className="text-left px-6 py-3 text-xs font-bold uppercase tracking-widest text-[#03541e]/80">Status</th>
                          {activeTab === "cancelled" && (
                            <th className="text-left px-6 py-3 text-xs font-bold uppercase tracking-widest text-[#03541e]/80">Cancelled By</th>
                          )}
                          <th className="text-left px-6 py-3 text-xs font-bold uppercase tracking-widest text-[#03541e]/80">Total Price</th>
                          <th className="text-left px-6 py-3 text-xs font-bold uppercase tracking-widest text-[#03541e]/80">Items</th>
                          <th className="text-left px-6 py-3 text-xs font-bold uppercase tracking-widest text-[#03541e]/80">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#d7eadb]">
                        {displayedOrders.map((order, index) => (
                          <tr key={order._id} className="hover:bg-[#f4fbf6] transition-all duration-150">

                            <td className="px-6 py-4 text-[#55705f]">{index + 1}</td>

                            <td className="px-6 py-4 text-[#12351f] font-mono text-xs">{order._id}</td>

                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold
                                ${order.orderStatus.toLowerCase() === 'delivered'
                                  ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-600'
                                  : order.orderStatus.toLowerCase() === 'processing'
                                    ? 'bg-[#03541e]/10 border border-[#03541e]/20 text-[#03541e]'
                                    : order.orderStatus.toLowerCase() === 'shipped'
                                      ? 'bg-blue-500/10 border border-blue-500/20 text-blue-600'
                                      : 'bg-red-500/10 border border-red-500/20 text-red-500'
                                }`}>
                                <span className={`w-1.5 h-1.5 rounded-full
                                  ${order.orderStatus.toLowerCase() === 'delivered' ? 'bg-emerald-500'
                                    : order.orderStatus.toLowerCase() === 'processing' ? 'bg-[#03541e] animate-pulse'
                                    : order.orderStatus.toLowerCase() === 'shipped' ? 'bg-blue-500'
                                    : 'bg-red-500'}`}
                                />
                                {order.orderStatus}
                              </span>
                            </td>

                            {/* Cancelled By Column - Only show for cancelled orders */}
                            {activeTab === "cancelled" && (
                              <td className="px-6 py-4 text-xs font-semibold">
                                <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded
                                  ${order.cancelledBy === "user"
                                    ? "bg-orange-500/10 text-orange-500"
                                    : "bg-purple-500/10 text-purple-500"}`}>
                                  {order.cancelledBy === "user" ? "User" : "Admin"}
                                </span>
                              </td>
                            )}

                            <td className="px-6 py-4 text-[#03541e] font-bold">₹{order.totalPrice.toFixed(2)}</td>

                            <td className="px-6 py-4 text-[#12351f]">{order.orderItem.length}</td>

                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                {activeTab === "all" ? (
                                  // Confirmed Orders - Edit & Delete buttons
                                  <>
                                    <Link
                                      to={`/admin/order/${order._id}`}
                                      className="w-8 h-8 rounded-lg flex items-center justify-center border border-emerald-500/30 text-emerald-600 hover:bg-emerald-500/10 transition-all duration-200"
                                      title="Edit order"
                                    >
                                      <Edit style={{fontSize: 16}} />
                                    </Link>
                                    <button
                                      onClick={() => handleDelete(order._id)}
                                      className="w-8 h-8 rounded-lg flex items-center justify-center border border-red-500/30 text-red-500 hover:bg-red-500/10 transition-all duration-200"
                                      title="Cancel order"
                                    >
                                      <Delete style={{fontSize: 16}} />
                                    </button>
                                  </>
                                ) : (
                                  // Cancelled Orders - Confirm & Cancel buttons
                                  <>
                                    <button
                                      onClick={() => handleConfirmCancellation(order._id)}
                                      className="px-3 py-1.5 rounded-lg flex items-center justify-center border border-green-500/30 text-green-600 hover:bg-green-500/10 transition-all duration-200 text-xs font-semibold"
                                      title="Confirm cancellation"
                                    >
                                      ✓ Confirm
                                    </button>
                                    <button
                                      onClick={() => handleDelete(order._id)}
                                      className="px-3 py-1.5 rounded-lg flex items-center justify-center border border-red-500/30 text-red-500 hover:bg-red-500/10 transition-all duration-200 text-xs font-semibold"
                                      title="Revert cancellation"
                                    >
                                      ✕ Revert
                                    </button>
                                  </>
                                )}
                              </div>
                            </td>

                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

            </div>
          </div>
        </>
      )}
      </AdminShell>
    </>
  );
}

export default OrderList;
