import React, { useEffect, useState } from "react";
import "../OrderStyles/OrderDetails.css";
import PageTitle from "../componant/PageTitle";
import Navbar from "../componant/Navbar";
import Footer from "../componant/Footer";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getOrderDetails, removeError } from "../feature/order/orderSlice";
import {
  createReview,
  removeError as removeProductError,
  removeSuccess as removeReviewSuccess,
} from "../feature/product/productSllice";
import { toast } from "react-toastify";
import Loader from "../componant/Loader";
import jsPDF from "jspdf";
import Rating from "@mui/material/Rating";

function OrderDetails() {
  const [reviewForm, setReviewForm] = useState({
    productId: "",
    productName: "",
    rating: 0,
    comment: "",
  });
  const { orderId } = useParams();
  const { order, loading, error } = useSelector((state) => state.order);
  const { reviewSuccess, reviewLoading, error: productError } = useSelector((state) => state.product);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getOrderDetails(orderId));
    
    return () => {
      dispatch(removeError());
    };
  }, [dispatch, orderId]);

  useEffect(() => {
    if (error) {
      toast.error(error, { position: "top-right", autoClose: 3000 });
    }
  }, [error]);

  useEffect(() => {
    if (productError) {
      toast.error(productError?.message || productError, { position: "top-right", autoClose: 3000 });
      dispatch(removeProductError());
    }
  }, [productError, dispatch]);

  useEffect(() => {
    if (reviewSuccess) {
      toast.success("Review submitted successfully", { position: "top-right", autoClose: 2000 });
      setReviewForm({ productId: "", productName: "", rating: 0, comment: "" });
      dispatch(removeReviewSuccess());
    }
  }, [reviewSuccess, dispatch]);

  const {
    shipingInfo = {},
    orderItem = [],
    paymentInfo = {},
    orderStatus = "processing",
    totalPrice,
    taxPrice,
    shippingPrice,
    itemPrice,
    paidAt,
  } = order;
  
  const shippingInfo = shipingInfo;
  const normalizedPaymentStatus = paymentInfo?.status?.toString().trim().toLowerCase();
  const isPaid =
    ["succeeded", "success", "paid", "captured", "completed", "succed"].includes(normalizedPaymentStatus) ||
    Boolean(paymentInfo?.id) ||
    Boolean(paidAt);
  const paymentStatus = isPaid ? "Paid" : "Not Paid";
  const isDeliveredOrder = (orderStatus || "").toString().trim().toLowerCase() === "delivered";

  const openReviewForm = (item) => {
    setReviewForm({
      productId: item.product,
      productName: item.name,
      rating: 5,
      comment: "",
    });
  };

  const submitReviewHandler = (e) => {
    e.preventDefault();

    if (!isDeliveredOrder) {
      toast.error("You can review only after order is delivered", { position: "top-right", autoClose: 2500 });
      return;
    }

    if (!reviewForm.productId) {
      toast.error("Please select a product to review", { position: "top-right", autoClose: 2500 });
      return;
    }

    if (!reviewForm.rating || Number(reviewForm.rating) < 1 || Number(reviewForm.rating) > 5) {
      toast.error("Rating must be between 1 and 5", { position: "top-right", autoClose: 2500 });
      return;
    }

    if (!reviewForm.comment?.trim()) {
      toast.error("Please write a review comment", { position: "top-right", autoClose: 2500 });
      return;
    }

    if (reviewForm.comment.trim().length < 10) {
      toast.error("Review comment must be at least 10 characters", { position: "top-right", autoClose: 2500 });
      return;
    }

    dispatch(
      createReview({
        rating: Number(reviewForm.rating),
        comment: reviewForm.comment.trim(),
        productId: reviewForm.productId,
      }),
    );
  };


const handleDownload = () => {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const W = 210;
  const H = 297;
  let y = 0;

  // ── Background ──
  doc.setFillColor(15, 23, 42);        // slate-900
  doc.rect(0, 0, W, H, "F");

  // ── Left accent bar ──
  doc.setFillColor(251, 191, 36);      // amber-400
  doc.rect(0, 0, 3, H, "F");

  // ── Top header band ──
  doc.setFillColor(30, 41, 59);        // slate-800
  doc.rect(0, 0, W, 38, "F");
  doc.setFillColor(251, 191, 36);
  doc.rect(0, 36, W, 2, "F");

  // ── Brand / Title ──
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(255, 255, 255);
  doc.text("ORDER DETAILS", 14, 18);

  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);     // slate-400
  doc.setFont("helvetica", "normal");
  doc.text(`Order ID: #${orderId}`, 14, 26);
  doc.text(`Downloaded: ${new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}`, 14, 32);

  // Status badge top-right
  const statusColor =
    orderStatus === "Delivered" ? [74, 222, 128] :
    orderStatus === "Shipped"   ? [96, 165, 250] :
                                  [251, 191, 36];
  doc.setFillColor(...statusColor);
  doc.roundedRect(W - 50, 12, 38, 10, 3, 3, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text((orderStatus || "Processing").toUpperCase(), W - 31, 18.5, { align: "center" });

  y = 48;

  // ── Section helper ──
  const drawSection = (title, icon, callback) => {
    // Section header bg
    doc.setFillColor(30, 41, 59);
    doc.roundedRect(10, y, W - 20, 10, 2, 2, "F");
    doc.setFillColor(251, 191, 36);
    doc.roundedRect(10, y, 3, 10, 1, 1, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(251, 191, 36);
    doc.text(title.toUpperCase(), 17, y + 6.5);
    y += 14;
    callback();
    y += 6;
  };

  // ── Row helper ──
  const drawRow = (label, value, highlight = false, isHeader = false) => {
    if (isHeader) {
      doc.setFillColor(15, 23, 42);
      doc.rect(10, y, W - 20, 8, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7);
      doc.setTextColor(251, 191, 36);
      ["IMAGE", "NAME", "QTY", "PRICE"].forEach((h, i) => {
        const xPos = [14, 42, 130, 165][i];
        doc.text(h, xPos, y + 5.5);
      });
      y += 9;
      return;
    }

    if (highlight) {
      doc.setFillColor(251, 191, 36, 0.15);
      doc.setFillColor(45, 35, 15);
      doc.roundedRect(10, y, W - 20, 9, 1.5, 1.5, "F");
      doc.setFillColor(251, 191, 36);
      doc.roundedRect(10, y, 2, 9, 0.5, 0.5, "F");
    } else {
      doc.setFillColor(22, 31, 47);
      doc.roundedRect(10, y, W - 20, 8, 1.5, 1.5, "F");
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);   // slate-500
    doc.text(label, 15, y + (highlight ? 6 : 5.5));

    doc.setFont("helvetica", highlight ? "bold" : "normal");
    doc.setFontSize(highlight ? 9 : 8);
    doc.setTextColor(highlight ? 251 : 203, highlight ? 191 : 213, highlight ? 36 : 225);
    doc.text(String(value), W - 15, y + (highlight ? 6 : 5.5), { align: "right" });
    y += highlight ? 11 : 10;
  };

  // ── ORDER ITEMS ──
  drawSection("Order Items", "", () => {
    drawRow("", "", false, true); // header row
    orderItem.forEach((item, idx) => {
      const isLast = idx === orderItem.length - 1;
      doc.setFillColor(22, 31, 47);
      doc.roundedRect(10, y, W - 20, 12, 1.5, 1.5, "F");

      // item color dot
      doc.setFillColor(251, 191, 36);
      doc.circle(17, y + 6, 1.5, "F");

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(203, 213, 225);
      doc.text(item.name, 22, y + 5);

      doc.setFontSize(7);
      doc.setTextColor(100, 116, 139);
      doc.text(`Product`, 22, y + 9.5);

      // Qty badge
      doc.setFillColor(15, 23, 42);
      doc.roundedRect(128, y + 2, 14, 8, 2, 2, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(255, 255, 255);
      doc.text(`x${item.quantity}`, 135, y + 7.5, { align: "center" });

      // Price
      doc.setTextColor(251, 191, 36);
      doc.setFontSize(9);
      doc.text(`Rs.${item.price}/-`, W - 15, y + 7, { align: "right" });

      y += 14;
      if (!isLast) {
        doc.setDrawColor(30, 41, 59);
        doc.setLineWidth(0.3);
        doc.line(14, y - 1, W - 14, y - 1);
      }
    });
  });

  // ── SHIPPING INFO ──
  drawSection("Shipping Info", "", () => {
    doc.setFillColor(22, 31, 47);
    doc.roundedRect(10, y, W - 20, 22, 2, 2, "F");

    doc.setFillColor(251, 191, 36);
    doc.roundedRect(10, y, 2, 22, 1, 1, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(251, 191, 36);
    doc.text("ADDRESS", 16, y + 6);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(203, 213, 225);
    const address = `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.state}, ${shippingInfo.country} - ${shippingInfo.pincode}`;
    const lines = doc.splitTextToSize(address, W - 50);
    doc.text(lines, 16, y + 12);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(251, 191, 36);
    doc.text("PHONE", W - 50, y + 6);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(203, 213, 225);
    doc.text(String(shippingInfo.phoneNo), W - 50, y + 12);
    y += 26;
  });

  // ── ORDER SUMMARY ──
  drawSection("Order Summary", "", () => {
    const payColor = paymentStatus === "Paid" ? [74, 222, 128] : [248, 113, 113];

    drawRow("Order Status", orderStatus || "Processing");
    
    // Payment status with colored badge
    doc.setFillColor(22, 31, 47);
    doc.roundedRect(10, y, W - 20, 8, 1.5, 1.5, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text("PAYMENT STATUS", 15, y + 5.5);
    doc.setFillColor(...payColor);
    doc.roundedRect(W - 42, y + 1.5, 30, 5.5, 1.5, 1.5, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(15, 23, 42);
    doc.text(paymentStatus, W - 27, y + 5.5, { align: "center" });
    y += 10;

    drawRow("Paid At", paidAt ? new Date(paidAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "N/A");

    // Divider
    doc.setDrawColor(51, 65, 85);
    doc.setLineWidth(0.4);
    doc.line(14, y, W - 14, y);
    y += 5;

    drawRow("Item Price", `Rs.${itemPrice || 0}/-`);
    drawRow("Tax Price", `Rs.${taxPrice || 0}/-`);
    drawRow("Shipping Price", `Rs.${shippingPrice || 0}/-`);

    // Divider
    doc.setDrawColor(51, 65, 85);
    doc.line(14, y, W - 14, y);
    y += 4;

    drawRow("Total Price", `Rs.${totalPrice || 0}/-`, true);
  });

  // ── Footer ──
  doc.setFillColor(30, 41, 59);
  doc.rect(0, H - 16, W, 16, "F");
  doc.setFillColor(251, 191, 36);
  doc.rect(0, H - 16, W, 1, "F");
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text("Thank you for your order!", W / 2, H - 8, { align: "center" });
  doc.text(`Generated on ${new Date().toLocaleString("en-IN")}`, W / 2, H - 3.5, { align: "center" });

  doc.save(`order-${orderId}.pdf`);
};
  return (
<>
  <Navbar />
  <PageTitle title={orderId} />

  {loading ? (<Loader />) : (

    <div className="min-h-screen bg-gradient-to-br from-[#f4fbf6] via-[#eaf7ed] to-[#f4fbf6] px-4 py-16">
      <div className="max-w-4xl mx-auto flex flex-col gap-6">

        {/* Page Header */}
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 rounded-full bg-[#03541e]" />
          <div>
            <h1 className="text-2xl font-bold text-[#12351f] tracking-tight">Order Details</h1>
            <p className="text-xs text-[#55705f] font-mono mt-0.5">#{orderId}</p>
          </div>
        </div>

        {/* ── Order Items ── */}
        <div className="bg-[#ffffff] backdrop-blur-sm border border-[#d7eadb] rounded-2xl shadow-2xl shadow-[#03541e]/8 overflow-hidden">

          {/* Card Header */}
          <div className="px-6 py-4 border-b border-[#d7eadb] flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#03541e]/10 border border-[#03541e]/20 flex items-center justify-center">
                <svg className="w-4 h-4 text-[#03541e]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
                </svg>
              </div>
              <h2 className="text-sm font-bold uppercase tracking-widest text-[#12351f]">Order Items</h2>
            </div>

            {/* Download Button */}
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#03541e]/10 border border-[#03541e]/20 text-[#03541e] text-xs font-bold uppercase tracking-widest hover:bg-[#03541e]/20 hover:border-[#03541e]/40 transition-all duration-200 active:scale-95"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              Download Order
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#d7eadb]">
                  <th className="text-left px-6 py-3 text-xs font-bold uppercase tracking-widest text-[#03541e]/80">Image</th>
                  <th className="text-left px-6 py-3 text-xs font-bold uppercase tracking-widest text-[#03541e]/80">Name</th>
                  <th className="text-center px-6 py-3 text-xs font-bold uppercase tracking-widest text-[#03541e]/80">Quantity</th>
                  <th className="text-center px-6 py-3 text-xs font-bold uppercase tracking-widest text-[#03541e]/80">Price</th>
                  <th className="text-center px-6 py-3 text-xs font-bold uppercase tracking-widest text-[#03541e]/80">Review</th>
                </tr>
              </thead>
              <tbody>
                {orderItem.map((item, index) => (
                  <tr
                    key={item.product || item._id}
                    className={`hover:bg-[#f4fbf6] transition-colors duration-150 ${index !== orderItem.length - 1 ? "border-b border-[#d7eadb]/60" : ""}`}
                  >
                    <td className="px-6 py-3">
                      <div className="w-14 h-14 rounded-xl overflow-hidden border border-[#d7eadb] bg-[#f4fbf6] shrink-0">
                        <img
                          src={item.image}
                          alt="Product"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-3 text-[#12351f] font-medium">{item.name}</td>
                    <td className="px-6 py-3 text-center">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-[#f4fbf6] border border-[#d7eadb] text-xs font-bold text-[#12351f]">
                        {item.quantity}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-center">
                      <span className="text-[#03541e] font-bold">₹{item.price}/-</span>
                    </td>
                    <td className="px-6 py-3 text-center">
                      {isDeliveredOrder ? (
                        <button
                          type="button"
                          onClick={() => openReviewForm(item)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest border border-[#03541e]/30 text-[#03541e] hover:bg-[#03541e]/10 transition-all duration-200"
                        >
                          {reviewForm.productId === item.product ? "Editing" : "Add / Update"}
                        </button>
                      ) : (
                        <span className="text-[10px] text-[#55705f]">After delivery</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {reviewForm.productId && (
            <form onSubmit={submitReviewHandler} className="px-6 py-5 border-t border-[#d7eadb] flex flex-col gap-3 bg-[#f4fbf6]/50">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-bold uppercase tracking-widest text-[#12351f]">
                  Review Product: <span className="text-[#03541e]">{reviewForm.productName}</span>
                </p>
                <button
                  type="button"
                  onClick={() => setReviewForm({ productId: "", productName: "", rating: 0, comment: "" })}
                  className="text-[10px] font-bold uppercase tracking-widest text-[#55705f] hover:text-red-500 transition-colors duration-200"
                >
                  Close
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div className="md:col-span-1">
                  <label className="text-[10px] uppercase tracking-widest text-[#55705f] font-bold">Rating</label>
                  <div className="mt-1 w-full bg-[#ffffff] border border-[#d7eadb] rounded-lg px-3 py-2 min-h-10.5 flex items-center">
                    <Rating
                      name="order-product-rating"
                      value={Number(reviewForm.rating) || 0}
                      onChange={(_, newValue) =>
                        setReviewForm((prev) => ({ ...prev, rating: newValue || 0 }))
                      }
                      precision={1}
                      size="small"
                    />
                  </div>
                </div>

                <div className="md:col-span-3">
                  <label className="text-[10px] uppercase tracking-widest text-[#55705f] font-bold">Comment</label>
                  <input
                    type="text"
                    value={reviewForm.comment}
                    onChange={(e) => setReviewForm((prev) => ({ ...prev, comment: e.target.value }))}
                    placeholder="Write your review"
                    className="mt-1 w-full bg-[#ffffff] border border-[#d7eadb] rounded-lg px-3 py-2 text-sm text-[#12351f] outline-none focus:border-[#03541e]/50 placeholder-[#55705f]"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={reviewLoading}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#03541e]/10 border border-[#03541e]/20 text-[#03541e] text-xs font-bold uppercase tracking-widest hover:bg-[#03541e]/20 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {reviewLoading ? "Saving..." : "Submit Review"}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* ── Shipping Info ── */}
        <div className="bg-[#ffffff] backdrop-blur-sm border border-[#d7eadb] rounded-2xl shadow-2xl shadow-[#03541e]/8 overflow-hidden">

          <div className="px-6 py-4 border-b border-[#d7eadb] flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#03541e]/10 border border-[#03541e]/20 flex items-center justify-center">
              <svg className="w-4 h-4 text-[#03541e]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
            </div>
            <h2 className="text-sm font-bold uppercase tracking-widest text-[#12351f]">Shipping Info</h2>
          </div>

          <div className="p-6 flex flex-col gap-3">
            <div className="flex items-start gap-4 p-4 rounded-xl bg-[#f4fbf6] border border-[#d7eadb]">
              <span className="text-xs font-bold uppercase tracking-widest text-[#03541e]/80 w-16 shrink-0 pt-0.5">Address</span>
              <span className="text-sm text-[#12351f]">
                {shippingInfo.address}, {shippingInfo.city}, {shippingInfo.state}, {shippingInfo.country}, {shippingInfo.pincode}
              </span>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-xl bg-[#f4fbf6] border border-[#d7eadb]">
              <span className="text-xs font-bold uppercase tracking-widest text-[#03541e]/80 w-16 shrink-0">Phone</span>
              <span className="text-sm text-[#12351f]">{shippingInfo.phoneNo}</span>
            </div>
          </div>
        </div>

        {/* ── Order Summary ── */}
        <div className="bg-[#ffffff] backdrop-blur-sm border border-[#d7eadb] rounded-2xl shadow-2xl shadow-[#03541e]/8 overflow-hidden">

          <div className="px-6 py-4 border-b border-[#d7eadb] flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#03541e]/10 border border-[#03541e]/20 flex items-center justify-center">
              <svg className="w-4 h-4 text-[#03541e]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 14.25l6-6m4.5-3.493V21.75l-3.75-1.5-3.75 1.5-3.75-1.5-3.75 1.5V4.757c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0c1.1.128 1.907 1.077 1.907 2.185z" />
              </svg>
            </div>
            <h2 className="text-sm font-bold uppercase tracking-widest text-[#12351f]">Order Summary</h2>
          </div>

          <div className="p-6 flex flex-col gap-2.5">

            {/* Order Status */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#f4fbf6] border border-[#d7eadb]">
              <span className="text-xs font-bold uppercase tracking-widest text-[#55705f]">Order Status</span>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold
                ${orderStatus === "Delivered"
                  ? "bg-green-400/10 border border-green-400/20 text-green-600"
                  : orderStatus === "Shipped"
                  ? "bg-blue-400/10 border border-blue-400/20 text-blue-600"
                  : "bg-[#03541e]/10 border border-[#03541e]/20 text-[#03541e]"
                }`}>
                <span className={`w-1.5 h-1.5 rounded-full
                  ${orderStatus === "Delivered" ? "bg-green-500"
                  : orderStatus === "Shipped" ? "bg-blue-500"
                  : "bg-[#03541e] animate-pulse"}`}
                />
                {orderStatus || "Processing"}
              </span>
            </div>

            {/* Payment Status */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#f4fbf6] border border-[#d7eadb]">
              <span className="text-xs font-bold uppercase tracking-widest text-[#55705f]">Payment Status</span>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold
                ${paymentStatus === "Paid"
                  ? "bg-green-400/10 border border-green-400/20 text-green-600"
                  : "bg-red-400/10 border border-red-400/20 text-red-500"
                }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${paymentStatus === "Paid" ? "bg-green-500" : "bg-red-500"}`} />
                {paymentStatus}
              </span>
            </div>

            {/* Paid At */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#f4fbf6] border border-[#d7eadb]">
              <span className="text-xs font-bold uppercase tracking-widest text-[#55705f]">Paid At</span>
              <span className="text-sm text-[#12351f]">{paidAt ? new Date(paidAt).toLocaleDateString() : "N/A"}</span>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 my-1">
              <div className="flex-1 h-px bg-[#d7eadb]" />
              <div className="w-1.5 h-1.5 rotate-45 bg-[#03541e]/30 shrink-0" />
              <div className="flex-1 h-px bg-[#d7eadb]" />
            </div>

            {/* Item Price */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#f4fbf6] border border-[#d7eadb]">
              <span className="text-xs font-bold uppercase tracking-widest text-[#55705f]">Item Price</span>
              <span className="text-sm text-[#12351f]">₹{itemPrice || 0}/-</span>
            </div>

            {/* Tax Price */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#f4fbf6] border border-[#d7eadb]">
              <span className="text-xs font-bold uppercase tracking-widest text-[#55705f]">Tax Price</span>
              <span className="text-sm text-[#12351f]">₹{taxPrice || 0}/-</span>
            </div>

            {/* Shipping Price */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#f4fbf6] border border-[#d7eadb]">
              <span className="text-xs font-bold uppercase tracking-widest text-[#55705f]">Shipping Price</span>
              <span className="text-sm text-[#12351f]">₹{shippingPrice || 0}/-</span>
            </div>

            {/* Total Price — highlighted */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-[#03541e] border border-[#03541e] mt-1">
              <span className="text-xs font-bold uppercase tracking-widest text-[#adf0be]">Total Price</span>
              <span className="text-lg font-bold text-[#adf0be]">₹{totalPrice || 0}/-</span>
            </div>

          </div>
        </div>

      </div>
    </div>
  )}

  <Footer />
</>
  );
}

export default OrderDetails;
