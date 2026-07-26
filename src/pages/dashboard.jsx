import React, { useState, useEffect } from "react";
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
  const [imageUrl, setImageUrl] = useState("");
  const [activeListings, setActiveListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [justPublished, setJustPublished] = useState(false);
  const [kpiData, setKpiData] = useState({
    totalRescued: 0,
    activeCount: 0,
    wasteCount: 0,
    leaderboardPoints: 0
  });

  const [form, setForm] = useState({
    category: "Rice/Biryani",
    weight: "",
    servings: "",
    preparedAt: "",
    expiryTime: "",
    packaging: "Boxed",
    instructions: "",
  });

  const navigate = (path) => {
    window.history.pushState({}, '', path);
    window.dispatchEvent(new Event('pushstate'));
  };

  const updateForm = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const fetchListings = async () => {
    try {
      const response = await fetch("http://localhost:5001/api/listings");
      const data = await response.json();
      if (response.ok) {
        const managerId = localStorage.getItem("userId");
        const managerListings = data.filter(
          (item) => item.postedBy && item.postedBy._id === managerId && item.status !== "completed"
        );
        setActiveListings(managerListings);

        const wasteRes = await fetch("http://localhost:5001/api/waste-logs");
        const wasteData = await wasteRes.json();
        const managerWaste = wasteRes.ok 
          ? wasteData.logs.filter((log) => log.managerId && log.managerId._id === managerId).reduce((sum, log) => sum + log.weightKg, 0)
          : 0;

        const completedRescues = data.filter(
          (item) => item.postedBy && item.postedBy._id === managerId && item.status === "completed"
        ).reduce((sum, item) => sum + item.weightKg, 0);

        const userRes = await fetch("http://localhost:5001/api/users/leaderboard");
        const userLeaderboard = await userRes.json();
        let points = localStorage.getItem("points") || 0;
        if (userRes.ok) {
          const matchedManager = userLeaderboard.restaurants.find((r) => r._id === managerId);
          if (matchedManager) {
            points = matchedManager.points;
            localStorage.setItem("points", points);
          }
        }

        setKpiData({
          totalRescued: completedRescues,
          activeCount: managerListings.length,
          wasteCount: managerWaste,
          leaderboardPoints: points
        });
      }
    } catch (error) {
      console.error("Error fetching listings:", error);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePublish = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const managerId = localStorage.getItem("userId");
      const fallbackImg = "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80";
      const finalImg = imageUrl || fallbackImg;

      const res = await fetch("http://localhost:5001/api/listings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: `${form.category} (${form.weight}kg)`,
          category: form.category,
          weightKg: parseFloat(form.weight) || 0,
          location: "Star Restaurant, Dhanmondi 27",
          imageUrl: finalImg,
          postedBy: managerId,
        }),
      });

      if (res.ok) {
        setJustPublished(true);
        setTimeout(() => setJustPublished(false), 3000);
        setForm({
          category: "Rice/Biryani",
          weight: "",
          servings: "",
          preparedAt: "",
          expiryTime: "",
          packaging: "Boxed",
          instructions: "",
        });
        setImageUrl("");
        fetchListings();
      }
    } catch (err) {
      console.error("Error publishing listing:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async (listingId) => {
    try {
      const res = await fetch(`http://localhost:5001/api/listings/${listingId}/complete`, {
        method: "PUT",
      });
      if (res.ok) {
        fetchListings();
      }
    } catch (err) {
      console.error("Error completing listing:", err);
    }
  };

  const kpis = [
    {
      label: "Total Food Rescued",
      value: `${kpiData.totalRescued} kg`,
      icon: Package,
      trend: "+12.4% this month",
      trendPositive: true,
    },
    {
      label: "Active Listings",
      value: `${kpiData.activeCount}`,
      icon: ClipboardList,
      trend: "Manager active items",
      trendPositive: null,
    },
    {
      label: "Total Waste Logged",
      value: `${kpiData.wasteCount} kg`,
      icon: BarChart3,
      trend: "From waste log",
      trendPositive: false,
    },
    {
      label: "Leaderboard Points",
      value: `${kpiData.leaderboardPoints} pts`,
      icon: Award,
      trend: "Tier: Star Donor",
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

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700;800&display=swap');
        .font-display { font-family: 'Fraunces', serif; }
      `}</style>

      <Sidebar />

      <div className="flex-1 min-w-0">
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

          <section className="grid xl:grid-cols-3 gap-6 items-stretch">
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

              <form onSubmit={handlePublish} className="space-y-5 flex-1 flex flex-col justify-between">
                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-2">Food Category</label>
                    <div className="flex gap-3 overflow-x-auto pb-2">
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
                        required
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
                    <label className="block text-xs font-semibold text-gray-600 mb-2">Food Image</label>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="flex-1 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                      />
                      <input
                        type="text"
                        placeholder="Or paste image URL fallback"
                        value={imageUrl.startsWith("data:") ? "" : imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
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
                      placeholder="e.g. Use the back kitchen entrance, ask for the shift supervisor Rahim Uddin."
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                    />
                  </div>
                </div>

                <div className="pt-5 flex items-center gap-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold px-7 py-3.5 shadow-sm shadow-emerald-100 transition-colors disabled:opacity-50"
                  >
                    {loading ? (
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <MapPin className="w-4 h-4" />
                        Publish Listing to Map
                      </>
                    )}
                  </button>

                  {justPublished && (
                    <p className="flex items-center gap-2 text-sm text-emerald-700 font-medium">
                      <CheckCircle2 className="w-4 h-4" /> Listing published — volunteers nearby have been notified.
                    </p>
                  )}
                </div>
              </form>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6 lg:p-7 flex flex-col">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-display text-lg font-semibold text-gray-900">Active Donations</h2>
                <span className="text-xs font-semibold text-gray-400">Live tracking</span>
              </div>

              <div className="space-y-4 flex-1 overflow-y-auto max-h-[500px] pr-1">
                {activeListings.map((item) => (
                  <div
                    key={item._id}
                    className="rounded-xl border border-gray-200 p-4 hover:border-emerald-200 transition-colors"
                  >
                    <div className="flex gap-3">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-14 h-14 rounded-lg object-cover shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-semibold text-gray-900 leading-tight">{item.title}</p>
                          <span
                            className={`shrink-0 text-[10px] font-bold uppercase tracking-wide rounded-full px-2 py-1 ${
                              item.status === "available"
                                ? "bg-amber-50 text-amber-600"
                                : "bg-emerald-50 text-emerald-700"
                            }`}
                          >
                            {item.status.toUpperCase()}
                          </span>
                        </div>

                        {item.status === "available" ? (
                          <p className="text-xs text-gray-500 mt-1.5">Waiting for a volunteer to claim.</p>
                        ) : (
                          <div className="flex items-center gap-2 mt-1.5">
                            <img
                              src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80"
                              alt="Volunteer avatar"
                              className="w-5 h-5 rounded-full object-cover"
                            />
                            <p className="text-xs text-gray-600">
                              <span className="font-medium text-gray-800">{item.claimedBy ? item.claimedBy.name : "Volunteer"}</span> is on the way
                            </p>
                          </div>
                        )}

                        {item.status === "claimed" && (
                          <div className="flex items-center gap-1.5 mt-2 text-xs text-gray-500">
                            <Timer className="w-3.5 h-3.5" />
                            ETA 15 min
                          </div>
                        )}
                      </div>
                    </div>

                    {item.status === "claimed" && (
                      <button
                        onClick={() => handleComplete(item._id)}
                        className="mt-3 w-full text-xs font-semibold rounded-lg border border-emerald-600 text-emerald-700 hover:bg-emerald-50 py-2 transition-colors"
                      >
                        Confirm Volunteer Arrival / Handover
                      </button>
                    )}
                  </div>
                ))}

                {activeListings.length === 0 && (
                  <p className="text-sm text-gray-400 text-center py-10">
                    No active listings posted yet.
                  </p>
                )}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}