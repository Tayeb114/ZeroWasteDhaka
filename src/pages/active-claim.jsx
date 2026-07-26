import React, { useState } from "react";
import {
  Phone,
  Package,
  Info,
  MapPin,
  CheckCircle2,
  Clock,
  Compass,
} from "lucide-react";
import Sidebar from "../components/Sidebar";

export default function ActiveClaimNavigation() {
  const [confirmed, setConfirmed] = useState(false);

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
          <div className="mb-6">
            <h1 className="font-display text-2xl font-semibold text-emerald-950">Active Claim Details</h1>
            <p className="text-sm text-gray-500 mt-1">Track your delivery progress and confirm handover below.</p>
          </div>

          <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* LEFT: CLAIM DETAILS & ACTIONS (5/12 cols) */}
            <div className="lg:col-span-5 bg-white rounded-2xl border border-gray-200 p-6 space-y-6">
              <div>
                <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-wide text-amber-700 bg-amber-50 border border-amber-100 rounded-full px-3 py-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                  {confirmed ? "Completed" : "In Progress — En Route"}
                </span>
                <h2 className="font-display text-xl font-semibold text-gray-900 mt-3.5">Claim #ZW-9042</h2>
              </div>

              {/* Package details */}
              <div className="rounded-xl border border-gray-150 bg-gray-50/50 p-4 flex items-start gap-3">
                <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 shrink-0 mt-0.5">
                  <Package className="w-5 h-5" />
                </span>
                <div>
                  <p className="text-xs text-gray-400 font-medium">Package Contents</p>
                  <p className="text-sm font-semibold text-gray-900 mt-0.5">
                    Mutton Biryani (5kg) &bull; 4 Boxed Packages
                  </p>
                </div>
              </div>

              {/* ETA / Stats summary */}
              <div className="rounded-xl border border-gray-150 bg-gray-50/50 p-4 flex items-start gap-3">
                <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 shrink-0 mt-0.5">
                  <Clock className="w-5 h-5" />
                </span>
                <div>
                  <p className="text-xs text-gray-400 font-medium">Estimated Arrival</p>
                  <p className="text-sm font-semibold text-gray-900 mt-0.5">
                    {confirmed ? "Delivered" : "6 mins remaining (0.8 km)"}
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setConfirmed(true)}
                  disabled={confirmed}
                  className={`w-full inline-flex items-center justify-center gap-2 rounded-full text-sm font-semibold px-7 py-4 shadow-sm transition-colors ${
                    confirmed
                      ? "bg-emerald-100 text-emerald-800 cursor-default"
                      : "bg-emerald-700 hover:bg-emerald-800 text-white shadow-emerald-100"
                  }`}
                >
                  <CheckCircle2 className="w-4.5 h-4.5" />
                  {confirmed ? "Food Handover Complete" : "Confirm Food Pickup & Handover"}
                </button>

                {confirmed && (
                  <p className="flex items-center gap-1.5 text-xs text-emerald-700 font-medium mt-3 justify-center">
                    ✓ Handover log synced successfully to leaderboard points!
                  </p>
                )}
              </div>
            </div>

            {/* RIGHT: PICKUP STEP PROGRESS & CONTACT CARD (7/12 cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Pickup Progress Timeline */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 lg:p-7">
                <h3 className="font-display text-base font-semibold text-gray-900 mb-6">
                  Pickup Step Progress
                </h3>

                {/* Timeline Checklist */}
                <div className="relative pl-8 space-y-8">
                  {/* Vertical connecting line */}
                  <div className="absolute left-3.5 top-2 bottom-2 w-0.5 bg-gray-200">
                    <div
                      className="w-full bg-emerald-600 transition-all duration-500"
                      style={{ height: confirmed ? "100%" : "50%" }}
                    />
                  </div>

                  {/* Step 1 */}
                  <div className="relative flex items-start gap-4">
                    <span className="absolute -left-8 flex items-center justify-center w-7.5 h-7.5 rounded-full bg-emerald-600 border-4 border-white shadow-sm">
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-gray-950">1. Donation Claimed</p>
                      <p className="text-xs text-gray-500 mt-0.5">Claim registered at 8:12 PM</p>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="relative flex items-start gap-4">
                    <span
                      className={`absolute -left-8 flex items-center justify-center w-7.5 h-7.5 rounded-full border-4 border-white shadow-sm transition-colors ${
                        confirmed
                          ? "bg-emerald-600"
                          : "bg-emerald-500 ring-2 ring-emerald-500/20"
                      }`}
                    >
                      {confirmed ? (
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      ) : (
                        <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
                      )}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-gray-950">2. In Transit</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {confirmed ? "Completed pickup route" : "Volunteer is en route to Star Restaurant"}
                      </p>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="relative flex items-start gap-4">
                    <span
                      className={`absolute -left-8 flex items-center justify-center w-7.5 h-7.5 rounded-full border-4 border-white shadow-sm transition-colors ${
                        confirmed ? "bg-emerald-600" : "bg-gray-200"
                      }`}
                    >
                      {confirmed ? (
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      ) : (
                        <span className="w-2.5 h-2.5 rounded-full bg-transparent" />
                      )}
                    </span>
                    <div>
                      <p
                        className={`text-sm font-semibold ${
                          confirmed ? "text-gray-950" : "text-gray-400"
                        }`}
                      >
                        3. Handover Complete
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {confirmed ? "Delivered at 8:28 PM & logged +100 points" : "Pending provider signature at pickup site"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Info & Pickup Instructions */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 lg:p-7 space-y-6">
                <h3 className="font-display text-base font-semibold text-gray-900">
                  Restaurant Contact & Instructions
                </h3>

                <div className="flex items-start justify-between gap-3 p-4 rounded-xl border border-gray-150 bg-gray-50/50">
                  <div className="flex items-start gap-3 min-w-0">
                    <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 shrink-0">
                      <MapPin className="w-5 h-5" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs text-gray-400 font-medium">Pickup Provider</p>
                      <p className="text-sm font-semibold text-gray-900 mt-0.5">Star Restaurant</p>
                      <p className="text-xs text-gray-500 mt-0.5">Dhanmondi 27, Dhaka</p>
                    </div>
                  </div>
                  <a
                    href="tel:+8801712345678"
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white shrink-0 transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                </div>

                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 flex items-start gap-3">
                  <Info className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-emerald-950">Pickup Instructions</p>
                    <p className="text-xs text-emerald-850 mt-1 leading-relaxed">
                      Please enter through the back kitchen entrance. Ask the shift supervisor, <strong>Rahim Uddin</strong>, for ZeroWaste claim ID #ZW-9042.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}