import React, { useEffect, useState } from "react";
import "../AdminStyles/UpdateProduct.css";
import PageTitle from "../componant/PageTitle";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {getProductDetails} from '../feature/product/productSllice.js'
import { removeError, removeSuccess, updateProduct, fetchCategories } from "../feature/admin/adminSlice";
import { toast } from "react-toastify";
import AdminShell from "./components/AdminShell";
import useFormValidation from "../utils/useFormValidation";

function UpdateProducts() {
  const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [stock, setStock] = useState("");
    const [image, setImage] = useState([]);
    const [imagePreview, setImagePreview] = useState([]);
    const [oldImage, setOldImage] = useState([]);
    const {product} = useSelector(state=>state.product);
    const {success, error, loading, categories = []} = useSelector(state=>state.admin);
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const {updateId} = useParams();

    // Fetch categories on mount
    useEffect(()=>{
      dispatch(fetchCategories());
    },[dispatch])

    useEffect(()=>{
      if(updateId){
        dispatch(getProductDetails(updateId))
      }
    },[dispatch, updateId])

    // Prefill form when product data is loaded
    useEffect(() => {
      if (product && product._id) {
        setName(product.name || "");
        setPrice(product.price || "");
        setDescription(product.description || "");
        setCategory(product.category || "");
        setStock(product.stock || "");
        setOldImage(product.images || []);
        // Clear new images when loading a product for editing
        setImage([]);
        setImagePreview([]);
      }
    }, [product]);

  const handleImageChange  = (e) =>{
     const files = Array.from(e.target.files);
    if (!files.length) {
      return;
    }

    const invalidFile = files.find((file) => !file.type.startsWith("image/"));
    if (invalidFile) {
      toast.error("Only image files are allowed", { position: "top-right", autoClose: 2200 });
      return;
    }
    setImage([]);
    setImagePreview([]);

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
  }

  const updateProductSubmitHandler = () => {
    if (!image.length && !oldImage.length) {
      toast.error("Please keep at least one product image", { position: "top-right", autoClose: 2200 });
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
    oldImage.forEach((img) => {
      myForm.append("oldImages", JSON.stringify(img));
    })
    dispatch(updateProduct({id:updateId, formData: myForm}))
  }

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

  const formRef = useFormValidation(validationRules, updateProductSubmitHandler);

   useEffect(() => {
      if (error) {
        toast.error(error?.message || error, {
          position: "top-right",
          autoClose: 2000,
        });
    
        dispatch(removeError());
      }
      if (success) {
        toast.success("Product Updated Successfully", {
          position: "top-right",
          autoClose: 2000,
        });
        dispatch(removeSuccess());
        navigate('/admin/products')
      }
    }, [error, dispatch, success]);
  return (
<>
      <PageTitle title="Update Products" />
      <AdminShell>
      <div className="px-0">
        <div className="max-w-2xl mx-auto flex flex-col gap-6">

          {/* Heading */}
          <div className="flex items-center gap-2">
            <div className="w-1 h-6 rounded-full bg-[#03541e]" />
            <h1 className="text-2xl font-bold text-[#12351f] tracking-tight">Update Product</h1>
          </div>

          {/* Card */}
          <div className="bg-[#ffffff] backdrop-blur-sm border border-[#d7eadb] rounded-2xl shadow-2xl shadow-[#03541e]/8 overflow-hidden">
            <div className="px-6 py-4 border-b border-[#d7eadb]">
              <p className="text-xs font-bold uppercase tracking-widest text-[#55705f]">Product Details</p>
            </div>

            <form ref={formRef} encType="multipart/form-data" onSubmit={(e) => e.preventDefault()} className="px-6 py-6 flex flex-col gap-5">

              {/* Name */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-[#55705f]">Product Name</label>
                <input
                  type="text" value={name} name="name" id="name"
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="bg-[#f4fbf6] border border-[#d7eadb] rounded-xl px-4 py-2.5 text-sm text-[#12351f] placeholder-[#55705f]/50 outline-none focus:border-[#03541e]/50 focus:ring-1 focus:ring-[#03541e]/20 transition-all duration-200"
                />
              </div>

              {/* Price */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="price" className="text-xs font-bold uppercase tracking-widest text-[#55705f]">Product Price (₹)</label>
                <input
                  type="number" value={price} name="price" id="price"
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  className="bg-[#f4fbf6] border border-[#d7eadb] rounded-xl px-4 py-2.5 text-sm text-[#12351f] placeholder-[#55705f]/50 outline-none focus:border-[#03541e]/50 focus:ring-1 focus:ring-[#03541e]/20 transition-all duration-200"
                />
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="decsriprion" className="text-xs font-bold uppercase tracking-widest text-[#55705f]">Product Description</label>
                <input
                  type="text" value={description} name="description" id="decsriprion"
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  className="bg-[#f4fbf6] border border-[#d7eadb] rounded-xl px-4 py-2.5 text-sm text-[#12351f] placeholder-[#55705f]/50 outline-none focus:border-[#03541e]/50 focus:ring-1 focus:ring-[#03541e]/20 transition-all duration-200"
                />
              </div>

              {/* Category */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="category" className="text-xs font-bold uppercase tracking-widest text-[#55705f]">Product Category</label>
                <select
                  value={category} id="category" name="category"
                  onChange={(e) => setCategory(e.target.value)}
                  required
                  className="bg-[#f4fbf6] border border-[#d7eadb] rounded-xl px-4 py-2.5 text-sm text-[#12351f] outline-none focus:border-[#03541e]/50 focus:ring-1 focus:ring-[#03541e]/20 transition-all duration-200 cursor-pointer"
                >
                  <option value="">Select a category</option>
                  {categories.map((item) => (
                    <option value={item.name} key={item._id || item.name}>{item.name}</option>
                  ))}
                </select>
              </div>

              {/* Stock */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="stock" className="text-xs font-bold uppercase tracking-widest text-[#55705f]">Product Stock</label>
                <input
                  type="number" value={stock} name="stock" id="stock"
                  onChange={(e) => setStock(e.target.value)}
                  required
                  className="bg-[#f4fbf6] border border-[#d7eadb] rounded-xl px-4 py-2.5 text-sm text-[#12351f] placeholder-[#55705f]/50 outline-none focus:border-[#03541e]/50 focus:ring-1 focus:ring-[#03541e]/20 transition-all duration-200"
                />
              </div>

              {/* File Upload */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="image" className="text-xs font-bold uppercase tracking-widest text-[#55705f]">Product Images</label>
                <div className="bg-[#f4fbf6] border border-[#d7eadb] rounded-xl px-4 py-2.5 hover:border-[#03541e]/30 transition-all duration-200">
                  <input
                    type="file" multiple accept="image/" name="image" id="image"
                    onChange={handleImageChange}
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

              {/* New Image Previews */}
              {imagePreview.length > 0 && (
                <div className="flex flex-col gap-2">
                  <p className="text-xs font-bold uppercase tracking-widest text-[#55705f]">New Images</p>
                  <div className="flex flex-wrap gap-3">
                    {imagePreview.map((img, index) => (
                      <div key={index} className="w-20 h-20 rounded-xl overflow-hidden border border-[#03541e]/30 bg-[#f4fbf6]">
                        <img src={img} alt="" className="w-full h-full object-cover object-center" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Old Images */}
              {oldImage.length > 0 && (
                <div className="flex flex-col gap-2">
                  <p className="text-xs font-bold uppercase tracking-widest text-[#55705f]">Current Images</p>
                  <div className="flex flex-wrap gap-3">
                    {oldImage.map((img, index) => (
                      <div key={index} className="w-20 h-20 rounded-xl overflow-hidden border border-[#d7eadb] bg-[#f4fbf6]">
                        <img src={img.url} alt="Old Image Preview" className="w-full h-full object-cover object-center" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Divider */}
              <div className="h-px bg-[#d7eadb]" />

              {/* Submit */}
              <button
                type="submit"
                className="w-full py-3.5 rounded-xl font-bold text-sm tracking-widest uppercase transition-all duration-200 bg-[#03541e] hover:bg-[#80f1a9] text-[#f4fbf6] shadow-lg shadow-[#80f1a9]/20 hover:shadow-[#80f1a9]/40 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? 'Updating Product...' : 'Update'}
              </button>

            </form>
          </div>
        </div>
      </div>
      </AdminShell>
    </>
  );
}

export default UpdateProducts;