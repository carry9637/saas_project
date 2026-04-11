require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

const authRoutes = require("./routes/authRoutes");
const clientRoutes = require("./routes/clientRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const ticketRoutes = require("./routes/ticketRoutes");

const app = express();

connectDB();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/auth", authRoutes);
app.use("/clients", clientRoutes);
app.use("/services", serviceRoutes);
app.use("/tickets", ticketRoutes);

app.get("/health", (_req, res) => res.json({ status: "ok" }));

// ─── Groq AI Chat endpoint ────────────────────────────────────────────────
app.post("/chat", async (req, res) => {
  const { message } = req.body;
  if (!message || typeof message !== "string" || message.trim().length === 0) {
    return res.status(400).json({ error: "Message is required." });
  }

  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful support assistant for a SaaS admin dashboard called Corelystic. " +
              "Answer questions about services, subscriptions, tickets, clients, billing, and account management. " +
              "Keep replies concise (2-3 sentences max), friendly, and professional. " +
              "If a question is unrelated to the platform, politely say you can only help with platform-related queries.",
          },
          { role: "user", content: message.trim() },
        ],
        temperature: 0.5,
        max_tokens: 200,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );

    const reply = response.data.choices[0].message.content;
    res.json({ reply });
  } catch (err) {
    console.error("Groq API error:", err?.response?.data || err.message);
    res.status(500).json({
      reply:
        "Sorry, I'm having trouble connecting right now. Please try again.",
    });
  }
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} [${process.env.NODE_ENV}]`);
});
