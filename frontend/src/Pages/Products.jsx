import React, { useEffect, useState } from "react";
import "../PageStyles/Products.css";
import PageTitle from "../componant/PageTitle";
import Navbar from "../componant/Navbar";
import Footer from "../componant/Footer";
import { useDispatch, useSelector } from "react-redux";
import { getProduct, removeError } from "../feature/product/productSllice";
import { fetchCategories } from "../feature/admin/adminSlice";
import { toast } from "react-toastify";
import Loader from "../componant/Loader";
import Product from "../componant/Product";
import { useLocation, useNavigate } from "react-router-dom";
import NoProduct from "../componant/NoProduct";
import Pagination from "../componant/Pagination";

function Products() {
  const { loading, error, products, resultPerPage, productCount } = useSelector(
    (state) => state.product,
  );
  const { categories = [] } = useSelector((state) => state.admin);
  const dispatch = useDispatch();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const keyword = searchParams.get("keyword");
  const category = searchParams.get("category");
  const pageFromUrl = parseInt(searchParams.get("page"), 10) || 1;
  const [currentPage, setCurrentPage] = useState(pageFromUrl);
  const navigate = useNavigate();

  // Fetch categories on mount
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);


  // Sync state with URL changes
  useEffect(() => {
    setCurrentPage(pageFromUrl);
  }, [pageFromUrl]);

  useEffect(() => {
    dispatch(getProduct({ keyword, page: currentPage,category }));
  }, [dispatch, keyword,currentPage, category]);

  useEffect(() => {
    if (error) {
      toast.error(error?.message || error, {
        position: "top-right",
        autoClose: 2000,
      });

      dispatch(removeError());
    }
  }, [error, dispatch]);

  const handlePageChange = (page) => {
    if (page !== currentPage) {
      setCurrentPage(page);

      const newSearchParams = new URLSearchParams(location.search);

      if (page === 1) {
        newSearchParams.delete('page');
      } else {
        newSearchParams.set('page', page);
      }
      navigate(`?${newSearchParams.toString()}`);
    }
  };

  const handleCategoryClick = (selectedCategory) => {
    setCurrentPage(1);

    const newSearchParams = new URLSearchParams(location.search);
    newSearchParams.set('category', selectedCategory);
    newSearchParams.delete('page');
    navigate(`?${newSearchParams.toString()}`);
  };

  return (
<>
      {loading ? (
        <Loader />
      ) : (
        <>
          <PageTitle title="All Plants | Plant House" />
          <Navbar />

          <div className="plant-products-page min-h-screen">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6">

              {/* ── Filter Sidebar ── */}
              <aside className="md:w-56 shrink-0">
                <div className="bg-[#ffffff] backdrop-blur-sm border border-[#d7eadb] rounded-2xl shadow-2xl shadow-[#03541e]/8 p-5 sticky top-6">

                  {/* Heading */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-1 h-5 rounded-full bg-[#03541e]" />
                    <h3 className="text-sm font-bold uppercase tracking-widest text-[#12351f]">
                      Categories
                    </h3>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-[#d7eadb] mb-4" />

                  {/* Category List */}
                  <ul className="flex flex-col gap-1">
                    {categories.map(categoryItem => (
                      <li
                        key={categoryItem._id || categoryItem.name}
                        onClick={() => handleCategoryClick(categoryItem.name)}
                        className="px-3 py-2 rounded-xl text-sm text-[#12351f] cursor-pointer
                          hover:bg-[#03541e]/10 hover:text-[#03541e]
                          border border-transparent hover:border-[#03541e]/20
                          transition-all duration-200 font-medium"
                      >
                        {categoryItem.name}
                      </li>
                    ))}
                  </ul>
                </div>
              </aside>

              {/* ── Products Section ── */}
              {products?.length > 0 ? (
                <div className="flex-1 flex flex-col gap-6">
                  <div className="plant-list-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {products.map((product) => (
                      <Product product={product} key={product._id} />
                    ))}
                  </div>
                  <Pagination currentPage={currentPage} onPageChange={handlePageChange} />
                </div>
              ) : (
                <div className="flex-1">
                  <NoProduct keyword={keyword} />
                </div>
              )}

            </div>
          </div>

          <Footer />
        </>
      )}
    </>
  );
}

export default Products;
