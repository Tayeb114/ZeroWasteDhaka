import React, { useState } from "react";
import {
  Leaf,
  MapPin,
  BarChart3,
  Trophy,
  ArrowRight,
  Menu,
  X,
  Clock,
  Package,
  Users,
  TrendingUp,
  Facebook,
  Instagram,
  Twitter,
  Mail,
  CheckCircle2,
} from "lucide-react";

export default function ZeroWasteDhaka() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const navLinks = [
    { label: "Home", href: "#home" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Leaderboard", href: "#leaderboard" },
    { label: "About Us", href: "#about" },
  ];

  const stats = [
    { value: "15,000+ kg", label: "Food Rescued" },
    { value: "120+", label: "Partner Restaurants" },
    { value: "2,500+", label: "Active Volunteers" },
    { value: "45,000+", label: "kg CO₂ Reduced" },
  ];

  const steps = [
    {
      title: "List the surplus",
      desc: "Restaurants post leftover food with exact weight, category, and pickup expiry window in under a minute.",
      icon: Package,
    },
    {
      title: "Claim the route",
      desc: "Nearby volunteers get a live map alert and claim the listing before it's picked up by someone else.",
      icon: MapPin,
    },
    {
      title: "Hand over & log",
      desc: "Food changes hands safely, the tracking log updates automatically, and both profiles earn leaderboard points.",
      icon: CheckCircle2,
    },
  ];

  const features = [
    {
      title: "Live Route Mapping",
      audience: "For Volunteers",
      desc: "Turn-by-turn pickup routes update in real time, so volunteers reach restaurants before food windows close.",
      icon: MapPin,
      img: "https://images.unsplash.com/photo-1522199755839-a2bacb67c546?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Waste Log Analytics",
      audience: "For Restaurant Managers",
      desc: "Automated inventory insights show exactly what's being rescued, when, and where waste patterns start.",
      icon: BarChart3,
      img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Gamified Leaderboards",
      audience: "For Everyone",
      desc: "Donation milestones and city-wide rankings turn every rescue into a small, visible act of impact.",
      icon: Trophy,
      img: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700;800&display=swap');
        .font-display { font-family: 'Fraunces', serif; }
        .route-line {
          background-image: repeating-linear-gradient(90deg, #a7f3d0 0, #a7f3d0 8px, transparent 8px, transparent 16px);
        }
      `}</style>

      {/* NAVBAR */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 h-20 flex items-center justify-between">
          <a href="#home" className="flex items-center gap-2.5">
            <span className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-700">
              <Leaf className="w-5 h-5 text-white" strokeWidth={2.5} />
            </span>
            <span className="font-display text-xl font-semibold tracking-tight text-emerald-950">
              ZeroWaste <span className="text-amber-500">Dhaka</span>
            </span>
          </a>

          <nav className="hidden md:flex items-center gap-9">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-gray-600 hover:text-emerald-700 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden md:block">
            <a
              href="#get-started"
              className="inline-flex items-center gap-2 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold px-6 py-2.5 shadow-sm shadow-emerald-200 transition-colors"
            >
              Get Started
            </a>
          </div>

          <button
            className="md:hidden text-emerald-950"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white px-6 py-5 space-y-4">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="block text-sm font-medium text-gray-700"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <a
              href="#get-started"
              className="block text-center rounded-full bg-emerald-700 text-white text-sm font-semibold px-6 py-2.5"
            >
              Get Started
            </a>
          </div>
        )}
      </header>

      {/* HERO */}
      <section id="home" className="relative overflow-hidden bg-gradient-to-b from-emerald-50 via-white to-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-16 pb-24 lg:pt-24 lg:pb-32 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-600 bg-amber-50 border border-amber-100 rounded-full px-3.5 py-1.5">
              <Clock className="w-3.5 h-3.5" />
              Dhaka's Food Rescue Network
            </span>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold text-emerald-950 leading-[1.08] mt-6">
              Rescuing Dhaka's Surplus Food, One Meal at a Time
            </h1>

            <p className="mt-6 text-lg text-gray-600 leading-relaxed max-w-xl">
              We connect local restaurants with kitchens still full at closing time to volunteers
              ready to move fast. Every claimed listing keeps good food out of landfills and on a
              plate in the community that needs it.
            </p>

            <div className="mt-9 flex flex-col sm:flex-row gap-4">
              <a
                href="#get-started"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold px-7 py-3.5 shadow-lg shadow-amber-200 transition-colors"
              >
                Join as a Partner
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#get-started"
                className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-emerald-700 text-emerald-800 hover:bg-emerald-50 text-sm font-semibold px-7 py-3.5 transition-colors"
              >
                Become a Volunteer
              </a>
            </div>

            <div className="mt-10 flex items-center gap-3">
              <div className="flex -space-x-3">
                {[
                  "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=80&q=80",
                  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80",
                  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=80&q=80",
                ].map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt="Volunteer"
                    className="w-9 h-9 rounded-full object-cover border-2 border-white"
                  />
                ))}
              </div>
              <p className="text-sm text-gray-500">
                <span className="font-semibold text-gray-800">2,500+ volunteers</span> already rescuing meals across Dhaka
              </p>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -top-10 -right-10 w-72 h-72 bg-emerald-100 rounded-full blur-3xl opacity-70" />
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1200&q=80"
                alt="Professional kitchen staff preparing food for donation"
                className="w-full h-[420px] lg:h-[520px] object-cover"
              />
            </div>

            <div className="absolute -bottom-6 left-6 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3 max-w-[240px]">
              <span className="flex items-center justify-center w-11 h-11 rounded-xl bg-emerald-700 shrink-0">
                <TrendingUp className="w-5 h-5 text-white" />
              </span>
              <div>
                <p className="text-sm font-bold text-gray-900 leading-none">2,840 kg</p>
                <p className="text-xs text-gray-500 mt-1">rescued across Dhaka this month</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* IMPACT STATS */}
      <section className="bg-emerald-900">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-14 grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
          {stats.map((stat) => (
            <div key={stat.label}>
              <p className="font-display text-3xl sm:text-4xl font-bold text-amber-400">{stat.value}</p>
              <p className="mt-2 text-xs sm:text-sm uppercase tracking-wide text-emerald-100">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-24 px-6 lg:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-700">The Rescue Route</span>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-emerald-950 mt-3">
              How It Works
            </h2>
            <p className="mt-4 text-gray-600">
              From a restaurant's closing shift to a volunteer's doorstep drop-off, the whole route
              runs in three simple stops.
            </p>
          </div>

          <div className="mt-16 relative">
            <div className="hidden md:block absolute top-7 left-[16.66%] right-[16.66%] h-0.5 route-line" />
            <div className="grid md:grid-cols-3 gap-12 md:gap-8">
              {steps.map((step, i) => (
                <div key={step.title} className="relative text-center md:text-left">
                  <div className="flex md:block items-center gap-4">
                    <span className="relative z-10 inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-700 text-white font-display font-semibold text-lg shrink-0">
                      {i + 1}
                    </span>
                    <span className="hidden md:inline-flex items-center justify-center w-10 h-10 rounded-lg bg-amber-50 text-amber-600 mt-5">
                      <step.icon className="w-5 h-5" />
                    </span>
                    <h3 className="font-display text-xl font-semibold text-gray-900 md:hidden">
                      {step.title}
                    </h3>
                  </div>
                  <h3 className="hidden md:block font-display text-xl font-semibold text-gray-900 mt-5">
                    {step.title}
                  </h3>
                  <p className="mt-2.5 text-gray-600 text-sm leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="bg-gray-50 py-24 px-6 lg:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-700">What's Inside</span>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-emerald-950 mt-3">
              Built for Every Role in the Rescue
            </h2>
            <p className="mt-4 text-gray-600">
              Volunteers, restaurant managers, and top contributors each get tools shaped around
              exactly what they need to do next.
            </p>
          </div>

          <div className="mt-16 grid md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow border border-gray-100"
              >
                <img
                  src={feature.img}
                  alt={feature.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700">
                    <feature.icon className="w-5 h-5" />
                  </span>
                  <p className="text-xs font-bold uppercase tracking-wide text-amber-600 mt-4">
                    {feature.audience}
                  </p>
                  <h3 className="font-display text-lg font-semibold text-gray-900 mt-1">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600 leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="about" className="bg-emerald-950 text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16 grid md:grid-cols-4 gap-12">
          <div className="md:col-span-1">
            <a href="#home" className="flex items-center gap-2.5">
              <span className="flex items-center justify-center w-9 h-9 rounded-full bg-emerald-700">
                <Leaf className="w-4.5 h-4.5 text-white" />
              </span>
              <span className="font-display text-lg font-semibold">
                ZeroWaste <span className="text-amber-400">Dhaka</span>
              </span>
            </a>
            <p className="mt-4 text-sm text-emerald-200 leading-relaxed max-w-xs">
              A community platform rescuing surplus food from Dhaka's kitchens and putting it in
              the hands of neighbors who need it, one claimed listing at a time.
            </p>
            <div className="flex items-center gap-3 mt-6">
              {[Facebook, Instagram, Twitter].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-full bg-emerald-900 hover:bg-emerald-700 flex items-center justify-center transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-wide text-emerald-300">Quick Links</h4>
            <ul className="mt-4 space-y-3 text-sm text-emerald-100">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="hover:text-white transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-wide text-emerald-300">Legal</h4>
            <ul className="mt-4 space-y-3 text-sm text-emerald-100">
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Food Safety Guidelines</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-wide text-emerald-300">Stay Updated</h4>
            <p className="mt-4 text-sm text-emerald-100">
              Get monthly rescue stats and new partner restaurants straight to your inbox.
            </p>
            {subscribed ? (
              <p className="mt-4 flex items-center gap-2 text-sm text-amber-300 font-medium">
                <CheckCircle2 className="w-4 h-4" /> You're subscribed
              </p>
            ) : (
              <form
                className="mt-4 flex items-center gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (email.trim()) setSubscribed(true);
                }}
              >
                <div className="flex items-center gap-2 bg-emerald-900 rounded-full px-4 py-2.5 flex-1">
                  <Mail className="w-4 h-4 text-emerald-300 shrink-0" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@email.com"
                    className="bg-transparent text-sm outline-none placeholder:text-emerald-400 w-full"
                  />
                </div>
                <button
                  type="submit"
                  className="rounded-full bg-amber-500 hover:bg-amber-600 text-white p-2.5 shrink-0 transition-colors"
                  aria-label="Subscribe"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="border-t border-emerald-900">
          <p className="max-w-7xl mx-auto px-6 lg:px-10 py-6 text-center text-xs text-emerald-400">
            © {new Date().getFullYear()} ZeroWaste Dhaka. Built by Tayeb. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
