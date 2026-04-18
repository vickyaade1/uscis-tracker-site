import Constants from "expo-constants";

export type ApiMode = "auto" | "localhost" | "lan";

const API_PORT = 4000;
const API_MODE: ApiMode = "auto";
const LAN_IP = "192.168.1.100";

function getExpoHost() {
  const hostUri = Constants.expoConfig?.hostUri;

  if (!hostUri) {
    return "";
  }

  return hostUri.split(":")[0];
}

export function getApiBaseUrl() {
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

export function getApiConfigSummary() {
  return {
    mode: API_MODE,
    port: API_PORT,
    lanIp: LAN_IP,
    baseUrl: getApiBaseUrl(),
  };
}

export function buildNetworkErrorMessage(error: unknown) {
  const defaultMessage =
    "Could not reach the backend server. Make sure the backend is running and your phone and computer are on the same Wi-Fi.";

  if (error instanceof Error) {
    if (error.message.includes("Network request failed")) {
      return `${defaultMessage} If you are using a real phone, switch API_MODE to "lan" and set LAN_IP in config/api.ts.`;
    }

    return error.message;
  }

  return defaultMessage;
}
