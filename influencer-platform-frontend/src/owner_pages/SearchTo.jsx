import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Search, SlidersHorizontal, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { FaInstagram, FaYoutube, FaTiktok, FaEnvelope, FaBookmark } from "react-icons/fa6";

const allCreators = [
  { name: "Sophia Adams",  followers: "870K", category: "Fashion",   price: "$5200", city: "London",   image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600" },
  { name: "Emma Brown",    followers: "440K", category: "Lifestyle", price: "$2400", city: "Paris",    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600" },
  { name: "Jay Keller",    followers: "315K", category: "Fitness",   price: "$2150", city: "New York", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600" },
  { name: "Mia Chen",      followers: "620K", category: "Tech",      price: "$3800", city: "Tokyo",    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800" },
  { name: "Lucas Ray",     followers: "290K", category: "Gaming",    price: "$1900", city: "Berlin",   image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600" },
  { name: "Aria Patel",    followers: "510K", category: "Beauty",    price: "$3100", city: "Mumbai",   image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600" },
  { name: "Tom Walsh",     followers: "180K", category: "Comedy",    price: "$1200", city: "Dublin",   image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600" },
  { name: "Zara King",     followers: "730K", category: "Fashion",   price: "$4600", city: "Milan",    image: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=600" },
];

const niches = ["All", "Fashion", "Lifestyle", "Fitness", "Tech", "Gaming", "Beauty", "Comedy"];

export default function SearchTo() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialNiche = searchParams.get("niche") || "All";

  const [query, setQuery]         = useState("");
  const [activeNiche, setNiche]   = useState(
    niches.find(n => n.toLowerCase() === initialNiche.toLowerCase()) || "All"
  );

  const filtered = allCreators.filter((c) => {
    const matchNiche = activeNiche === "All" || c.category.toLowerCase() === activeNiche.toLowerCase();
    const matchQuery = c.name.toLowerCase().includes(query.toLowerCase()) ||
                       c.category.toLowerCase().includes(query.toLowerCase());
    return matchNiche && matchQuery;
  });

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white px-4 md:px-10 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Search Creators</h1>
        <p className="text-gray-400">Find the perfect influencer for your brand</p>
      </div>

      {/* Search bar */}
      <div className="flex gap-3 mb-6">
        <div className="flex-1 bg-[#1a1a1a] border border-zinc-800 rounded-2xl flex items-center px-4 gap-3">
          <Search size={18} className="text-gray-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or niche..."
            className="flex-1 bg-transparent outline-none py-3 text-white placeholder:text-gray-500"
          />
        </div>
        <button className="bg-[#330b05] border border-[#8f3131] px-4 rounded-2xl flex items-center gap-2 hover:bg-[#4a1008] transition">
          <SlidersHorizontal size={18} />
          <span className="hidden md:block text-sm">Filter</span>
        </button>
      </div>

      {/* Niche pills */}
      <div className="flex flex-wrap gap-2 mb-8">
        {niches.map((n) => (
          <button
            key={n}
            onClick={() => setNiche(n)}
            className={`px-4 py-1.5 rounded-full text-sm border transition ${
              activeNiche === n
                ? "bg-[#8f3131] border-[#8f3131] text-white"
                : "border-zinc-700 text-gray-400 hover:border-zinc-500"
            }`}
          >
            {n}
          </button>
        ))}
      </div>

      {/* Results count */}
      <p className="text-gray-500 text-sm mb-6">{filtered.length} creators found</p>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filtered.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-[#111111] border border-zinc-800 rounded-2xl overflow-hidden hover:border-zinc-600 transition"
          >
            <div className="h-[280px] overflow-hidden bg-zinc-900">
              <img src={item.image} alt={item.name} className="w-full h-full object-cover object-top" />
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold">{item.name}</h3>
                  <div className="flex items-center gap-1 text-gray-400 text-xs mt-0.5">
                    <MapPin size={11} /> {item.city}
                  </div>
                </div>
                <span className="bg-green-900/40 text-green-400 text-[10px] px-2 py-0.5 rounded-full">{item.category}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-400 mb-3">
                <span>{item.followers} followers</span>
                <span className="text-white font-semibold">{item.price}</span>
              </div>
              <div className="flex gap-2">
                <button className="border border-zinc-700 rounded-lg p-1.5 hover:bg-zinc-800 transition">
                  <FaEnvelope size={13} className="text-gray-400" />
                </button>
                <button className="border border-zinc-700 rounded-lg p-1.5 hover:bg-zinc-800 transition">
                  <FaBookmark size={13} className="text-gray-400" />
                </button>
                <button className="flex-1 bg-[#330b05] hover:bg-[#4a1008] text-white text-xs py-1.5 rounded-xl transition">
                  Send Message
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 text-gray-500">
          <Search size={48} className="mx-auto mb-4 opacity-30" />
          <p className="text-lg">No creators found for "{query || activeNiche}"</p>
        </div>
      )}
    </div>
  );
}
