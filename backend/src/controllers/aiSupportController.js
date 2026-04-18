const { env } = require("../config/env");
const { sendGroqSupportMessage } = require("../services/groqSupportService");

async function getAiSupportReply(req, res) {
  const message = typeof req.body.message === "string" ? req.body.message.trim() : "";
  const language = typeof req.body.language === "string" ? req.body.language.trim() : "en";

  console.log("[AI Support Controller] Incoming request", {
    hasMessage: Boolean(message),
    language,
  });

  if (!message) {
    return res.status(400).json({
      ok: false,
      error: "Message is required.",
    });
  }

  if (!env.groqApiKey) {
    return res.status(500).json({
      ok: false,
      error: "AI support is not configured yet. Add GROQ_API_KEY to backend/.env.",
    });
  }

  try {
    const reply = await sendGroqSupportMessage(message, language);

    return res.json({
      ok: true,
      reply,
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    const messageText = error.message || "AI support failed.";

    console.log("[AI Support Controller] Returning error response", {
      statusCode,
      message: messageText,
    });

    return res.status(statusCode).json({
      ok: false,
      error: messageText,
    });
  }
}

module.exports = {
  getAiSupportReply,
};
