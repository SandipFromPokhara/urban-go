import { useState } from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";

export default function AIPage({ isDarkMode }) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { role: "user", text: input }]);
    setLoading(true);

    try {
      const res = await fetch("/api/ai/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          conversation: [...messages, { role: "user", text: input }],
        }),
      });

      const data = await res.json();

      // Only show AI's plain-text response
      const aiText = data.text || "Sorry, no response from AI.";
      setMessages((prev) => [...prev, { role: "ai", text: aiText }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "Error fetching response." },
      ]);
    } finally {
      setLoading(false);
      setInput("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div
      className={`relative flex justify-center items-start min-h-[calc(100vh-80px)] px-4 py-16 overflow-hidden ${
        isDarkMode ? "bg-gray-900" : "bg-blue-50"
      }`}
    >
      {/* Animated AI Background */}
      <motion.div
        className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-cyan-500 via-purple-600 to-pink-600 opacity-20 blur-3xl"
        animate={{ x: [0, 150, 0], y: [0, 100, 0] }}
        transition={{ duration: 20, repeat: Infinity, repeatType: "loop" }}
      />

      {/* AI Chat Card */}
      <div
        className={`relative z-10 flex flex-col w-full max-w-3xl rounded-2xl p-6 mt-16 shadow-2xl ${
          isDarkMode
            ? "bg-gray-800 text-gray-200 shadow-cyan-500/50"
            : "bg-white text-gray-900 shadow-blue-400/30"
        }`}
        style={{ minHeight: "calc(100vh - 300px)" }}
      >
        {/* Header */}
        <h2
          className="text-4xl font-extrabold m-6 text-center"
          style={{
            textShadow: isDarkMode
              ? "0 0 20px #0ff, 0 0 40px #0ff"
              : "0 0 10px #3b82f6, 0 0 20px #3b82f6",
          }}
        >
          UrbanGo AI Assistant
        </h2>

        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto space-y-3 mb-4 p-2">
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              className={`max-w-xl p-3 rounded-xl break-words shadow-md transform transition-transform duration-150 ${
                msg.role === "user"
                  ? "bg-blue-500 text-white self-end"
                  : isDarkMode
                  ? "bg-gray-700 text-cyan-200 self-start"
                  : "bg-gray-100 text-gray-900 self-start"
              }`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {/* Parse Markdown */}
              <ReactMarkdown
                children={msg.text}
                components={{
                // example: style <p> and <li> elements
                p: ({ node, ...props }) => (
                <p className="mb-2 leading-relaxed" {...props} />
                ),
                li: ({ node, ...props }) => (
                <li className="ml-4 list-disc" {...props} />
                ),
                strong: ({ node, ...props }) => (
                <strong className="font-bold" {...props} />
                ),
            }}
            />
            </motion.div>
          ))}
          {loading && (
            <p className="text-sm text-gray-400 italic">AI is typing...</p>
          )}
        </div>

        {/* Input box */}
        <div className="flex gap-2 mt-auto">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ask about events or routes..."
            className={`flex-1 p-2 rounded-lg border shadow-inner transition-all duration-200 focus:outline-none focus:ring-2 ${
              isDarkMode
                ? "border-gray-600 bg-gray-800 text-gray-100 placeholder-gray-400 focus:ring-cyan-400/50"
                : "border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:ring-blue-400/50"
            }`}
          />
          <button
            onClick={sendMessage}
            className={`px-4 py-2 rounded-lg font-semibold text-white shadow-lg transition-all duration-300 cursor-pointer ${
              isDarkMode
                ? "bg-gradient-to-r from-purple-500 to-blue-700 shadow-purple-500/50 hover:shadow-sky-900"
                : "bg-gradient-to-r from-cyan-400 to-blue-500 shadow-cyan-400/50 hover:shadow-cyan-500/70"
            }`}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
