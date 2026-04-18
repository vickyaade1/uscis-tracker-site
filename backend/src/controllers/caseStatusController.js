const {
  env,
  hasUscisCredentials,
  getMaskedClientId,
} = require("../config/env");
const { getMockCaseStatus } = require("../services/mockCaseStatusService");
const { getLiveCaseStatus } = require("../services/uscisCaseStatusService");
const { HttpError } = require("../utils/httpError");
const {
  normalizeReceiptNumber,
  isValidReceiptNumber,
} = require("../utils/receiptNumber");

async function getCaseStatus(req, res) {
  const receiptNumber = normalizeReceiptNumber(req.body.receiptNumber);

  console.log("[Case Status Controller] Incoming request", {
    receiptNumber,
    uscisMode: env.uscisMode,
  });

  if (!receiptNumber) {
    return res.status(400).json({
      ok: false,
      error: "Receipt number is required",
    });
  }

  if (!isValidReceiptNumber(receiptNumber)) {
    return res.status(400).json({
      ok: false,
      error: "Receipt number must look like ABC1234567890",
    });
  }

  try {
    if (env.uscisMode === "live") {
      if (!hasUscisCredentials()) {
        console.log("[Case Status Controller] Live mode missing credentials");

        throw new HttpError(
          500,
          "USCIS live mode is enabled, but USCIS credentials are missing. Add USCIS_CLIENT_ID and USCIS_CLIENT_SECRET to backend/.env."
        );
      }

      console.log("[Case Status Controller] Using USCIS live mode", {
        clientId: getMaskedClientId(),
      });

      const liveResult = await getLiveCaseStatus(receiptNumber);

      console.log("[Case Status Controller] Returning live USCIS result", {
        receiptNumber,
        source: liveResult.source,
        statusCode: liveResult.case.statusCode,
      });

      return res.json({
        ok: true,
        ...liveResult,
      });
    }

    console.log("[Case Status Controller] Using mock mode", {
      receiptNumber,
    });

    const mockResult = await getMockCaseStatus(receiptNumber);

    console.log("[Case Status Controller] Returning mock result", {
      receiptNumber,
      source: mockResult.source,
      statusCode: mockResult.case.statusCode,
    });

    return res.json({
      ok: true,
      ...mockResult,
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    const message = error.message || "Could not fetch case status.";

    console.log("[Case Status Controller] Returning error response", {
      receiptNumber,
      statusCode,
      message,
    });

    return res.status(statusCode).json({
      ok: false,
      error: message,
    });
  }
}

module.exports = {
  getCaseStatus,
};
