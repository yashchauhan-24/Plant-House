import React, { useEffect, useMemo, useState } from "react";
import "../PageStyles/ProductDetails.css";
import PageTitle from "../componant/PageTitle";
import Navbar from "../componant/Navbar";
import Footer from "../componant/Footer";
import Rating from "@mui/material/Rating";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  createReview,
  getProductDetails,
  removeError,
  removeSuccess,
} from "../feature/product/productSllice";
import { toast } from "react-toastify";
import Loader from "../componant/Loader";
import { addItemsToCart, removeError as removeCartError, removeMessage } from "../feature/cart/cartSlice.js";
import { toggleWishlistItem } from "../feature/wishlist/wishlistSlice";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import useFormValidation from "../utils/useFormValidation";

function ProductDetails() {
  const [selectImage, setSelectImage]=useState("")
  const [comment, setComment]= useState("")
  const [userRatin, setUserRating] = useState(0);
  const [quantity , setQuantity] = useState(1)
  const { loading, error, product, reviewSuccess, reviewLoading } = useSelector((state) => state.product);
  const { loading: cartLoading, error: cartError, success, message } = useSelector((state) => state.cart);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);
  const { isAuthenticated } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  // --- Dynamic Rating Calculations ---
  const totalReviews = product?.reviews?.length || 0;
  
  // 1. Calculate Average Rating
  const averageRating = totalReviews > 0 
    ? (product.reviews.reduce((acc, rev) => acc + Number(rev.rating), 0) / totalReviews)
    : 0;

  // 2. Calculate Star Distribution & Recommendations
  const starCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  let recommendCount = 0;

  if (totalReviews > 0) {
    product.reviews.forEach(rev => {
      // Count stars for the progress bars
      const rating = Math.round(Number(rev.rating));
      if (rating >= 1 && rating <= 5) {
        starCounts[rating] += 1;
      }
      
      // Calculate recommendations. 
      // (Assuming a rating of 4 or 5 means they recommend it. 
      // If your DB has an actual 'rev.isRecommended' boolean, use that instead!)
      if (rating >= 4) {
        recommendCount += 1;
      }
    });
  }

  // 3. Convert counts to percentages for the UI
  const recommendPercent = totalReviews > 0 
    ? Math.round((recommendCount / totalReviews) * 100) 
    : 0;
  const ringCircumference = 264;
  const recommendStrokeOffset = ringCircumference - (recommendPercent / 100) * ringCircumference;

  const ratingDistribution = [5, 4, 3, 2, 1].map(stars => ({
    stars,
    percent: totalReviews > 0 ? Math.round((starCounts[stars] / totalReviews) * 100) : 0,
    count: starCounts[stars]
  }));
  const handleRatingChange = (newRating) => {
    setUserRating(newRating);
  };
  
  const reviewValidationRules = {
    rules: {
      comment: {
        required: true,
        minlength: 10
      }
    },
    messages: {
      comment: {
        required: "Please write your review comment",
        minlength: "Review comment must be at least 10 characters"
      }
    }
  };

  const handleReviewSubmitHandler = () => {
    if (!isAuthenticated) {
      toast.error("Please login to submit review", { position: 'top-right', autoClose: 2000 })
      navigate('/login')
      return
    }
    if(!userRatin){
      toast.error("Plz give Ratting", {position: 'top-right', autoClose: 2000})
      return;
    }
    dispatch(createReview ({
      rating: userRatin,
      comment: comment.trim(),
      productId: id
    }))
  };

  const reviewFormRef = useFormValidation(reviewValidationRules, handleReviewSubmitHandler);
  const imageList = useMemo(() => {
    const urls = (product?.image || [])
      .map((img) => img?.url || img?.uri)
      .filter(Boolean);
    return [...new Set(urls)];
  }, [product]);
  useEffect(() => {
    if (id) {
      dispatch(getProductDetails(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (error) {
      toast.error(error?.message || error, {
        position: "top-right",
        autoClose: 2000,
      });

      dispatch(removeError());
    }
    if (cartError) {
      toast.error(cartError?.message || cartError, {
        position: "top-right",
        autoClose: 2000,
      })
      dispatch(removeCartError());
    }
  }, [dispatch, error, cartError]);

  useEffect(()=>{
    if (success){
      toast.success(message,{
        position: "top-right",
        autoClose: 2000,} )
        dispatch(removeMessage());
    }
  },[dispatch,success,message])

 

  const decreaseQuantity=()=>{
     if(quantity <= 1){
      toast.error("Quantity cannot less than 1", {position: "top-center", autoClose:2000})
      return;
    }
    setQuantity(qty=> qty -1)
  }
  // quantity increase by 1
  const increaseQuantity=()=>{
    if(product.stock <= quantity){
      toast.error("Cannot excees available stock", {position: "top-center", autoClose:2000})
      return;
    }
    setQuantity(qty=> qty +1)
  }
  const addtoCart=()=>{
    if (!isAuthenticated) {
      toast.error("Please login to add product to cart", {
        position: "top-right",
        autoClose: 2000,
      })
      navigate('/login')
      return
    }
    if (!product?._id) {
      toast.error("Product is not available", {
        position: "top-right",
        autoClose: 2000,
      })
      return
    }
    dispatch(addItemsToCart({id: product._id, name: product.name, price: product.price, quantity: quantity, image: product.image}))
  }

  const isWishlisted = wishlistItems.some((item) => item.product === product?._id);

  const handleWishlistToggle = () => {
    if (!product?._id) {
      return;
    }

    dispatch(
      toggleWishlistItem({
        product: product._id,
        name: product.name,
        price: product.price,
        image: imageList[0] || "/images/no-products.png",
      }),
    );
  };
  
  useEffect(()=>{
    if(reviewSuccess){
       toast.success("Review submitted successfully", {position: 'top-right', autoClose: 2000})
       setUserRating(0);
       setComment("");
       dispatch(removeSuccess());
       dispatch(getProductDetails(id))
    }
  }, [reviewSuccess, dispatch,id])

  useEffect(()=>{
    if(imageList.length > 0){
      setSelectImage(imageList[0])
    } else {
      setSelectImage("")
    }
  },[imageList])

   if (loading) {
    return (
      <>
        <Navbar />
        <Loader />
        <Footer />
      </>
    );
  }

  if (error || !product) {
    return (
      <>
        <PageTitle title="Product-Details" />
        <Navbar />
        <Footer />
      </>
    );
  }
  return (


<>
  <PageTitle title={`${product.name} - Details`} />
  <Navbar />

  <div className="plant-product-details-page min-h-screen bg-[#f4fbf6] px-4 py-12">
    <div className="max-w-6xl mx-auto flex flex-col gap-10">

      {/* ── Product Main Section ── */}
      <div className="bg-[#ffffff] backdrop-blur-md border border-[#d7eadb] rounded-3xl shadow-[0_20px_70px_rgba(61,43,31,0.12)] overflow-hidden">
        <div className="flex flex-col md:flex-row gap-0">

          {/* Left — Images */}
          <div className="md:w-2/5 p-6 md:p-7 flex flex-col gap-4 border-b md:border-b-0 md:border-r border-[#d7eadb] bg-[#f4fbf6]/40">

            {/* Main Image */}
            <div className="w-full aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-[#eaf7ed]/70 to-[#d7eadb]/40 border border-[#03541e]/15 shadow-inner">
              <img
                src={selectImage || "/images/no-products.png"}
                alt={product.name}
                className="w-full h-full object-contain object-center p-2"
                onError={(e) => {
                  e.currentTarget.src = "/images/no-products.png";
                }}
              />
            </div>

            {/* Thumbnails */}
            {imageList.length > 1 && (
              <div className="flex gap-2.5 flex-wrap">
                {imageList
                  .filter((imgSrc) => imgSrc !== selectImage)
                  .map((imgSrc, index) => (
                    <div
                      key={index}
                      onClick={() => setSelectImage(imgSrc || "/images/no-products.png")}
                      className="w-16 h-16 rounded-xl overflow-hidden border border-[#d7eadb] hover:border-[#03541e]/50 cursor-pointer transition-all duration-200 hover:scale-105 bg-[#f4fbf6]/60"
                    >
                      <img
                        src={imgSrc || "/images/no-products.png"}
                        alt="Thumbnail"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "/images/no-products.png";
                        }}
                      />
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Right — Info */}
          <div className="md:w-3/5 p-6 md:p-8 lg:p-10 flex flex-col gap-6">

            {/* Name */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-1 h-5 rounded-full bg-[#03541e]" />
                <h2 className="text-2xl font-bold text-[#12351f] tracking-tight">{product.name}</h2>
              </div>
              <p className="text-[#6B4C36] text-sm leading-relaxed max-w-2xl">{product.description}</p>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-[#03541e] tracking-tight">₹{product.price}</span>
              <span className="text-[#55705f] text-sm font-medium">/-</span>
            </div>

            {/* Rating + Reviews */}
            <div className="flex items-center gap-3">
              <Rating value={averageRating} precision={0.1} readOnly />
              <span className="text-xs text-[#55705f] font-medium">
                ({product?.numOfReview ?? product?.numOfReviews ?? 0} {(product?.numOfReview ?? product?.numOfReviews ?? 0) === 1 ? "Review" : "Reviews"})
              </span>
            </div>

            {/* Stock Status */}
            <div>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold
                ${product.stock > 0
                  ? "bg-green-400/10 border border-green-400/20 text-green-600"
                  : "bg-red-400/10 border border-red-400/20 text-red-500"
                }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${product.stock > 0 ? "bg-green-500 animate-pulse" : "bg-red-500"}`} />
                {product.stock > 0 ? `In Stock (${product.stock} available)` : "Out Of Stock"}
              </span>
            </div>

            {/* Quantity + Add to Cart */}
            {product.stock > 0 && (
              <div className="flex flex-col gap-4">

                {/* Quantity Controls */}
                <div className="flex items-center justify-start gap-4 flex-wrap">
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#55705f]">Quantity</span>
                  <div className="flex items-center gap-0 border border-[#03541e]/30 rounded-xl overflow-hidden bg-[#f4fbf6] shadow-inner">
                    <button
                      onClick={decreaseQuantity}
                      className="w-10 h-10 flex items-center justify-center text-[#12351f] hover:text-[#03541e] hover:bg-[#eaf7ed] transition-all duration-150 text-lg font-bold"
                    >
                      −
                    </button>
                    <input
                      type="text"
                      readOnly
                      value={quantity}
                      className="w-11 h-10 text-center bg-transparent text-[#12351f] text-sm font-bold outline-none border-x border-[#03541e]/20"
                    />
                    <button
                      onClick={increaseQuantity}
                      className="w-10 h-10 flex items-center justify-center text-[#12351f] hover:text-[#03541e] hover:bg-[#eaf7ed] transition-all duration-150 text-lg font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <button
                  disabled={cartLoading}
                  onClick={addtoCart}
                  className="w-full py-3.5 rounded-2xl font-extrabold text-sm tracking-[0.22em] uppercase transition-all duration-200 bg-[#03541e] hover:bg-[#12351f] text-[#ffffff] shadow-[0_12px_30px_rgba(61,43,31,0.20)] hover:shadow-[0_14px_34px_rgba(61,43,31,0.30)] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {cartLoading ? "Adding..." : "Add To Cart"}
                </button>

                <button
                  onClick={handleWishlistToggle}
                  className="w-full py-3 rounded-2xl font-bold text-sm tracking-[0.18em] uppercase transition-all duration-200 border border-[#03541e]/30 text-[#12351f] hover:text-[#03541e] hover:bg-[#f4fbf6] flex items-center justify-center gap-2"
                >
                  {isWishlisted ? <FavoriteIcon style={{ fontSize: 18, color: "#03541e" }} /> : <FavoriteBorderIcon style={{ fontSize: 18 }} />}
                  {isWishlisted ? "Wishlisted" : "Add Wishlist Now"}
                </button>
              </div>
            )}

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-[#d7eadb]" />
              <div className="w-1.5 h-1.5 rotate-45 bg-[#03541e]/30 shrink-0" />
              <div className="flex-1 h-px bg-[#d7eadb]" />
            </div>

          </div>
        </div>
      </div>

      {/* ── Customer Review Form ── */}
      <div className="bg-[#ffffff] backdrop-blur-sm border border-[#d7eadb] rounded-2xl shadow-2xl shadow-[#03541e]/8 overflow-hidden">
        <div className="px-6 py-4 border-b border-[#d7eadb] flex items-center justify-between gap-3">
          <h2 className="text-sm font-bold uppercase tracking-widest text-[#12351f]">Write a Review</h2>
          {!isAuthenticated && (
            <span className="text-[10px] font-semibold uppercase tracking-widest text-[#55705f]">Login required</span>
          )}
        </div>

        <form ref={reviewFormRef} onSubmit={(e) => e.preventDefault()} className="p-6 flex flex-col gap-4 bg-[#f4fbf6]/40">
          <div className="flex items-center gap-3 flex-wrap">
            <label className="text-xs font-bold uppercase tracking-widest text-[#55705f]">Rating</label>
            <Rating
              value={Number(userRatin) || 0}
              onChange={(_, newValue) => handleRatingChange(newValue || 0)}
              precision={1}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-widest text-[#55705f]">Comment</label>
            <textarea
              name="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience with this product"
              rows={4}
              className="w-full bg-[#ffffff] border border-[#d7eadb] rounded-xl px-4 py-3 text-sm text-[#12351f] placeholder-[#55705f] outline-none focus:border-[#03541e]/50"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={reviewLoading}
              className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-widest transition-all duration-200 bg-[#03541e] hover:bg-[#12351f] text-[#ffffff] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {reviewLoading ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        </form>
      </div>

      {/* ── Detailed Customer Ratings Dashboard ── */}
      <div className="bg-[#ffffff] backdrop-blur-sm border border-[#d7eadb] rounded-2xl shadow-2xl shadow-[#03541e]/8 overflow-hidden">

        {/* Rating Header Overview */}
        <div className="p-6 md:p-10 border-b border-[#d7eadb] flex flex-col gap-10">

          {/* Top Section: Bars, Score, and Ring */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 items-center">

            {/* Column 1: Progress Bars */}
            <div className="flex flex-col gap-2.5 w-full order-2 md:order-1">
              {ratingDistribution.map((row, idx) => (
                <div key={idx} className="flex items-center gap-3 text-sm">
                  <span className="text-[#55705f] w-12 hover:underline cursor-pointer">{row.stars} stars</span>
                  <div className="flex-1 h-2.5 bg-[#d7eadb] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#03541e] rounded-full"
                      style={{ width: `${row.percent}%` }}
                    />
                  </div>
                  <span className="text-[#55705f] w-8 text-right">{row.percent}%</span>
                </div>
              ))}
            </div>

            {/* Column 2: Overall Score */}
            <div className="flex flex-col items-center justify-center order-1 md:order-2">
              <span className="text-5xl font-extrabold text-[#12351f] mb-2 tracking-tight">{averageRating.toFixed(1)}</span>
              <div className="scale-125 mb-1">
                <Rating value={averageRating} precision={0.1} readOnly size="small" />
              </div>
              <span className="text-sm text-[#55705f]">{totalReviews} star ratings</span>
            </div>

            {/* Column 3: Recommendation Ring */}
            <div className="flex flex-col items-center justify-center order-3 md:order-3">
              <div className="relative w-24 h-24 mb-3">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="48" cy="48" r="42" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-[#d7eadb]" />
                  <circle cx="48" cy="48" r="42" stroke="currentColor" strokeWidth="6" fill="transparent" strokeDasharray={ringCircumference} strokeDashoffset={recommendStrokeOffset} className="text-[#03541e] drop-shadow-lg" strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-bold text-[#12351f]">{recommendPercent}</span>
                </div>
              </div>
              <span className="text-sm font-bold text-[#12351f] tracking-wide">{recommendPercent}% would recommend</span>
              <span className="text-xs text-[#55705f] mt-1">{recommendCount} recommendations</span>
            </div>

          </div>

          {/* Bottom Section: Specific Attributes */}
          <div className="pt-8 border-t border-[#d7eadb] flex flex-wrap justify-center sm:justify-around gap-6 sm:gap-4">

            {/* Comfort */}
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 flex items-center justify-center rounded-full border-2 border-[#03541e]/30">
                <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                  <circle cx="22" cy="22" r="22" stroke="currentColor" strokeWidth="2" fill="transparent" strokeDasharray="138" strokeDashoffset="11" className="text-[#03541e]" strokeLinecap="round" />
                </svg>
                <span className="text-sm font-bold text-[#12351f]">{averageRating.toFixed(1)}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-[#12351f]">Comfort</span>
                <span className="text-xs text-[#55705f]">out of 5</span>
              </div>
            </div>

            {/* Value */}
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 flex items-center justify-center rounded-full border-2 border-[#03541e]/30">
                <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                  <circle cx="22" cy="22" r="22" stroke="currentColor" strokeWidth="2" fill="transparent" strokeDasharray="138" strokeDashoffset="11" className="text-[#03541e]" strokeLinecap="round" />
                </svg>
                <span className="text-sm font-bold text-[#12351f]">{averageRating.toFixed(1)}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-[#12351f]">Value</span>
                <span className="text-xs text-[#55705f]">out of 5</span>
              </div>
            </div>

            {/* Style */}
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 flex items-center justify-center rounded-full border-2 border-[#03541e]/30">
                <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                  <circle cx="22" cy="22" r="22" stroke="currentColor" strokeWidth="2" fill="transparent" strokeDasharray="138" strokeDashoffset="11" className="text-[#03541e]" strokeLinecap="round" />
                </svg>
                <span className="text-sm font-bold text-[#12351f]">{averageRating.toFixed(1)}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-[#12351f]">Style</span>
                <span className="text-xs text-[#55705f]">out of 5</span>
              </div>
            </div>

          </div>
        </div>

        {/* Reviews List */}
        {product.reviews && product.reviews.length > 0 ? (
          <div className="p-6 md:p-10 flex flex-col gap-4">
            {product.reviews.map((review, i) => (
              <div
                key={i}
                className="p-5 rounded-xl bg-[#f4fbf6] border border-[#d7eadb] hover:border-[#03541e]/30 transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#03541e]/10 border border-[#03541e]/20 flex items-center justify-center text-sm font-bold text-[#03541e] shadow-inner">
                      {review.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-bold text-[#12351f] tracking-wide">{review.name}</span>
                  </div>
                  <Rating value={Number(review.rating) || 0} disabled={true} size="small" />
                </div>
                <p className="text-sm text-[#6B4C36] leading-relaxed pl-11">{review.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 py-12 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#eaf7ed] border border-[#d7eadb] flex items-center justify-center">
              <svg className="w-6 h-6 text-[#55705f]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
              </svg>
            </div>
            <p className="text-sm text-[#55705f]">No reviews yet. Be the first to review!</p>
          </div>
        )}
      </div>

    </div>
  </div>

  <Footer />
</>
  );
}

export default ProductDetails;