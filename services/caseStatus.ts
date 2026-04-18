import { getApiBaseUrl } from "../config/api";

const REQUEST_TIMEOUT_MS = 10000;

export type LocalizedText = {
  en: string;
  es?: string;
  hi?: string;
};

export type NormalizedCaseStatus = {
  receiptNumber: string;
  formType: string;
  statusCode: string;
  statusText: LocalizedText;
  statusDescription: LocalizedText;
  updatedAt: string;
};

type RawCaseStatusResponse = {
  ok?: boolean;
  error?: string;
  case?: Partial<NormalizedCaseStatus>;
};

export type CaseStatusErrorType =
  | "validation"
  | "backend"
  | "network"
  | "timeout"
  | "unknown";

export class CaseStatusError extends Error {
  type: CaseStatusErrorType;

  constructor(type: CaseStatusErrorType, message: string) {
    super(message);
    this.name = "CaseStatusError";
    this.type = type;
  }
}

function normalizeReceiptNumber(receiptNumber: string) {
  return receiptNumber.trim().toUpperCase();
}

function validateReceiptNumber(receiptNumber: string) {
  if (!receiptNumber) {
    throw new CaseStatusError("validation", "Please enter a receipt number.");
  }

  if (!/^[A-Z]{3}[0-9]{10}$/.test(receiptNumber)) {
    throw new CaseStatusError(
      "validation",
      "Receipt number must look like ABC1234567890."
    );
  }
}

function normalizeLocalizedText(value?: Partial<LocalizedText>) {
  return {
    en: value?.en || "",
    es: value?.es || value?.en || "",
    hi: value?.hi || value?.en || "",
  };
}

function normalizeCaseStatus(rawCase?: Partial<NormalizedCaseStatus>) {
  if (!rawCase?.receiptNumber || !rawCase.statusCode || !rawCase.updatedAt) {
    throw new CaseStatusError("backend", "Backend returned incomplete case data.");
  }

  return {
    receiptNumber: rawCase.receiptNumber,
    formType: rawCase.formType || "",
    statusCode: rawCase.statusCode,
    statusText: normalizeLocalizedText(rawCase.statusText),
    statusDescription: normalizeLocalizedText(rawCase.statusDescription),
    updatedAt: rawCase.updatedAt,
  };
}

function parseResponseData(data: RawCaseStatusResponse) {
  if (!data.ok || !data.case) {
    throw new CaseStatusError(
      "backend",
      data.error || "Backend could not return case status."
    );
  }

  return normalizeCaseStatus(data.case);
}

export function getCaseStatusErrorType(error: unknown): CaseStatusErrorType {
  if (error instanceof CaseStatusError) {
    return error.type;
  }

  return "unknown";
}

export async function fetchCaseStatus(receiptNumber: string) {
  const normalizedReceipt = normalizeReceiptNumber(receiptNumber);
  validateReceiptNumber(normalizedReceipt);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  const url = `${getApiBaseUrl()}/api/case-status`;

  try {
    console.log("[CaseStatusService] Request starting", {
      url,
      receiptNumber: normalizedReceipt,
      timeoutMs: REQUEST_TIMEOUT_MS,
    });

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        receiptNumber: normalizedReceipt,
      }),
      signal: controller.signal,
    });

    let data: RawCaseStatusResponse = {};

    try {
      data = (await response.json()) as RawCaseStatusResponse;
    } catch {
      throw new CaseStatusError("backend", "Backend returned invalid JSON.");
    }

    console.log("[CaseStatusService] Response received", {
      ok: response.ok,
      status: response.status,
      data,
    });

    if (!response.ok) {
      throw new CaseStatusError(
        "backend",
        data.error || `Backend request failed with status ${response.status}.`
      );
    }

    return parseResponseData(data);
  } catch (error) {
    console.log("[CaseStatusService] Request failed", error);

    if (error instanceof CaseStatusError) {
      throw error;
    }

    if (error instanceof Error && error.name === "AbortError") {
      throw new CaseStatusError(
        "timeout",
        "The request took too long. Please try again."
      );
    }

    if (error instanceof Error && error.message.includes("Network request failed")) {
      throw new CaseStatusError(
        "network",
        "Could not reach the backend server."
      );
    }

    throw new CaseStatusError(
      "unknown",
      "Something unexpected happened while checking case status."
    );
  } finally {
    clearTimeout(timeoutId);
  }
}
