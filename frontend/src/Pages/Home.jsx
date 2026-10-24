import React, { useEffect, useState } from "react";
import Footer from "../componant/Footer";
import Navbar from "../componant/Navbar";
import Product from "../componant/Product";
import ImageSlider from "../componant/ImageSlider";
import PageTitle from "../componant/PageTitle";
import { useDispatch, useSelector } from "react-redux";
import { getProduct,removeError } from "../feature/product/productSllice";
import { fetchCategories } from "../feature/admin/adminSlice";
import Loader from "../componant/Loader";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import Pagination from "../componant/Pagination";
import "../PageStyles/Home.css";

function Home() {
  const PRODUCTS_PER_PAGE = 12;
  const { error, loading, products } = useSelector(
    (state) => state.product,
  );
  const { categories = [], categoryLoading, error: categoryError } = useSelector((state) => state.admin);

  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("featured");
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);

  useEffect(() => {
    dispatch(getProduct({ keyword: "", page: currentPage, limit: PRODUCTS_PER_PAGE }));
    dispatch(fetchCategories());
  }, [dispatch, currentPage]);

  useEffect(() => {
  if (error) {
    toast.error(error?.message || error, {
      position: "top-right",
      autoClose: 2000,
    });

    dispatch(removeError());
  }
}, [error, dispatch]);
  useEffect(() => {
    if (categoryError) toast.error(categoryError?.message || categoryError, { position: "top-right", autoClose: 2000 });
  }, [categoryError]);

  useEffect(() => {
    setCurrentPage(1);
  }, [sortBy]);

  const { totalPages } = useSelector((state) => state.product);

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    document.getElementById("featured-plants")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleChatSubmit = (event) => {
    event.preventDefault();
    const message = chatMessage.trim();
    if (!message) return;
    setChatMessages((messages) => [...messages, { text: message, fromUser: true }]);
    setChatMessage("");
    setTimeout(() => {
      setChatMessages((messages) => [...messages, { text: "Thanks for reaching out. Our plant experts will help you shortly.", fromUser: false }]);
    }, 350);
  };
  return (
<>
  {loading ? (<Loader />) : (
    <>
      <Navbar />
      <PageTitle title="Plant House | Bring life home" />

      <main className="plant-home">
        <ImageSlider />

        <div className="plant-category-rail">
          {categoryLoading ? <span className="plant-category-empty">Loading categories...</span> : categories.length === 0 ? <span className="plant-category-empty">No categories available</span> : categories.map((category) => (
            <Link key={category._id} to={`/products?category=${encodeURIComponent(category.name)}`} className="plant-category-item">
              <span className="plant-category-icon">{category.image?.url ? <img src={category.image.url} alt="" /> : <span className="plant-category-fallback" />}</span>
              <span>{category.name}</span>
            </Link>
          ))}
        </div>

        {/* Products Section */}
        <section className="plant-products" id="featured-plants">
          <div className="plant-section-heading">
            <div><span className="plant-eyebrow">CURATED FOR YOUR HOME</span><h2>Featured Plants</h2></div>
            <label>Sort by <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}><option value="featured">Featured</option><option value="price">Price</option><option value="rating">Top rated</option></select></label>
          </div>

          <div className="plant-product-grid">
            {products.map((product) => <Product product={product} key={product._id} />)}
          </div>
          {totalPages > 1 && <Pagination currentPage={currentPage} onPageChange={handlePageChange} />}

          <div className="plant-care-banner">
            <div className="plant-care-copy">
              <span className="plant-care-kicker">PERSONAL PLANT SUPPORT</span>
              <h2>Stuck with plant care?</h2>
              <p>Get thoughtful advice from our plant experts.</p>
            </div>
            <button type="button" className="plant-chat-trigger" onClick={() => setChatOpen(true)}>
              <span className="plant-chat-trigger-icon">+</span>
              Chat With Us
            </button>
          </div>

        </section>
      </main>

      <Footer />
      {chatOpen && (
        <div className="plant-chat-layer" onClick={() => setChatOpen(false)}>
          <section className="plant-chat-popup" role="dialog" aria-modal="true" aria-labelledby="plant-chat-title" onClick={(event) => event.stopPropagation()}>
            <header className="plant-chat-header">
              <div className="plant-chat-brand"><span className="plant-chat-avatar">PH</span><div><strong id="plant-chat-title">Plant House Care</strong><small>Usually replies instantly</small></div></div>
              <button type="button" className="plant-chat-close" onClick={() => setChatOpen(false)} aria-label="Close chat">×</button>
            </header>
            <div className="plant-chat-body">
              <div className="plant-chat-bubble plant-chat-bubble-bot">Hi there. What can we help your plant with today?</div>
              {chatMessages.map((message, index) => <div key={`${message.text}-${index}`} className={`plant-chat-bubble ${message.fromUser ? "plant-chat-bubble-user" : "plant-chat-bubble-bot"}`}>{message.text}</div>)}
            </div>
            <form className="plant-chat-form" onSubmit={handleChatSubmit}>
              <input value={chatMessage} onChange={(event) => setChatMessage(event.target.value)} placeholder="Ask about your plant..." aria-label="Chat message" />
              <button type="submit" aria-label="Send message">→</button>
            </form>
          </section>
        </div>
      )}
    </>
  )}
</>
  );
}

export default Home;
