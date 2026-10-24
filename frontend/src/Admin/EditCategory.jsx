import React, { useEffect, useState } from "react";
import PageTitle from "../componant/PageTitle";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import AdminShell from "./components/AdminShell";
import { useNavigate, useParams } from "react-router-dom";
import { updateCategory, fetchCategories } from "../feature/admin/adminSlice";

export default function EditCategory() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { categories = [], categoryLoading } = useSelector((state) => state.admin);
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!categories || categories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [categories, dispatch]);

  useEffect(() => {
    const cat = categories.find((c) => c._id === id);
    if (cat) { setName(cat.name); setPreview(cat.image?.url || ""); }
  }, [categories, id]);

  const submitHandler = async (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (trimmed.length < 2) {
      toast.error("Category name must be at least 2 characters");
      return;
    }

    try {
      setIsSubmitting(true);
      const category = categories.find((item) => item._id === id);
      const res = await dispatch(updateCategory({
        id,
        name: trimmed,
        image,
        oldImage: category?.image,
      })).unwrap();
      toast.success(res.message || "Category updated successfully");
      navigate("/admin/category/create");
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          err ||
          "Failed to update category",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <PageTitle title="Edit Category" />
      <AdminShell>
        <div className="max-w-2xl mx-auto bg-[#ffffff] border border-[#d7eadb] rounded-2xl p-6">
          <h3 className="text-sm font-bold uppercase tracking-widest text-[#55705f] mb-3">Edit Category</h3>
          <form onSubmit={submitHandler} className="flex flex-col gap-4">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              placeholder="Category name"
              className="bg-[#f4fbf6] border border-[#d7eadb] rounded-xl px-4 py-2 text-sm"
            />
            <label className="text-xs font-bold uppercase tracking-widest text-[#55705f]">Category Image</label>
            <input type="file" accept="image/*" onChange={(event) => { const file = event.target.files?.[0]; setImage(file || null); setPreview(file ? URL.createObjectURL(file) : preview); }} className="text-sm text-[#55705f]" />
            {preview && <img src={preview} alt="Category preview" className="h-24 w-24 rounded-full object-cover border border-[#d7eadb]" />}

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isSubmitting || categoryLoading}
                className="px-4 py-2 rounded-md bg-[#03541e] text-white"
              >
                {isSubmitting || categoryLoading ? "UPDATING..." : "Update Category"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/admin/category/create")}
                className="px-4 py-2 rounded-md border border-[#d7eadb]"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </AdminShell>
    </>
  );
}
