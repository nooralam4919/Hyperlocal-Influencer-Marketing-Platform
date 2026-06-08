import { useState } from "react";
import { BookOpen, Video, FileText, ExternalLink, Search } from "lucide-react";
import { motion } from "framer-motion";

const resources = [
  {
    id: 1,
    type: "Guide",
    icon: "📘",
    title: "How to Write a Creator Brief",
    desc: "A step-by-step guide to writing briefs that get better content from creators.",
    tag: "Beginner",
    tagColor: "bg-green-900/40 text-green-400",
    readTime: "5 min read",
  },
  {
    id: 2,
    type: "Video",
    icon: "🎬",
    title: "Influencer Marketing 101",
    desc: "Everything you need to know about running your first influencer campaign.",
    tag: "Beginner",
    tagColor: "bg-green-900/40 text-green-400",
    readTime: "12 min watch",
  },
  {
    id: 3,
    type: "Template",
    icon: "📄",
    title: "Campaign Contract Template",
    desc: "A ready-to-use contract template for brand-creator collaborations.",
    tag: "Template",
    tagColor: "bg-blue-900/40 text-blue-400",
    readTime: "Download",
  },
  {
    id: 4,
    type: "Guide",
    icon: "📊",
    title: "Measuring ROI on Creator Campaigns",
    desc: "Learn which metrics matter and how to track campaign performance.",
    tag: "Advanced",
    tagColor: "bg-orange-900/40 text-orange-400",
    readTime: "8 min read",
  },
  {
    id: 5,
    type: "Template",
    icon: "📋",
    title: "Creator Outreach Email Templates",
    desc: "5 proven email templates to reach out to creators and get responses.",
    tag: "Template",
    tagColor: "bg-blue-900/40 text-blue-400",
    readTime: "Download",
  },
  {
    id: 6,
    type: "Video",
    icon: "🎥",
    title: "Negotiating Rates with Creators",
    desc: "Tips and tactics for negotiating fair rates without burning bridges.",
    tag: "Intermediate",
    tagColor: "bg-yellow-900/40 text-yellow-400",
    readTime: "9 min watch",
  },
];

const filters = ["All", "Guide", "Video", "Template"];

export default function Resources() {
  const [active, setActive] = useState("All");
  const [query, setQuery]   = useState("");

  const filtered = resources.filter((r) => {
    const matchType  = active === "All" || r.type === active;
    const matchQuery = r.title.toLowerCase().includes(query.toLowerCase());
    return matchType && matchQuery;
  });

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white px-4 md:px-10 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-1">Resources</h1>
        <p className="text-gray-400">Guides, templates and videos to help you run better campaigns</p>
      </div>

      {/* Search */}
      <div className="bg-[#1a1a1a] border border-zinc-800 rounded-2xl flex items-center px-4 gap-3 mb-6 max-w-lg">
        <Search size={16} className="text-gray-500" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search resources..."
          className="bg-transparent outline-none py-3 text-sm w-full placeholder:text-gray-600"
        />
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-8">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActive(f)}
            className={`px-4 py-1.5 rounded-full text-sm border transition ${
              active === f
                ? "bg-[#8f3131] border-[#8f3131] text-white"
                : "border-zinc-700 text-gray-400 hover:border-zinc-500"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((r, i) => (
          <motion.div
            key={r.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="bg-[#111111] border border-zinc-800 rounded-2xl p-6 hover:border-zinc-600 transition flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-start mb-4">
                <span className="text-3xl">{r.icon}</span>
                <span className={`text-[11px] px-2 py-0.5 rounded-full ${r.tagColor}`}>{r.tag}</span>
              </div>
              <h3 className="font-semibold text-base mb-2">{r.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{r.desc}</p>
            </div>

            <div className="flex justify-between items-center mt-5 pt-4 border-t border-zinc-800">
              <span className="text-xs text-gray-500">{r.readTime}</span>
              <button className="flex items-center gap-1.5 text-[#d97a5d] text-sm hover:text-white transition">
                {r.type === "Template" ? "Download" : "Open"}
                <ExternalLink size={13} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 text-gray-500">
          <BookOpen size={48} className="mx-auto mb-4 opacity-30" />
          <p>No resources found for "{query}"</p>
        </div>
      )}
    </div>
  );
}
