import { useState, useRef, useEffect } from "react";

// ─── Bot response logic ──────────────────────────────────────────────────────
// Removed hardcoded replies — responses now come from Groq AI via backend /chat

// ─── Styles object (inline — guaranteed to render) ───────────────────────────
const S = {
  window: (open) => ({
    position: "fixed",
    bottom: "84px",
    right: "20px",
    zIndex: 9999,
    width: "360px",
    height: "510px",
    display: "flex",
    flexDirection: "column",
    background: "#ffffff",
    borderRadius: "18px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.18), 0 4px 16px rgba(0,0,0,0.08)",
    border: "1px solid #e5e7eb",
    overflow: "hidden",
    transformOrigin: "bottom right",
    transition: "opacity 0.25s ease, transform 0.25s ease",
    opacity: open ? 1 : 0,
    transform: open ? "scale(1)" : "scale(0.92)",
    pointerEvents: open ? "auto" : "none",
  }),
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "14px 18px",
    background: "linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)",
    flexShrink: 0,
  },
  headerLeft: { display: "flex", alignItems: "center", gap: "12px" },
  avatarWrap: { position: "relative" },
  headerAvatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    background: "rgba(255,255,255,0.18)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  onlineDot: {
    position: "absolute",
    bottom: "1px",
    right: "1px",
    width: "11px",
    height: "11px",
    background: "#4ade80",
    borderRadius: "50%",
    border: "2px solid #4f46e5",
  },
  headerTitle: {
    color: "#fff",
    fontWeight: 600,
    fontSize: "14px",
    lineHeight: "1.3",
  },
  headerSub: {
    color: "rgba(255,255,255,0.75)",
    fontSize: "11px",
    marginTop: "1px",
  },
  closeBtn: {
    background: "transparent",
    border: "none",
    cursor: "pointer",
    color: "rgba(255,255,255,0.8)",
    padding: "6px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background 0.15s",
  },
  messagesArea: {
    flex: 1,
    overflowY: "auto",
    padding: "20px 16px 12px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    background: "#f8fafc",
  },
  msgRow: (isUser) => ({
    display: "flex",
    alignItems: "flex-end",
    gap: "10px",
    flexDirection: isUser ? "row-reverse" : "row",
  }),
  msgAvatar: (isUser) => ({
    flexShrink: 0,
    minWidth: "32px",
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    background: isUser ? "#4f46e5" : "#64748b",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "12px",
    fontWeight: 700,
    color: "#fff",
    letterSpacing: "0",
  }),
  bubble: (isUser) => ({
    maxWidth: "74%",
    padding: "12px 16px",
    borderRadius: isUser ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
    fontSize: "13.5px",
    lineHeight: "1.65",
    background: isUser ? "#4f46e5" : "#ffffff",
    color: isUser ? "#ffffff" : "#1e293b",
    border: isUser ? "none" : "1px solid #e2e8f0",
    boxShadow: "0 1px 6px rgba(0,0,0,0.07)",
    wordBreak: "break-word",
    whiteSpace: "pre-wrap",
  }),
  suggestionsBar: {
    display: "flex",
    gap: "8px",
    padding: "10px 16px 10px",
    overflowX: "auto",
    background: "#ffffff",
    borderTop: "1px solid #eef2f7",
    flexShrink: 0,
  },
  chip: {
    flexShrink: 0,
    fontSize: "12px",
    fontWeight: 500,
    color: "#4f46e5",
    background: "#eef2ff",
    border: "1px solid #c7d2fe",
    padding: "6px 14px",
    borderRadius: "999px",
    cursor: "pointer",
    transition: "background 0.15s",
    whiteSpace: "nowrap",
    lineHeight: "1",
  },
  inputSection: {
    padding: "12px 16px 16px",
    background: "#ffffff",
    borderTop: "1px solid #e5e7eb",
    flexShrink: 0,
  },
  inputRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    background: "#f1f5f9",
    border: "1.5px solid #e2e8f0",
    borderRadius: "14px",
    padding: "10px 10px 10px 16px",
  },
  input: {
    flex: 1,
    background: "transparent",
    border: "none",
    outline: "none",
    fontSize: "13.5px",
    color: "#1e293b",
    lineHeight: "1.5",
    padding: "0",
    margin: "0",
    minWidth: "0",
  },
  sendBtn: (active) => ({
    flexShrink: 0,
    width: "38px",
    height: "38px",
    borderRadius: "11px",
    background: active ? "#4f46e5" : "#c7d2fe",
    border: "none",
    cursor: active ? "pointer" : "default",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background 0.15s, transform 0.1s",
  }),
  fab: {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    zIndex: 9999,
    width: "54px",
    height: "54px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #4f46e5, #6366f1)",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 18px rgba(79,70,229,0.45)",
    transition: "transform 0.2s, box-shadow 0.2s",
  },
  badge: {
    position: "absolute",
    top: "-3px",
    right: "-3px",
    width: "18px",
    height: "18px",
    background: "#ef4444",
    borderRadius: "50%",
    border: "2px solid #fff",
    fontSize: "10px",
    fontWeight: 700,
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  typingBubble: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "18px 18px 18px 4px",
    padding: "14px 18px",
    display: "flex",
    gap: "6px",
    alignItems: "center",
    boxShadow: "0 1px 6px rgba(0,0,0,0.07)",
  },
  dot: (delay) => ({
    width: "7px",
    height: "7px",
    background: "#94a3b8",
    borderRadius: "50%",
    animation: "chatBounce 1.2s infinite ease-in-out",
    animationDelay: delay,
  }),
};

// ─── Message bubble ──────────────────────────────────────────────────────────
function MessageBubble({ msg }) {
  const isUser = msg.sender === "user";
  return (
    <div style={S.msgRow(isUser)}>
      <div style={S.msgAvatar(isUser)}>{isUser ? "U" : "B"}</div>
      <div style={S.bubble(isUser)}>{msg.text}</div>
    </div>
  );
}

// ─── Typing indicator ────────────────────────────────────────────────────────
function TypingIndicator() {
  return (
    <div style={S.msgRow(false)}>
      <div style={S.msgAvatar(false)}>B</div>
      <div style={S.typingBubble}>
        <span style={S.dot("0s")} />
        <span style={S.dot("0.2s")} />
        <span style={S.dot("0.4s")} />
      </div>
    </div>
  );
}

// ─── Main Chatbot component ──────────────────────────────────────────────────
export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "bot",
      text: "Hi there! 👋 I'm your Support Assistant. Ask me about services, subscriptions, tickets, or anything else!",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
      setHasUnread(false);
    }
  }, [isOpen]);

  const handleSend = async () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), sender: "user", text: trimmed },
    ]);
    setInputValue("");
    setIsTyping(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });
      const data = await res.json();
      const reply =
        data.reply || "Sorry, I couldn't get a response. Please try again.";
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, sender: "bot", text: reply },
      ]);
      if (!isOpen) setHasUnread(true);
    } catch {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "bot",
          text: "⚠️ Could not connect to the server. Please try again.",
        },
      ]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Bounce keyframe */}
      <style>{`
        @keyframes chatBounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-5px); }
        }
      `}</style>

      {/* ── Chat Window ── */}
      <div style={S.window(isOpen)}>
        {/* Header */}
        <div style={S.header}>
          <div style={S.headerLeft}>
            <div style={S.avatarWrap}>
              <div style={S.headerAvatar}>
                <svg
                  width="20"
                  height="20"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="#fff"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
              </div>
              <span style={S.onlineDot} />
            </div>
            <div>
              <p style={S.headerTitle}>Support Assistant</p>
              <p style={S.headerSub}>Always online</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            style={S.closeBtn}
            aria-label="Close chat"
          >
            <svg
              width="18"
              height="18"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div style={S.messagesArea}>
          {messages.map((msg) => (
            <MessageBubble key={msg.id} msg={msg} />
          ))}
          {isTyping && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick chips */}
        <div style={S.suggestionsBar}>
          {["Services", "Subscription", "Tickets", "Help"].map((s) => (
            <button
              key={s}
              style={S.chip}
              onClick={() => {
                setInputValue(s);
                setTimeout(() => inputRef.current?.focus(), 50);
              }}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Input */}
        <div style={S.inputSection}>
          <div style={S.inputRow}>
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              style={S.input}
            />
            <button
              onClick={handleSend}
              disabled={!inputValue.trim()}
              style={S.sendBtn(!!inputValue.trim())}
              aria-label="Send"
            >
              <svg
                width="16"
                height="16"
                fill="none"
                viewBox="0 0 24 24"
                stroke="#fff"
                strokeWidth={2.5}
                style={{ transform: "rotate(90deg)" }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* ── FAB Button ── */}
      <button
        onClick={() => setIsOpen((p) => !p)}
        style={S.fab}
        aria-label="Toggle chat"
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.08)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
        }}
      >
        {hasUnread && !isOpen && <span style={S.badge}>1</span>}
        <span
          style={{
            position: "absolute",
            transition: "opacity 0.2s, transform 0.2s",
            opacity: isOpen ? 1 : 0,
            transform: isOpen ? "rotate(0deg)" : "rotate(90deg)",
          }}
        >
          <svg
            width="22"
            height="22"
            fill="none"
            viewBox="0 0 24 24"
            stroke="#fff"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </span>
        <span
          style={{
            position: "absolute",
            transition: "opacity 0.2s, transform 0.2s",
            opacity: isOpen ? 0 : 1,
            transform: isOpen ? "rotate(-90deg)" : "rotate(0deg)",
          }}
        >
          <svg
            width="22"
            height="22"
            fill="none"
            viewBox="0 0 24 24"
            stroke="#fff"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
        </span>
      </button>
    </>
  );
}
