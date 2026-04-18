const { env } = require("../config/env");
const { HttpError } = require("../utils/httpError");

const SYSTEM_PROMPT = `You are a helpful USCIS immigration assistant.
Help users understand their case status,
explain USCIS processes, answer immigration
questions in simple language.
Always remind users you are an AI and not a lawyer.
Support English, Spanish, and Hindi.`;

async function sendGroqSupportMessage(message, language) {
  console.log("[AI Support Service] Sending request to Groq", {
    model: env.groqModel,
    language,
  });

  const response = await fetch(env.groqApiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.groqApiKey}`,
    },
    body: JSON.stringify({
      model: env.groqModel,
      messages: [
        {
          role: "system",
          content: `${SYSTEM_PROMPT}\n\nUser preferred language: ${language || "en"}.`,
        },
        {
          role: "user",
          content: message,
        },
      ],
      max_tokens: 500,
      temperature: 0.7,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.log("[AI Support Service] Groq request failed", {
      status: response.status,
      data,
    });

    throw new HttpError(
      response.status,
      data?.error?.message || "Groq could not respond right now."
    );
  }

  const reply = data?.choices?.[0]?.message?.content?.trim() || "";

  if (!reply) {
    throw new HttpError(502, "Groq returned an empty response.");
  }

  console.log("[AI Support Service] Groq request succeeded");

  return reply;
}

module.exports = {
  sendGroqSupportMessage,
};
