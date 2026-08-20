import React, { useState, useEffect } from "react";
import {
  Leaf,
  Map,
  ClipboardList,
  Trophy,
  LogOut,
  Coins,
  Info,
  LayoutDashboard,
  PlusCircle,
  BarChart3,
  Star,
  Edit2,
  Check,
  X,
  MapPin,
  MessageSquare,
  User
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import ReviewsDrawer from "../components/ReviewsDrawer";
import { API_BASE_URL } from "../config/api";

const VOLUNTEER_AVATAR = "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80";
const MANAGER_AVATAR = "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=100&q=80";

const ROLE_BOARDS = {
  volunteers: { label: "Top Volunteers", unit: "delivery points" },
  restaurants: { label: "Top Restaurants", unit: "donation points" },
};

function RankBadge({ rank }) {
  const tones = {
    1: "bg-amber-100 text-amber-800 border border-amber-200",
    2: "bg-slate-100 text-slate-700 border border-slate-200",
    3: "bg-orange-100 text-orange-800 border border-orange-200",
  };
  return (
    <span className={`inline-flex h-7 w-7 items-center justify-center rounded-full font-mono text-xs font-semibold ${tones[rank] || "bg-gray-100 text-gray-600"}`}>
      {rank}
    </span>
  );
}

export default function ProfileLeaderboard() {
  const [volunteers, setVolunteers] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ratings, setRatings] = useState({});
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState(null);
  const [selectedRestaurantName, setSelectedRestaurantName] = useState("");

  const [viewMode, setViewMode] = useState(localStorage.getItem("role") || "volunteer");
  const [tab, setTab] = useState("volunteers");
  const isVolunteer = viewMode === "volunteer";

  // Editable Profile States
  const [editingProfile, setEditingProfile] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [profileForm, setProfileForm] = useState({ name: "", bio: "", restaurantName: "", address: "" });
  const [myReviews, setMyReviews] = useState([]);

  const fetchMyProfile = async () => {
    const uid = localStorage.getItem("userId");
    if (!uid) return;
    try {
      const res = await fetch(`${API_BASE_URL}/users/${uid}/profile`);
      if (res.ok) {
        const data = await res.json();
        setUserProfile(data);
        setProfileForm({
          name: data.name || "",
          bio: data.bio || "",
          restaurantName: data.restaurantName || "",
          address: data.address || ""
        });
      }
      
      const rRes = await fetch(`${API_BASE_URL}/reviews/user/${uid}`);
      if (rRes.ok) {
        const rData = await rRes.json();
        setMyReviews(rData.reviews.slice(0, 3));
      }
    } catch(err) {
      console.error("Error fetching profile:", err);
    }
  };

  const handleProfileSave = async () => {
    const uid = localStorage.getItem("userId");
    try {
      const res = await fetch(`${API_BASE_URL}/users/${uid}/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileForm)
      });
      if (res.ok) {
        const data = await res.json();
        setUserProfile(data);
        setEditingProfile(false);
        localStorage.setItem("name", data.name);
        if (data.restaurantName) localStorage.setItem("restaurantName", data.restaurantName);
        window.dispatchEvent(new Event("pushstate")); // to update sidebar
      }
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/users/leaderboard`);
      const data = await res.json();
      if (res.ok) {
        setVolunteers(data.volunteers.map((v, i) => ({ rank: i + 1, ...v })));
        const fetchedRestaurants = data.restaurants.map((r, i) => ({ rank: i + 1, ...r }));
        setRestaurants(fetchedRestaurants);
        
        const ratingsMap = {};
        await Promise.all([...data.volunteers, ...fetchedRestaurants].map(async (u) => {
          const rRes = await fetch(`${API_BASE_URL}/reviews/user/${u._id}`);
          if (rRes.ok) {
            const rData = await rRes.json();
            ratingsMap[u._id] = { avg: rData.averageRating, total: rData.totalReviews };
          }
        }));
        setRatings(ratingsMap);
      }
    } catch (err) {
      console.error("Error fetching leaderboard:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
    fetchMyProfile();
  }, []);

  const board = tab === "volunteers"
    ? { label: "Top Volunteers", rows: volunteers, unit: "delivery points" }
    : { label: "Top Restaurants", rows: restaurants, unit: "donation points" };

  useEffect(() => {
    const handleRoleSync = () => {
      setViewMode(localStorage.getItem("role") || "volunteer");
    };
    window.addEventListener("pushstate", handleRoleSync);
    window.addEventListener("popstate", handleRoleSync);
    return () => {
      window.removeEventListener("pushstate", handleRoleSync);
      window.removeEventListener("popstate", handleRoleSync);
    };
  }, []);

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    localStorage.setItem("role", mode);
    window.dispatchEvent(new Event("pushstate"));
  };

  const userId = localStorage.getItem("userId");
  const activeUser = isVolunteer 
    ? volunteers.find((v) => v._id === userId)
    : restaurants.find((r) => r._id === userId);

  const userName = userProfile ? userProfile.name : (activeUser ? activeUser.name : (localStorage.getItem("name") || "User"));
  const userRole = isVolunteer ? "Volunteer" : `Manager · ${userProfile?.restaurantName || "Restaurant"}`;
  const userRankLabel = activeUser 
    ? `${isVolunteer ? "Volunteer" : "Manager"} · Rank #${activeUser.rank}` 
    : `${isVolunteer ? "Volunteer" : "Manager"} · Rank #3`;
  const userPoints = activeUser ? activeUser.points : (parseInt(localStorage.getItem("points") || "0", 10));
  const userCompletedCount = activeUser 
    ? (isVolunteer ? activeUser.rescuesCompleted : activeUser.donationsCompleted)
    : (isVolunteer ? 1 : 2);
  const userCompletedUnit = isVolunteer ? "rescues completed" : "donations completed";
  const userAvatar = isVolunteer ? VOLUNTEER_AVATAR : MANAGER_AVATAR;

  const activeUserRank = activeUser ? activeUser.rank : 3;
  const listToSearch = isVolunteer ? volunteers : restaurants;
  const nextUp = listToSearch.find((u) => u.rank === activeUserRank - 1) || listToSearch[0];

  const gapToNext = nextUp ? nextUp.points - userPoints : 0;
  const actionsToNext = Math.ceil(gapToNext / 100);

  return (
    <div className="h-screen bg-gray-50 text-gray-900 flex overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700;800&display=swap');
        .font-display { font-family: 'Fraunces', serif; }
      `}</style>

      <Sidebar />

      <div className="flex-1 min-w-0 flex flex-col h-screen overflow-y-auto">
        <main className="p-6 lg:p-8 flex-1 flex flex-col">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="font-display text-2xl font-semibold text-emerald-950">Profile &amp; Leaderboard</h1>
              <p className="mt-1 text-sm text-gray-500">Track rescues, update your profile, and view community standings.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[45fr_55fr]">
            {/* LEFT PROFILE COLUMN */}
            <section className="flex flex-col gap-6">
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm relative">
                {!editingProfile ? (
                  <button 
                    onClick={() => setEditingProfile(true)}
                    className="absolute top-6 right-6 w-8 h-8 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                ) : (
                  <div className="absolute top-6 right-6 flex gap-2">
                    <button 
                      onClick={() => setEditingProfile(false)}
                      className="w-8 h-8 rounded-full bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={handleProfileSave}
                      className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center hover:bg-emerald-100"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  </div>
                )}

                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-gray-100 border border-gray-200 shrink-0 ring-4 ring-emerald-50">
                    <User className="w-8 h-8 text-gray-500" />
                  </div>
                  <div className="flex-1 min-w-0 pr-12">
                    {editingProfile ? (
                      <input 
                        type="text" 
                        value={profileForm.name} 
                        onChange={(e) => setProfileForm(prev => ({...prev, name: e.target.value}))}
                        className="font-display text-lg font-semibold text-emerald-950 bg-gray-50 border border-gray-200 rounded px-2 py-1 w-full"
                      />
                    ) : (
                      <h2 className="font-display text-lg font-semibold text-emerald-950 truncate">{userName}</h2>
                    )}
                    <span className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 border border-emerald-100">
                      {userRankLabel}
                    </span>
                  </div>
                </div>
                
                {/* Average Rating Badge */}
                {userProfile && (
                  <div className="mt-4 flex items-center gap-2">
                    <div className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-100 px-3 py-1.5 rounded-lg">
                      <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                      <span className="text-sm font-bold text-amber-900">{userProfile.ratingAverage > 0 ? userProfile.ratingAverage : "-"}</span>
                      <span className="text-xs text-amber-700/70 ml-1">({userProfile.ratingCount} reviews)</span>
                    </div>
                  </div>
                )}

                {/* Editable Fields */}
                <div className="mt-6 space-y-4">
                  {!isVolunteer && (
                    <>
                      <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Restaurant Name</label>
                        {editingProfile ? (
                          <input 
                            type="text" 
                            value={profileForm.restaurantName} 
                            onChange={(e) => setProfileForm(prev => ({...prev, restaurantName: e.target.value}))}
                            className="mt-1 w-full text-sm bg-gray-50 border border-gray-200 rounded-lg px-3 py-2"
                          />
                        ) : (
                          <p className="mt-1 text-sm text-gray-900 font-medium">{userProfile?.restaurantName || "Not set"}</p>
                        )}
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Pickup Location (Address)</label>
                        {editingProfile ? (
                          <input 
                            type="text" 
                            value={profileForm.address} 
                            onChange={(e) => setProfileForm(prev => ({...prev, address: e.target.value}))}
                            className="mt-1 w-full text-sm bg-gray-50 border border-gray-200 rounded-lg px-3 py-2"
                          />
                        ) : (
                          <div className="mt-1 flex items-start gap-1.5">
                            <MapPin className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                            <p className="text-sm text-gray-900">{userProfile?.address || JSON.parse(localStorage.getItem("user") || "{}").address || "Location set during posting"}</p>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                  
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Bio / Description</label>
                    {editingProfile ? (
                      <textarea 
                        value={profileForm.bio} 
                        onChange={(e) => setProfileForm(prev => ({...prev, bio: e.target.value}))}
                        rows={3}
                        className="mt-1 w-full text-sm bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 resize-none"
                      />
                    ) : (
                      <p className="mt-1 text-sm text-gray-600 italic">
                        {userProfile?.bio ? `"${userProfile.bio}"` : "No bio provided."}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-6 pt-5 border-t border-gray-100">
                  <div className="mb-2 flex items-end justify-between">
                    <span className="text-xs font-medium uppercase tracking-wide text-gray-400">Total earned</span>
                    <span className="font-mono text-xs text-gray-600">
                      <strong className="text-sm text-emerald-950">{userPoints}</strong> pts &middot; {userCompletedCount} {userCompletedUnit}
                    </span>
                  </div>
                  <div className="flex gap-1.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className={`h-2.5 flex-1 rounded-full transition-colors duration-300 ${i < userCompletedCount ? "bg-emerald-600" : "bg-gray-200/60"}`} />
                    ))}
                  </div>
                </div>
              </div>

              {/* RECENT FEEDBACK */}
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-sm font-semibold text-emerald-950 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-emerald-600" />
                  Recent Feedback &amp; Reviews
                </h3>
                {myReviews.length === 0 ? (
                  <p className="text-xs leading-relaxed text-gray-500">
                    No reviews yet. Complete rescues to receive feedback!
                  </p>
                ) : (
                  <div className="space-y-4">
                    {myReviews.map(review => (
                      <div key={review._id} className="border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <div className="flex items-center justify-center w-5 h-5 rounded-full bg-gray-100 border border-gray-200 shrink-0">
                              <User className="w-3 h-3 text-gray-500" />
                            </div>
                            <span className="text-xs font-semibold text-gray-900">{review.reviewer_id?.name || "User"}</span>
                          </div>
                          <span className="text-[10px] text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-0.5 mb-1.5">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-3 h-3 ${i < review.rating ? "text-amber-500 fill-amber-500" : "text-gray-200"}`} />
                          ))}
                        </div>
                        {review.comment && (
                          <p className="text-xs text-gray-600 leading-relaxed bg-gray-50/50 p-2 rounded">"{review.comment}"</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>

            {/* RIGHT LEADERBOARD TABLES */}
            <section className="flex flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-1 flex items-center justify-between">
                <h3 className="font-display text-base font-semibold text-emerald-950">Top Restaurants</h3>
                <span className="text-xs text-gray-400">ranked by donation points</span>
              </div>

              <div className="mt-3 overflow-hidden rounded-xl border border-gray-200">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="bg-gray-50 text-[11px] uppercase tracking-wide text-gray-400">
                      <th className="px-4 py-3 font-semibold">Rank</th>
                      <th className="px-4 py-3 font-semibold">Restaurant Name</th>
                      <th className="px-4 py-3 text-right font-semibold">Points</th>
                    </tr>
                  </thead>
                  <tbody>
                    {restaurants.map((row) => {
                      const isCurrentUserRow = row._id === userId;
                      return (
                        <tr 
                          key={row.rank} 
                          onClick={() => {
                            setSelectedRestaurantId(row._id);
                            setSelectedRestaurantName(row.restaurantName || row.name);
                            setDrawerOpen(true);
                          }}
                          className={`border-t border-gray-100 cursor-pointer ${isCurrentUserRow ? "bg-emerald-50/20" : "hover:bg-gray-50/50"}`}
                        >
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-2">
                              <RankBadge rank={row.rank} />
                              {row.rank === 1 && <Trophy className="h-3.5 w-3.5 text-amber-500" />}
                            </div>
                          </td>
                          <td className="px-4 py-3.5 text-sm font-medium text-gray-900">
                            <div className="flex items-center gap-2">
                              {row.restaurantName || row.name}
                              {isCurrentUserRow && (
                                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-800">You</span>
                              )}
                              <div
                                className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded text-[10px] font-bold ml-1"
                              >
                                <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                                {ratings[row._id]?.avg > 0 ? ratings[row._id].avg : "New"}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3.5 text-right font-mono text-sm font-semibold text-gray-900">
                            {row.points}
                            <span className="ml-1 text-[10px] font-normal text-gray-400">pts</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
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