import React, { useEffect, useMemo, useState } from "react";
import PageTitle from "../componant/PageTitle";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import useFormValidation from "../utils/useFormValidation";
import {
  clearCategoryCreated,
  createCategory,
  fetchCategories,
  removeError,
  deleteCategory,
} from "../feature/admin/adminSlice";
import { useNavigate } from "react-router-dom";
import AdminShell from "./components/AdminShell";

export default function AddCategory() {
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    categories = [],
    categoryLoading,
    categoryCreateLoading,
    categoryCreated,
    error,
  } = useSelector((state) => state.admin);

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

    if (categoryCreated) {
      toast.success("Category created successfully", {
        position: "top-right",
        autoClose: 2000,
      });
      setName("");
      setImage(null);
      setPreview("");
      dispatch(clearCategoryCreated());
      dispatch(fetchCategories());
    }
  }, [error, categoryCreated, dispatch]);

  const sortedCategories = useMemo(() => {
    return [...categories].sort((a, b) => a.name.localeCompare(b.name));
  }, [categories]);

  const submitCategoryHandler = async () => {
    try {
      setIsSubmitting(true);
      const categoryName = name.trim();
      await dispatch(createCategory({ name: categoryName, image })).unwrap();
    } catch (submitError) {
      toast.error(
        submitError?.response?.data?.message ||
          submitError?.message ||
          submitError ||
          "Failed to create category",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const validationRules = {
    rules: {
      name: { required: true, minlength: 2 }
    },
    messages: {
      name: { required: "Category name is required", minlength: "Must be at least 2 characters" }
    }
  };

  const formRef = useFormValidation(validationRules, submitCategoryHandler);

  return (
    <>
      <PageTitle title="Add Category" />
      <AdminShell>
      <div className="px-0">
        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-[#ffffff] border border-[#d7eadb] rounded-2xl shadow-2xl shadow-[#03541e]/8 overflow-hidden">
            <div className="px-6 py-4 border-b border-[#d7eadb]">
              <p className="text-xs font-bold uppercase tracking-widest text-[#55705f]">Create Category</p>
            </div>

            <form ref={formRef} onSubmit={(e) => e.preventDefault()} className="px-6 py-6 flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-widest text-[#55705f]">Category Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                  name="name"
                  placeholder="Enter category name"
                  required
                  className="bg-[#f4fbf6] border border-[#d7eadb] rounded-xl px-4 py-2.5 text-sm text-[#12351f] placeholder-[#55705f] outline-none focus:border-[#03541e]/50 focus:ring-1 focus:ring-[#03541e]/20 transition-all duration-200"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-widest text-[#55705f]">Category Image</label>
                <input type="file" accept="image/*" onChange={(event) => { const file = event.target.files?.[0]; setImage(file || null); setPreview(file ? URL.createObjectURL(file) : ""); }} className="text-sm text-[#55705f]" />
                {preview && <img src={preview} alt="Category preview" className="h-24 w-24 rounded-full object-cover border border-[#d7eadb]" />}
              </div>

              <button
                type="submit"
                disabled={isSubmitting || categoryCreateLoading}
                className="w-full py-3.5 rounded-xl font-bold text-sm tracking-widest uppercase transition-all duration-200 bg-[#03541e] hover:bg-[#12351f] text-[#ffffff] shadow-lg shadow-[#03541e]/20 hover:shadow-[#03541e]/40 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting || categoryCreateLoading ? "CREATING..." : "Create Category"}
              </button>
            </form>
          </div>

          <div className="bg-[#ffffff] border border-[#d7eadb] rounded-2xl shadow-2xl shadow-[#03541e]/8 overflow-hidden">
            <div className="px-6 py-4 border-b border-[#d7eadb]">
              <p className="text-xs font-bold uppercase tracking-widest text-[#55705f]">Available Categories</p>
            </div>

            <div className="px-6 py-5 max-h-130 overflow-auto">
              {categoryLoading ? (
                <p className="text-sm text-[#55705f]">Loading categories...</p>
              ) : sortedCategories.length === 0 ? (
                <p className="text-sm text-[#55705f]">No categories added yet.</p>
              ) : (
                <ul className="flex flex-col gap-2">
                  {sortedCategories.map((categoryItem) => (
                    <li
                      key={categoryItem._id}
                      className="flex items-center justify-between gap-3 px-3 py-2 rounded-lg bg-[#f4fbf6] text-[#03541e] text-sm font-medium border border-[#d7eadb]"
                    >
                      <div className="flex items-center gap-3"><div className="h-10 w-10 overflow-hidden rounded-full bg-[#eaf7ed]">{categoryItem.image?.url && <img src={categoryItem.image.url} alt="" className="h-full w-full object-cover" />}</div><span>{categoryItem.name}</span></div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            navigate(`/admin/category/${categoryItem._id}/edit`);
                          }}
                          className="px-2 py-1 rounded-md bg-[#03541e] text-white text-xs"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            if (!window.confirm("Delete this category?")) return;
                            dispatch(deleteCategory(categoryItem._id))
                              .unwrap()
                              .then((res) => {
                                toast.success(res.message || "Category deleted");
                                dispatch(fetchCategories());
                              })
                              .catch((err) => {
                                toast.error(err?.message || err || "Failed to delete category");
                              });
                          }}
                          className="px-2 py-1 rounded-md bg-red-600 text-white text-xs"
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
      </AdminShell>
    </>
  );
}
