import React, { useState, useEffect } from "react";
import {
  Search,
  MapPin,
  Clock,
  CheckCircle,
} from "lucide-react";
import Sidebar from "../components/Sidebar";

export default function VolunteerMapFeed() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [claimedId, setClaimedId] = useState(null);
  const [donations, setDonations] = useState([]);

  const navigate = (path) => {
    window.history.pushState({}, "", path);
    window.dispatchEvent(new Event("pushstate"));
  };

  const fetchDonations = async () => {
    try {
      const res = await fetch("http://localhost:5001/api/listings");
      const data = await res.json();
      if (res.ok) {
        // Map backend schemas to frontend UI models
        const mapped = data
          .filter((item) => item.status === "available")
          .map((item) => ({
            id: item._id,
            title: item.title,
            restaurant: item.postedBy ? item.postedBy.name : "ZeroWaste Partner",
            area: item.location || "Dhaka",
            distance: "1.2 km away",
            expiry: "Expires in 2 hours",
            urgent: item.weightKg > 4,
            category: item.category,
            tags: [item.category, "Fresh", `${item.weightKg} kg`],
            img: item.imageUrl,
          }));
        setDonations(mapped);
      }
    } catch (err) {
      console.error("Error fetching listings:", err);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  const filters = ["All", "Rice/Biryani", "Curries", "Bakery"];

  const filteredDonations = donations.filter((d) => {
    const matchesFilter = activeFilter === "All" || d.category === activeFilter;
    const matchesQuery =
      query.trim() === "" ||
      d.area.toLowerCase().includes(query.toLowerCase()) ||
      d.restaurant.toLowerCase().includes(query.toLowerCase()) ||
      d.title.toLowerCase().includes(query.toLowerCase());
    return matchesFilter && matchesQuery;
  });

  const handleClaim = async (id) => {
    setClaimedId(id);
    try {
      const volunteerId = localStorage.getItem("userId");
      const res = await fetch(`http://localhost:5001/api/listings/${id}/claim`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ claimedBy: volunteerId }),
      });
      if (res.ok) {
        setTimeout(() => {
          navigate("/active-claim");
        }, 1000);
      }
    } catch (err) {
      console.error("Error claiming listing:", err);
    }
  };

  return (
    <div className="h-screen bg-gray-50 text-gray-900 flex overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700;800&display=swap');
        .font-display { font-family: 'Fraunces', serif; }
      `}</style>

      <Sidebar />

      {/* MAIN */}
      <div className="flex-1 min-w-0 flex flex-col h-screen overflow-y-auto">
        {/* HEADER */}
        <header className="bg-white border-b border-gray-200 px-6 lg:px-8 py-5 shrink-0 sticky top-0 z-15">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="font-display text-2xl font-semibold text-emerald-950">
                Browse Food Feed
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                Find available surplus food listings near your area in Dhaka.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search areas, restaurants..."
                  className="w-full rounded-full border border-gray-200 bg-gray-50 pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              <div className="flex items-center gap-2 overflow-x-auto">
                {filters.map((f) => (
                  <button
                    key={f}
                    onClick={() => setActiveFilter(f)}
                    className={`shrink-0 rounded-full text-xs font-semibold px-4 py-2 transition-colors ${
                      activeFilter === f
                        ? "bg-emerald-700 text-white"
                        : "bg-gray-50 text-gray-500 border border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <main className="p-6 lg:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-gray-900">
              Available Donations
            </h2>
            <span className="text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-full px-3 py-1">
              {filteredDonations.length} Active Listings
            </span>
          </div>

          {/* GRID CARD LAYOUT */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredDonations.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-md transition-all flex flex-col group"
              >
                {/* Food Image */}
                <div className="h-48 overflow-hidden relative shrink-0">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {item.urgent && (
                    <span className="absolute top-3 right-3 bg-red-600 text-white text-[10px] font-bold tracking-wider uppercase rounded-full px-2.5 py-1 shadow-sm">
                      Urgent Pickup
                    </span>
                  )}
                  <span className="absolute bottom-3 left-3 bg-emerald-900/80 backdrop-blur-sm text-white text-[11px] font-semibold rounded-full px-3 py-1">
                    {item.category}
                  </span>
                </div>

                {/* Card Info */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-display text-base font-semibold text-gray-900 group-hover:text-emerald-800 transition-colors">
                        {item.title}
                      </h3>
                    </div>
                    <p className="text-xs text-gray-500 font-medium">{item.restaurant}</p>
                    
                    {/* Location Badge */}
                    <div className="flex items-center gap-1.5 text-xs text-gray-600">
                      <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                      <span>{item.area} &bull; {item.distance}</span>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 pt-1.5">
                      {item.tags.map((tag) => (
                        <span key={tag} className="text-[10px] font-semibold bg-gray-100 text-gray-500 rounded-md px-2 py-0.5">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Expiration Timer & Button */}
                  <div className="flex items-center justify-between gap-3 pt-5 mt-4 border-t border-gray-100">
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-semibold rounded-full px-2.5 py-1 ${
                        item.urgent ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-600"
                      }`}
                    >
                      <Clock className="w-3 h-3" />
                      {item.expiry}
                    </span>

                    <button
                      onClick={() => handleClaim(item.id)}
                      disabled={claimedId !== null}
                      className={`rounded-full text-xs font-semibold px-4.5 py-2.5 transition-colors flex items-center gap-1.5 ${
                        claimedId === item.id
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-emerald-700 hover:bg-emerald-800 text-white shadow-sm"
                      }`}
                    >
                      {claimedId === item.id ? (
                        <>
                          <CheckCircle className="w-3.5 h-3.5" />
                          Claimed!
                        </>
                      ) : (
                        "Claim Donation"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredDonations.length === 0 && (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
              <p className="text-sm text-gray-500">No listings match your search or filter.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}