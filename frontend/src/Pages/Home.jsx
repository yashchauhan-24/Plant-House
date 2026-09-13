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
  const { error, loading, products } = useSelector(
    (state) => state.product,
  );
  const { categories = [], categoryLoading, error: categoryError } = useSelector((state) => state.admin);

  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("featured");

  useEffect(() => {
    dispatch(getProduct({ keyword: "", page: currentPage }));
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
        <section className="plant-products">
          <div className="plant-section-heading">
            <div><span className="plant-eyebrow">CURATED FOR YOUR HOME</span><h2>Featured Plants</h2></div>
            <label>Sort by <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}><option value="featured">Featured</option><option value="price">Price</option><option value="rating">Top rated</option></select></label>
          </div>

          <div className="plant-product-grid">
            {products.map((product, index) => (
              <React.Fragment key={product._id || index}>
                {index === 6 && <div className="plant-promo-card"><div><span>PLANT CARE ESSENTIALS</span><h3>Feed your plants right with our organic fertilizers.</h3><Link to="/products?category=Fertilizers">Shop Now</Link></div></div>}
                <Product product={product} />
              </React.Fragment>
            ))}
          </div>
          <Pagination currentPage={currentPage} onPageChange={setCurrentPage} nextPageteText="Next →" lastPageText="" firstPageText="" prevPageText="" />

          <div className="plant-care-banner">
            <div>
              <h2>Stuck with plant care?</h2>
              <p>We're here to help</p>
            </div>
            <Link to="/contact-us">Chat With Us</Link>
          </div>

        </section>
      </main>

      <Footer />
    </>
  )}
</>
  );
}

export default Home;
