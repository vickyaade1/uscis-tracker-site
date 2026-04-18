import { getApiBaseUrl } from "../config/api";

const REQUEST_TIMEOUT_MS = 15000;

type AiSupportResponse = {
  ok?: boolean;
  error?: string;
  reply?: string;
};

export async function sendAiSupportMessage(message: string, language: string) {
  const trimmedMessage = message.trim();

  if (!trimmedMessage) {
    throw new Error("Please enter a message.");
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  const url = `${getApiBaseUrl()}/api/ai-support`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: trimmedMessage,
        language,
      }),
      signal: controller.signal,
    });

    const data = (await response.json()) as AiSupportResponse;

    if (!response.ok || !data.ok || !data.reply) {
      throw new Error(data.error || "AI support is unavailable right now.");
    }

    return data.reply;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("The AI response took too long. Please try again.");
    }

    if (error instanceof Error && error.message.includes("Network request failed")) {
      throw new Error("Could not reach the backend support service.");
    }

    throw error instanceof Error
      ? error
      : new Error("Something went wrong while contacting AI support.");
  } finally {
    clearTimeout(timeoutId);
  }
}
