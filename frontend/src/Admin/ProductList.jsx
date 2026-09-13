import React, { useEffect } from "react";
import "../AdminStyles/ProductsList.css";
import PageTitle from "../componant/PageTitle";
import { Delete, Edit } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../componant/Loader";
import {
  deleteProduct,
  fetchAllProducts,
  removeError,
} from "../feature/admin/adminSlice";
import { toast } from "react-toastify";
import AdminShell from "./components/AdminShell";

function ProductList() {
  const { products, loading, error, deleting = {} } = useSelector(
    (state) => state.admin
  );

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error?.message || error, {
        position: "top-right",
        autoClose: 2000,
      });

      dispatch(removeError());
    }
  }, [error, dispatch]);
  if (!products || products.length === 0) {
    return (
      <>
      <PageTitle title="All Products" />
      <AdminShell>
        <div className="product-list-container">
          <h1 className="product-list-title">All Products</h1>
          <p className="admin-no-products">No Products Found</p>
        </div>
      </AdminShell>
      </>
    );
  }

  const handleDelete = (productId) => {
    const isConfirmed = window.confirm("Are You Sure Dlete item?");
    if (isConfirmed) {
      dispatch(deleteProduct(productId)).then((action) => {
        if (action.type === "admin/deleteProduct/fulfilled") {
          toast.success("Product Deleted Successfully", {
            position: "top-right",
            autoClose: 2000,
          });
        }
      });
    }
  };
  return (
  <>
            <PageTitle title="All Products" />
            <AdminShell>
        {loading ? (
          <Loader />
        ) : (
          <>
            <div className="px-0">
              <div className="w-full flex flex-col gap-6">

                {/* Heading */}
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-6 rounded-full bg-[#03541e]" />
                    <h1 className="text-2xl font-bold text-[#12351f] tracking-tight">All Products</h1>
                  </div>
                  <Link
                    to="/admin/product/create"
                    className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-200 bg-[#adf5c5] hover:bg-[#64c688] text-[#ffffff] shadow-lg shadow-[#03541e]/20"
                    aria-label="Add product"
                  >
                    Add Product
                  </Link>
                </div>

                {/* Table Card */}
                <div className="bg-[#ffffff] backdrop-blur-sm border border-[#d7eadb] rounded-2xl shadow-2xl shadow-[#03541e]/8 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-[#d7eadb]">
                          <th className="text-left px-6 py-3 text-xs font-bold uppercase tracking-widest text-[#03541e]/80">Sr No.</th>
                          <th className="text-left px-6 py-3 text-xs font-bold uppercase tracking-widest text-[#03541e]/80">Image</th>
                          <th className="text-left px-6 py-3 text-xs font-bold uppercase tracking-widest text-[#03541e]/80">Product Name</th>
                          <th className="text-left px-6 py-3 text-xs font-bold uppercase tracking-widest text-[#03541e]/80">Price</th>
                          <th className="text-left px-6 py-3 text-xs font-bold uppercase tracking-widest text-[#03541e]/80">Category</th>
                          <th className="text-left px-6 py-3 text-xs font-bold uppercase tracking-widest text-[#03541e]/80">Stock</th>
                          <th className="text-left px-6 py-3 text-xs font-bold uppercase tracking-widest text-[#03541e]/80">Created At</th>
                          <th className="text-left px-6 py-3 text-xs font-bold uppercase tracking-widest text-[#03541e]/80">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#d7eadb]">
                        {Array.isArray(products) && products.length > 0 ? (
                          products.map((product, index) => (
                            <tr key={product._id} className="hover:bg-[#f4fbf6] transition-all duration-150">

                              <td className="px-6 py-4 text-[#55705f]">{index + 1}</td>

                              <td className="px-6 py-4">
                                <div className="w-12 h-12 rounded-xl overflow-hidden border border-[#d7eadb] bg-[#f4fbf6]">
                                  <img
                                    src={product.image?.[0]?.url || product.image?.[0]?.uri || "/placeholder.png"}
                                    alt={product.name}
                                    className="w-full h-full object-cover object-center"
                                  />
                                </div>
                              </td>

                              <td className="px-6 py-4 text-[#12351f] font-medium">{product.name}</td>

                              <td className="px-6 py-4 text-[#03541e] font-bold">₹{product.price}</td>

                              <td className="px-6 py-4">
                                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#eaf7ed] border border-[#d7eadb] text-[#12351f]">
                                  {product.category}
                                </span>
                              </td>

                              <td className="px-6 py-4">
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold
                                  ${product.stock > 0
                                    ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-600'
                                    : 'bg-red-500/10 border border-red-500/20 text-red-500'
                                  }`}>
                                  <span className={`w-1.5 h-1.5 rounded-full ${product.stock > 0 ? 'bg-emerald-500' : 'bg-red-500'}`} />
                                  {product.stock}
                                </span>
                              </td>

                              <td className="px-6 py-4 text-[#55705f] text-xs">
                                {new Date(product.createdAt).toLocaleDateString()}
                              </td>

                              <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                  <Link
                                    to={`/admin/product/${product._id}`}
                                    disabled={loading}
                                    className="w-8 h-8 rounded-lg flex items-center justify-center border border-emerald-500/30 text-emerald-600 hover:bg-emerald-500/10 transition-all duration-200"
                                  >
                                    <Edit style={{fontSize: 16}} />
                                  </Link>
                                  <button
                                    disabled={deleting[product._id]}
                                    onClick={() => handleDelete(product._id)}
                                    className="w-8 h-8 rounded-lg flex items-center justify-center border border-red-500/30 text-red-500 hover:bg-red-500/10 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                                  >
                                    {deleting[product._id] ? <Loader /> : <Delete style={{fontSize: 16}} />}
                                  </button>
                                </div>
                              </td>

                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="8" className="px-6 py-20 text-center">
                              <div className="flex flex-col items-center gap-3">
                                <div className="w-14 h-14 rounded-2xl bg-[#eaf7ed] border border-[#d7eadb] flex items-center justify-center">
                                  <Inventory style={{fontSize: 24}} className="text-[#55705f]" />
                                </div>
                                <p className="text-sm text-[#55705f]">No products available</p>
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            </div>
          </>
        )}
        </AdminShell>
      </>
  );
}

export default ProductList;
