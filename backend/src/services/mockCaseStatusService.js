async function getMockCaseStatus(receiptNumber) {
  return {
    source: "mock",
    case: {
      receiptNumber,
      formType: "I-485",
      statusCode: "case-received",
      statusText: {
        en: "Case Was Received",
        es: "Se recibio el caso",
        hi: "Case Was Received",
      },
      statusDescription: {
        en: "We received your case and sent you a receipt notice.",
        es: "Recibimos su caso y le enviamos un aviso de recibo.",
        hi: "We received your case and sent you a receipt notice.",
      },
      updatedAt: new Date().toISOString(),
    },
  };
}

module.exports = {
  getMockCaseStatus,
};
