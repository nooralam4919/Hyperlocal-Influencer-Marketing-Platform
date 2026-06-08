import { useState } from "react";
import { Heart, MessageCircle, Share2, PlusCircle } from "lucide-react";
import { motion } from "framer-motion";

const posts = [
  {
    id: 1,
    author: "Sophia Adams",
    avatar: "https://i.pravatar.cc/150?img=1",
    role: "Fashion Creator · 870K",
    time: "2h ago",
    content: "Just wrapped up an amazing campaign with a local brand! If you're a shop owner looking for fashion creators in London, DM me. Let's build something great together 🔥",
    likes: 142,
    comments: 28,
    liked: false,
  },
  {
    id: 2,
    author: "Jay Keller",
    avatar: "https://i.pravatar.cc/150?img=12",
    role: "Fitness Creator · 315K",
    time: "5h ago",
    content: "Tip for brand owners: always brief your creator with clear deliverables. A good brief = better content. Happy to share my template if anyone needs it 💪",
    likes: 89,
    comments: 14,
    liked: false,
  },
  {
    id: 3,
    author: "Mia Chen",
    avatar: "https://i.pravatar.cc/150?img=9",
    role: "Tech Creator · 620K",
    time: "1d ago",
    content: "Looking for tech brands to collaborate with for Q3. I cover gadgets, software, and AI tools. My audience is 18-35, highly engaged. Let's connect!",
    likes: 203,
    comments: 41,
    liked: false,
  },
  {
    id: 4,
    author: "Aria Patel",
    avatar: "https://i.pravatar.cc/150?img=20",
    role: "Beauty Creator · 510K",
    time: "2d ago",
    content: "Just hit 500K! 🎉 Grateful for every brand that trusted me. If you're a beauty or skincare brand, my rates are very competitive for this milestone month.",
    likes: 512,
    comments: 76,
    liked: false,
  },
];

const topics = ["All", "Campaigns", "Tips", "Collabs", "Announcements"];

export default function Community() {
  const [activeTopic, setTopic] = useState("All");
  const [feed, setFeed]         = useState(posts);

  const toggleLike = (id) => {
    setFeed((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
          : p
      )
    );
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white px-4 md:px-10 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Community</h1>
          <p className="text-gray-400 mt-1">Connect with creators and brand owners</p>
        </div>
        <button className="flex items-center gap-2 bg-[#8f3131] hover:bg-[#a23a3a] transition px-4 py-2.5 rounded-xl text-sm font-medium">
          <PlusCircle size={16} />
          New Post
        </button>
      </div>

      {/* Topic filter */}
      <div className="flex gap-2 flex-wrap mb-8">
        {topics.map((t) => (
          <button
            key={t}
            onClick={() => setTopic(t)}
            className={`px-4 py-1.5 rounded-full text-sm border transition ${
              activeTopic === t
                ? "bg-[#8f3131] border-[#8f3131] text-white"
                : "border-zinc-700 text-gray-400 hover:border-zinc-500"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Feed */}
      <div className="max-w-2xl mx-auto flex flex-col gap-5">
        {feed.map((post, i) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-[#111111] border border-zinc-800 rounded-2xl p-6 hover:border-zinc-700 transition"
          >
            {/* Author */}
            <div className="flex items-center gap-3 mb-4">
              <img src={post.avatar} alt={post.author} className="w-10 h-10 rounded-full object-cover" />
              <div>
                <p className="font-semibold text-sm">{post.author}</p>
                <p className="text-xs text-gray-500">{post.role} · {post.time}</p>
              </div>
            </div>

            {/* Content */}
            <p className="text-gray-300 text-sm leading-relaxed mb-5">{post.content}</p>

            {/* Actions */}
            <div className="flex items-center gap-6 text-gray-500 text-sm border-t border-zinc-800 pt-4">
              <button
                onClick={() => toggleLike(post.id)}
                className={`flex items-center gap-2 hover:text-red-400 transition ${post.liked ? "text-red-400" : ""}`}
              >
                <Heart size={16} fill={post.liked ? "currentColor" : "none"} />
                {post.likes}
              </button>
              <button className="flex items-center gap-2 hover:text-blue-400 transition">
                <MessageCircle size={16} />
                {post.comments}
              </button>
              <button className="flex items-center gap-2 hover:text-green-400 transition ml-auto">
                <Share2 size={16} />
                Share
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
