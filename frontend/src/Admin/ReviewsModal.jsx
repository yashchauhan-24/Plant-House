import React, { useEffect, useRef } from "react";
import Close from "@mui/icons-material/Close";
import Delete from "@mui/icons-material/Delete";
import "../AdminStyles/ReviewsModal.css";

function ReviewsModal({ product, reviews, loading, onClose, onDelete }) {
  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleEscape = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  const reviewCount = reviews?.length ?? Number(product?.numOfReview || 0);
  const rating = Number(product?.ratting ?? product?.rating ?? 0);
  const image = product?.image?.[0]?.url || "/images/no-products.png";

  return (
    <div className="reviews-modal-overlay" onClick={onClose}>
      <section
        ref={modalRef}
        className="reviews-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="reviews-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="reviews-modal-header">
          <h2 id="reviews-modal-title">Product Reviews</h2>
          <button ref={closeButtonRef} type="button" className="reviews-modal-close" onClick={onClose} aria-label="Close reviews">
            <Close fontSize="small" />
          </button>
        </header>

        <div className="reviews-product-card">
          <img src={image} alt={product?.name || "Product"} />
          <div className="reviews-product-info">
            <h3>{product?.name}</h3>
            <span className="reviews-category">{product?.category || "Plant"}</span>
            <strong>₹{product?.price ?? "-"}</strong>
          </div>
          <div className="reviews-product-meta">
            <span className={String(product?.stock) === "0" ? "stock-badge out" : "stock-badge"}>
              {String(product?.stock) === "0" ? "Out of stock" : "In stock"}
            </span>
            <span className="reviews-rating"><b>★</b> {rating.toFixed(1)}</span>
            <span>{reviewCount} {reviewCount === 1 ? "Review" : "Reviews"}</span>
          </div>
        </div>

        <div className="reviews-modal-body">
          {loading ? (
            <div className="reviews-modal-state"><span className="reviews-spinner" />Loading reviews...</div>
          ) : reviews?.length ? (
            <div className="reviews-cards">
              {reviews.map((review, index) => (
                <article className="review-card" key={review._id}>
                  <div className="review-card-top">
                    <div className="reviewer">
                      <span className="reviewer-avatar">{review.name?.charAt(0).toUpperCase() || "U"}</span>
                      <div><strong>{review.name || "Anonymous"}</strong><small>{review.createdAt ? new Date(review.createdAt).toLocaleDateString() : ""}</small></div>
                    </div>
                    <button type="button" className="review-delete" onClick={() => onDelete(product._id, review._id)} aria-label={`Delete review by ${review.name || "anonymous"}`}>
                      <Delete fontSize="small" />
                    </button>
                  </div>
                  <div className="review-rating"><span>★</span> {review.rating}</div>
                  <p>{review.comment}</p>
                  <small className="review-number">Review {index + 1}</small>
                </article>
              ))}
            </div>
          ) : (
            <div className="reviews-modal-state reviews-empty"><span>★</span><p>No reviews yet for this product</p></div>
          )}
        </div>

        <footer className="reviews-modal-footer">
          <button type="button" className="reviews-modal-secondary modal-close-btn" onClick={onClose}>Close</button>
        </footer>
      </section>
    </div>
  );
}

export default ReviewsModal;