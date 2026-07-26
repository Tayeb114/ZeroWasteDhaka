import React, { useState, useEffect } from "react";
import {
  ChevronDown,
  ArrowDownRight,
  Scale,
  Wallet,
  Trash2,
  CheckCircle2,
  CalendarRange,
  BarChart3,
} from "lucide-react";
import Sidebar from "../components/Sidebar";

export default function WasteLogAnalytics() {
  const [activeNav, setActiveNav] = useState("Waste Log Analytics");
  const [timeframe, setTimeframe] = useState("This Week");

  const [form, setForm] = useState({
    category: "Rice/Biryani",
    weight: "",
    disposedAt: "",
  });
  const [saved, setSaved] = useState(false);
  const [logs, setLogs] = useState([]);
  const [totalWaste, setTotalWaste] = useState(0);
  const [avoidedLoss, setAvoidedLoss] = useState(0);
  const [loading, setLoading] = useState(false);

  const updateForm = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const fetchLogs = async () => {
    try {
      const res = await fetch("http://localhost:5001/api/waste-logs");
      const data = await res.json();
      if (res.ok) {
        setLogs(data.logs);
        setTotalWaste(data.totalWaste);
        setAvoidedLoss(data.avoidedFinancialLoss);
      }
    } catch (err) {
      console.error("Error fetching logs:", err);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const managerId = localStorage.getItem("userId");
      const res = await fetch("http://localhost:5001/api/waste-logs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category: form.category,
          weightKg: parseFloat(form.weight) || 0,
          disposalDate: form.disposedAt || new Date(),
          managerId,
        }),
      });

      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
        setForm({
          category: "Rice/Biryani",
          weight: "",
          disposedAt: "",
        });
        fetchLogs();
      }
    } catch (err) {
      console.error("Error saving log:", err);
    } finally {
      setLoading(false);
    }
  };

  const timeframes = ["Custom Range", "This Week", "This Month", "Last 3 Months"];

  const metrics = [
    {
      label: "Latest Log Waste",
      value: logs.length > 0 ? `${logs[logs.length - 1].weightKg} kg` : "0 kg",
      icon: Scale,
      badge: "↓ Live entry tracker",
      badgeGood: true,
    },
    {
      label: "Total Waste (Selected Period)",
      value: `${totalWaste} kg`,
      icon: BarChart3,
      badge: null,
      badgeGood: null,
    },
    {
      label: "Avoided Financial Loss",
      value: `৳${avoidedLoss.toLocaleString()}`,
      icon: Wallet,
      badge: null,
      badgeGood: null,
      note: "Saved via volunteer rescues",
    },
  ];

  const history = logs.map((log) => ({
    date: new Date(log.disposalDate).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    category: log.category,
    weight: `${log.weightKg} kg`,
    status: "Logged Entry",
  }));

  return (
    <div className="h-screen bg-gray-50 text-gray-900 flex overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700;800&display=swap');
        .font-display { font-family: 'Fraunces', serif; }
      `}</style>

      <Sidebar />

      {/* MAIN */}
      <div className="flex-1 min-w-0 flex flex-col h-screen overflow-y-auto">
        <main className="p-6 lg:p-8">
          {/* HEADER + TIME-TRAVEL FILTER */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h1 className="font-display text-2xl font-semibold text-emerald-950">Waste Log Analytics</h1>

            <div className="relative w-full sm:w-64 shrink-0">
              <CalendarRange className="w-4 h-4 text-emerald-700 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                className="w-full appearance-none rounded-xl border border-gray-200 bg-white pl-10 pr-9 py-2.5 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                {timeframes.map((t) => (
                  <option key={t} value={t}>
                    View Records: {t}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* METRIC CARDS */}
          <section className="grid sm:grid-cols-3 gap-4 mb-6">
            {metrics.map((m) => (
              <div key={m.label} className="bg-white rounded-2xl border border-gray-200 p-5">
                <div className="flex items-center justify-between">
                  <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700">
                    <m.icon className="w-4.5 h-4.5" />
                  </span>
                  {m.badge && (
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 rounded-full px-2 py-1">
                      <ArrowDownRight className="w-3 h-3" />
                      {m.badge}
                    </span>
                  )}
                </div>
                <p className="font-display text-2xl font-semibold text-gray-900 mt-3">{m.value}</p>
                <p className="text-xs text-gray-500 mt-1">{m.label}</p>
                {m.note && <p className="text-[11px] text-gray-400 mt-1">{m.note}</p>}
              </div>
            ))}
          </section>

          {/* TWO-COLUMN MAIN GRID */}
          <section className="flex flex-col lg:flex-row gap-6 items-start">
            {/* LEFT: LOG NEW KITCHEN WASTE (45%) */}
            <div className="w-full lg:basis-[45%] bg-white rounded-2xl border border-gray-200 p-6 lg:p-7">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-display text-lg font-semibold text-gray-900">Log New Kitchen Waste</h2>
                  <p className="text-sm text-gray-500 mt-1">Record discarded surplus for accurate tracking.</p>
                </div>
                <span className="flex items-center justify-center w-11 h-11 rounded-xl bg-amber-50 text-amber-600 shrink-0">
                  <Trash2 className="w-5 h-5" />
                </span>
              </div>

              <form onSubmit={handleSave} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-2">Food Category</label>
                  <div className="relative">
                    <select
                      value={form.category}
                      onChange={(e) => updateForm("category", e.target.value)}
                      className="w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    >
                      <option>Rice/Biryani</option>
                      <option>Curries</option>
                      <option>Bakery</option>
                      <option>Others</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-2">Weight (kg) of Discarded Food</label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={form.weight}
                    onChange={(e) => updateForm("weight", e.target.value)}
                    placeholder="e.g. 3.0"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-2">Date & Time of Disposal</label>
                  <input
                    type="datetime-local"
                    value={form.disposedAt}
                    onChange={(e) => updateForm("disposedAt", e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold px-7 py-3.5 shadow-sm shadow-emerald-100 transition-colors"
                >
                  Save Waste Log Entry
                </button>

                {saved && (
                  <p className="flex items-center gap-2 text-sm text-emerald-700 font-medium">
                    <CheckCircle2 className="w-4 h-4" /> Waste log entry saved.
                  </p>
                )}
              </form>
            </div>

            {/* RIGHT: HISTORICAL LOG RECORD TABLE (55%) */}
            <div className="w-full lg:basis-[55%] bg-white rounded-2xl border border-gray-200 p-6 lg:p-7">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="font-display text-lg font-semibold text-gray-900">Historical Log Record</h2>
                  <p className="text-sm text-gray-500 mt-1">Most recent entries for {timeframe.toLowerCase()}.</p>
                </div>
              </div>

              <div className="overflow-x-auto -mx-2">
                <table className="w-full text-sm min-w-[420px]">
                  <thead>
                    <tr className="text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400 border-b border-gray-100">
                      <th className="px-2 py-3">Date</th>
                      <th className="px-2 py-3">Category</th>
                      <th className="px-2 py-3">Weight (kg)</th>
                      <th className="px-2 py-3">Status / Note</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((row, i) => (
                      <tr
                        key={i}
                        className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition-colors"
                      >
                        <td className="px-2 py-3.5 text-gray-700 whitespace-nowrap">{row.date}</td>
                        <td className="px-2 py-3.5 text-gray-700 whitespace-nowrap">{row.category}</td>
                        <td className="px-2 py-3.5 text-gray-900 font-semibold whitespace-nowrap">{row.weight}</td>
                        <td className="px-2 py-3.5">
                          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 rounded-full px-2.5 py-1 whitespace-nowrap">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}