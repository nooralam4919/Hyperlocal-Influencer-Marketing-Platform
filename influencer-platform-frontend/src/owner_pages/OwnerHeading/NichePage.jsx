import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { FaInstagram, FaYoutube, FaFacebook, FaEnvelope, FaBookmark } from "react-icons/fa6";

// All creators pool — filtered by niche prop
const allCreators = [
  { name: "Sophia Adams",  niche: "Fashion",   followers: "870K", price: "$5200", city: "London",    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600", bio: "Luxury fashion & street style content creator." },
  { name: "Zara King",     niche: "Fashion",   followers: "730K", price: "$4600", city: "Milan",     image: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=600", bio: "High fashion editorials and brand campaigns." },
  { name: "Lily Monroe",   niche: "Fashion",   followers: "520K", price: "$3200", city: "Paris",     image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600", bio: "Sustainable fashion advocate and stylist." },

  { name: "Tom Walsh",     niche: "Comedy",    followers: "180K", price: "$1200", city: "Dublin",    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600", bio: "Stand-up comedian turned viral content creator." },
  { name: "Jake Rivers",   niche: "Comedy",    followers: "240K", price: "$1600", city: "Chicago",   image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600", bio: "Sketch comedy and relatable everyday humor." },
  { name: "Nina Gomez",    niche: "Comedy",    followers: "310K", price: "$2000", city: "Madrid",    image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600", bio: "Bilingual comedy creator with global reach." },

  { name: "Emma Brown",    niche: "Lifestyle", followers: "440K", price: "$2400", city: "Paris",     image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600", bio: "Everyday lifestyle, travel and wellness content." },
  { name: "Chloe Park",    niche: "Lifestyle", followers: "390K", price: "$2100", city: "Seoul",     image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800", bio: "Minimalist living and slow lifestyle content." },
  { name: "Sara Bloom",    niche: "Lifestyle", followers: "280K", price: "$1700", city: "Sydney",    image: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=600", bio: "Home, family and wellness lifestyle creator." },

  { name: "Mia Chen",      niche: "Tech",      followers: "620K", price: "$3800", city: "Tokyo",     image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600", bio: "AI, gadgets and software reviews for tech enthusiasts." },
  { name: "Dev Patel",     niche: "Tech",      followers: "480K", price: "$3000", city: "Bangalore", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600", bio: "Coding tutorials, SaaS tools and developer content." },
  { name: "Alex Wu",       niche: "Tech",      followers: "350K", price: "$2200", city: "San Francisco", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600", bio: "Startup culture, product reviews and tech news." },

  { name: "Aria Patel",    niche: "Beauty",    followers: "510K", price: "$3100", city: "Mumbai",    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600", bio: "Skincare routines, makeup tutorials and beauty reviews." },
  { name: "Luna Rose",     niche: "Beauty",    followers: "670K", price: "$4200", city: "New York",  image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600", bio: "Clean beauty advocate and luxury skincare creator." },
  { name: "Hana Kim",      niche: "Beauty",    followers: "420K", price: "$2600", city: "Seoul",     image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600", bio: "K-beauty trends and affordable skincare routines." },

  { name: "Lucas Ray",     niche: "Gaming",    followers: "290K", price: "$1900", city: "Berlin",    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600", bio: "FPS and RPG gaming content with live streams." },
  { name: "Max Storm",     niche: "Gaming",    followers: "540K", price: "$3400", city: "Los Angeles", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600", bio: "Esports commentary and gaming gear reviews." },
  { name: "Kai Tanaka",    niche: "Gaming",    followers: "380K", price: "$2400", city: "Tokyo",     image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600", bio: "JRPG specialist and anime gaming crossover content." },
];

const nicheColors = {
  Fashion:   { bg: "bg-pink-900/30",   text: "text-pink-300",   border: "border-pink-800",   badge: "bg-pink-100 text-pink-800" },
  Comedy:    { bg: "bg-yellow-900/30", text: "text-yellow-300", border: "border-yellow-800", badge: "bg-yellow-100 text-yellow-800" },
  Lifestyle: { bg: "bg-green-900/30",  text: "text-green-300",  border: "border-green-800",  badge: "bg-green-100 text-green-800" },
  Tech:      { bg: "bg-blue-900/30",   text: "text-blue-300",   border: "border-blue-800",   badge: "bg-blue-100 text-blue-800" },
  Beauty:    { bg: "bg-purple-900/30", text: "text-purple-300", border: "border-purple-800", badge: "bg-purple-100 text-purple-800" },
  Gaming:    { bg: "bg-red-900/30",    text: "text-red-300",    border: "border-red-800",    badge: "bg-red-100 text-red-800" },
};

const nicheEmojis = {
  Fashion: "👗", Comedy: "😂", Lifestyle: "🌿", Tech: "💻", Beauty: "💄", Gaming: "🎮",
};

export default function NichePage({ niche }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const colors = nicheColors[niche] || nicheColors.Fashion;
  const creators = allCreators.filter(
    (c) =>
      c.niche === niche &&
      (query === "" || c.name.toLowerCase().includes(query.toLowerCase()) || c.city.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white px-4 md:px-10 py-8">

      {/* Back button */}
      <button
        onClick={() => navigate("/owner-dashboard")}
        className="flex items-center gap-2 text-gray-400 hover:text-white transition mb-6 text-sm"
      >
        <ArrowLeft size={16} />
        Back to Dashboard
      </button>

      {/* Header */}
      <div className={`rounded-3xl p-8 mb-8 border ${colors.bg} ${colors.border}`}>
        <div className="flex items-center gap-4 mb-3">
          <span className="text-5xl">{nicheEmojis[niche]}</span>
          <div>
            <h1 className={`text-4xl font-bold ${colors.text}`}>{niche}</h1>
            <p className="text-gray-400 mt-1">{creators.length} creators available for collaboration</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-[#1a1a1a] border border-zinc-800 rounded-2xl flex items-center px-4 gap-3 mb-8 max-w-lg">
        <Search size={16} className="text-gray-500" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={`Search ${niche} creators...`}
          className="bg-transparent outline-none py-3 text-sm w-full placeholder:text-gray-600"
        />
      </div>

      {/* Creator grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {creators.map((creator, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-[#111111] border border-zinc-800 rounded-2xl overflow-hidden hover:border-zinc-600 transition"
          >
            {/* Image */}
            <div className="h-[280px] overflow-hidden bg-zinc-900">
              <img src={creator.image} alt={creator.name} className="w-full h-full object-cover object-top" />
            </div>

            {/* Content */}
            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold text-base">{creator.name}</h3>
                  <div className="flex items-center gap-1 text-gray-400 text-xs mt-0.5">
                    <MapPin size={11} /> {creator.city}
                  </div>
                </div>
                <span className={`text-[11px] px-2 py-0.5 rounded-full ${colors.badge}`}>{creator.niche}</span>
              </div>

              <p className="text-gray-500 text-xs mt-2 mb-3 leading-relaxed">{creator.bio}</p>

              <div className="flex justify-between text-sm text-gray-400 mb-4">
                <span>{creator.followers} followers</span>
                <span className="text-white font-semibold">{creator.price}</span>
              </div>

              {/* Social icons */}
              <div className="flex gap-3 text-gray-500 mb-4">
                <a href="https://instagram.com" target="_blank" rel="noreferrer"><FaInstagram size={15} className="hover:text-pink-500 transition" /></a>
                <a href="https://youtube.com" target="_blank" rel="noreferrer"><FaYoutube size={15} className="hover:text-red-500 transition" /></a>
                <a href="https://facebook.com" target="_blank" rel="noreferrer"><FaFacebook size={14} className="hover:text-[#1877F2] transition" /></a>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2">
                <button className="border border-zinc-700 rounded-lg p-1.5 hover:bg-zinc-800 transition">
                  <FaEnvelope size={13} className="text-gray-400" />
                </button>
                <button className="border border-zinc-700 rounded-lg p-1.5 hover:bg-zinc-800 transition">
                  <FaBookmark size={13} className="text-gray-400" />
                </button>
                <button
                  onClick={() => navigate("/owner-dashboard/massage")}
                  className="flex-1 bg-[#330b05] hover:bg-[#4a1008] text-white text-xs py-2 rounded-xl transition"
                >
                  Send Message
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {creators.length === 0 && (
        <div className="text-center py-20 text-gray-500">
          <span className="text-6xl block mb-4">{nicheEmojis[niche]}</span>
          <p className="text-lg">No creators found for "{query}"</p>
        </div>
      )}
    </div>
  );
}
