import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../feature/user/userSlice";
import MenuIcon from "@mui/icons-material/Menu";

function AdminHeader({ onOpenMenu }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);

  const handleLogout = async () => {
    await dispatch(logout());
    navigate("/admin/login");
  };

  return (
    <div className="w-full">
      <div className="admin-header w-full flex items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-3.5">
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            type="button"
            onClick={onOpenMenu}
            className="admin-mobile-menu-button lg:hidden w-9 h-9 rounded-xl transition-all duration-200 flex items-center justify-center"
            aria-label="Open sidebar menu"
          >
            <MenuIcon style={{ fontSize: 20 }} />
          </button>

          <div className="hidden sm:block min-w-0">
            <p className="admin-header-eyebrow">Admin Workspace</p>
            <p className="admin-header-subtitle truncate">Manage store operations</p>
          </div>
        </div>

        <div className="admin-header-account flex items-center gap-3 min-w-0">
        <div className="flex items-center gap-2 min-w-0">
          <div className="admin-avatar w-9 h-9 rounded-xl overflow-hidden shrink-0">
            <img
              src={user?.avatar?.url || "/images/profile.png"}
              alt="Admin"
              className="w-full h-full object-cover object-center"
              onError={(e) => {
                e.currentTarget.src = "/images/profile.png";
              }}
            />
          </div>
          <div className="min-w-0">
            <p className="admin-header-eyebrow">Admin</p>
            <p className="admin-header-user truncate max-w-35 sm:max-w-55">
              {user?.name || "Administrator"}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="admin-logout-button px-4 py-2 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-200"
          aria-label="Logout"
        >
          Logout
        </button>
        </div>
      </div>
    </div>
  );
}

export default AdminHeader;
