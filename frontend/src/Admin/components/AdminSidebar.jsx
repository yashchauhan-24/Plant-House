import React from "react";
import { Link, useLocation } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import InventoryIcon from "@mui/icons-material/Inventory";
import CategoryIcon from "@mui/icons-material/Category";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PeopleIcon from "@mui/icons-material/People";
import ReviewsIcon from "@mui/icons-material/Reviews";

const navGroups = [
  {
    label: "Overview",
    items: [
      { to: "/admin/dashboard", label: "Dashboard", icon: DashboardIcon },
    ],
  },
  {
    label: "Management",
    items: [
      { to: "/admin/products", label: "Products", icon: InventoryIcon },
      { to: "/admin/category/create", label: "Categories", icon: CategoryIcon },
      { to: "/admin/orders", label: "Orders", icon: ShoppingCartIcon },
      { to: "/admin/users", label: "Users", icon: PeopleIcon },
    ],
  },
  {
    label: "Content",
    items: [
      { to: "/admin/reviews", label: "Reviews", icon: ReviewsIcon },
    ],
  },
];

function NavItem({ to, label, Icon, isActive, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`admin-sidebar-item group flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${isActive ? "is-active" : ""}`}
      aria-label={label}
    >
      {React.createElement(Icon, { style: { fontSize: 18 } })}
      <span>{label}</span>
    </Link>
  );
}

export default function AdminSidebar({ mobileOpen = false, onClose }) {
  const location = useLocation();

  const content = (
    <>
      <div className="admin-sidebar-header flex items-center gap-2 px-4 py-5">
        <DashboardIcon className="admin-sidebar-brand-icon" style={{ fontSize: 22 }} />
        <span className="admin-sidebar-title">Admin Panel</span>
      </div>

      <nav className="flex flex-col gap-6 px-4 py-6 flex-1">
        {navGroups.map((group) => (
          <div key={group.label} className="flex flex-col gap-1.5">
            <p className="text-[11px] font-bold uppercase tracking-widest text-[#55705f] px-2 mb-1">
              {group.label}
            </p>
            {group.items.map((item) => (
              <NavItem
                key={item.to}
                to={item.to}
                label={item.label}
                Icon={item.icon}
                isActive={location.pathname.startsWith(item.to)}
                onClick={onClose}
              />
            ))}
          </div>
        ))}
      </nav>
    </>
  );

  return (
    <>
      <aside className="admin-sidebar hidden lg:flex w-64 shrink-0 flex-col min-h-screen">
        {content}
      </aside>

      <div
        className={`fixed inset-0 z-50 lg:hidden transition-all duration-200 ${
          mobileOpen ? "visible" : "invisible"
        }`}
        aria-hidden={!mobileOpen}
      >
        <button
          type="button"
          onClick={onClose}
          className={`admin-sidebar-scrim absolute inset-0 backdrop-blur-[1px] transition-opacity duration-200 ${
            mobileOpen ? "opacity-100" : "opacity-0"
          }`}
          aria-label="Close sidebar"
        />

        <aside
          className={`admin-sidebar admin-sidebar-mobile relative w-72 max-w-[85vw] h-full flex flex-col transition-transform duration-250 ${
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {content}
        </aside>
      </div>
    </>
  );
}
