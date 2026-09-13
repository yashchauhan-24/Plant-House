import React, { useEffect, useState } from 'react'
import '../UserStyles/Form.css'
import PageTitle from '../componant/PageTitle'
import Footer from '../componant/Footer'
import Navbar from '../componant/Navbar'
import { useDispatch, useSelector } from 'react-redux'
import { forgotPassword, removeError, removeSuccess } from '../feature/user/userSlice'
import { toast } from 'react-toastify'
import Loader from '../componant/Loader'
import { Link, useNavigate } from 'react-router-dom'
import useFormValidation from '../utils/useFormValidation'

function ForgotPassword() {
    const {loading, error, success, message}= useSelector(state=>state.user)
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [email, setEmail]=useState("")
    
    const forgotPasswordValidationRules = {
      rules: {
        email: {
          required: true,
          email: true
        }
      },
      messages: {
        email: {
          required: "Email is required",
          email: "Please enter a valid email address"
        }
      }
    };

    const forgotPasswordSubmitHandler = () => {
        const myForm = new FormData()
        myForm.set('email', email.trim())
        dispatch(forgotPassword(myForm))
    };

    const formRef = useFormValidation(forgotPasswordValidationRules, forgotPasswordSubmitHandler);
    // Error
      useEffect(() => {
        if (error) {
          toast.error(error, { position: "top-right", autoClose: 2000 });
    
          dispatch(removeError());
        }
      }, [error, dispatch]);
    
      // Suceess
      useEffect(() => {
        if (success) {
          toast.success(message, { position: "top-right", autoClose: 3000 });
          dispatch(removeSuccess());
          navigate("/profile");
        }
      }, [success, dispatch]);
  return (
   <>
  {loading ? (
    <Loader />
  ) : (
    <>
      <PageTitle title="Forgot Password" />
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-[#f4fbf6] via-[#eaf7ed] to-[#f4fbf6] flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">

          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-[#03541e]/10 border border-[#03541e]/20 flex items-center justify-center shadow-lg shadow-[#03541e]/10">
              <svg className="w-8 h-8 text-[#03541e]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
            </div>
          </div>

          {/* Card */}
          <div className="bg-[#ffffff] backdrop-blur-sm border border-[#d7eadb] rounded-2xl shadow-2xl shadow-[#03541e]/10 px-8 py-10">

            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-[#12351f] tracking-tight">Forgot Password</h2>
              <p className="mt-2 text-[#6B4C36] text-sm leading-relaxed">
                Enter your registered email and we'll send you a reset link.
              </p>
            </div>

            <form ref={formRef} onSubmit={(e) => e.preventDefault()} className="space-y-5">

              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-[#55705f] mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <svg className="w-4 h-4 text-[#55705f]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                  </span>
                  <input
                    type="email"
                    placeholder="Enter Your Registered Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    name="email"
                    className="w-full bg-[#f4fbf6] border border-[#d7eadb] focus:border-[#03541e] focus:ring-2 focus:ring-[#03541e]/20 text-[#12351f] placeholder-[#55705f] rounded-xl pl-10 pr-4 py-3 text-sm outline-none transition-all duration-200"
                  />
                </div>
              </div>

              <div className="pt-1">
                <button className="w-full py-3.5 px-6 rounded-xl font-bold text-sm tracking-widest uppercase transition-all duration-200 bg-[#03541e] hover:bg-[#12351f] text-[#ffffff] shadow-lg shadow-[#03541e]/20 hover:shadow-[#03541e]/40 active:scale-[0.98]">
                  Send Reset Link
                </button>
              </div>

            </form>

            <p className="text-center text-[#55705f] text-xs mt-6">
              Remember your password?{" "}
              <Link to="/login" className="text-[#03541e] hover:text-[#adf0be] font-semibold transition-colors duration-150">
                Back to Login
              </Link>
            </p>

          </div>
        </div>
      </div>

      <Footer />
    </>
  )}
</>
  )
}   

export default ForgotPassword
