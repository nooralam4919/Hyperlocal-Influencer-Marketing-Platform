import { motion } from "framer-motion";
import authService from "../Appwrite/Auth";
import { logout } from "../store/authSlice";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useState, useEffect, useRef } from "react";
import { Search, Bell, Settings, MapPin, ArrowUpRight, Layers3, LogOut } from "lucide-react";
import { FaInstagram, FaYoutube, FaFacebook, FaEnvelope, FaBookmark } from "react-icons/fa6";

const influencers = [
  { name: "Sophia Adams", followers: "870K", category: "Fashion",   price: "$5200", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600" },
  { name: "Emma Brown",   followers: "440K", category: "Lifestyle", price: "$2400", image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600" },
  { name: "Mia Chen",     followers: "440K", category: "Tech",      price: "$2400", image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800" },
  { name: "Jay Keller",   followers: "315K", category: "Fitness",   price: "$2150", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600" },
];

const headingItems = [
  { name: "Home",      slug: "/owner-dashboard" },
  { name: "Search",    slug: "/owner-dashboard/search" },
  { name: "Message",   slug: "/owner-dashboard/massage" },
  { name: "Community", slug: "/owner-dashboard/community" },
  { name: "Resource",  slug: "/owner-dashboard/resources" },
];

const navItems = [
  { name: "All",       slug: "/owner-dashboard" },
  { name: "Fashion",   slug: "/owner-dashboard/fashion" },
  { name: "Comedy",    slug: "/owner-dashboard/comedy" },
  { name: "Lifestyle", slug: "/owner-dashboard/lifestyle" },
  { name: "Tech",      slug: "/owner-dashboard/tech" },
  { name: "Beauty",    slug: "/owner-dashboard/beauty" },
  { name: "Gaming",    slug: "/owner-dashboard/gaming" },
];

export default function OwnerViewPage() {
  const [loggingOut, setLoggingOut]       = useState(false);
  const [dropdownOpen, setDropdownOpen]   = useState(false);
  const dropdownRef                       = useRef(null);
  const dispatch       = useDispatch();
  const navigate       = useNavigate();
  const location       = useLocation();
  const isHome         = location.pathname === "/owner-dashboard";

  // Close dropdown on route change
  useEffect(() => { setDropdownOpen(false); }, [location.pathname]);

  // Close dropdown when clicking anywhere outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await authService.logOut();
      dispatch(logout());
      navigate("/");
    } catch (err) {
      console.log(err);
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#300905]">

      {/* ── NAVBAR (always visible) ── */}
      <nav className="h-[50px] bg-black border-b border-white/10 px-4 md:px-8 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-8">
          <div
            className="w-10 h-10 rounded-full bg-[#30100b] flex items-center justify-center cursor-pointer hover:bg-[#4a1008] transition"
            onClick={() => navigate("/owner-dashboard")}
          >
            <Layers3 size={15} className="text-white" />
          </div>

          <div className="hidden lg:flex items-center gap-8 text-sm font-medium">
            {headingItems.map((item) => (
              <button
                key={item.slug}
                onClick={() => navigate(item.slug)}
                className={`transition duration-300 ${
                  location.pathname === item.slug
                    ? "text-[#C08552]"
                    : "text-white/80 hover:text-[#C08552]"
                }`}
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4 text-white">
          <div className="hidden md:flex items-center gap-2">
            <MapPin size={16} />
            <span className="text-sm">London, UK</span>
          </div>
          <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center cursor-pointer hover:bg-white/10 transition">
            <Settings size={18} />
          </div>
          <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center cursor-pointer hover:bg-white/10 transition">
            <Bell size={18} />
          </div>

          {/* Avatar with dropdown */}
          <div className="relative" ref={dropdownRef}>
            <img
              src="https://i.pravatar.cc/150?img=32"
              alt="avatar"
              className="w-10 h-10 rounded-full cursor-pointer ring-2 ring-transparent hover:ring-[#C08552] transition"
              onClick={() => setDropdownOpen((prev) => !prev)}
            />

            {dropdownOpen && (
              <div className="absolute right-0 top-12 w-44 bg-[#1a1a1a] border border-zinc-700 rounded-2xl shadow-2xl overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-zinc-700">
                  <p className="text-sm font-semibold text-white">My Account</p>
                  <p className="text-xs text-gray-400">Owner</p>
                </div>
                <button
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-zinc-800 transition flex items-center gap-2"
                >
                  <LogOut size={15} />
                  {loggingOut ? "Logging out..." : "Logout"}
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* ── NESTED ROUTE OUTLET (Search / Messages / Community / Resources) ── */}
      {!isHome && <Outlet />}

      {/* ── HOME CONTENT ── */}
      {isHome && (
        <div>

          {/* HERO */}
          <div className="bg-black rounded-b-[40px] overflow-hidden px-5 md:px-10 py-10">
            <div className="grid grid-cols-1 lg:grid-cols-[1.8fr_0.7fr] gap-8 items-center">

              {/* LEFT */}
              <motion.div initial={{ x: -40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.6 }}>
                <h1 className="text-white font-black leading-[1] tracking-[-0.04em] text-[36px] sm:text-[48px] md:text-[58px] lg:text-[68px]">
                  <span className="flex flex-wrap items-center gap-2 md:gap-3">
                    Find
                    <Search className="h-10 w-10 sm:h-12 sm:w-12 border border-[#4B2E2B] text-[#B6B09F] rounded-xl p-2" />
                    Influencers
                    <span className="flex">
                      <img src="https://i.pravatar.cc/150?img=11" alt="" className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full border-2 border-white" />
                      <img src="https://i.pravatar.cc/150?img=21" alt="" className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full border-2 border-white -ml-3" />
                      <img src="https://i.pravatar.cc/150?img=31" alt="" className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full border-2 border-white -ml-3" />
                    </span>
                  </span>
                  to collaborate with
                </h1>

                {/* Search bar */}
                <div className="mt-8 w-full max-w-[550px]">
                  <div className="bg-[#330b05] h-[58px] rounded-2xl flex items-center p-2 shadow-xl">
                    <input
                      placeholder="Search creators..."
                      className="flex-1 min-w-0 bg-transparent outline-none px-4 text-white placeholder:text-gray-400"
                    />
                    <button
                      onClick={() => navigate("/owner-dashboard/search")}
                      className="w-10 h-10 rounded-xl bg-[#63190e] flex items-center justify-center shrink-0 hover:bg-[#7a2215] transition"
                    >
                      <Search size={18} className="text-[#B6B09F]" />
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* RIGHT CTA CARD */}
              <motion.div
                whileHover={{ scale: 1.03 }}
                className="h-[180px] sm:h-[220px] bg-[#330b05] rounded-[24px] p-6 relative overflow-hidden flex flex-col justify-between shadow-2xl"
              >
                <div className="absolute -right-12 -top-6 w-40 h-40 border border-[#B6B09F]/20 rounded-full" />
                <div className="absolute -right-16 bottom-0 w-32 h-32 border border-[#B6B09F]/20 rounded-full" />
                <div className="flex justify-end">
                  <ArrowUpRight size={40} className="text-[#B6B09F]" />
                </div>
                <div>
                  <p className="text-[#B6B09F]/70 text-sm uppercase tracking-widest">Learn More</p>
                  <h2 className="text-white text-2xl sm:text-3xl font-black leading-tight">See how<br />it's done</h2>
                </div>
              </motion.div>
            </div>
          </div>

          {/* CREATOR CARDS */}
          <div className="relative px-3 sm:px-6 md:px-8 py-6">
            <div className="bg-[#EAE4D5] rounded-[30px] p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 shadow-xl">
              {influencers.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -6 }}
                  className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition w-full"
                >
                  <div className="w-full h-[300px] bg-zinc-900 overflow-hidden">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover object-top" />
                  </div>
                  <div className="p-3 flex flex-col gap-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-1">
                          <span className="text-sm font-semibold text-gray-900">{item.name}</span>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="#3b82f6">
                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-900">{item.followers}</p>
                        <p className="text-[10px] text-gray-400">Followers</p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center mt-2">
                      <div className="flex gap-2 text-gray-500">
                        <a href="https://instagram.com" target="_blank" rel="noreferrer"><FaInstagram size={15} className="hover:text-pink-500 transition" /></a>
                        <a href="https://youtube.com" target="_blank" rel="noreferrer"><FaYoutube size={15} className="hover:text-red-500 transition" /></a>
                        <a href="https://facebook.com" target="_blank" rel="noreferrer"><FaFacebook size={14} className="hover:text-[#1877F2] transition" /></a>
                      </div>
                      <span className="bg-green-100 text-green-800 text-[10px] px-2 py-0.5 rounded-full">{item.category}</span>
                    </div>

                    <div className="border-t border-gray-100 mt-3 pt-2">
                      <p className="text-[10px] text-gray-400">Advertising Price</p>
                      <p className="text-lg font-bold text-gray-900">{item.price}</p>
                    </div>

                    <div className="flex items-center gap-2 mt-3">
                      <button className="border border-gray-200 rounded-lg p-1.5 hover:bg-gray-100 transition"><FaEnvelope size={13} className="text-gray-500" /></button>
                      <button className="border border-gray-200 rounded-lg p-1.5 hover:bg-gray-100 transition"><FaBookmark size={13} className="text-gray-500" /></button>
                      <button
                        onClick={() => navigate("/owner-dashboard/massage")}
                        className="flex-1 bg-[#330b05] text-white text-xs py-1.5 rounded-xl hover:bg-gray-700 transition"
                      >
                        Send Message
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Show All card */}
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="bg-[#330b05] rounded-2xl flex flex-col items-center justify-center min-h-[250px] shadow-lg cursor-pointer"
                onClick={() => navigate("/owner-dashboard/search")}
              >
                <h2 className="text-2xl sm:text-3xl font-bold text-white">Show All</h2>
                <p className="text-white/80 mt-2 text-sm">13,150 Creators</p>
              </motion.div>
            </div>
          </div>

          {/* BROWSE BY NICHE */}
          <div className="pt-10 px-4 md:px-8">
            <div className="text-center mb-4">
              <h1 className="text-lg md:text-xl font-bold tracking-wide text-white">BROWSE BY NICHE</h1>
            </div>
            <div className="flex justify-center">
              <ul className="flex flex-wrap justify-center gap-3">
                {navItems.map((item) => (
                  <li key={item.slug}>
                    <button
                      onClick={() => navigate(item.slug)}
                      className="px-8 py-1.5 rounded-full bg-black border text-sm text-white hover:bg-zinc-800 transition"
                    >
                      {item.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* TOP CREATORS */}
          <div className="text-white py-10 mt-0 px-8">
            <div className="mb-8">
              <p className="text-gray-400 uppercase tracking-[0.25em] text-sm">Trending This Week</p>
              <h2 className="text-4xl font-bold mt-2">Top creators</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {influencers.map((creator, index) => (
                <div key={index} className="overflow-hidden rounded-2xl border border-zinc-800 bg-[#111111] hover:border-zinc-700 transition-all duration-300">
                  <div className="h-72 overflow-hidden bg-zinc-900">
                    <img src={creator.image} alt={creator.name} className="w-full h-full object-cover object-top" />
                  </div>
                  <div className="p-4">
                    <h3 className="text-xl font-semibold">{creator.name}</h3>
                    <div className="flex justify-between mt-1">
                      <p className="text-gray-400 text-sm">{creator.followers}</p>
                      <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm">{creator.category}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <hr className="border-zinc-800" />

          {/* HOW IT WORKS */}
          <section className="text-white py-10 px-6 md:px-12">
            <div className="mb-12">
              <p className="text-gray-400 uppercase tracking-[0.2em] text-sm">SIMPLE PROCESS</p>
              <h2 className="text-4xl font-bold mt-2">How it works</h2>
            </div>
            <div className="space-y-8">
              {[
                { n: 1, title: "Search & filter creators",  desc: "Filter by niche, budget, follower count and platform to find the perfect match." },
                { n: 2, title: "Message & negotiate",       desc: "Send a direct message, discuss deliverables and agree on pricing in-platform." },
                { n: 3, title: "Launch your campaign",      desc: "Track performance, get reports and measure ROI from your dashboard." },
              ].map((step) => (
                <div key={step.n} className="flex items-start gap-6">
                  <div className="w-16 h-16 rounded-full bg-[#712020] flex items-center justify-center flex-shrink-0">
                    <span className="text-3xl font-bold text-[#f5a08c]">{step.n}</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2">{step.title}</h3>
                    <p className="text-gray-400 text-lg">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <hr className="border-zinc-800" />

          {/* PRICING + CTA + FOOTER */}
          <section className="text-white">
            {/* Pricing */}
            <div className="px-4 md:px-12 py-10 border-b border-zinc-900">
              <div className="text-center mb-12">
                <p className="text-gray-500 uppercase tracking-[0.3em] text-xs mb-3">Choose a Plan</p>
                <h2 className="text-4xl md:text-5xl font-bold">Pricing</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                <div className="rounded-3xl border border-zinc-800 bg-[#111111] p-8 md:p-10 hover:border-zinc-700 transition">
                  <p className="text-gray-400 text-lg mb-4">Free</p>
                  <div className="flex items-end mb-8">
                    <span className="text-5xl md:text-6xl font-bold">$0</span>
                    <span className="text-gray-500 text-xl ml-2">/mo</span>
                  </div>
                  <ul className="space-y-3 text-gray-300 text-lg">
                    <li>✔ 5 searches per day</li>
                    <li>✔ 3 messages</li>
                    <li className="text-gray-500">Analytics (locked)</li>
                  </ul>
                  <button className="mt-10 w-full py-3 rounded-2xl border border-zinc-700 hover:bg-white hover:text-black transition">Get Started</button>
                </div>

                <div className="rounded-3xl border border-[#8f3131] bg-[#111111] p-8 md:p-10 relative shadow-lg hover:scale-[1.02] transition">
                  <div className="absolute -top-3 left-6 bg-[#8f3131] text-xs px-3 py-1 rounded-full">MOST POPULAR</div>
                  <p className="text-[#d97a5d] text-lg mb-4">Pro</p>
                  <div className="flex items-end mb-8">
                    <span className="text-5xl md:text-6xl font-bold">$49</span>
                    <span className="text-gray-500 text-xl ml-2">/mo</span>
                  </div>
                  <ul className="space-y-3 text-gray-300 text-lg">
                    <li>✔ Unlimited search</li>
                    <li>✔ Unlimited messages</li>
                    <li>✔ Full analytics</li>
                  </ul>
                  <button className="mt-10 w-full py-3 rounded-2xl bg-[#8f3131] hover:bg-[#a23a3a] transition font-semibold">Upgrade Now</button>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="px-4 md:px-12 py-10 border-b border-zinc-900">
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-4xl md:text-5xl font-bold mb-4">Find your perfect creator</h2>
                <p className="text-gray-400 text-lg md:text-xl mb-10">Join 500+ brands already growing with us.</p>
                <div className="flex flex-col md:flex-row gap-4 justify-center">
                  <input type="email" placeholder="Enter your email" className="bg-[#151515] border border-zinc-800 rounded-2xl px-6 py-4 w-full md:w-[420px] outline-none focus:border-gray-500" />
                  <button className="bg-[#8f3131] hover:bg-[#a23a3a] transition px-8 py-4 rounded-2xl font-semibold">Get Started</button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <footer className="bg-black px-4 md:px-12 py-5 flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm">
              <p>© 2025 CreatorConnect. All rights reserved.</p>
              <div className="flex gap-6 mt-4 md:mt-0">
                <a className="hover:text-white transition cursor-pointer">Privacy</a>
                <a className="hover:text-white transition cursor-pointer">Terms</a>
                <a className="hover:text-white transition cursor-pointer">Contact</a>
              </div>
            </footer>
          </section>

        </div>
      )}
    </div>
  );
}
