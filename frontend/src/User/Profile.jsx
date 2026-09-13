import React, { useEffect } from 'react'
import PageTitle from '../componant/PageTitle'
import '../UserStyles/Profile.css'
import Navbar from '../componant/Navbar'
import Footer from '../componant/Footer'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Loader from '../componant/Loader'


const Profile = () => {
    const navigate = useNavigate()
    const {loading, isAuthenticated,user}= useSelector(state=>state.user)
    useEffect(()=>{
        if(isAuthenticated === false){
            navigate('/login')
        }
    })
  
  return (
<>
  {loading ? (<Loader />) : !user ? (<h1>User not found</h1>) : (
    <>
      <PageTitle
        title={
          user?.name
            ? `${user.name.charAt(0).toUpperCase() + user.name.slice(1)} Profile`
            : "Profile"
        }
      />
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-[#f4fbf6] via-[#eaf7ed] to-[#f4fbf6] px-4 py-16">
        <div className="w-full max-w-lg mx-auto flex flex-col gap-4">

          {/* ── Hero Card ── */}
          <div className="bg-[#ffffff] backdrop-blur-sm border border-[#d7eadb] rounded-2xl shadow-2xl shadow-[#03541e]/10 overflow-hidden">

            {/* Banner */}
            <div className="h-24 bg-gradient-to-br from-[#03541e] via-[#12351f] to-[#03541e] relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#03541e]/10 via-transparent to-[#03541e]/5" />
            </div>

            {/* Hero Body */}
            <div className="px-7 pb-6 -mt-10 relative z-10">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

                {/* Avatar */}
                <div className="w-20 h-20 rounded-2xl p-0.5 bg-gradient-to-br from-[#03541e] via-[#adf0be] to-[#03541e] shadow-lg shadow-[#03541e]/20 flex-shrink-0"
                  style={{ boxShadow: '0 0 0 4px #f4fbf6, 0 8px 28px rgba(201,151,58,0.2)' }}>
                  <div className="w-full h-full rounded-2xl overflow-hidden border-2 border-[#eaf7ed]">
                    <img
                      src={user.avatar?.url || './images/profile.png'}
                      alt="User Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Edit Button */}
                <Link
                  to="/profile/update"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#03541e]/10 border border-[#03541e]/20 text-[#03541e] hover:text-[#03541e] hover:bg-[#03541e]/20 hover:border-[#03541e]/40 text-xs font-semibold uppercase tracking-widest transition-all duration-200 hover:-translate-y-0.5 w-fit"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
                  </svg>
                  Edit Profile
                </Link>
              </div>

              {/* Name & Badge */}
              <h1 className="mt-4 text-2xl font-bold text-[#12351f] tracking-tight">
                Welcome,{" "}
                <span className="text-[#03541e]">
                  {user.name ? user.name.charAt(0).toUpperCase() + user.name.slice(1) : ""}
                </span>
              </h1>
              <p className="mt-1 text-[#55705f] text-xs">Manage your account and preferences</p>

              <div className="inline-flex items-center gap-2 mt-3 px-3 py-1.5 rounded-full bg-[#03541e]/10 border border-[#03541e]/20 text-[#03541e] text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-[#03541e] shadow shadow-[#03541e]/60 animate-pulse" />
                Premium Member
              </div>
            </div>

            {/* Stats Strip */}
            <div className="grid grid-cols-3 border-t border-[#d7eadb]">
              <div className="py-4 text-center border-r border-[#d7eadb]">
                <div className="text-xl font-bold text-[#03541e]">
                  {user.createdAt ? Math.floor((new Date() - new Date(user.createdAt)) / (1000 * 60 * 60 * 24 * 30)) : 0}
                </div>
                <div className="text-xs text-[#55705f] uppercase tracking-widest mt-1">Months</div>
              </div>
              <div className="py-4 text-center border-r border-[#d7eadb]">
                <div className="text-xl font-bold text-[#03541e]">
                  {user.createdAt ? String(user.createdAt).substring(0, 4) : '—'}
                </div>
                <div className="text-xs text-[#55705f] uppercase tracking-widest mt-1">Since Year</div>
              </div>
              <div className="py-4 text-center">
                <div className="text-xl font-bold text-[#03541e]">1</div>
                <div className="text-xs text-[#55705f] uppercase tracking-widest mt-1">Account</div>
              </div>
            </div>
          </div>

          {/* ── Details Card ── */}
          <div className="bg-[#ffffff] backdrop-blur-sm border border-[#d7eadb] rounded-2xl shadow-2xl shadow-[#03541e]/10">
            <div className="px-7 pt-6 pb-4">

              {/* Section Header */}
              <div className="flex items-center gap-3 mb-5">
                <span className="text-xs font-bold uppercase tracking-widest text-[#03541e]/60">Account Details</span>
                <div className="flex-1 h-px bg-gradient-to-r from-[#03541e]/20 to-transparent" />
              </div>

              {/* Name Field */}
              <div className="flex items-center gap-4 p-3.5 rounded-xl bg-[#f4fbf6] border border-[#d7eadb] hover:border-[#03541e]/30 hover:bg-[#eaf7ed] hover:translate-x-1 transition-all duration-200 mb-2.5 cursor-default">
                <div className="w-10 h-10 rounded-xl bg-[#03541e]/10 border border-[#03541e]/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-[#03541e]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-widest text-[#55705f] mb-0.5">Full Name</div>
                  <div className="text-sm font-medium text-[#12351f]">{user.name}</div>
                </div>
              </div>

              {/* Email Field */}
              <div className="flex items-center gap-4 p-3.5 rounded-xl bg-[#f4fbf6] border border-[#d7eadb] hover:border-[#03541e]/30 hover:bg-[#eaf7ed] hover:translate-x-1 transition-all duration-200 mb-2.5 cursor-default">
                <div className="w-10 h-10 rounded-xl bg-[#03541e]/10 border border-[#03541e]/20 flex items-center justify-content-center flex-shrink-0 flex items-center justify-center">
                  <svg className="w-4 h-4 text-[#03541e]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-widest text-[#55705f] mb-0.5">Email Address</div>
                  <div className="text-sm font-medium text-[#12351f]">{user.email}</div>
                </div>
              </div>

              {/* Joined Field */}
              <div className="flex items-center gap-4 p-3.5 rounded-xl bg-[#f4fbf6] border border-[#d7eadb] hover:border-[#03541e]/30 hover:bg-[#eaf7ed] hover:translate-x-1 transition-all duration-200 cursor-default">
                <div className="w-10 h-10 rounded-xl bg-[#03541e]/10 border border-[#03541e]/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-[#03541e]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                  </svg>
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-widest text-[#55705f] mb-0.5">Member Since</div>
                  <div className="text-sm font-medium text-[#12351f]">
                    {user.createdAt ? String(user.createdAt).substring(0, 10) : 'N/A'}
                  </div>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 px-7 py-2">
              <div className="flex-1 h-px bg-[#d7eadb]" />
              <div className="w-1.5 h-1.5 rounded-sm rotate-45 bg-[#03541e]/40" />
              <div className="flex-1 h-px bg-[#d7eadb]" />
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 px-7 pb-7 pt-3">
              <Link
                to="/orders/user"
                className="flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl font-bold text-xs tracking-widest uppercase transition-all duration-200 bg-[#03541e] hover:bg-[#12351f] text-[#ffffff] shadow-lg shadow-[#03541e]/20 hover:shadow-[#03541e]/40 active:scale-[0.98] hover:-translate-y-0.5"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
                </svg>
                My Orders
              </Link>
              <Link
                to="/password/update"
                className="flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl font-bold text-xs tracking-widest uppercase transition-all duration-200 bg-transparent border border-[#03541e]/20 text-[#03541e] hover:bg-[#03541e]/10 hover:border-[#03541e]/40 hover:text-[#03541e] active:scale-[0.98] hover:-translate-y-0.5"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
                Change Password
              </Link>
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </>
  )}
</>
  )
}

export default Profile
