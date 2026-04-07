import { useState, useRef, useEffect } from "react";

export default function AIRoadmapPage() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi! 👋 I’m your AI job‑seeker assistant.\n\nYou can tell me:\n- Your current role and skills\n- Your target job and location\n- How much time you can spend each week\n\nThen I’ll build a clear roadmap for you step by step.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/ai/chat-roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      const result = await response.json();

      const assistantMessage = {
        role: "assistant",
        content: result.reply,
        roadmap: result.roadmap, // optional: [{title, description}]
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I’m having trouble connecting right now. Please check your internet and try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function renderContent(text) {
    return text.split("\n").map((line, i) => (
      <span key={i}>
        {line}
        <br />
      </span>
    ));
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-medium">
            AI
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">
              AI Job‑Seeker Assistant
            </h1>
            <p className="text-xs text-gray-500">
              Let’s build your roadmap together.
            </p>
          </div>
        </div>

        <button
          onClick={() => setMessages(messages.slice(0, 1))}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          New chat
        </button>
      </div>

      {/* Chat area */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs md:max-w-2xl rounded-lg px-4 py-3 ${
                msg.role === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-900 shadow"
              }`}
            >
              <p className="text-sm">{renderContent(msg.content)}</p>

              {/* If assistant sends a roadmap */}
              {msg.roadmap?.length > 0 && (
                <div className="mt-3 border-t border-gray-200 pt-2">
                  <h4 className="text-sm font-medium text-gray-800 mb-1">
                    Your Roadmap 🎯
                  </h4>
                  <ol className="space-y-2 text-xs text-gray-700 list-decimal pl-4">
                    {msg.roadmap.map((step, idx) => (
                      <li key={idx}>
                        <span className="font-medium">{step.title}</span>
                        <br />
                        {step.description}
                      </li>
                    ))}
                  </ol>
                  <div className="mt-2 text-xs text-gray-500">
                    You can ask me things like “make this easier / shorter” or
                    “focus on remote jobs in India”.
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white rounded-lg px-4 py-2 shadow text-gray-500 text-sm">
              <span>Typing</span>
              <span className="dot-pulse">&nbsp;•••</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message input */}
      <form
        onSubmit={handleSubmit}
        className="bg-white border-t border-gray-200 p-3"
      >
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything about your job or roadmap (e.g., 'I'm a beginner in IT, I want to become a full‑stack developer in 1 year…')"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 disabled:opacity-70 text-sm"
          >
            {loading ? "SENDING..." : "SEND"}
          </button>
        </div>

        <div className="mt-2 text-xs text-gray-500 flex justify-between">
          <span>Ask me about skills, roadmap, or resume tips.</span>
          <button
            type="button"
            onClick={() =>
              setMessages((prev) => [
                ...prev,
                {
                  role: "user",
                  content:
                    "Give me a 1‑year roadmap to become a full‑stack developer in India with 1–2 hours per day.",
                },
              ])
            }
            className="underline hover:text-gray-700"
          >
            Try an example
          </button>
        </div>
      </form>

      <style jsx>{`
        .dot-pulse {
          display: inline-block;
          animation: dot-pulse 1.5s infinite;
        }
        @keyframes dot-pulse {
          0%,
          60%,
          100% {
            content: "•••";
          }
          30% {
            content: "••";
          }
        }
      `}</style>
    </div>
  );
}
