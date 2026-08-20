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
import { API_BASE_URL } from "../config/api";

export default function WasteLogAnalytics() {
  const now = new Date();
  
  // Default to current month start and end dates
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
  
  const [startDate, setStartDate] = useState(firstDay);
  const [endDate, setEndDate] = useState(lastDay);

  const [form, setForm] = useState({
    foodName: "",
    quantity: "",
    unit: "kg",
    disposedAt: "",
  });
  const [saved, setSaved] = useState(false);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  const updateForm = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const fetchLogs = async () => {
    try {
      const managerId = localStorage.getItem("userId");
      const res = await fetch(`${API_BASE_URL}/waste-logs?managerId=${managerId}`);
      const data = await res.json();
      if (res.ok) {
        setLogs(data.logs);
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
      const res = await fetch(`${API_BASE_URL}/waste-logs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          foodName: form.foodName,
          quantity: parseFloat(form.quantity) || 0,
          unit: form.unit,
          disposalDate: form.disposedAt || new Date(),
          managerId,
        }),
      });

      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
        setForm({
          foodName: "",
          quantity: "",
          unit: "kg",
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

  // Filter logs for CURRENT calendar month only (for Cards 2 and 3)
  const currentMonthLogs = logs.filter(log => {
    const logDate = new Date(log.disposalDate);
    return logDate.getMonth() === now.getMonth() && logDate.getFullYear() === now.getFullYear();
  });

  const currentMonthWaste = currentMonthLogs.reduce((sum, log) => sum + log.quantity, 0);

  // Filter logs by selected calendar range (for Historical Table)
  const filteredLogs = logs.filter(log => {
    if (!startDate || !endDate) return true;
    const logDate = new Date(log.disposalDate);
    const sDate = new Date(startDate);
    sDate.setHours(0, 0, 0, 0);
    const eDate = new Date(endDate);
    eDate.setHours(23, 59, 59, 999);
    return logDate >= sDate && logDate <= eDate;
  });

  const metrics = [
    {
      label: "Latest Discard Entry",
      value: logs.length > 0 ? `${logs[0].quantity} ${logs[0].unit}` : "N/A",
      icon: Scale,
      badge: null,
      badgeGood: null,
      note: "Most recent kitchen discard",
    },
    {
      label: "Current Month's Total Waste",
      value: `${currentMonthWaste} Items/L/kg`,
      icon: BarChart3,
      badge: null,
      badgeGood: null,
      note: "Total waste logged this month",
    },
    {
      label: "Current Month Log Count",
      value: `${currentMonthLogs.length} Logs`,
      icon: CheckCircle2,
      badge: null,
      badgeGood: null,
      note: "Entries recorded this month",
    },
  ];

  const history = filteredLogs.map((log) => ({
    date: new Date(log.disposalDate).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    foodItem: log.foodName,
    quantityUnit: `${log.quantity} ${log.unit}`,
    status: "Logged Entry",
  }));

  const formatTablePeriod = () => {
    if (!startDate || !endDate) return "All Time";
    const s = new Date(startDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    const e = new Date(endDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    return `${s} - ${e}`;
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
        <main className="p-6 lg:p-8">
          {/* HEADER + CALENDAR FILTER */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h1 className="font-display text-2xl font-semibold text-emerald-950">Waste Log Analytics</h1>

            <div className="flex items-center gap-2">
              <CalendarRange className="w-4 h-4 text-emerald-700 hidden sm:block" />
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <span className="text-gray-400 text-sm font-medium">to</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
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
                <p className="text-xs text-gray-800 font-medium mt-1">{m.label}</p>
                {m.note && <p className="text-[11px] text-gray-500 mt-1">{m.note}</p>}
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
                {saved && (
                  <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold rounded-xl p-4 flex items-center gap-3 animate-pulse">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    Waste log recorded successfully!
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-2">DISCARDED FOOD NAME *</label>
                  <input
                    type="text"
                    value={form.foodName}
                    onChange={(e) => updateForm("foodName", e.target.value)}
                    placeholder="e.g. Chicken Soup"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-2">QUANTITY *</label>
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      value={form.quantity}
                      onChange={(e) => updateForm("quantity", e.target.value)}
                      placeholder="e.g. 2.5"
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-2">UNIT *</label>
                    <div className="relative">
                      <select
                        value={form.unit}
                        onChange={(e) => updateForm("unit", e.target.value)}
                        className="w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      >
                        <option>kg</option>
                        <option>Liters</option>
                        <option>Pieces</option>
                        <option>Packets</option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
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
              </form>
            </div>

            {/* RIGHT: HISTORICAL LOG RECORD TABLE (55%) */}
            <div className="w-full lg:basis-[55%] bg-white rounded-2xl border border-gray-200 p-6 lg:p-7">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="font-display text-lg font-semibold text-gray-900">Historical Log Record</h2>
                  <p className="text-sm text-gray-500 mt-1">Showing entries for {formatTablePeriod()}.</p>
                </div>
              </div>

              <div className="overflow-x-auto -mx-2">
                <table className="w-full text-sm min-w-[420px]">
                  <thead>
                    <tr className="text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400 border-b border-gray-100">
                      <th className="px-2 py-3">DATE</th>
                      <th className="px-2 py-3">FOOD ITEM</th>
                      <th className="px-2 py-3">QUANTITY / UNIT</th>
                      <th className="px-2 py-3">STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.length > 0 ? history.map((row, i) => (
                      <tr
                        key={i}
                        className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition-colors"
                      >
                        <td className="px-2 py-3.5 text-gray-700 whitespace-nowrap">{row.date}</td>
                        <td className="px-2 py-3.5 text-gray-700 whitespace-nowrap">{row.foodItem}</td>
                        <td className="px-2 py-3.5 text-gray-900 font-semibold whitespace-nowrap">{row.quantityUnit}</td>
                        <td className="px-2 py-3.5">
                          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 rounded-full px-2.5 py-1 whitespace-nowrap">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="4" className="px-2 py-6 text-center text-sm text-gray-500">
                          No waste logged in selected date range.
                        </td>
                      </tr>
                    )}
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