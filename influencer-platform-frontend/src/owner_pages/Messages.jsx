import { useState } from "react";
import { Send, Search } from "lucide-react";
import { motion } from "framer-motion";

const contacts = [
  { id: 1, name: "Sophia Adams",  avatar: "https://i.pravatar.cc/150?img=1",  last: "Sure, let's collab!",        time: "2m",  unread: 2 },
  { id: 2, name: "Emma Brown",    avatar: "https://i.pravatar.cc/150?img=5",  last: "I'll send the rate card.",   time: "1h",  unread: 0 },
  { id: 3, name: "Jay Keller",    avatar: "https://i.pravatar.cc/150?img=12", last: "Sounds good to me.",         time: "3h",  unread: 1 },
  { id: 4, name: "Mia Chen",      avatar: "https://i.pravatar.cc/150?img=9",  last: "When do you need it by?",   time: "1d",  unread: 0 },
  { id: 5, name: "Aria Patel",    avatar: "https://i.pravatar.cc/150?img=20", last: "Thanks for reaching out!",  time: "2d",  unread: 0 },
];

const mockMessages = {
  1: [
    { from: "them", text: "Hey! I saw your brand and I love it.", time: "10:00" },
    { from: "me",   text: "Thanks! We'd love to work with you.",  time: "10:02" },
    { from: "them", text: "Sure, let's collab!",                  time: "10:03" },
  ],
  2: [
    { from: "me",   text: "Hi Emma, interested in a campaign?",   time: "09:00" },
    { from: "them", text: "I'll send the rate card.",              time: "09:15" },
  ],
  3: [
    { from: "them", text: "Sounds good to me.",                   time: "Yesterday" },
  ],
  4: [
    { from: "me",   text: "We have a fitness campaign.",          time: "Mon" },
    { from: "them", text: "When do you need it by?",              time: "Mon" },
  ],
  5: [
    { from: "them", text: "Thanks for reaching out!",             time: "Sun" },
  ],
};

export default function Messages() {
  const [active, setActive]   = useState(contacts[0]);
  const [input, setInput]     = useState("");
  const [chats, setChats]     = useState(mockMessages);

  const send = () => {
    if (!input.trim()) return;
    setChats((prev) => ({
      ...prev,
      [active.id]: [
        ...(prev[active.id] || []),
        { from: "me", text: input.trim(), time: "Now" },
      ],
    }));
    setInput("");
  };

  return (
    <div className="h-screen bg-[#0a0a0a] text-white flex overflow-hidden">
      {/* Sidebar */}
      <div className="w-[280px] border-r border-zinc-800 flex flex-col">
        <div className="p-4 border-b border-zinc-800">
          <h2 className="text-lg font-bold mb-3">Messages</h2>
          <div className="bg-[#1a1a1a] rounded-xl flex items-center px-3 gap-2">
            <Search size={15} className="text-gray-500" />
            <input placeholder="Search..." className="bg-transparent outline-none py-2 text-sm w-full placeholder:text-gray-600" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {contacts.map((c) => (
            <button
              key={c.id}
              onClick={() => setActive(c)}
              className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-zinc-900 transition text-left ${active.id === c.id ? "bg-zinc-900" : ""}`}
            >
              <img src={c.avatar} alt={c.name} className="w-10 h-10 rounded-full object-cover" />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium truncate">{c.name}</span>
                  <span className="text-[10px] text-gray-500 shrink-0 ml-1">{c.time}</span>
                </div>
                <p className="text-xs text-gray-500 truncate">{c.last}</p>
              </div>
              {c.unread > 0 && (
                <span className="bg-[#8f3131] text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center shrink-0">
                  {c.unread}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col">
        {/* Chat header */}
        <div className="h-[60px] border-b border-zinc-800 flex items-center px-6 gap-3">
          <img src={active.avatar} alt={active.name} className="w-9 h-9 rounded-full" />
          <div>
            <p className="font-semibold text-sm">{active.name}</p>
            <p className="text-xs text-green-400">Online</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-3">
          {(chats[active.id] || []).map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.from === "me" ? "justify-end" : "justify-start"}`}
            >
              <div className={`max-w-[60%] px-4 py-2 rounded-2xl text-sm ${
                msg.from === "me"
                  ? "bg-[#8f3131] text-white rounded-br-sm"
                  : "bg-[#1a1a1a] text-gray-200 rounded-bl-sm"
              }`}>
                <p>{msg.text}</p>
                <p className="text-[10px] mt-1 opacity-50 text-right">{msg.time}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Input */}
        <div className="border-t border-zinc-800 px-6 py-4 flex gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Type a message..."
            className="flex-1 bg-[#1a1a1a] border border-zinc-800 rounded-2xl px-4 py-3 text-sm outline-none placeholder:text-gray-600 focus:border-zinc-600"
          />
          <button
            onClick={send}
            className="bg-[#8f3131] hover:bg-[#a23a3a] transition w-12 h-12 rounded-2xl flex items-center justify-center"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
