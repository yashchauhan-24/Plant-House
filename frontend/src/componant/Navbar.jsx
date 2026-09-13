import React, { useEffect, useRef, useState } from "react";
import "../componentStyles/Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import PersonAdd from "@mui/icons-material/PersonAdd";
import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
import "../PageStyles/Search.css";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../feature/user/userSlice";

function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const [profileOpen, setProfileOpen] = useState(false);
  const toggleProfile = () => setProfileOpen(!profileOpen);
  const [isSearchOpen, setSearchOpen] = useState(false);
  const [isMobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const toggleSearch = () => setSearchOpen(!isSearchOpen);
  const mobileSearchInputRef = useRef(null);
  const handleSearchClick = () => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      setMobileSearchOpen((open) => !open);
      setIsMenuOpen(false);
      return;
    }
    toggleSearch();
  };
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const { cartItems } = useSelector((state) => state.cart);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setMobileSearchOpen(false);
    if (searchQuery.trim()) {
      navigate(`/products?keyword=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate(`/products`);
    }
  };

  useEffect(() => {
    if (isMobileSearchOpen) {
      mobileSearchInputRef.current?.focus();
    }
  }, [isMobileSearchOpen]);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") setMobileSearchOpen(false);
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    setIsMenuOpen(false);
    setProfileOpen(false);
    navigate("/login");
  };

  const options = [
    { name: "Profile", funcName: () => { navigate("/profile"); setProfileOpen(false); } },
    { name: "My Orders", funcName: () => { navigate("/orders/user"); setProfileOpen(false); } },
    { name: "Wishlist", funcName: () => { navigate("/wishlist"); setProfileOpen(false); }, isWishlist: true },
    { name: "Cart", funcName: () => { navigate("/cart"); setProfileOpen(false); }, isCart: true },
    ...(user?.role === "admin"
      ? [{ name: "Dashboard", funcName: () => { navigate("/admin/dashboard"); setProfileOpen(false); } }]
      : []),
    { name: "Logout", funcName: handleLogout },
  ];
  return (
<nav className="plant-navbar">
  <div className="plant-announcement">
    <div className="plant-announcement-track">
      <span>FREE SHIPPING ON ORDERS ABOVE ₹499</span>
      <span>FRESH, HEALTHY PLANTS</span>
      <span>100% PLANT GROWTH GUARANTEE</span>
      <span aria-hidden="true">FREE SHIPPING ON ORDERS ABOVE ₹499</span>
      <span aria-hidden="true">FRESH, HEALTHY PLANTS</span>
      <span aria-hidden="true">100% PLANT GROWTH GUARANTEE</span>
    </div>
  </div>
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="plant-mainbar flex items-center justify-between gap-4">

      {/* ── Logo ── */}
      <div className="plant-brand flex-shrink-0">
        <Link
          to="/"
          onClick={() => setIsMenuOpen(false)}
          className="text-xl font-bold text-[#ffffff] tracking-tight transition-colors duration-200"
        >
          <span className="plant-mark">PH</span>
          <span className="plant-logo-text">Plant House</span>
        </Link>
      </div>

      {/* ── Right Side Icons ── */}
      <div className="plant-actions flex items-center gap-2 ml-auto">

        {/* Search */}
        <div className="plant-search-shell relative flex items-center">
          <form
            onSubmit={handleSearchSubmit}
            className={`flex items-center transition-all duration-300 overflow-hidden ${
              isSearchOpen ? "w-44 sm:w-56" : "w-0"
            }`}
          >
            <input
              type="text"
              placeholder="Search for plants..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="plant-search-input"
            />
          </form>
          <button
            type="button"
            onClick={handleSearchClick}
            className="plant-icon-button"
          >
            <SearchIcon style={{ fontSize: 20 }} />
          </button>
        </div>

        <div className="plant-action-icons flex items-center gap-2">
        {/* Cart */}
        <div className="relative">
          <Link
            to="/wishlist"
            className="plant-icon-button"
          >
            <FavoriteBorderIcon style={{ fontSize: 20 }} />
            {wishlistItems?.length > 0 && (
              <span className="plant-count-badge">
                {wishlistItems.length}
              </span>
            )}
          </Link>
        </div>

        {/* Cart */}
        <div className="relative">
          <Link
            to="/cart"
            className="plant-icon-button"
          >
            <ShoppingCartIcon style={{ fontSize: 20 }} />
            {cartItems?.length > 0 && (
              <span className="plant-count-badge">
                {cartItems.length}
              </span>
            )}
          </Link>
        </div>

        {/* Register if not authenticated */}
        {!isAuthenticated && (
          <Link
            to="/register"
            className="plant-icon-button"
          >
            <PersonAdd style={{ fontSize: 20 }} />
          </Link>
        )}

        {/* ── Dashboard / Profile (RIGHT END) ── */}
        {isAuthenticated && (
        <div className="relative">

          {/* Overlay */}
          <div
            className={`fixed inset-0 z-40 bg-[#03541e]/60 backdrop-blur-sm transition-opacity duration-300 ${
              profileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
            }`}
            onClick={toggleProfile}
          />

          {/* Profile Trigger */}
          <div
            onClick={toggleProfile}
            className="relative z-50 flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-[#12351f]/80 border border-[#55705f]/50 hover:border-[#03541e]/30 hover:bg-[#12351f] cursor-pointer transition-all duration-200 select-none"
          >
            <div className="w-7 h-7 rounded-lg overflow-hidden border border-[#03541e]/20 flex-shrink-0">
              <img
                src={user?.avatar?.url || "./images/profile.png"}
                alt="Profile"
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = "./images/profile.png"; }}
              />
            </div>
            <span className="hidden sm:block text-sm font-semibold text-[#ffffff] max-w-[100px] truncate">
              {user?.name || "User"}
            </span>
            <svg
              className={`w-3.5 h-3.5 text-[#d7eadb] transition-transform duration-200 ${profileOpen ? "rotate-180" : ""}`}
              fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </div>

          {/* Dropdown */}
          {profileOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-[#03541e]/95 backdrop-blur-sm border border-[#12351f]/50 rounded-2xl shadow-2xl shadow-[#03541e]/50 overflow-hidden z-50">

              {/* Dropdown Header */}
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
                  <p className="text-xs font-semibold text-[#ffffff] truncate">{user?.name || "User"}</p>
                  <p className="text-xs text-[#55705f] truncate">{user?.email || ""}</p>
                </div>
              </div>

              {/* Dropdown Options */}
              <div className="p-1.5 flex flex-col gap-0.5">
                {options &&
                  options.map((item) => (
                    <button
                      onClick={item.funcName}
                      key={item.name}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 text-left ${
                        item.isCart && cartItems.length > 0
                          ? "text-[#03541e] bg-[#03541e]/10 hover:bg-[#03541e]/20 border border-[#03541e]/20"
                          : item.isWishlist && wishlistItems.length > 0
                          ? "text-[#03541e] bg-[#03541e]/10 hover:bg-[#03541e]/20 border border-[#03541e]/20"
                          : "text-[#d7eadb] hover:text-[#ffffff] hover:bg-[#12351f]/60"
                      }`}
                    >
                      <span>{item.name}</span>
                      {item.isCart && cartItems.length > 0 && (
                        <span className="ml-2 min-w-[20px] h-5 px-1.5 rounded-full bg-[#03541e] text-[#03541e] text-xs font-bold flex items-center justify-center">
                          {cartItems.length}
                        </span>
                      )}
                      {item.isWishlist && wishlistItems.length > 0 && (
                        <span className="ml-2 min-w-[20px] h-5 px-1.5 rounded-full bg-[#03541e] text-[#03541e] text-xs font-bold flex items-center justify-center">
                          {wishlistItems.length}
                        </span>
                      )}
                    </button>
                  ))}
              </div>

            </div>
          )}
        </div>
        )}

        {/* ── Mobile Hamburger ── */}
        <button
          onClick={toggleMenu}
          className="plant-icon-button flex md:hidden"
        >
          {isMenuOpen ? (
            <CloseIcon style={{ fontSize: 20 }} />
          ) : (
            <MenuIcon style={{ fontSize: 20 }} />
          )}
        </button>
        </div>

      </div>
    </div>

    <ul className="plant-desktop-links">
      <li><Link to="/" onClick={() => setIsMenuOpen(false)} className="plant-nav-link">Home</Link></li>
      <li><Link to="/products" className="plant-nav-link">Plants</Link></li>
      <li><Link to="/about-us" className="plant-nav-link">About Us</Link></li>
    </ul>

    <div className={`plant-mobile-search ${isMobileSearchOpen ? "is-open" : ""}`}>
      <form onSubmit={handleSearchSubmit} className="plant-mobile-search-form">
        <input
          ref={mobileSearchInputRef}
          type="search"
          placeholder="Search for plants..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label="Search for plants"
        />
        <button type="submit" aria-label="Submit plant search">
          <SearchIcon style={{ fontSize: 19 }} />
        </button>
      </form>
    </div>

    {/* ── Mobile Menu ── */}
    {isMenuOpen && (
      <div className="md:hidden border-t border-[#12351f]/50 py-3 flex flex-col gap-1">
        <Link
          to="/"
          onClick={() => setIsMenuOpen(false)}
          className="plant-nav-link"
        >
          Home
        </Link>
        <Link
          to="/products"
          className="plant-nav-link"
        >
            Plants
        </Link>
        <Link
          to="/about-us"
          className="plant-nav-link"
        >
          About Us
        </Link>
      </div>
    )}

  </div>
</nav>
  );
}

export default Navbar;
