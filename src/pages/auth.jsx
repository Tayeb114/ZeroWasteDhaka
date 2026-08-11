import React, { useState, useEffect } from "react";
import { Leaf, ArrowRight, ArrowLeft, Mail, Lock, User, Info, Building2, MapPin, Shield, Utensils, Sparkles } from "lucide-react";
import { API_BASE_URL } from "../config/api";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function AuthPage() {
  const [searchParams] = useSearchParams();
  const modeParam = searchParams.get("mode");
  const roleParam = searchParams.get("role");

  const [activeTab, setActiveTab] = useState(modeParam === "register" ? "register" : "signin"); // "signin" or "register"
  const [role, setRole] = useState(roleParam === "manager" ? "manager" : "volunteer"); // "volunteer" or "manager"

  useEffect(() => {
    if (modeParam === "register" || modeParam === "signin") {
      setActiveTab(modeParam);
    }
    if (roleParam === "manager" || roleParam === "volunteer") {
      setRole(roleParam);
    }
  }, [modeParam, roleParam]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [restaurantName, setRestaurantName] = useState("");
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const url = activeTab === "signin" 
        ? `${API_BASE_URL}/auth/login` 
        : `${API_BASE_URL}/auth/register`;
      
      const payload = activeTab === "signin"
        ? { email, password }
        : { name, email, password, role, restaurantName: role === "manager" ? restaurantName : "" };

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Authentication failed");
      }

      // Save user session in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("name", data.name);
      localStorage.setItem("userId", data._id);
      localStorage.setItem("points", data.points || 0);
      if (data.restaurantName) {
        localStorage.setItem("restaurantName", data.restaurantName);
      } else {
        localStorage.removeItem("restaurantName");
      }
      localStorage.setItem("user", JSON.stringify(data));

      window.dispatchEvent(new Event("pushstate"));

      if (data.role === "volunteer") {
        navigate("/map");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-55 flex items-center justify-center p-4 sm:p-6 lg:p-8" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700;800&display=swap');
        .font-display { font-family: 'Fraunces', serif; }
      `}</style>

      {/* Decorative background blobs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-emerald-100 rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-pulse pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-amber-100 rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-pulse pointer-events-none" style={{ animationDelay: "2s" }} />

      <div className="relative w-full max-w-md bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 p-8">
        
        {/* BRANDING */}
        <div className="flex flex-col items-center mb-8">
          <span className="flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-700 shadow-md shadow-emerald-75">
            <Leaf className="w-6 h-6 text-white" />
          </span>
          <h1 className="font-display text-2xl font-bold text-emerald-950 mt-4 tracking-tight">
            ZeroWaste <span className="text-amber-500">Dhaka</span>
          </h1>
          <p className="text-xs text-gray-500 mt-1.5 font-medium">
            Rescuing surplus food, protecting the environment
          </p>
        </div>

        {/* TAB SWITCHER */}
        <div className="flex bg-gray-55/70 bg-gray-100/80 rounded-2xl p-1 mb-8 border border-gray-200/30">
          <button
            onClick={() => { setActiveTab("signin"); setError(""); }}
            className={`flex-1 text-xs font-semibold py-3 rounded-xl transition-all duration-200 ${
              activeTab === "signin"
                ? "bg-white text-emerald-950 shadow-sm"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setActiveTab("register"); setError(""); }}
            className={`flex-1 text-xs font-semibold py-3 rounded-xl transition-all duration-200 ${
              activeTab === "register"
                ? "bg-white text-emerald-950 shadow-sm"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            Create Account
          </button>
        </div>

        {/* FORM CONTAINER */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-red-50 text-red-700 border border-red-200 text-xs font-semibold rounded-xl p-3.5 text-center">
              ⚠️ {error}
            </div>
          )}
          {/* Name / Business Name (Registration only) */}
          {activeTab === "register" && (
            <div>
              <label htmlFor="name-input" className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">
                Full Name / Business Name
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400">
                  <User className="w-[18px] h-[18px]" />
                </span>
                <input
                  id="name-input"
                  type="text"
                  required
                  placeholder="Enter name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 transition-all text-gray-900 font-medium"
                />
              </div>
            </div>
          )}

          {/* Email Address */}
          <div>
            <label htmlFor="email-input" className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400">
                <Mail className="w-[18px] h-[18px]" />
              </span>
              <input
                id="email-input"
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 transition-all text-gray-900 font-medium"
              />
            </div>
            {activeTab === "signin" && (
              <p className="text-[10px] text-gray-400 mt-1.5">
                💡 Tip: Use email with "manager" or "rahim" to simulate Manager dashboard.
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password-input" className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400">
                <Lock className="w-[18px] h-[18px]" />
              </span>
              <input
                id="password-input"
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 transition-all text-gray-900 font-medium"
              />
            </div>
          </div>

          {/* ROLE SELECTOR CARDS (Registration only) */}
          {activeTab === "register" && (
            <div className="pt-2 space-y-4">
              <div>
                <span className="block text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wider">
                  Select Your Role
                </span>
                <div className="grid grid-cols-2 gap-4">
                  {/* Volunteer Card */}
                  <button
                    type="button"
                    onClick={() => setRole("volunteer")}
                    className={`flex flex-col items-start text-left p-4 rounded-2xl border transition-all ${
                      role === "volunteer"
                        ? "border-emerald-600 bg-emerald-50/20 ring-1 ring-emerald-600"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <span className={`flex items-center justify-center w-8 h-8 rounded-lg mb-3 ${role === "volunteer" ? "bg-emerald-100 text-emerald-700" : "bg-gray-150 bg-gray-100 text-gray-500"}`}>
                      <Shield className="w-4 h-4" />
                    </span>
                    <span className="text-xs font-bold text-gray-900">Volunteer</span>
                    <span className="text-[10px] text-gray-400 mt-1 leading-normal">
                      Claim and rescue surplus food.
                    </span>
                  </button>

                  {/* Manager Card */}
                  <button
                    type="button"
                    onClick={() => setRole("manager")}
                    className={`flex flex-col items-start text-left p-4 rounded-2xl border transition-all ${
                      role === "manager"
                        ? "border-emerald-600 bg-emerald-50/20 ring-1 ring-emerald-600"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <span className={`flex items-center justify-center w-8 h-8 rounded-lg mb-3 ${role === "manager" ? "bg-emerald-100 text-emerald-700" : "bg-gray-150 bg-gray-100 text-gray-500"}`}>
                      <Utensils className="w-4 h-4" />
                    </span>
                    <span className="text-xs font-bold text-gray-900">Manager</span>
                    <span className="text-[10px] text-gray-400 mt-1 leading-normal">
                      Log and donate food surplus.
                    </span>
                  </button>
                </div>
              </div>

              {/* Dynamic Restaurant Name input field for Manager */}
              {role === "manager" && (
                <div>
                  <label htmlFor="restaurant-name-input" className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">
                    RESTAURANT / BUSINESS NAME
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400">
                      <Utensils className="w-[18px] h-[18px]" />
                    </span>
                    <input
                      id="restaurant-name-input"
                      type="text"
                      required
                      placeholder="e.g., Dhaka Restaurant, Kacchi Bhai"
                      value={restaurantName}
                      onChange={(e) => setRestaurantName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 transition-all text-gray-900 font-medium"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ACTION BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold py-4 shadow-sm shadow-emerald-100 transition-colors mt-6"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : activeTab === "signin" ? (
              <>
                Sign In to Dashboard
                <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Register Account (0 pts Start)
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
