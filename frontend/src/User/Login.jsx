import React, { useEffect, useState } from "react";
import "../UserStyles/Form.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login, removeError, removeSuccess } from "../feature/user/userSlice";
import { toast } from "react-toastify";
import useFormValidation from "../utils/useFormValidation";

function Login() {
  const { error, loading, success, isAuthenticated } = useSelector(
    (state) => state.user,
  );
  const dispatch = useDispatch();
  const location = useLocation()
  const [loginEmail, setLoginEmail] = useState("");
  const [loginpass, setLoginPass] = useState("");
  const redirect = new URLSearchParams(location.search).get("redirect") ||'/'
  const navigate = useNavigate();

  const loginValidationRules = {
    rules: {
      email: {
        required: true,
        email: true
      },
      password: {
        required: true,
        minlength: 6
      }
    },
    messages: {
      email: {
        required: "Email is required",
        email: "Please enter a valid email"
      },
      password: {
        required: "Password is required",
        minlength: "Password must be at least 6 characters"
      }
    }
  };

  const loginSubmitHandler = () => {
    dispatch(login({ email: loginEmail.trim(), password: loginpass, loginType: "user" }));
  };

  const formRef = useFormValidation(loginValidationRules, loginSubmitHandler);
  // Error
  useEffect(() => {
    if (error) {
      toast.error(error, { position: "top-right", autoClose: 2000 });

      dispatch(removeError());
    }
  }, [error, dispatch]);
  
  // Success
  useEffect(() => {
    if (success && isAuthenticated) {
      toast.success("Login successfull! Redirecting...", {
        position: "top-right",
        autoClose: 3000,
      });

      const timer = setTimeout(() => {
        dispatch(removeSuccess());
        navigate(redirect);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [success, isAuthenticated, dispatch, navigate, redirect]);

  return (
<div className="min-h-screen bg-gradient-to-br from-[#f4fbf6] via-[#eaf7ed] to-[#f4fbf6] flex items-center justify-center px-4 py-16">
  <div className="w-full max-w-md">

    {/* Logo / Brand */}
    <div className="flex justify-center mb-8">
      <div className="w-14 h-14 rounded-2xl bg-[#03541e]/10 border border-[#03541e]/20 flex items-center justify-center shadow-lg shadow-[#03541e]/10">
        <svg className="w-7 h-7 text-[#03541e]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
        </svg>
      </div>
    </div>

    {/* Card */}
    <div className="bg-[#ffffff] backdrop-blur-sm border border-[#d7eadb] rounded-2xl shadow-2xl shadow-[#03541e]/10 px-8 py-10">

      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-[#12351f] tracking-tight">Sign In</h2>
        <p className="mt-2 text-[#6B4C36] text-sm">Welcome back! Please enter your details.</p>
      </div>

      <form ref={formRef} onSubmit={(e) => e.preventDefault()} className="space-y-5">

        {/* Email */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-widest text-[#55705f] mb-1.5">
            Email
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <svg className="w-4 h-4 text-[#55705f]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
            </span>
            <input
              type="email"
              name="email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full bg-[#f4fbf6] border border-[#d7eadb] focus:border-[#03541e] focus:ring-2 focus:ring-[#03541e]/20 text-[#12351f] placeholder-[#55705f] rounded-xl pl-10 pr-4 py-3 text-sm outline-none transition-all duration-200"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-widest text-[#55705f] mb-1.5">
            Password
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <svg className="w-4 h-4 text-[#55705f]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
            </span>
            <input
              type="password"
              name="password"
              value={loginpass}
              onChange={(e) => setLoginPass(e.target.value)}
              placeholder="Enter your password"
              className="w-full bg-[#f4fbf6] border border-[#d7eadb] focus:border-[#03541e] focus:ring-2 focus:ring-[#03541e]/20 text-[#12351f] placeholder-[#55705f] rounded-xl pl-10 pr-4 py-3 text-sm outline-none transition-all duration-200"
            />
          </div>
        </div>

        {/* Forgot Password */}
        <div className="flex justify-end">
          <Link
            to="/forgot/password"
            className="text-xs text-[#03541e] hover:text-[#adf0be] font-semibold transition-colors duration-150"
          >
            Forgot Password? Reset Here
          </Link>
        </div>

        {/* Submit */}
        <div className="pt-1">
          <button className="w-full py-3.5 px-6 rounded-xl font-bold text-sm tracking-widest uppercase transition-all duration-200 bg-[#03541e] hover:bg-[#12351f] text-[#ffffff] shadow-lg shadow-[#03541e]/20 hover:shadow-[#03541e]/40 active:scale-[0.98]">
            Sign In
          </button>
        </div>

      </form>

      {/* Sign Up Link */}
      <p className="text-center text-[#55705f] text-xs mt-6">
        Don't have an account?{" "}
        <Link to="/register" className="text-[#03541e] hover:text-[#adf0be] font-semibold transition-colors duration-150">
          Sign Up
        </Link>
      </p>

    </div>
  </div>
</div>
  );
}

export default Login;
