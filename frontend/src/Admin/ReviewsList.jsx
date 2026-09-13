import React, { useEffect, useState } from "react";
import "../AdminStyles/ReviewsList.css";
import PageTitle from "../componant/PageTitle";
import { Delete } from "@mui/icons-material";
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
import { useNavigate } from "react-router-dom";
import AdminShell from "./components/AdminShell";

function ReviewsList() {
  const { products, loading, error, reviews, success, message } = useSelector(
    (state) => state.admin,
  );
  const navigate= useNavigate()
  const [selectedProduct, setSelectedProduct] = useState(null);
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
      navigate('/admin/reviews')
    }
  }, [error, dispatch, success, message]);

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

  const handleViewRevies = (productId) => {
    setSelectedProduct(productId);
    dispatch(fetchProductReview(productId));
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
                                onClick={() => handleViewRevies(product._id)}
                                className="px-4 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#03541e] border border-[#03541e] text-[#f4fbf6] hover:bg-[#12351f] transition-all duration-200"
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

              {/* ── Reviews For Selected Product ── */}
              {selectedProduct && reviews && reviews.length > 0 && (
                <div className="bg-[#ffffff] backdrop-blur-sm border border-[#d7eadb] rounded-2xl shadow-2xl shadow-[#03541e]/8 overflow-hidden">
                  <div className="px-6 py-4 border-b border-[#d7eadb]">
                    <p className="text-xs font-bold uppercase tracking-widest text-[#55705f]">Reviews For Product</p>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-[#d7eadb]">
                          <th className="text-left px-6 py-3 text-xs font-bold uppercase tracking-widest text-[#03541e]/80">Sl No.</th>
                          <th className="text-left px-6 py-3 text-xs font-bold uppercase tracking-widest text-[#03541e]/80">Reviewer Name</th>
                          <th className="text-left px-6 py-3 text-xs font-bold uppercase tracking-widest text-[#03541e]/80">Rating</th>
                          <th className="text-left px-6 py-3 text-xs font-bold uppercase tracking-widest text-[#03541e]/80">Comment</th>
                          <th className="text-left px-6 py-3 text-xs font-bold uppercase tracking-widest text-[#03541e]/80">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#d7eadb]">
                        {reviews.length > 0 ? (
                          reviews.map((review, index) => (
                            <tr key={review._id} className="hover:bg-[#f4fbf6] transition-all duration-150">

                              <td className="px-6 py-4 text-[#55705f]">{index + 1}</td>

                              <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                  <div className="w-8 h-8 rounded-full bg-[#03541e]/10 border border-[#03541e]/20 flex items-center justify-center text-xs font-bold text-[#03541e]">
                                    {review.name?.charAt(0).toUpperCase()}
                                  </div>
                                  <span className="text-[#12351f] font-medium">{review.name}</span>
                                </div>
                              </td>

                              <td className="px-6 py-4">
                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-[#03541e]/10 border border-[#03541e]/20 text-[#03541e]">
                                  ★ {review.rating}
                                </span>
                              </td>

                              <td className="px-6 py-4 text-[#12351f] max-w-xs truncate">{review.comment}</td>

                              <td className="px-6 py-4">
                                <button
                                  onClick={() => handleDeleteReview(selectedProduct, review._id)}
                                  className="w-8 h-8 rounded-lg flex items-center justify-center border border-red-500/30 text-red-500 hover:bg-red-500/10 transition-all duration-200"
                                >
                                  <Delete style={{fontSize: 16}} />
                                </button>
                              </td>

                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="5" className="px-6 py-12 text-center text-sm text-[#55705f]">
                              {selectedProduct ? "No reviews for this product" : "Click View Reviews to load reviews"}
                            </td>
                          </tr>
                        )}
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

export default ReviewsList;
