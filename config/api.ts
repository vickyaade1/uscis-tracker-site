import Constants from "expo-constants";

export type ApiMode = "auto" | "localhost" | "lan";

const API_PORT = 4000;
const API_MODE: ApiMode = "auto";
const LAN_IP = "192.168.1.100";
const FALLBACK_RENDER_API_URL = "https://uscis-tracker-site.onrender.com";

function getExpoHost() {
  const hostUri = Constants.expoConfig?.hostUri;

  if (!hostUri) {
    return "";
  }

  return hostUri.split(":")[0];
}

function getConfiguredProductionApiUrl() {
  const configuredUrl = Constants.expoConfig?.extra?.apiUrl;

  if (typeof configuredUrl === "string" && configuredUrl.trim()) {
    return configuredUrl.trim();
  }

  return FALLBACK_RENDER_API_URL;
}

function getDevelopmentApiBaseUrl() {
  if (API_MODE === "localhost") {
    return `http://localhost:${API_PORT}`;
  }

  if (API_MODE === "lan") {
    return `http://${LAN_IP}:${API_PORT}`;
  }

  const expoHost = getExpoHost();

  if (expoHost) {
    return `http://${expoHost}:${API_PORT}`;
  }

  return `http://localhost:${API_PORT}`;
}

export function getApiBaseUrl() {
  if (!__DEV__) {
    return getConfiguredProductionApiUrl();
  }

  return getDevelopmentApiBaseUrl();
}

export function getApiConfigSummary() {
  return {
    mode: __DEV__ ? API_MODE : "production",
    port: API_PORT,
    lanIp: LAN_IP,
    baseUrl: getApiBaseUrl(),
    productionUrl: getConfiguredProductionApiUrl(),
  };
}

export function buildNetworkErrorMessage(error: unknown) {
  const developmentMessage =
    'Could not reach the backend server. Make sure the backend is running and your phone and computer are on the same Wi-Fi.';
  const productionMessage =
    "Could not reach the live backend server. Check that your Render deployment is healthy and the production API URL is configured correctly.";

  if (error instanceof Error) {
    if (error.message.includes("Network request failed")) {
      if (__DEV__) {
        return `${developmentMessage} If you are using a real phone, switch API_MODE to "lan" and set LAN_IP in config/api.ts.`;
      }

      return productionMessage;
    }

    return error.message;
  }

  return __DEV__ ? developmentMessage : productionMessage;
}
