const { env } = require("../config/env");
const { HttpError } = require("../utils/httpError");

let cachedToken = {
  accessToken: "",
  expiresAt: 0,
};

function getTokenBufferMs() {
  return 60 * 1000;
}

async function requestNewAccessToken() {
  console.log("[USCIS Auth] Requesting new access token");

  const body = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: env.uscisClientId,
    client_secret: env.uscisClientSecret,
  });

  const response = await fetch(env.uscisTokenUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok || !data.access_token) {
    console.log("[USCIS Auth] Access token request failed", {
      status: response.status,
      error: data.error_description || data.error || "Unknown token error",
    });

    throw new HttpError(
      502,
      "Could not get a USCIS access token. Check your USCIS client ID, client secret, and token URL."
    );
  }

  const expiresInSeconds = Number(data.expires_in || 1800);

  cachedToken = {
    accessToken: data.access_token,
    expiresAt: Date.now() + expiresInSeconds * 1000,
  };

  console.log("[USCIS Auth] Access token fetched successfully", {
    expiresInSeconds,
  });

  return cachedToken.accessToken;
}

async function getAccessToken() {
  const tokenIsFresh =
    cachedToken.accessToken &&
    cachedToken.expiresAt - getTokenBufferMs() > Date.now();

  if (tokenIsFresh) {
    console.log("[USCIS Auth] Using cached access token");
    return cachedToken.accessToken;
  }

  return requestNewAccessToken();
}

module.exports = {
  getAccessToken,
};
