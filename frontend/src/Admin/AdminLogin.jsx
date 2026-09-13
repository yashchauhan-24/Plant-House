import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  login,
  removeError,
  removeSuccess,
} from "../feature/user/userSlice";
import { isValidEmail } from "../utils/formValidation";

function AdminLogin() {
  const { error, success, isAuthenticated, user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState({ email: false, password: false });

  const handleSubmit = (e) => {
    e.preventDefault();

    const requiredErrors = {
      email: !email.trim(),
      password: !password.trim(),
    };
    setFieldErrors(requiredErrors);

    if (requiredErrors.email || requiredErrors.password) {
      return;
    }

    if (!isValidEmail(email)) {
      toast.error("Please enter a valid email address", { position: "top-right", autoClose: 2200 });
      setFieldErrors((prev) => ({ ...prev, email: true }));
      return;
    }

    dispatch(login({ email: email.trim(), password, loginType: "admin" }));
  };

  useEffect(() => {
    if (error) {
      toast.error(error, { position: "top-right", autoClose: 2200 });
      dispatch(removeError());
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (success && isAuthenticated && user) {
      toast.success("Admin login successful", {
        position: "top-right",
        autoClose: 1800,
      });

      const timer = setTimeout(() => {
        dispatch(removeSuccess());
        navigate("/admin/dashboard");
      }, 1400);

      return () => clearTimeout(timer);
    }
  }, [success, isAuthenticated, user, dispatch, navigate]);

  useEffect(() => {
    if (isAuthenticated && user?.role === "admin") {
      navigate("/admin/dashboard");
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f4fbf6] via-[#eaf7ed] to-[#f4fbf6] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-[#03541e]/10 border border-[#03541e]/20 flex items-center justify-center shadow-lg shadow-[#03541e]/10">
            <svg className="w-7 h-7 text-[#03541e]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.5l9-9 9 9M4.5 12L12 4.5 19.5 12M6 10.5V19.5h12v-9" />
            </svg>
          </div>
        </div>

        <div className="bg-[#ffffff] border border-[#d7eadb] rounded-2xl shadow-2xl shadow-[#03541e]/10 px-8 py-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-[#12351f] tracking-tight">Admin Login</h2>
            <p className="mt-2 text-[#6B4C36] text-sm">Access admin dashboard securely.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-[#55705f] mb-1.5">
                Admin Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  const value = e.target.value;
                  setEmail(value);
                  if (value.trim()) {
                    setFieldErrors((prev) => ({ ...prev, email: false }));
                  }
                }}
                onBlur={() => setFieldErrors((prev) => ({ ...prev, email: !email.trim() }))}
                placeholder="Enter admin email"
                className={`w-full bg-[#f4fbf6] border ${fieldErrors.email ? "border-red-400" : "border-[#d7eadb]"} ${fieldErrors.email ? "focus:border-red-400 focus:ring-red-400/20" : "focus:border-[#03541e] focus:ring-[#03541e]/20"} focus:ring-2 text-[#12351f] placeholder-[#55705f] rounded-xl px-4 py-3 text-sm outline-none transition-all duration-200`}
              />
              {fieldErrors.email && <p className="mt-2 text-sm text-red-500">Email is required</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-[#55705f] mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  const value = e.target.value;
                  setPassword(value);
                  if (value.trim()) {
                    setFieldErrors((prev) => ({ ...prev, password: false }));
                  }
                }}
                onBlur={() => setFieldErrors((prev) => ({ ...prev, password: !password.trim() }))}
                placeholder="Enter password"
                className={`w-full bg-[#f4fbf6] border ${fieldErrors.password ? "border-red-400" : "border-[#d7eadb]"} ${fieldErrors.password ? "focus:border-red-400 focus:ring-red-400/20" : "focus:border-[#03541e] focus:ring-[#03541e]/20"} focus:ring-2 text-[#12351f] placeholder-[#55705f] rounded-xl px-4 py-3 text-sm outline-none transition-all duration-200`}
              />
              {fieldErrors.password && <p className="mt-2 text-sm text-red-500">Password is required</p>}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-xl font-bold text-sm tracking-widest uppercase transition-all duration-200 bg-[#03541e] hover:bg-[#12351f] text-[#ffffff] shadow-lg shadow-[#03541e]/20 hover:shadow-[#03541e]/40 active:scale-[0.98]"
            >
              Login To Admin
            </button>
          </form>

          <p className="text-center text-[#55705f] text-xs mt-6">
            User account?{" "}
            <Link to="/login" className="text-[#03541e] hover:text-[#adf0be] font-semibold transition-colors duration-150">
              Go to user login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;