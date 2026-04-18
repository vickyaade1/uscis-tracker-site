const { env } = require("../config/env");
const { getAccessToken } = require("./uscisAuthService");
const { HttpError } = require("../utils/httpError");

function slugifyStatus(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function mapStatusCode(statusText) {
  const text = String(statusText || "").toLowerCase();

  if (text.includes("biometrics") && text.includes("scheduled")) {
    return "biometrics-scheduled";
  }

  if (text.includes("biometrics") && (text.includes("completed") || text.includes("taken"))) {
    return "biometrics-completed";
  }

  if (text.includes("actively reviewing") || text.includes("active review")) {
    return "case-actively-reviewing";
  }

  if (text.includes("approved") || text.includes("approval")) {
    return "case-approved";
  }

  if (text.includes("denied") || text.includes("denial")) {
    return "case-denied";
  }

  if (text.includes("received")) {
    return "case-received";
  }

  return slugifyStatus(statusText) || "case-status-updated";
}

function toIsoDate(value) {
  const candidate = Date.parse(value || "");

  if (!Number.isNaN(candidate)) {
    return new Date(candidate).toISOString();
  }

  return new Date().toISOString();
}

function normalizeUscisCaseStatus(payload, receiptNumber) {
  const caseStatus = payload.case_status || payload.caseStatus || payload.data;

  if (!caseStatus) {
    throw new HttpError(502, "USCIS did not return case status data.");
  }

  const statusTextEn =
    caseStatus.current_case_status_text_en ||
    caseStatus.currentCaseStatusTextEn ||
    caseStatus.statusText ||
    "Case Status Updated";
  const statusDescEn =
    caseStatus.current_case_status_desc_en ||
    caseStatus.currentCaseStatusDescEn ||
    caseStatus.statusDescription ||
    "USCIS returned an updated status.";

  return {
    source: "uscis",
    case: {
      receiptNumber: caseStatus.receiptNumber || receiptNumber,
      formType: caseStatus.formType || "",
      statusCode: mapStatusCode(statusTextEn),
      statusText: {
        en: statusTextEn,
        es:
          caseStatus.current_case_status_text_es ||
          caseStatus.currentCaseStatusTextEs ||
          statusTextEn,
        hi: statusTextEn,
      },
      statusDescription: {
        en: statusDescEn,
        es:
          caseStatus.current_case_status_desc_es ||
          caseStatus.currentCaseStatusDescEs ||
          statusDescEn,
        hi: statusDescEn,
      },
      updatedAt: toIsoDate(caseStatus.modifiedDate || caseStatus.submittedDate),
    },
  };
}

function getUscisErrorMessage(data) {
  if (Array.isArray(data.errors) && data.errors[0]?.message) {
    return data.errors[0].message;
  }

  return data.message || data.error || "USCIS request failed.";
}

async function getLiveCaseStatus(receiptNumber) {
  console.log("[USCIS Case Status] Starting request", {
    receiptNumber,
    endpoint: `${env.uscisCaseStatusUrl}/${receiptNumber}`,
  });

  const accessToken = await getAccessToken();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), env.uscisTimeoutMs);

  try {
    const response = await fetch(
      `${env.uscisCaseStatusUrl}/${receiptNumber}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        signal: controller.signal,
      }
    );

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      console.log("[USCIS Case Status] Request failed", {
        receiptNumber,
        status: response.status,
        error: getUscisErrorMessage(data),
      });

      throw new HttpError(response.status, getUscisErrorMessage(data));
    }

    console.log("[USCIS Case Status] Request succeeded", {
      receiptNumber,
      status: response.status,
      keys: Object.keys(data || {}),
    });

    return normalizeUscisCaseStatus(data, receiptNumber);
  } catch (error) {
    if (error.name === "AbortError") {
      console.log("[USCIS Case Status] Request timed out", {
        receiptNumber,
        timeoutMs: env.uscisTimeoutMs,
      });

      throw new HttpError(504, "USCIS request timed out.");
    }

    console.log("[USCIS Case Status] Unexpected request failure", {
      receiptNumber,
      message: error.message,
    });

    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

module.exports = {
  getLiveCaseStatus,
};
