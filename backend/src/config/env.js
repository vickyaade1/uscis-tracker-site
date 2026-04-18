const dotenv = require("dotenv");

dotenv.config();

const rawPort = process.env.PORT;
const parsedPort = Number(rawPort);
const safePort = Number.isInteger(parsedPort) && parsedPort > 0 ? parsedPort : 4000;

const env = {
  port: safePort,
  uscisMode: process.env.USCIS_MODE || "mock",
  uscisClientId: process.env.USCIS_CLIENT_ID || "",
  uscisClientSecret: process.env.USCIS_CLIENT_SECRET || "",
  uscisTokenUrl:
    process.env.USCIS_TOKEN_URL || "https://api-int.uscis.gov/oauth/accesstoken",
  uscisCaseStatusUrl:
    process.env.USCIS_CASE_STATUS_URL || "https://api-int.uscis.gov/case-status",
  uscisTimeoutMs: Number(process.env.USCIS_TIMEOUT_MS || 10000),
  groqApiKey: process.env.GROQ_API_KEY || "",
  groqApiUrl:
    process.env.GROQ_API_URL || "https://api.groq.com/openai/v1/chat/completions",
  groqModel: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
};

function hasUscisCredentials() {
  return Boolean(env.uscisClientId && env.uscisClientSecret);
}

function getMaskedClientId() {
  if (!env.uscisClientId) {
    return "";
  }

  if (env.uscisClientId.length <= 6) {
    return "***";
  }

  return `${env.uscisClientId.slice(0, 3)}***${env.uscisClientId.slice(-3)}`;
}

module.exports = {
  env,
  hasUscisCredentials,
  getMaskedClientId,
};
