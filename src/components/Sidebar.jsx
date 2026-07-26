import React, { useState, useEffect } from "react";
import {
  Leaf,
  LayoutDashboard,
  PlusCircle,
  BarChart3,
  ClipboardList,
  Trophy,
  LogOut,
  Map,
} from "lucide-react";

export default function Sidebar() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [role, setRole] = useState(localStorage.getItem("role") || "volunteer");
  const [name, setName] = useState(localStorage.getItem("name") || "");

  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname;
      let currentRole = localStorage.getItem("role") || "volunteer";
      
      // Auto-promote role to manager based on manager-specific routes
      if (path === "/dashboard" || path === "/wastelog") {
        currentRole = "manager";
        localStorage.setItem("role", "manager");
      }
      
      setCurrentPath(path);
      setRole(currentRole);
      setName(localStorage.getItem("name") || "");
    };

    window.addEventListener("popstate", handleLocationChange);
    window.addEventListener("pushstate", handleLocationChange);
    
    // Run once on mount to capture initial route role
    handleLocationChange();

    return () => {
      window.removeEventListener("popstate", handleLocationChange);
      window.removeEventListener("pushstate", handleLocationChange);
    };
  }, []);

  const navigate = (path) => {
    window.history.pushState({}, "", path);
    window.dispatchEvent(new Event("pushstate"));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    navigate("/auth");
  };

  // Define navigation items based on role
  const managerLinks = [
    { label: "Overview Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { label: "Post Leftovers", path: "/map", icon: PlusCircle },
    { label: "Waste Log Analytics", path: "/wastelog", icon: BarChart3 },
    { label: "Active Claims", path: "/active-claim", icon: ClipboardList },
    { label: "Profile & Leaderboard", path: "/leaderboard", icon: Trophy },
  ];

  const volunteerLinks = [
    { label: "Browse Food Feed", path: "/map", icon: Map },
    { label: "Active Claims", path: "/active-claim", icon: ClipboardList },
    { label: "Profile & Leaderboard", path: "/leaderboard", icon: Trophy },
  ];

  const links = role === "manager" ? managerLinks : volunteerLinks;

  const displayName = name || (role === "manager" ? "Rahim Uddin" : "Tanvir Ahmed");
  const displayRole = role === "manager" ? "Manager · Star Restaurant" : "Volunteer";
  const displayAvatar =
    role === "manager"
      ? "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=100&q=80"
      : "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80";

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-200 shrink-0 h-screen sticky top-0">
      <div className="h-20 flex items-center gap-2.5 px-6 border-b border-gray-100">
        <span className="flex items-center justify-center w-9 h-9 rounded-full bg-emerald-700">
          <Leaf className="w-4.5 h-4.5 text-white" />
        </span>
        <span className="font-display text-base font-semibold text-emerald-900 leading-tight">
          ZeroWaste <span className="text-amber-500">Dhaka</span>
        </span>
      </div>

      <nav className="flex-1 px-3 py-6 space-y-1">
        {links.map((item) => {
          const active = currentPath === item.path;
          return (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                active
                  ? "bg-emerald-50 text-emerald-800"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
              }`}
            >
              <item.icon className={`w-[18px] h-[18px] ${active ? "text-emerald-700" : "text-gray-400"}`} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-3 px-2 py-2">
          <img
            src={displayAvatar}
            alt={`${displayName} profile`}
            className="w-10 h-10 rounded-full object-cover border border-gray-200"
          />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">{displayName}</p>
            <p className="text-xs text-gray-500 truncate">{displayRole}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="mt-2 w-full flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut className="w-[18px] h-[18px]" />
          Logout
        </button>
      </div>
    </aside>
  );
}
