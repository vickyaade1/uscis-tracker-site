function normalizeReceiptNumber(value) {
  return String(value || "").trim().toUpperCase();
}

function isValidReceiptNumber(value) {
  return /^[A-Z]{3}[0-9]{10}$/.test(value);
}

module.exports = {
  normalizeReceiptNumber,
  isValidReceiptNumber,
};
