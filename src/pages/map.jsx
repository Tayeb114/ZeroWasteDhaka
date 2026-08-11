import React, { useState, useEffect } from "react";
import {
  Search,
  MapPin,
  Clock,
  CheckCircle,
  Star,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { API_BASE_URL } from "../config/api";
import ReviewsDrawer from "../components/ReviewsDrawer";

const getRemainingTimeText = (dateString) => {
  if (!dateString) return "Expires in 2 hrs"; // sensible default fallback
  const expiryDate = new Date(dateString);
  if (isNaN(expiryDate.getTime())) return "Expires in 2 hrs";

  const diffMs = expiryDate - new Date();
  if (diffMs <= 0) return "Expired";

  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMins / 60);

  if (diffHours >= 1) {
    const remainingMins = diffMins % 60;
    return remainingMins > 0 
      ? `Expires in ${diffHours}h ${remainingMins}m` 
      : `Expires in ${diffHours} hr${diffHours > 1 ? 's' : ''}`;
  }
  return `Expires in ${diffMins} min${diffMins > 1 ? 's' : ''}`;
};

export default function VolunteerMapFeed() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [claimedId, setClaimedId] = useState(null);
  const [donations, setDonations] = useState([]);
  const [ratings, setRatings] = useState({});
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState(null);
  const [selectedRestaurantName, setSelectedRestaurantName] = useState("");

  const navigate = useNavigate();

  const fetchDonations = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/listings`);
      const data = await res.json();
      if (res.ok) {
        // Map backend schemas to frontend UI models
        const mapped = data
          .filter((item) => {
            if (item.status === "available") return true;
            if (item.status === "claimed") {
              const oneHourAgo = Date.now() - 60 * 60 * 1000;
              return new Date(item.updatedAt || item.claimed_at || Date.now()).getTime() > oneHourAgo;
            }
            return false;
          })
          .map((item) => {
            let quantityTag = "N/A";
            if (item.weightKg && item.itemCount) quantityTag = `${item.weightKg} kg (${item.itemCount} Boxes)`;
            else if (item.weightKg) quantityTag = `${item.weightKg} kg`;
            else if (item.itemCount) quantityTag = `${item.itemCount} Items/Boxes`;

            let urgent = false;
            const expDate = item.expires_at || item.expiryTime || item.expiresAt;
            if (expDate) {
              const msLeft = new Date(expDate).getTime() - Date.now();
              if (msLeft <= 60 * 60 * 1000 && msLeft > 0) urgent = true;
            }

            const expiryText = getRemainingTimeText(expDate);

            return {
              id: item._id,
              status: item.status,
              title: item.title,
              restaurant: item.postedBy ? (item.postedBy.restaurantName || item.postedBy.name) : "ZeroWaste Partner",
              postedById: item.postedBy ? (item.postedBy._id || item.postedBy) : null,
              area: item.postedBy && item.postedBy.address ? item.postedBy.address : (item.postedBy && item.postedBy.restaurantName ? item.postedBy.restaurantName : item.location || "Dhaka"),
              expiry: expiryText,
              urgent: urgent,
              category: item.category,
              tags: [item.category, "Fresh", quantityTag],
              img: item.imageUrl,
            };
          });
        setDonations(mapped);
        
        // Fetch ratings for unique managers
        const uniqueManagerIds = [...new Set(mapped.map(m => m.postedById).filter(Boolean))];
        const ratingsMap = {};
        await Promise.all(uniqueManagerIds.map(async (id) => {
          const rRes = await fetch(`${API_BASE_URL}/reviews/user/${id}`);
          if (rRes.ok) {
            const rData = await rRes.json();
            ratingsMap[id] = { avg: rData.averageRating, total: rData.totalReviews };
          }
        }));
        setRatings(ratingsMap);
      }
    } catch (err) {
      console.error("Error fetching listings:", err);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  const filters = ["All", "Rice/Biryani", "Curries & Gravies", "Bakery & Bread", "Snacks/Others"];
  const user = JSON.parse(localStorage.getItem("user")) || {};

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
      const volunteerId = user._id || user.id || localStorage.getItem("userId");
      
      const res = await fetch(`${API_BASE_URL}/claims`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ listing_id: id, receiver_id: volunteerId }),
      });
      if (res.ok) {
        navigate("/active-claim");
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
        <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md pb-4 pt-2 border-b border-gray-100 px-6 lg:px-8 shrink-0">
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
                    <div className="flex items-center gap-2 mt-0.5 mb-2">
                      <p className="text-xs text-gray-500 font-medium">{item.restaurant}</p>
                      {item.postedById && (
                        <div
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setSelectedRestaurantId(item.postedById);
                            setSelectedRestaurantName(item.restaurant);
                            setDrawerOpen(true);
                          }}
                          className="inline-flex items-center gap-1 bg-amber-50 hover:bg-amber-100 text-amber-700 px-2 py-0.5 rounded text-[10px] font-bold transition-colors cursor-pointer relative z-10"
                        >
                          <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                          {ratings[item.postedById]?.avg > 0 ? ratings[item.postedById].avg : "New"}
                          <span className="font-normal text-amber-600 ml-0.5">({ratings[item.postedById]?.total || 0})</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-1.5 text-xs text-gray-600">
                      <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                      <span>{item.area}</span>
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
                  <div className="flex items-center justify-between gap-2 pt-3 mt-4 border-t border-gray-100">
                    <span
                      className={`flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium rounded-full whitespace-nowrap truncate ${
                        item.urgent ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      <Clock className="w-3.5 h-3.5 shrink-0" />
                      {item.expiry}
                    </span>

                    {user.role === 'manager' ? (
                      item.status === 'available' ? (
                        <span className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 rounded-full whitespace-nowrap truncate">
                          🟢 Seeking Volunteer
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium text-amber-700 bg-amber-50 rounded-full whitespace-nowrap truncate">
                          🟡 Claimed
                        </span>
                      )
                    ) : (
                      <button
                        onClick={() => handleClaim(item.id)}
                        disabled={claimedId !== null}
                        className={`text-[11px] bg-emerald-700 hover:bg-emerald-800 text-white font-medium px-3 py-1.5 rounded-full shadow-sm transition-all duration-150 flex items-center gap-1.5 whitespace-nowrap truncate ${
                          claimedId === item.id ? "bg-emerald-100 text-emerald-800" : ""
                        }`}
                      >
                        {claimedId === item.id ? (
                          <>
                            <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                            Claimed!
                          </>
                        ) : (
                          "Claim Donation"
                        )}
                      </button>
                    )}
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
      
      <ReviewsDrawer 
        isOpen={drawerOpen} 
        onClose={() => setDrawerOpen(false)} 
        restaurantId={selectedRestaurantId} 
        restaurantName={selectedRestaurantName} 
      />
    </div>
  );
}