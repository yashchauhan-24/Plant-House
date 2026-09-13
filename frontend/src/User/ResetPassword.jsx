import React, { useEffect, useState } from 'react'
import '../UserStyles/Form.css'
import PageTitle from '../componant/PageTitle'
import Navbar from '../componant/Navbar'
import Footer from '../componant/Footer'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { removeError, removeSuccess, resetPassword } from '../feature/user/userSlice'
import { toast } from 'react-toastify'
import useFormValidation from '../utils/useFormValidation'

function ResetPassword() {
    const {loading, error, success}=useSelector(state=>state.user)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [password, setPassword]=useState("")
    const [confirmPassword, setConfirmPassword]=useState("")
    const {token} = useParams()
    
    const resetPasswordValidationRules = {
      rules: {
        newPassword: {
          required: true,
          minlength: 8
        },
        confirmPassword: {
          required: true,
          minlength: 8,
          equalTo: "[name='newPassword']"
        }
      },
      messages: {
        newPassword: {
          required: "Password is required",
          minlength: "Password must be at least 8 characters"
        },
        confirmPassword: {
          required: "Please confirm your password",
          minlength: "Password must be at least 8 characters",
          equalTo: "Passwords do not match"
        }
      }
    };

    const resetPasswordSubmitHandler = () => {
        const data={
            password,
            confirmPassword,
        }
        dispatch(resetPassword({token: token, uderData:data}))
    }

    const formRef = useFormValidation(resetPasswordValidationRules, resetPasswordSubmitHandler);

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
              toast.success("Password reset  successfully! plz login to continue", {
                position: "top-right",
                autoClose: 3000,
              });
              dispatch(removeSuccess());
              navigate("/login");
            }
          }, [success, dispatch]);
  return (

<>
  <PageTitle title="Reset Password" />
  <Navbar />

  <div className="min-h-screen bg-linear-to-br from-[#f4fbf6] via-[#eaf7ed] to-[#f4fbf6] flex items-center justify-center px-4 py-16">
    <div className="w-full max-w-md">

      {/* Logo / Brand */}
      <div className="flex justify-center mb-8">
        <div className="w-14 h-14 rounded-2xl bg-[#03541e]/10 border border-[#03541e]/20 flex items-center justify-center shadow-lg shadow-[#03541e]/10">
          <svg className="w-7 h-7 text-[#03541e]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
        </div>
      </div>

      {/* Card */}
      <div className="bg-[#ffffff] backdrop-blur-sm border border-[#d7eadb] rounded-2xl shadow-2xl shadow-[#03541e]/10 px-8 py-10">

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-[#12351f] tracking-tight">Reset Password</h2>
          <p className="mt-2 text-[#6B4C36] text-sm">Enter your new password below.</p>
        </div>

        <form ref={formRef} onSubmit={(e) => e.preventDefault()} className="space-y-5">

          {/* New Password */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-[#55705f] mb-1.5">
              New Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <svg className="w-4 h-4 text-[#55705f]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
              </span>
              <input
                type="password"
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                name="newPassword"
                className="w-full bg-[#f4fbf6] border border-[#d7eadb] focus:border-[#03541e] focus:ring-2 focus:ring-[#03541e]/20 text-[#12351f] placeholder-[#55705f] rounded-xl pl-10 pr-4 py-3 text-sm outline-none transition-all duration-200"
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-[#55705f] mb-1.5">
              Confirm Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <svg className="w-4 h-4 text-[#55705f]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              </span>
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                name="confirmPassword"
                className="w-full bg-[#f4fbf6] border border-[#d7eadb] focus:border-[#03541e] focus:ring-2 focus:ring-[#03541e]/20 text-[#12351f] placeholder-[#55705f] rounded-xl pl-10 pr-4 py-3 text-sm outline-none transition-all duration-200"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="pt-1">
            <button className="w-full py-3.5 px-6 rounded-xl font-bold text-sm tracking-widest uppercase transition-all duration-200 bg-[#03541e] hover:bg-[#12351f] text-[#ffffff] shadow-lg shadow-[#03541e]/20 hover:shadow-[#03541e]/40 active:scale-[0.98]">
              Reset Password
            </button>
          </div>

        </form>
      </div>
    </div>
  </div>

  <Footer />
</>
  )
}

export default ResetPassword
