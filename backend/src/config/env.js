const dotenv = require("dotenv");

dotenv.config();

const env = {
  port: Number(process.env.PORT || 4000),
  uscisMode: process.env.USCIS_MODE || "mock",
  uscisClientId: process.env.USCIS_CLIENT_ID || "",
  uscisClientSecret: process.env.USCIS_CLIENT_SECRET || "",
  uscisTokenUrl:
    process.env.USCIS_TOKEN_URL || "https://api-int.uscis.gov/oauth/accesstoken",
  uscisCaseStatusUrl:
    process.env.USCIS_CASE_STATUS_URL || "https://api-int.uscis.gov/case-status",
  uscisTimeoutMs: Number(process.env.USCIS_TIMEOUT_MS || 10000),
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
