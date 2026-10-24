import React, { useState } from "react";
import AdminHeader from "../AdminHeader";
import AdminSidebar from "./AdminSidebar";
import "../../AdminStyles/AdminShell.css";

export default function AdminShell({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="admin-layout min-h-screen bg-gradient-to-br from-[#f4fbf6] via-[#eaf7ed] to-[#f4fbf6] flex">
      <AdminSidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="admin-right flex-1 min-w-0 flex flex-col">
        <AdminHeader onOpenMenu={() => setMobileOpen(true)} />
        <main className="admin-main px-4 sm:px-6 pt-6 pb-12 flex-1">{children}</main>
      </div>
    </div>
  );
}
