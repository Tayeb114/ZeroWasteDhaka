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
} from "lucide-react";
import Sidebar from "../components/Sidebar";

const VOLUNTEER_AVATAR = "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80";
const MANAGER_AVATAR = "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=100&q=80";

const VOLUNTEERS = [
  { rank: 1, name: "Asif Rahman", points: 400 },
  { rank: 2, name: "Farzana Yesmin", points: 300 },
  { rank: 3, name: "Tanvir Ahmed", points: 100 },
];

const RESTAURANTS = [
  { rank: 1, name: "Kacchi Bhai (Dhanmondi)", points: 500 },
  { rank: 2, name: "Star Restaurant", points: 200 },
  { rank: 3, name: "Sultans Dine", points: 100 },
];

const ROLE_BOARDS = {
  volunteers: { label: "Top Volunteers", rows: VOLUNTEERS, unit: "delivery points" },
  restaurants: { label: "Top Restaurants", rows: RESTAURANTS, unit: "donation points" },
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
  const [viewMode, setViewMode] = useState(localStorage.getItem("role") || "volunteer");
  const [tab, setTab] = useState("volunteers");
  const board = ROLE_BOARDS[tab];

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

  // Profile data for active view
  const isVolunteer = viewMode === "volunteer";
  const userName = isVolunteer ? "Tanvir Ahmed" : "Rahim Uddin";
  const userRole = isVolunteer ? "Volunteer" : "Manager · Star Restaurant";
  const userRankLabel = isVolunteer ? "Volunteer · Rank #3" : "Manager (Star Restaurant) · Rank #2";
  const userPoints = isVolunteer ? 100 : 200;
  const userCompletedCount = isVolunteer ? 1 : 2;
  const userCompletedUnit = isVolunteer ? "rescues completed" : "donations completed";
  const userAvatar = isVolunteer ? VOLUNTEER_AVATAR : MANAGER_AVATAR;

  // Next rank logic
  const nextUp = isVolunteer
    ? VOLUNTEERS.find((v) => v.rank === 2) // Farzana Yesmin (300 pts)
    : RESTAURANTS.find((r) => r.rank === 1); // Kacchi Bhai (500 pts)

  const gapToNext = nextUp ? nextUp.points - userPoints : 0;
  const actionsToNext = Math.ceil(gapToNext / 100);

  return (
    <div className="h-screen bg-gray-50 text-gray-900 flex overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700;800&display=swap');
        .font-display { font-family: 'Fraunces', serif; }
      `}</style>

      <Sidebar />

      {/* MAIN */}
      <div className="flex-1 min-w-0 flex flex-col h-screen overflow-y-auto">
        <main className="p-6 lg:p-8 flex-1 flex flex-col">
          {/* HEADER */}
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="font-display text-2xl font-semibold text-emerald-950">Profile &amp; Leaderboard</h1>
              <p className="mt-1 text-sm text-gray-500">Track rescues and view the community standings.</p>
            </div>

            {/* ROLE SWITCHER TOGGLE */}
            <div className="flex items-center gap-2.5 bg-white border border-gray-200 rounded-xl p-1.5 shadow-sm self-start sm:self-center">
              <span className="text-xs font-semibold text-gray-400 pl-2">View Mode:</span>
              <button
                onClick={() => handleViewModeChange("volunteer")}
                className={`text-xs font-medium px-3.5 py-2 rounded-lg transition-all ${
                  viewMode === "volunteer"
                    ? "bg-emerald-700 text-white shadow-sm"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-55"
                }`}
              >
                Volunteer
              </button>
              <button
                onClick={() => handleViewModeChange("manager")}
                className={`text-xs font-medium px-3.5 py-2 rounded-lg transition-all ${
                  viewMode === "manager"
                    ? "bg-emerald-700 text-white shadow-sm"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-55"
                }`}
              >
                Restaurant Manager
              </button>
            </div>
          </div>

          {/* RULES / INSTRUCTIONS */}
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-emerald-100 bg-emerald-50/50 px-5 py-3.5 shadow-sm">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-100">
              <Coins className="h-4.5 w-4.5 text-emerald-700" />
            </div>
            <p className="text-sm text-emerald-950">
              <strong className="font-semibold text-emerald-900">Flat-rate rule:</strong> Every completed rescue awards a flat{" "}
              <strong className="font-semibold text-emerald-700">+100 pts</strong> to both the restaurant and the volunteer involved. Everyone starts at 0.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[45fr_55fr]">
            {/* LEFT PROFILE COLUMN */}
            <section className="flex flex-col gap-6">
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-4">
                  <img src={userAvatar} alt={userName} className="h-16 w-16 rounded-2xl object-cover ring-4 ring-emerald-50" />
                  <div>
                    <h2 className="font-display text-lg font-semibold text-emerald-950">{userName}</h2>
                    <span className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 border border-emerald-100">
                      {userRankLabel}
                    </span>
                  </div>
                </div>

                <div className="mt-6">
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

              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="mb-1 text-sm font-semibold text-emerald-950">How points work</h3>
                <p className="text-xs leading-relaxed text-gray-500">
                  Points are earned one rescue at a time — no bonuses, no multipliers. Post a rescue as a
                  restaurant, or claim and deliver one as a volunteer, and 100 pts land in your account
                  the moment it's marked complete.
                </p>
              </div>
            </section>

            {/* RIGHT LEADERBOARD TABLES */}
            <section className="flex flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center gap-2 rounded-xl bg-gray-100 p-1">
                {Object.entries(ROLE_BOARDS).map(([key, { label }]) => (
                  <button
                    key={key}
                    onClick={() => setTab(key)}
                    className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${tab === key ? "bg-white text-emerald-950 shadow-sm" : "text-gray-500 hover:text-gray-800"}`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <div className="mb-1 flex items-center justify-between">
                <h3 className="font-display text-base font-semibold text-emerald-950">{board.label}</h3>
                <span className="text-xs text-gray-400">ranked by {board.unit}</span>
              </div>

              <div className="mt-3 overflow-hidden rounded-xl border border-gray-200">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="bg-gray-50 text-[11px] uppercase tracking-wide text-gray-400">
                      <th className="px-4 py-3 font-semibold">Rank</th>
                      <th className="px-4 py-3 font-semibold">{tab === "volunteers" ? "Volunteer" : "Restaurant"}</th>
                      <th className="px-4 py-3 text-right font-semibold">Points</th>
                    </tr>
                  </thead>
                  <tbody>
                    {board.rows.map((row) => {
                      const isCurrentUserRow = row.name === userName;
                      return (
                        <tr key={row.rank} className={`border-t border-gray-100 ${isCurrentUserRow ? "bg-emerald-50/20" : "hover:bg-gray-50/50"}`}>
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-2">
                              <RankBadge rank={row.rank} />
                              {row.rank === 1 && <Trophy className="h-3.5 w-3.5 text-amber-500" />}
                            </div>
                          </td>
                          <td className="px-4 py-3.5 text-sm font-medium text-gray-900">
                            {row.name}
                            {isCurrentUserRow && (
                              <span className="ml-2 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-800">You</span>
                            )}
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

              <div className="mt-4 rounded-xl bg-emerald-50/40 border border-emerald-100/50 px-5 py-4">
                <p className="text-sm text-emerald-950">
                  <strong className="font-semibold text-emerald-800">Your progress:</strong> You've completed{" "}
                  <strong className="font-semibold text-emerald-900">{userCompletedCount}</strong> {userCompletedCount === 1 ? (isVolunteer ? "rescue" : "donation") : (isVolunteer ? "rescues" : "donations")} and earned{" "}
                  <strong className="font-semibold text-emerald-900">{userPoints} pts</strong>.
                  {nextUp && actionsToNext > 0 && (
                    <> Complete <strong className="font-semibold text-emerald-900">{actionsToNext} more</strong> ({actionsToNext * 100} pts) to pass {nextUp.name} at {nextUp.points} pts.</>
                  )}
                </p>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}