import React from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../componant/Navbar";
import Footer from "../componant/Footer";
import PageTitle from "../componant/PageTitle";
import { removeWishlistItem } from "../feature/wishlist/wishlistSlice";

function Wishlist() {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.wishlist);

  return (
    <>
      <Navbar />
      <PageTitle title="Your Wishlist" />

      {items.length === 0 ? (
        <div className="min-h-screen bg-gradient-to-br from-[#f4fbf6] via-[#eaf7ed] to-[#f4fbf6] flex flex-col items-center justify-center gap-5 px-4">
          <div className="w-16 h-16 rounded-2xl bg-[#03541e]/10 border border-[#03541e]/20 flex items-center justify-center">
            <svg className="w-8 h-8 text-[#03541e]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 8.25c0-2.485-2.015-4.5-4.5-4.5-1.74 0-3.247.99-4 2.437-.753-1.447-2.26-2.437-4-2.437-2.485 0-4.5 2.015-4.5 4.5 0 7.22 8.5 12 8.5 12s8.5-4.78 8.5-12z" />
            </svg>
          </div>
          <p className="text-[#55705f] text-lg font-medium text-center">Your wishlist is empty</p>
          <Link
            to="/products"
            className="px-6 py-2.5 rounded-xl bg-[#76ea9d] hover:bg-[#eff7f2] text-[#ffffff] font-bold text-sm tracking-widest uppercase transition-all duration-200 shadow-lg shadow-[#03541e]/20"
          >
            Explore Products
          </Link>
        </div>
      ) : (
        <div className="min-h-screen bg-gradient-to-br from-[#f4fbf6] via-[#eaf7ed] to-[#f4fbf6] px-4 pt-20 pb-12">
          <div className="max-w-6xl mx-auto">
            <div className="bg-[#ffffff] border border-[#d7eadb] rounded-2xl shadow-2xl shadow-[#03541e]/8 overflow-hidden">
              <div className="px-6 py-5 border-b border-[#d7eadb] flex items-center justify-between">
                <h2 className="text-lg font-bold text-[#12351f] tracking-tight">Saved Items</h2>
                <span className="text-xs font-semibold uppercase tracking-widest text-[#55705f]">
                  {items.length} {items.length === 1 ? "Item" : "Items"}
                </span>
              </div>

              <div className="divide-y divide-[#d7eadb]">
                {items.map((item) => (
                  <div key={item.product} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5">
                    <Link to={`/product/${item.product}`} className="w-20 h-20 rounded-xl overflow-hidden border border-[#d7eadb] bg-[#f4fbf6] shrink-0">
                      <img
                        src={item.image || "/images/no-products.png"}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "/images/no-products.png";
                        }}
                      />
                    </Link>

                    <div className="flex-1 min-w-0">
                      <Link to={`/product/${item.product}`} className="text-[#12351f] font-semibold hover:text-[#03541e] transition-colors duration-150 line-clamp-1">
                        {item.name}
                      </Link>
                      <p className="text-[#55705f] text-sm mt-1">Price: ₹{item.price}</p>
                    </div>

                    <button
                      onClick={() => dispatch(removeWishlistItem(item.product))}
                      className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-red-500/10 border border-red-500/20 text-red-600 hover:bg-red-500/20 transition-all duration-150"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}

export default Wishlist;
