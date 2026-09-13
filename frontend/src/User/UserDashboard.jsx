import React, { useState } from "react";
import "../UserStyles/UserDashboard.css";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout, removeSuccess } from "../feature/user/userSlice.js";
import { toast } from "react-toastify";
import { removeError } from "../feature/product/productSllice";

function UserDashboard({ user }) {
  const [menuVisible, setMenuVisible] = useState(false);
  const { cartItems } = useSelector((state) => state.cart);

  const toggleMenu = () => {
    setMenuVisible((prev) => !prev);
  };
  const closeMenu = () => {
    setMenuVisible(false);
  };
  const dispatch = useDispatch();
  const options = [
    { name: "Orders", funcName: orders },
    { name: "Account", funcName: account },
    { name: `cart (${cartItems.length})`, funcName: myCart, isCart: true },
    { name: "Logout", funcName: logoutUser },
  ];
  if (user.role === "admin") {
    options.unshift({
      name: "Admin",
      funcName: dashboard,
    });
  }
  const navigate = useNavigate();

  function orders() {
    setMenuVisible(false);
    navigate("/orders/user");
  }
  function account() {
    setMenuVisible(false);
    navigate("/profile");
  }
  function logoutUser() {
    setMenuVisible(false);
    dispatch(logout())
      .unwrap()
      .then(() => {
        toast.success("Logout Successful", {
          position: "top-right",
          autoClose: 3000,
        });
        dispatch(removeSuccess());
        navigate("/login");
      })
      .catch((error) => {
        toast.error(error?.message || "Logout failed", {
          position: "top-right",
          autoClose: 3000,
        });
        dispatch(removeError());
      });
  }
  function dashboard() {
    setMenuVisible(false);
    navigate('/admin/dashboard')
  }
  function myCart() {
    navigate("/cart");
  }
  return (
<>
  {/* Overlay */}
  <div
    className={`fixed inset-0 z-40 bg-[#03541e]/60 backdrop-blur-sm transition-opacity duration-300 ${
      menuVisible ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
    }`}
    onClick={toggleMenu}
  />

  {/* Dashboard Container */}
  <div className="relative z-50">

    {/* Profile Header / Trigger */}
    <div
      onClick={toggleMenu}
      className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-[#12351f]/80 border border-[#55705f]/50 hover:border-[#03541e]/30 hover:bg-[#12351f] cursor-pointer transition-all duration-200 select-none"
    >
      <div className="w-8 h-8 rounded-lg overflow-hidden border border-[#03541e]/20 flex-shrink-0">
        <img
          src={user?.avatar?.url || "./images/profile.png"}
          alt="Profile"
          className="w-full h-full object-cover"
          onError={(e) => { e.target.src = "./images/profile.png"; }}
        />
      </div>
      <span className="text-sm font-semibold text-[#ffffff] max-w-[120px] truncate">
        {user.name || "User"}
      </span>
      {/* Chevron */}
      <svg
        className={`w-3.5 h-3.5 text-[#d7eadb] transition-transform duration-200 ${menuVisible ? "rotate-180" : ""}`}
        fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
      </svg>
    </div>

    {/* Dropdown Menu */}
    {menuVisible && (
      <div className="absolute right-0 mt-2 w-52 bg-[#03541e]/95 backdrop-blur-sm border border-[#12351f]/50 rounded-2xl shadow-2xl shadow-[#03541e]/50 overflow-hidden">

        {/* Menu Header */}
        <div className="px-4 py-3 border-b border-[#12351f]/50 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg overflow-hidden border border-[#03541e]/20 flex-shrink-0">
            <img
              src={user?.avatar?.url || "./images/profile.png"}
              alt="Profile"
              className="w-full h-full object-cover"
              onError={(e) => { e.target.src = "./images/profile.png"; }}
            />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-[#ffffff] truncate">{user.name || "User"}</p>
            <p className="text-xs text-[#55705f] truncate">{user.email || ""}</p>
          </div>
        </div>

        {/* Menu Options */}
        <div className="p-1.5 flex flex-col gap-0.5">
          {options &&
            options.map((item) => (
              <button
                onClick={item.funcName}
                key={item.name}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 text-left
                  ${item.isCart && cartItems.length > 0
                    ? "text-[#03541e] bg-[#03541e]/10 hover:bg-[#03541e]/20 border border-[#03541e]/20"
                    : "text-[#d7eadb] hover:text-[#ffffff] hover:bg-[#12351f]/60"
                  }`}
              >
                <span>{item.name}</span>
                {/* Cart badge */}
                {item.isCart && cartItems.length > 0 && (
                  <span className="ml-2 min-w-[20px] h-5 px-1.5 rounded-full bg-[#03541e] text-[#03541e] text-xs font-bold flex items-center justify-center">
                    {cartItems.length}
                  </span>
                )}
              </button>
            ))}
        </div>

      </div>
    )}
  </div>
</>
  );
}

export default UserDashboard;
