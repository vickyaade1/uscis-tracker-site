import AsyncStorage from "@react-native-async-storage/async-storage";

export type SavedCase = {
  receipt: string;
  nickname: string;
  status: string;
  statusCode: string;
  updatedAt: string;
};

export const SAVED_CASES_STORAGE_KEY = "savedCases";

function normalizeSavedCase(item: Partial<SavedCase>): SavedCase {
  return {
    receipt: item.receipt?.trim().toUpperCase() || "",
    nickname: item.nickname?.trim() || "My Case",
    status: item.status || "",
    statusCode: item.statusCode || "",
    updatedAt: item.updatedAt || "",
  };
}

export async function loadSavedCases() {
  const storedCases = await AsyncStorage.getItem(SAVED_CASES_STORAGE_KEY);

  if (!storedCases) {
    return [] as SavedCase[];
  }

  const parsedCases = JSON.parse(storedCases) as Partial<SavedCase>[];
  return parsedCases.map(normalizeSavedCase).filter((item) => item.receipt);
}

export async function persistSavedCases(savedCases: SavedCase[]) {
  await AsyncStorage.setItem(
    SAVED_CASES_STORAGE_KEY,
    JSON.stringify(savedCases.map(normalizeSavedCase))
  );
}

export async function upsertSavedCase(nextSavedCase: SavedCase) {
  const normalizedNextCase = normalizeSavedCase(nextSavedCase);
  const currentSavedCases = await loadSavedCases();
  const existingIndex = currentSavedCases.findIndex(
    (item) => item.receipt === normalizedNextCase.receipt
  );

  if (existingIndex >= 0) {
    currentSavedCases[existingIndex] = {
      ...currentSavedCases[existingIndex],
      ...normalizedNextCase,
    };
  } else {
    currentSavedCases.unshift(normalizedNextCase);
  }

  await persistSavedCases(currentSavedCases);
  return currentSavedCases;
}

export async function removeSavedCase(receiptNumber: string) {
  const normalizedReceipt = receiptNumber.trim().toUpperCase();
  const currentSavedCases = await loadSavedCases();
  const nextSavedCases = currentSavedCases.filter(
    (item) => item.receipt !== normalizedReceipt
  );

  await persistSavedCases(nextSavedCases);
  return nextSavedCases;
}

export async function clearSavedCases() {
  await AsyncStorage.removeItem(SAVED_CASES_STORAGE_KEY);
  return [] as SavedCase[];
}
