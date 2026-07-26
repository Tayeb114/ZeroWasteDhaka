import React, { useState } from "react";
import {
  PlusCircle,
  BarChart3,
  ClipboardList,
  Bell,
  Package,
  Award,
  ChevronDown,
  Utensils,
  MapPin,
  CheckCircle2,
  Timer,
} from "lucide-react";
import Sidebar from "../components/Sidebar";

export default function RestaurantManagerDashboard() {
  const [activeNav, setActiveNav] = useState("Overview Dashboard");

  const navigate = (path) => {
    window.history.pushState({}, '', path);
    window.dispatchEvent(new Event('pushstate'));
  };

  const [form, setForm] = useState({
    category: "Rice/Biryani",
    weight: "",
    servings: "",
    preparedAt: "",
    expiryTime: "",
    packaging: "Boxed",
    instructions: "",
  });
  const [justPublished, setJustPublished] = useState(false);

  const updateForm = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const handlePublish = (e) => {
    e.preventDefault();
    setJustPublished(true);
    setTimeout(() => setJustPublished(false), 3000);
  };

  const kpis = [
    {
      label: "Total Food Rescued",
      value: "320 kg",
      icon: Package,
      trend: "+12.4% this month",
      trendPositive: true,
    },
    {
      label: "Active Listings",
      value: "3",
      icon: ClipboardList,
      trend: "1 pending · 2 claimed",
      trendPositive: null,
    },
    {
      label: "Total Waste Logged",
      value: "45 kg",
      icon: BarChart3,
      trend: "-8.1% vs last week",
      trendPositive: true,
    },
    {
      label: "Leaderboard Points",
      value: "1,250 pts",
      icon: Award,
      trend: "Tier: Gold Donor",
      trendPositive: null,
    },
  ];

  const foodCategories = [
    { name: "Rice/Biryani", img: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=200&q=80" },
    { name: "Curries", img: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=200&q=80" },
    { name: "Bread/Roti", img: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=200&q=80" },
    { name: "Bakery", img: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=200&q=80" },
    { name: "Dry Food", img: "https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=200&q=80" },
  ];

  const activeListings = [
    {
      title: "Mutton Biryani (5kg)",
      status: "AVAILABLE",
      note: "Waiting for a volunteer to claim.",
      img: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=160&q=80",
    },
    {
      title: "Chicken Curry & Roti",
      status: "CLAIMED",
      volunteer: "Tanvir Ahmed",
      eta: "18 min",
      img: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=160&q=80",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80",
    },
    {
      title: "Assorted Bakery Items",
      status: "CLAIMED",
      volunteer: "Farzana Rahman",
      eta: "6 min",
      img: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=160&q=80",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700;800&display=swap');
        .font-display { font-family: 'Fraunces', serif; }
      `}</style>

      <Sidebar />

      {/* MAIN */}
      <div className="flex-1 min-w-0">
        {/* HEADER */}
        <header className="bg-white border-b border-gray-200 px-6 lg:px-8 h-20 flex items-center justify-between sticky top-0 z-30">
          <div>
            <h1 className="font-display text-xl sm:text-2xl font-semibold text-emerald-950">
              Welcome Back, Manager!
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative w-10 h-10 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors">
              <Bell className="w-[18px] h-[18px] text-gray-500" />
              <span className="absolute -top-1 -right-1 w-4.5 h-4.5 min-w-[18px] rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center">
                3
              </span>
            </button>
            <a
              href="#post-surplus"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold px-5 py-2.5 shadow-sm shadow-emerald-100 transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              Post Surplus Food
            </a>
          </div>
        </header>

        <main className="p-6 lg:p-8 space-y-8">
          {/* KPI CARDS */}
          <section className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">
            {kpis.map((kpi) => (
              <div
                key={kpi.label}
                className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700">
                    <kpi.icon className="w-5 h-5" />
                  </span>
                  {kpi.trendPositive === true && (
                    <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 rounded-full px-2 py-1">
                      ▲ growth
                    </span>
                  )}
                </div>
                <p className="font-display text-2xl font-semibold text-gray-900 mt-4">{kpi.value}</p>
                <p className="text-xs text-gray-500 mt-1">{kpi.label}</p>
                <p
                  className={`text-xs font-medium mt-2 ${
                    kpi.trendPositive === true ? "text-emerald-600" : "text-gray-400"
                  }`}
                >
                  {kpi.trend}
                </p>
              </div>
            ))}
          </section>

          {/* FORM + ACTIVE DONATIONS */}
          <section className="grid xl:grid-cols-3 gap-6 items-stretch">
            {/* POST SURPLUS FOOD FORM */}
            <div
              id="post-surplus"
              className="xl:col-span-2 bg-white rounded-2xl border border-gray-200 p-6 lg:p-8 flex flex-col"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-display text-lg font-semibold text-gray-900">Post Surplus Food</h2>
                  <p className="text-sm text-gray-500 mt-1">List today's leftovers for nearby volunteers to claim.</p>
                </div>
                <span className="hidden sm:flex items-center justify-center w-11 h-11 rounded-xl bg-amber-50 text-amber-600">
                  <Utensils className="w-5 h-5" />
                </span>
              </div>

              <form onSubmit={handlePublish} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-2">Food Category</label>
                  <div className="relative">
                    <select
                      value={form.category}
                      onChange={(e) => updateForm("category", e.target.value)}
                      className="w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    >
                      {foodCategories.map((c) => (
                        <option key={c.name} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>

                  <div className="flex gap-2.5 mt-3 overflow-x-auto pb-1">
                    {foodCategories.map((c) => (
                      <button
                        type="button"
                        key={c.name}
                        onClick={() => updateForm("category", c.name)}
                        className={`shrink-0 rounded-xl overflow-hidden border-2 transition-colors ${
                          form.category === c.name ? "border-emerald-600" : "border-transparent"
                        }`}
                      >
                        <img src={c.img} alt={c.name} className="w-16 h-16 object-cover" />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-2">Weight (kg)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      value={form.weight}
                      onChange={(e) => updateForm("weight", e.target.value)}
                      placeholder="e.g. 5"
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-2">Estimated Servings</label>
                    <input
                      type="number"
                      min="0"
                      value={form.servings}
                      onChange={(e) => updateForm("servings", e.target.value)}
                      placeholder="e.g. 20"
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-2">Prepared At</label>
                    <input
                      type="time"
                      value={form.preparedAt}
                      onChange={(e) => updateForm("preparedAt", e.target.value)}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-2">Expiry Time</label>
                    <input
                      type="time"
                      value={form.expiryTime}
                      onChange={(e) => updateForm("expiryTime", e.target.value)}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-2">Packaging Type</label>
                  <div className="relative">
                    <select
                      value={form.packaging}
                      onChange={(e) => updateForm("packaging", e.target.value)}
                      className="w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    >
                      <option>Boxed</option>
                      <option>Poly Pack</option>
                      <option>Container</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-2">
                    Special Pickup Instructions for Volunteers
                  </label>
                  <textarea
                    rows={3}
                    value={form.instructions}
                    onChange={(e) => updateForm("instructions", e.target.value)}
                    placeholder="e.g. Use the back kitchen entrance, ask for the shift supervisor."
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold px-7 py-3.5 shadow-sm shadow-emerald-100 transition-colors"
                >
                  <MapPin className="w-4 h-4" />
                  Publish Listing to Map
                </button>

                {justPublished && (
                  <p className="flex items-center gap-2 text-sm text-emerald-700 font-medium">
                    <CheckCircle2 className="w-4 h-4" /> Listing published — volunteers nearby have been notified.
                  </p>
                )}
              </form>
            </div>

            {/* ACTIVE DONATIONS & VOLUNTEER TRACKING */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 lg:p-7 flex flex-col">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-display text-lg font-semibold text-gray-900">Active Donations</h2>
                <span className="text-xs font-semibold text-gray-400">Live tracking</span>
              </div>

              <div className="space-y-4 flex-1">
                {activeListings.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-xl border border-gray-200 p-4 hover:border-emerald-200 transition-colors"
                  >
                    <div className="flex gap-3">
                      <img
                        src={item.img}
                        alt={item.title}
                        className="w-14 h-14 rounded-lg object-cover shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-semibold text-gray-900 leading-tight">{item.title}</p>
                          <span
                            className={`shrink-0 text-[10px] font-bold uppercase tracking-wide rounded-full px-2 py-1 ${
                              item.status === "AVAILABLE"
                                ? "bg-amber-50 text-amber-600"
                                : "bg-emerald-50 text-emerald-700"
                            }`}
                          >
                            {item.status}
                          </span>
                        </div>

                        {item.status === "AVAILABLE" ? (
                          <p className="text-xs text-gray-500 mt-1.5">{item.note}</p>
                        ) : (
                          <div className="flex items-center gap-2 mt-1.5">
                            <img
                              src={item.avatar}
                              alt={item.volunteer}
                              className="w-5 h-5 rounded-full object-cover"
                            />
                            <p className="text-xs text-gray-600">
                              <span className="font-medium text-gray-800">{item.volunteer}</span> is on the way
                            </p>
                          </div>
                        )}

                        {item.status === "CLAIMED" && (
                          <div className="flex items-center gap-1.5 mt-2 text-xs text-gray-500">
                            <Timer className="w-3.5 h-3.5" />
                            ETA {item.eta}
                          </div>
                        )}
                      </div>
                    </div>

                    {item.status === "CLAIMED" && (
                      <button className="mt-3 w-full text-xs font-semibold rounded-lg border border-emerald-600 text-emerald-700 hover:bg-emerald-50 py-2 transition-colors">
                        Confirm Volunteer Arrival / Handover
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}