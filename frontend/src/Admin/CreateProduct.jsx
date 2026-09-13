import React, { useEffect, useState } from "react";
// import "../AdminStyles/CreateProduct.css";
import PageTitle from "../componant/PageTitle";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { createProducts, fetchCategories, removeError, removeSuccess } from "../feature/admin/adminSlice";
import { Link, useNavigate } from "react-router-dom";
import AdminShell from "./components/AdminShell";
import useFormValidation from "../utils/useFormValidation";

export default function CreateProduct() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState("");
  const [image, setImage] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);

  const { loading, success, error, categories = [], categoryLoading } = useSelector((state) => state.admin);
  const dispatch =  useDispatch()
  const navigate = useNavigate();
  
  const createProductSubmitHandler = () => {
    if (image.length === 0) {
      toast.error("Please upload at least one product image", { position: "top-right", autoClose: 2200 });
      return;
    }

    const normalizedName = name.trim();
    const normalizedDescription = description.trim();
    const normalizedPrice = Number(price);
    const normalizedStock = Number(stock);

    const myForm = new FormData();
    myForm.set("name", normalizedName);
    myForm.set("price", normalizedPrice);
    myForm.set("description", normalizedDescription);
    myForm.set("category", category);
    myForm.set("stock", normalizedStock);
    image.forEach((img) => {
      myForm.append("image", img);
    })
    dispatch(createProducts(myForm))
  };

  const validationRules = {
    rules: {
      name: { required: true, minlength: 3 },
      price: { required: true, number: true, min: 0.01 },
      description: { required: true, minlength: 10 },
      category: { required: true },
      stock: { required: true, number: true, min: 0 }
    },
    messages: {
      name: { required: "Product name is required", minlength: "Must be at least 3 characters" },
      price: { required: "Price is required", number: "Enter valid price", min: "Must be greater than 0" },
      description: { required: "Description is required", minlength: "Must be at least 10 characters" },
      category: "Please select a category",
      stock: { required: "Stock is required", number: "Enter valid number", min: "Cannot be negative" }
    }
  };

  const formRef = useFormValidation(validationRules, createProductSubmitHandler);
    useEffect(() => {
      dispatch(fetchCategories());
    }, [dispatch]);

    useEffect(() => {
    if (error) {
      toast.error(error?.message || error, {
        position: "top-right",
        autoClose: 2000,
      });
  
      dispatch(removeError());
    }
    if (success) {
      toast.success("Product Create Successfully", {
        position: "top-right",
        autoClose: 2000,
      });
      dispatch(removeSuccess());
    //   reset Form
    setName("")
    setCategory("")
    setDescription("")
    setImage([])
    setPrice("")
    setStock("")
    setImagePreview([])
    navigate("/admin/dashboard");
    }
  }, [error, dispatch, success, navigate]);

  // images 
  const createProductImag = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) {
      return;
    }

    const invalidFile = files.find((file) => !file.type.startsWith("image/"));
    if (invalidFile) {
      toast.error("Only image files are allowed", { position: "top-right", autoClose: 2200 });
      return;
    }

    files.forEach((file) => {
      setImage((old) => [...old, file]);
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setImagePreview((old) => [...old, reader.result]);
        }
      }
      reader.readAsDataURL(file)
    });
  };

  // Remove image function
  const removeImage = (index) => {
    setImage((old) => old.filter((_, i) => i !== index));
    setImagePreview((old) => old.filter((_, i) => i !== index));
  };
  return (
<>
      <PageTitle title="Create Product" />
      <AdminShell>
      <div className="px-0">
        <div className="max-w-2xl mx-auto flex flex-col gap-6">

          {/* Heading */}
          <div className="flex items-center gap-2">
            <div className="w-1 h-6 rounded-full bg-[#03541e]" />
            <h1 className="text-2xl font-bold text-[#12351f] tracking-tight">Create Product</h1>
          </div>

          {/* Card */}
          <div className="bg-[#ffffff] backdrop-blur-sm border border-[#d7eadb] rounded-2xl shadow-2xl shadow-[#03541e]/8 overflow-hidden">
            <div className="px-6 py-4 border-b border-[#d7eadb]">
              <p className="text-xs font-bold uppercase tracking-widest text-[#55705f]">Product Details</p>
            </div>

            <form
              ref={formRef}
              onSubmit={(e) => e.preventDefault()}
              encType="multipart/form-data"
              className="px-6 py-6 flex flex-col gap-5"
            >

              {/* Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-widest text-[#55705f]">Product Name</label>
                <input
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                  name="name"
                  placeholder="Enter product name"
                  required
                  className="bg-[#f4fbf6] border border-[#d7eadb] rounded-xl px-4 py-2.5 text-sm text-[#12351f] placeholder-[#55705f] outline-none focus:border-[#03541e]/50 focus:ring-1 focus:ring-[#03541e]/20 transition-all duration-200"
                />
              </div>

              {/* Price */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-widest text-[#55705f]">Price (₹)</label>
                <input
                  onChange={(e) => setPrice(e.target.value)}
                  type="number"
                  name="price"
                  placeholder="Enter product price"
                  required
                  className="bg-[#f4fbf6] border border-[#d7eadb] rounded-xl px-4 py-2.5 text-sm text-[#12351f] placeholder-[#55705f] outline-none focus:border-[#03541e]/50 focus:ring-1 focus:ring-[#03541e]/20 transition-all duration-200"
                />
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-widest text-[#55705f]">Description</label>
                <input
                  onChange={(e) => setDescription(e.target.value)}
                  type="text"
                  name="description"
                  placeholder="Enter product description"
                  required
                  className="bg-[#f4fbf6] border border-[#d7eadb] rounded-xl px-4 py-2.5 text-sm text-[#12351f] placeholder-[#55705f] outline-none focus:border-[#03541e]/50 focus:ring-1 focus:ring-[#03541e]/20 transition-all duration-200"
                />
              </div>

              {/* Category */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-widest text-[#55705f]">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  name="category"
                  required
                  disabled={categoryLoading}
                  className="bg-[#f4fbf6] border border-[#d7eadb] rounded-xl px-4 py-2.5 text-sm text-[#12351f] outline-none focus:border-[#03541e]/50 focus:ring-1 focus:ring-[#03541e]/20 transition-all duration-200 cursor-pointer"
                >
                  <option value="">{categoryLoading ? "Loading categories..." : "Select a category"}</option>
                  {categories.map((item, index) => (
                    <option value={item.name} key={item._id || index}>{item.name}</option>
                  ))}
                </select>
                {!categoryLoading && categories.length === 0 && (
                  <p className="text-xs text-[#55705f]">
                    No category found. Add from admin panel: <Link to="/admin/category/create" className="text-[#03541e] font-semibold underline">Create Category</Link>
                  </p>
                )}
              </div>

              {/* Stock */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-widest text-[#55705f]">Stock</label>
                <input
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  type="number"
                  name="stock"
                  placeholder="Enter product stock"
                  required
                  className="bg-[#f4fbf6] border border-[#d7eadb] rounded-xl px-4 py-2.5 text-sm text-[#12351f] placeholder-[#55705f] outline-none focus:border-[#03541e]/50 focus:ring-1 focus:ring-[#03541e]/20 transition-all duration-200"
                />
              </div>

              {/* File Upload */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-widest text-[#55705f]">Product Images</label>
                <div className="bg-[#f4fbf6] border border-[#d7eadb] rounded-xl px-4 py-2.5 transition-all duration-200 hover:border-[#03541e]/30">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    name="image"
                    onChange={createProductImag}
                    className="w-full text-sm text-[#55705f]
                      file:mr-4 file:py-1.5 file:px-4
                      file:rounded-lg file:border-0
                      file:text-xs file:font-bold file:uppercase file:tracking-wider
                      file:bg-[#03541e]/10 file:text-[#03541e]
                      hover:file:bg-[#03541e]/20
                      cursor-pointer transition-all duration-200"
                  />
                </div>
              </div>

              {/* Image Previews */}
              {imagePreview.length > 0 && (
                <div className="flex flex-wrap gap-3">
                  {imagePreview.map((img, index) => (
                    <div key={index} className="relative w-20 h-20 rounded-xl overflow-hidden border border-[#d7eadb] bg-[#f4fbf6] group">
                      <img
                        alt="Products Preview"
                        src={img}
                        className="w-full h-full object-cover object-center"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute inset-0 bg-[#03541e]/70 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center"
                      >
                        <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Divider */}
              <div className="h-px bg-[#d7eadb]" />

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl font-bold text-sm tracking-widest uppercase transition-all duration-200 bg-[#03541e] hover:bg-[#12351f] text-[#ffffff] shadow-lg shadow-[#03541e]/20 hover:shadow-[#03541e]/40 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Creating..." : "Create"}
              </button>

            </form>
          </div>
        </div>
      </div>
      </AdminShell>
    </>
  );
}
