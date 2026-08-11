import React, { useState, useEffect } from "react";
import {
  Package,
  Info,
  MapPin,
  CheckCircle2,
  User,
  Compass,
  Trophy,
  Star,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { API_BASE_URL } from "../config/api";

const VOLUNTEER_AVATAR = "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80";

const mockVolunteerClaim = {
  _id: "mockvolclaim876543210ab",
  listing_id: {
    title: "Mutton Biryani - 5kg",
    category: "Rice/Biryani",
    weightKg: 5,
    itemCount: 2,
    location: "Dhaka Restaurant, Dhanmondi 27",
    imageUrl: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80",
    postedBy: { name: "Rahim Uddin", restaurantName: "Dhaka Restaurant", email: "contact@example.com" },
    instructions: "Please enter through the back kitchen entrance. Ask the chef or manager for ZeroWaste claim ID #43210A."
  },
  receiver_id: { _id: "tanvirid", name: "Tanvir Ahmed", rescuesCompleted: 15 }
};

const mockManagerClaims = [
  {
    _id: "mockmngrclaim987654321a",
    listing_id: {
      title: "Chicken Curry & Roti",
      category: "Curries",
      weightKg: 3.5,
      location: "Bengal Spice Kitchen, Gulshan",
      imageUrl: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=80",
      postedBy: { _id: "managerid", name: "Bengal Spice Kitchen" },
    },
    receiver_id: { name: "Asif Rahman", email: "asif@example.com", rescuesCompleted: 23 }
  },
  {
    _id: "mockmngrclaim987654321b",
    listing_id: {
      title: "Assorted Pastry Pack",
      category: "Bakery",
      itemCount: 2,
      location: "Bengal Spice Kitchen, Gulshan",
      imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80",
      postedBy: { _id: "managerid", name: "Bengal Spice Kitchen" },
    },
    receiver_id: { name: "Farzana Yesmin", email: "farzana@example.com", rescuesCompleted: 8 }
  }
];

export default function ActiveClaimNavigation() {
  const [role, setRole] = useState(localStorage.getItem("role") || "volunteer");
  const [userId, setUserId] = useState(localStorage.getItem("userId") || "");
  const [activeClaims, setActiveClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [devMode, setDevMode] = useState(false);
  const [completedLocally, setCompletedLocally] = useState({});

  const navigate = useNavigate();
  const location = useLocation();

  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [pendingClaimForReview, setPendingClaimForReview] = useState(null);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });

  const formatQuantity = (weightKg, itemCount) => {
    if (weightKg && itemCount) return `${weightKg} kg (${itemCount} Boxes)`;
    if (weightKg) return `${weightKg} kg`;
    if (itemCount) return `${itemCount} Items/Boxes`;
    return "N/A";
  };

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 4000);
  };

  const fetchActiveClaims = async () => {
    if (devMode) return;
    setLoading(true);
    try {
      const currentRole = localStorage.getItem("role") || "volunteer";
      const user = JSON.parse(localStorage.getItem("user")) || {};
      const currentUserId = user._id || user.id || localStorage.getItem("userId") || "";
      setRole(currentRole);
      setUserId(currentUserId);

      const queryParam = currentRole === "manager" ? `managerId=${currentUserId}` : `volunteerId=${currentUserId}`;
      const res = await fetch(`${API_BASE_URL}/claims/active?${queryParam}`);
      const claimsData = await res.json();
      
      if (res.ok) {
        let filtered = [];
        if (currentRole === "volunteer") {
          filtered = claimsData.filter((claim) => {
            const receiver = claim.receiver_id;
            return String(receiver?._id || receiver) === String(currentUserId);
          });
        } else {
          filtered = claimsData.filter((claim) => {
            const postedBy = claim.listing_id?.postedBy;
            const postedId = typeof postedBy === "object" ? postedBy._id : postedBy;
            return String(postedId) === String(currentUserId);
          });
        }
        setActiveClaims(filtered);
      }
    } catch (err) {
      console.error("Error fetching claims:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveClaims();
  }, [devMode]);

  // Sync role updates from Sidebar click/toggles
  useEffect(() => {
    setRole(localStorage.getItem("role") || "volunteer");
    setUserId(localStorage.getItem("userId") || "");
    fetchActiveClaims();
  }, [location.pathname]);

  const handleConfirmHandover = async (claim) => {
    try {
      if (devMode) {
        showToast("Handover complete! +100 points awarded!");
        setCompletedLocally(prev => ({ ...prev, [claim._id]: true }));
        return;
      }
      
      const res = await fetch(`${API_BASE_URL}/claims/${claim._id}/confirm`, {
        method: "PUT",
      });
      if (res.ok) {
        showToast("Handover complete! +100 points awarded!");
        const currentPoints = parseInt(localStorage.getItem("points") || "0", 10);
        localStorage.setItem("points", currentPoints + 100);
        
        // Mark locally as completed instead of fetching active claims so they can rate
        setCompletedLocally(prev => ({ ...prev, [claim._id]: true }));
      } else {
        const data = await res.json();
        showToast(`Error: ${data.message || "Failed to complete handover"}`);
      }
    } catch (err) {
      console.error("Error completing claim:", err);
      showToast("Error connecting to server. Please try again.");
    }
  };

  const initiateComplete = (claim) => {
    if (role === "volunteer") {
      handleConfirmHandover(claim);
    } else {
      handleConfirmHandover(claim);
    }
  };

  const submitReviewAndComplete = async () => {
    try {
      if (!devMode) {
        const claim = pendingClaimForReview;
        const receiverId = typeof claim.listing_id.postedBy === "object" ? claim.listing_id.postedBy._id : claim.listing_id.postedBy;
        await fetch(`${API_BASE_URL}/reviews`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            claim_id: claim._id,
            reviewer_id: userId,
            target_user_id: receiverId,
            rating: reviewForm.rating,
            comment: reviewForm.comment,
          }),
        });
      }
      setReviewModalOpen(false);
      if (devMode) {
        setActiveClaims((prev) => prev.filter((item) => item._id !== pendingClaimForReview._id));
      } else {
        fetchActiveClaims();
      }
    } catch (err) {
      console.error("Error submitting review:", err);
      showToast("Error saving review.");
      setReviewModalOpen(false);
      if (!devMode) fetchActiveClaims();
    }
  };

  const toggleDevMode = () => {
    if (!devMode) {
      setDevMode(true);
      setActiveClaims(role === "volunteer" ? [mockVolunteerClaim] : mockManagerClaims);
      setLoading(false);
      showToast("Loaded dev environment sample claims!");
    } else {
      setDevMode(false);
      setLoading(true);
    }
  };

  return (
    <div className="h-screen bg-gray-50 text-gray-900 flex overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700;800&display=swap');
        .font-display { font-family: 'Fraunces', serif; }
      `}</style>

      {/* Dynamic Toast Message */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-800 text-white text-sm font-semibold rounded-2xl px-6 py-4 shadow-xl border border-emerald-700 flex items-center gap-3 animate-pulse">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      <Sidebar />

      {/* MAIN CONTAINER */}
      <div className="flex-1 min-w-0 flex flex-col h-screen overflow-y-auto">
        
        <header className="bg-white border-b border-gray-200 px-6 lg:px-8 h-20 flex items-center justify-between sticky top-0 z-30 shrink-0">
          <div>
            <h1 className="font-display text-xl sm:text-2xl font-semibold text-emerald-950">
              Active Claim Details
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
              Role: <span className="font-semibold capitalize text-emerald-750">{role}</span>
            </p>
          </div>
        </header>

        {/* CONTENT */}
        <main className="p-6 lg:p-8 flex-1 flex flex-col">
          {loading ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center my-auto">
              <span className="w-6 h-6 border-2 border-emerald-700 border-t-transparent rounded-full animate-spin inline-block" />
              <p className="text-sm text-gray-500 mt-2">Retrieving active claims...</p>
            </div>
          ) : activeClaims.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center my-auto max-w-lg mx-auto w-full">
              <Compass className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-sm font-semibold text-gray-800">No active claimed listings found.</p>
              <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">
                {role === "volunteer"
                  ? "Browse the food feed to claim fresh food donations listed nearby!"
                  : "Post new surplus food items. Claims will appear here once volunteer pickup starts."}
              </p>
              {role === "volunteer" && (
                <button
                  onClick={() => navigate("/map")}
                  className="mt-5 inline-flex items-center gap-2 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold px-6 py-3 transition-colors"
                >
                  Browse Food Feed to Claim
                </button>
              )}
            </div>
          ) : role === "volunteer" ? (
            /* ==================== VOLUNTEER DUAL COLUMN VIEW ==================== */
            (() => {
              const claim = activeClaims[0];
              const listing = claim.listing_id;
              return (
                <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  
                  {/* LEFT: CLAIM DETAILS (5 cols) */}
                  <div className="lg:col-span-5 bg-white rounded-2xl border border-gray-200 p-6 space-y-6">
                    <div>
                      <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-wide text-amber-700 bg-amber-50 border border-amber-100 rounded-full px-3 py-1.5 animate-pulse">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        In Progress — En Route
                      </span>
                      <h2 className="font-display text-xl font-semibold text-gray-900 mt-3.5">
                        Claim #{claim._id.slice(-6).toUpperCase()}
                      </h2>
                    </div>

                    <div className="rounded-xl border border-gray-150 bg-gray-50/50 p-4 flex items-start gap-3">
                      <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 shrink-0 mt-0.5">
                        <Package className="w-5 h-5" />
                      </span>
                      <div>
                        <p className="text-xs text-gray-400 font-medium">Package Contents</p>
                        <p className="text-sm font-semibold text-gray-900 mt-0.5">
                          {listing.title} &bull; {formatQuantity(listing.weightKg, listing.itemCount)}
                        </p>
                      </div>
                    </div>

                    <div className="pt-2">
                      {completedLocally[claim._id] ? (
                        <button
                          onClick={() => {
                            setPendingClaimForReview(claim);
                            setReviewModalOpen(true);
                            setReviewForm({ rating: 5, comment: "" });
                          }}
                          className="w-full inline-flex items-center justify-center gap-2 rounded-full text-sm font-semibold px-7 py-4 bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-100 transition-colors"
                        >
                          <Star className="w-4.5 h-4.5" />
                          ⭐ Rate Food & Pickup Experience
                        </button>
                      ) : (
                        <button
                          onClick={() => handleConfirmHandover(claim)}
                          className="w-full inline-flex items-center justify-center gap-2 rounded-full text-sm font-semibold px-7 py-4 bg-emerald-700 hover:bg-emerald-800 text-white shadow-sm shadow-emerald-100 transition-colors"
                        >
                          <CheckCircle2 className="w-4.5 h-4.5" />
                          Confirm Food Pickup & Handover
                        </button>
                      )}
                    </div>
                  </div>

                  {/* RIGHT: TIMELINE PROGRESS (7 cols) */}
                  <div className="lg:col-span-7 space-y-6">
                    
                    {/* Pickup Step Progress */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-6 lg:p-7">
                      <h3 className="font-display text-base font-semibold text-gray-900 mb-6">
                        Pickup Step Progress
                      </h3>

                      <div className="relative pl-8 space-y-8">
                        <div className="absolute left-3.5 top-2 bottom-2 w-0.5 bg-gray-200">
                          <div className="w-full bg-emerald-600 h-1/2 transition-all duration-500" />
                        </div>

                        {/* Step 1 */}
                        <div className="relative flex items-start gap-4">
                          <span className="absolute -left-8 flex items-center justify-center w-7.5 h-7.5 rounded-full bg-emerald-600 border-4 border-white shadow-sm">
                            <CheckCircle2 className="w-4 h-4 text-white" />
                          </span>
                          <div>
                            <p className="text-sm font-semibold text-gray-950">1. Donation Claimed</p>
                            <p className="text-xs text-gray-500 mt-0.5">Claim registered successfully</p>
                          </div>
                        </div>

                        {/* Step 2 */}
                        <div className="relative flex items-start gap-4">
                          <span className="absolute -left-8 flex items-center justify-center w-7.5 h-7.5 rounded-full bg-emerald-500 border-4 border-white shadow-sm ring-2 ring-emerald-500/20">
                            <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
                          </span>
                          <div>
                            <p className="text-sm font-semibold text-gray-950">2. In Transit</p>
                            <p className="text-xs text-gray-500 mt-0.5">Volunteer is en route to {listing.postedBy?.restaurantName || listing.postedBy?.name || 'Restaurant'}</p>
                          </div>
                        </div>

                        {/* Step 3 */}
                        <div className="relative flex items-start gap-4">
                          <span className="absolute -left-8 flex items-center justify-center w-7.5 h-7.5 rounded-full bg-gray-200 border-4 border-white shadow-sm">
                            <span className="w-2.5 h-2.5 rounded-full bg-transparent" />
                          </span>
                          <div>
                            <p className="text-sm font-semibold text-gray-400">3. Handover Complete</p>
                            <p className="text-xs text-gray-500 mt-0.5">Pending handover confirmation</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Contact details */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-6 lg:p-7 space-y-6">
                      <h3 className="font-display text-base font-semibold text-gray-900">
                        Restaurant Details & Instructions
                      </h3>

                      <div className="flex items-start justify-between gap-3 p-4 rounded-xl border border-gray-150 bg-gray-50/50">
                        <div className="flex items-start gap-3 min-w-0">
                          <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 shrink-0">
                            <MapPin className="w-5 h-5" />
                          </span>
                          <div className="min-w-0">
                            <p className="text-xs text-gray-400 font-medium">Pickup Location</p>
                            <p className="text-sm font-semibold text-gray-900 mt-0.5">
                              {listing.postedBy?.restaurantName || listing.postedBy?.name || 'Restaurant'}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">{listing.postedBy?.address || listing.location || "Location not set"}</p>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 flex items-start gap-3">
                        <Info className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-semibold text-emerald-955">Special Instructions</p>
                          <p className="text-xs text-emerald-850 mt-1 leading-relaxed">
                            {listing.instructions ? listing.instructions : "No special instructions provided."}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              );
            })()
          ) : (
            /* ==================== MANAGER LIST VIEW ==================== */
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-lg font-semibold text-gray-900">Active Pickups En Route</h2>
                <span className="text-xs font-semibold text-gray-400">{activeClaims.length} volunteers en route</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {activeClaims.map((claim) => {
                  const listing = claim.listing_id;
                  const receiver = claim.receiver_id;
                  return (
                    <div
                      key={claim._id}
                      className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col justify-between hover:shadow-sm transition-all border-l-4 border-l-emerald-600"
                    >
                      <div className="space-y-4">
                        {/* Listing info */}
                        <div className="flex items-start gap-3">
                          <img
                            src={listing.imageUrl}
                            alt={listing.title}
                            className="w-12 h-12 rounded-xl object-cover shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">{listing.category}</p>
                            <p className="text-sm font-semibold text-gray-900 leading-tight mt-0.5">{listing.title}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{formatQuantity(listing.weightKg, listing.itemCount)} &bull; {listing.postedBy?.address || listing.location || "Location not set"}</p>
                          </div>
                        </div>

                        {/* Volunteer card */}
                        <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-4 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={VOLUNTEER_AVATAR}
                              alt="Volunteer avatar"
                              className="w-9 h-9 rounded-full object-cover shrink-0"
                            />
                            <div>
                              <p className="text-xs text-gray-400 font-medium">Assigned Volunteer</p>
                              <p className="text-xs font-bold text-gray-800">{receiver ? receiver.name : "Volunteer Rescuer"}</p>
                              {receiver && receiver.rescuesCompleted !== undefined && (
                                <p className="text-[10px] text-gray-500 font-medium mt-0.5 flex items-center gap-1">
                                  <Trophy className="w-3 h-3 text-amber-500" />
                                  {receiver.rescuesCompleted} Total Claims
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => initiateComplete(claim)}
                        className="mt-5 w-full text-xs font-semibold rounded-full bg-emerald-700 hover:bg-emerald-800 text-white py-3.5 shadow-sm transition-colors flex items-center justify-center gap-2"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Confirm Handover & Complete
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* REVIEW MODAL */}
      {reviewModalOpen && pendingClaimForReview && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50">
              <h3 className="font-display text-xl font-semibold text-gray-900">Rate Your Pickup Experience</h3>
              <p className="text-sm text-gray-500 mt-1">How was your pickup at {pendingClaimForReview.listing_id.postedBy?.restaurantName || pendingClaimForReview.listing_id.postedBy?.name || 'the restaurant'}?</p>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-center gap-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setReviewForm((prev) => ({ ...prev, rating: star }))}
                    className="p-1 focus:outline-none transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-10 h-10 transition-colors ${
                        star <= reviewForm.rating
                          ? "text-amber-500 fill-amber-500"
                          : "text-gray-300 fill-gray-100"
                      }`}
                    />
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wider">
                  Optional Feedback
                </label>
                <textarea
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm((prev) => ({ ...prev, comment: e.target.value }))}
                  placeholder="e.g. Food was well packed and ready on time!"
                  rows={3}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={submitReviewAndComplete}
                  className="flex-1 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-3.5 transition-colors shadow-sm"
                >
                  Submit & Complete
                </button>
                <button
                  onClick={() => {
                    setReviewModalOpen(false);
                    if (devMode) {
                      setActiveClaims((prev) => prev.filter((item) => item._id !== pendingClaimForReview._id));
                    } else {
                      fetchActiveClaims();
                    }
                  }}
                  className="flex-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3.5 transition-colors"
                >
                  Skip
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}