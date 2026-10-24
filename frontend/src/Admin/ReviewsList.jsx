import React, { useEffect, useRef, useState } from "react";
import "../AdminStyles/ReviewsList.css";
import PageTitle from "../componant/PageTitle";
import { useDispatch, useSelector } from "react-redux";
import {
  clearMessage,
  deleteReview,
  fetchAllProducts,
  fetchProductReview,
  removeError,
  removeSuccess,
} from "../feature/admin/adminSlice";
import { toast } from "react-toastify";
import Loader from "../componant/Loader";
import AdminShell from "./components/AdminShell";
import ReviewsModal from "./ReviewsModal";

function ReviewsList() {
  const { products, loading, error, reviews, success, message } = useSelector(
    (state) => state.admin,
  );
  const [selectedProduct, setSelectedProduct] = useState(null);
  const triggerRef = useRef(null);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  const handleDeleteReview = (productId, reviewId) => {
    const confirm = window.confirm(" Are you sure to delete this review?");
    if (confirm) {
      dispatch(deleteReview({ productId, reviewId }));
    }
  };
  useEffect(() => {
    if (error) {
      toast.error(error?.message || error, {
        position: "top-right",
        autoClose: 2000,
      });
      dispatch(removeError());
    }
    if (success) {
      toast.success(message, {
        position: "top-right",
        autoClose: 2000,
      });
      dispatch(removeSuccess());
      dispatch(clearMessage());
      dispatch(fetchAllProducts());
      if (selectedProduct?._id) dispatch(fetchProductReview(selectedProduct._id));
    }
  }, [error, dispatch, success, message, selectedProduct]);

  if (!products || products.length === 0) {
    return (
      <>
        <PageTitle title="All Reviews" />
        <AdminShell>
          <div className="reviews-list-container">
            <h1 className="reviews-list-title">Admin Reviews</h1>
            <p>No products found.</p>
          </div>
        </AdminShell>
      </>
    );
  }

  const handleViewRevies = (productId, trigger) => {
    const product = products.find((item) => item._id === productId);
    triggerRef.current = trigger;
    setSelectedProduct(product || null);
    dispatch(fetchProductReview(productId));
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
    triggerRef.current?.focus();
  };
  return (
<>
      <PageTitle title="All Reviews" />
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
                <h1 className="text-2xl font-bold text-[#12351f] tracking-tight">Product Reviews</h1>
              </div>

              {/* ── Products Table ── */}
              <div className="bg-[#ffffff] backdrop-blur-sm border border-[#d7eadb] rounded-2xl shadow-2xl shadow-[#03541e]/8 overflow-hidden">
                <div className="px-6 py-4 border-b border-[#d7eadb]">
                  <p className="text-xs font-bold uppercase tracking-widest text-[#55705f]">All Products</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[#d7eadb]">
                        <th className="text-left px-6 py-3 text-xs font-bold uppercase tracking-widest text-[#03541e]/80">Sl No.</th>
                        <th className="text-left px-6 py-3 text-xs font-bold uppercase tracking-widest text-[#03541e]/80">Product Name</th>
                        <th className="text-left px-6 py-3 text-xs font-bold uppercase tracking-widest text-[#03541e]/80">Image</th>
                        <th className="text-left px-6 py-3 text-xs font-bold uppercase tracking-widest text-[#03541e]/80">No. of Reviews</th>
                        <th className="text-left px-6 py-3 text-xs font-bold uppercase tracking-widest text-[#03541e]/80">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#d7eadb]">
                      {products.map((product, index) => (
                        <tr key={product._id} className="hover:bg-[#f4fbf6] transition-all duration-150">

                          <td className="px-6 py-4 text-[#55705f]">{index + 1}</td>

                          <td className="px-6 py-4 text-[#12351f] font-medium">{product.name}</td>

                          <td className="px-6 py-4">
                            <div className="w-12 h-12 rounded-xl overflow-hidden border border-[#d7eadb] bg-[#f4fbf6]">
                              <img
                                src={product?.image?.[0]?.url || "/images/no-products.png"}
                                alt="Product-Image"
                                className="w-full h-full object-cover object-center"
                              />
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-[#eaf7ed] border border-[#d7eadb] text-[#12351f]">
                              {product.numOfReview}
                            </span>
                          </td>

                          <td className="px-6 py-4">
                            {product.numOfReview > 0 && (
                              <button
                                onClick={(event) => handleViewRevies(product._id, event.currentTarget)}
                                className="reviews-view-button px-4 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#03541e] border border-[#03541e] text-[#f4fbf6] transition-all duration-200"
                              >
                                View Reviews
                              </button>
                            )}
                          </td>

                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          </div>
        </>
      )}
      </AdminShell>
      {selectedProduct && (
        <ReviewsModal
          product={selectedProduct}
          reviews={reviews}
          loading={loading}
          onClose={handleCloseModal}
          onDelete={handleDeleteReview}
        />
      )}
    </>
  );
}

export default ReviewsList;
