import React from "react";
import "../componentStyles/Product.css";
import { Link } from "react-router-dom";
import Rating from "@mui/material/Rating";
import "../componentStyles/Rating.css";
import { useDispatch, useSelector } from "react-redux";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { toggleWishlistItem } from "../feature/wishlist/wishlistSlice";

function Product({ product }) {
  const dispatch = useDispatch();
  const { items: wishlistItems } = useSelector((state) => state.wishlist);

  const isWishlisted = wishlistItems.some((item) => item.product === product?._id);

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();

    dispatch(
      toggleWishlistItem({
        product: product?._id,
        name: product?.name,
        price: product?.price,
        image:
          product?.image?.[0]?.url ||
          product?.image?.[0]?.uri?.replace("./public", "") ||
          "/images/no-products.png",
      }),
    );
  };

  // console.log(product);

  return (

<Link to={`/product/${product._id}`} className="block group">
  <div className="plant-product-card">

    {/* Product Image — fixed height so all cards are equal */}
    <div className="plant-product-image">
      <img
        src={
          product?.image?.[0]?.url ||
          product?.image?.[0]?.uri?.replace("./public", "") ||
          "/images/no-products.png"
        }
        alt={product?.name}
        className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
      />
      <span className="plant-bestseller">BESTSELLER</span>
      <button
        onClick={handleToggleWishlist}
        className="absolute top-3 right-3 w-9 h-9 rounded-full border border-[#d7eadb] bg-[#ffffff]/90 hover:bg-[#ffffff] text-[#12351f] hover:text-[#03541e] transition-all duration-200 flex items-center justify-center"
        aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
      >
        {isWishlisted ? <FavoriteIcon style={{ fontSize: 18, color: "#03541e" }} /> : <FavoriteBorderIcon style={{ fontSize: 18 }} />}
      </button>
      {/* Hover overlay */}
      <div className="plant-image-shade" />
    </div>

    {/* Product Details */}
    <div className="plant-product-details">

      {/* Name */}
      <h3 className="plant-product-name">
        {product.name}
      </h3>

      <p className="plant-product-description">{product.description || "Fresh, healthy plant for your home"}</p>

      {/* Price */}
      <p className="plant-product-price">
        <strong>
          ₹{product.price}
        </strong>
          <del className="plant-old-price"> ₹{product.originalPrice || Math.round(Number(product.price || 0) * 1.25)}</del>
      </p>

      {/* Rating */}
      <div className="plant-product-rating">
        <Rating
          value={product?.ratting ?? product?.rating ?? 0}
          disabled={true}
          size="small"
        />
        <span>
          ({product?.numOfReview ?? product?.numOfReviews ?? 0}{" "}
          {(product?.numOfReview ?? product?.numOfReviews ?? 0) === 1 ? "Review" : "Reviews"})
        </span>
      </div>

      {/* Divider */}
      {/* View Details Button */}
      <button className="plant-view-button">
        View Product
      </button>

    </div>
  </div>
</Link>
  );
}
export default Product;
