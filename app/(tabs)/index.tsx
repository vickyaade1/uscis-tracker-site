import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getApiConfigSummary } from "../../config/api";
import {
  DEFAULT_LANGUAGE,
  type AppLanguage,
  appText,
  getLocalizedCaseText,
  t,
} from "../../config/i18n";
import {
  fetchCaseStatus,
  getCaseStatusErrorType,
  type CaseStatusErrorType,
  type LocalizedText,
  type NormalizedCaseStatus,
} from "../../services/caseStatus";

type SavedCase = {
  receipt: string;
  nickname: string;
  status: string;
  statusCode: string;
  updatedAt: string;
};

type RequestErrorState = {
  type: CaseStatusErrorType;
  message: string;
};

const SAVED_CASES_STORAGE_KEY = "savedCases";

const languageOptions: { code: AppLanguage; labelKey: keyof typeof appText }[] = [
  { code: "en", labelKey: "english" },
  { code: "es", labelKey: "spanish" },
  { code: "hi", labelKey: "hindi" },
];

function getStageIndex(statusCode?: string) {
  switch (statusCode) {
    case "case-received":
      return 0;
    case "biometrics-scheduled":
      return 1;
    case "biometrics-completed":
      return 2;
    case "case-actively-reviewing":
      return 3;
    case "decision":
    case "case-approved":
    case "case-denied":
      return 4;
    default:
      return 0;
  }
}

export default function Dashboard() {
  const [language, setLanguage] = useState<AppLanguage>(DEFAULT_LANGUAGE);
  const [receipt, setReceipt] = useState("");
  const [nickname, setNickname] = useState("");
  const [savedCases, setSavedCases] = useState<SavedCase[]>([]);
  const [caseData, setCaseData] = useState<NormalizedCaseStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorState, setErrorState] = useState<RequestErrorState | null>(null);
  const [lastRequestedReceipt, setLastRequestedReceipt] = useState("");

  const apiConfig = useMemo(() => getApiConfigSummary(), []);
  const stageIndex = getStageIndex(caseData?.statusCode);
  const currentStatus =
    getLocalizedCaseText(language, caseData?.statusText) ||
    t(language, appText.emptyStatus, "-");
  const currentDescription = getLocalizedCaseText(
    language,
    caseData?.statusDescription
  );
  const stages = [
    { key: "case-received", label: t(language, appText.stageCaseReceived) },
    {
      key: "biometrics-scheduled",
      label: t(language, appText.stageBiometricsScheduled),
    },
    {
      key: "biometrics-completed",
      label: t(language, appText.stageBiometricsCompleted),
    },
    {
      key: "case-actively-reviewing",
      label: t(language, appText.stageActivelyReviewing),
    },
    { key: "decision", label: t(language, appText.stageDecision) },
  ];

  useEffect(() => {
    const loadSavedCases = async () => {
      try {
        const storedCases = await AsyncStorage.getItem(SAVED_CASES_STORAGE_KEY);

        if (!storedCases) {
          return;
        }

        const parsedCases: SavedCase[] = JSON.parse(storedCases).map(
          (item: Partial<SavedCase>) => ({
            receipt: item.receipt || "",
            nickname: item.nickname || "My Case",
            status: item.status || "",
            statusCode: item.statusCode || "",
            updatedAt: item.updatedAt || "",
          })
        );

        setSavedCases(parsedCases);
      } catch (error) {
        console.log("[SavedCases] Failed to load saved cases", error);
      }
    };

    loadSavedCases();
  }, []);

  const persistSavedCases = async (nextSavedCases: SavedCase[]) => {
    try {
      await AsyncStorage.setItem(
        SAVED_CASES_STORAGE_KEY,
        JSON.stringify(nextSavedCases)
      );
      console.log("[SavedCases] Storage updated", nextSavedCases);
    } catch (error) {
      console.log("[SavedCases] Failed to update storage", error);
      setErrorState({
        type: "unknown",
        message: "Could not update saved cases on this device.",
      });
    }
  };

  const buildErrorState = (error: unknown): RequestErrorState => {
    const errorType = getCaseStatusErrorType(error);
    const detail =
      error instanceof Error ? error.message : "Something went wrong.";

    if (errorType === "validation") {
      return {
        type: errorType,
        message: detail,
      };
    }

    if (errorType === "backend") {
      return {
        type: errorType,
        message: detail,
      };
    }

    if (errorType === "network") {
      return {
        type: errorType,
        message: `${detail} ${t(language, appText.networkErrorHelp)}`,
      };
    }

    if (errorType === "timeout") {
      return {
        type: errorType,
        message: detail,
      };
    }

    return {
      type: "unknown",
      message: detail,
    };
  };

  const updateSavedCaseAfterRefresh = (
    refreshedCase: NormalizedCaseStatus,
    savedNickname?: string
  ) => {
    const existingSavedCase = savedCases.find(
      (item) => item.receipt === refreshedCase.receiptNumber
    );

    if (!existingSavedCase) {
      return;
    }

    const nextSavedCases = savedCases.map((item) => {
      if (item.receipt !== refreshedCase.receiptNumber) {
        return item;
      }

      return {
        ...item,
        nickname: savedNickname || item.nickname,
        status: getLocalizedCaseText(language, refreshedCase.statusText),
        statusCode: refreshedCase.statusCode,
        updatedAt: refreshedCase.updatedAt,
      };
    });

    setSavedCases(nextSavedCases);
    persistSavedCases(nextSavedCases);
  };

  const runCaseStatusRequest = async (
    receiptNumber: string,
    options?: {
      nicknameOverride?: string;
      updateSavedCase?: boolean;
    }
  ) => {
    const cleanReceipt = receiptNumber.trim().toUpperCase();

    setLastRequestedReceipt(cleanReceipt);
    setLoading(true);
    setErrorState(null);
    setCaseData(null);

    try {
      const nextCaseData = await fetchCaseStatus(cleanReceipt);
      setCaseData(nextCaseData);

      if (options?.updateSavedCase) {
        updateSavedCaseAfterRefresh(nextCaseData, options.nicknameOverride);
      }

      return nextCaseData;
    } catch (error) {
      setErrorState(buildErrorState(error));
      return null;
    } finally {
      setLoading(false);
    }
  };

  const checkStatus = async () => {
    await runCaseStatusRequest(receipt);
  };

  const retryLastRequest = async () => {
    if (!lastRequestedReceipt) {
      return;
    }

    await runCaseStatusRequest(lastRequestedReceipt);
  };

  const refreshCurrentCase = async () => {
    const activeReceipt = caseData?.receiptNumber || receipt;

    if (!activeReceipt) {
      return;
    }

    await runCaseStatusRequest(activeReceipt, {
      nicknameOverride: nickname.trim() || "My Case",
      updateSavedCase: true,
    });
  };

  const saveCase = () => {
    if (!caseData) {
      setErrorState({
        type: "validation",
        message: t(language, appText.saveCaseFirstError),
      });
      return;
    }

    const alreadySaved = savedCases.some(
      (item) => item.receipt === caseData.receiptNumber
    );

    if (alreadySaved) {
      setErrorState({
        type: "validation",
        message: t(language, appText.duplicateCaseError),
      });
      return;
    }

    const newCase: SavedCase = {
      receipt: caseData.receiptNumber,
      nickname: nickname.trim() || "My Case",
      status: getLocalizedCaseText(language, caseData.statusText),
      statusCode: caseData.statusCode,
      updatedAt: caseData.updatedAt,
    };

    const nextSavedCases = [...savedCases, newCase];
    setSavedCases(nextSavedCases);
    persistSavedCases(nextSavedCases);
    setErrorState(null);
    setNickname("");
  };

  const deleteCase = (index: number) => {
    const nextSavedCases = savedCases.filter(
      (_, itemIndex) => itemIndex !== index
    );

    setSavedCases(nextSavedCases);
    persistSavedCases(nextSavedCases);
  };

  const recheckSavedCase = async (savedCase: SavedCase) => {
    setReceipt(savedCase.receipt);
    setNickname(savedCase.nickname);

    await runCaseStatusRequest(savedCase.receipt, {
      nicknameOverride: savedCase.nickname,
      updateSavedCase: true,
    });
  };

  const getErrorTitle = () => {
    if (!errorState) {
      return "";
    }

    if (errorState.type === "validation") {
      return t(language, appText.validationErrorTitle);
    }

    if (errorState.type === "backend") {
      return t(language, appText.backendErrorTitle);
    }

    if (errorState.type === "network") {
      return t(language, appText.networkErrorTitle);
    }

    if (errorState.type === "timeout") {
      return t(language, appText.timeoutErrorTitle);
    }

    return t(language, appText.unknownErrorTitle);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header}>{t(language, appText.appName)}</Text>
        <Text style={styles.title}>{t(language, appText.dashboardTitle)}</Text>

        <View style={styles.languageCard}>
          <Text style={styles.languageTitle}>{t(language, appText.language)}</Text>
          <View style={styles.languageRow}>
            {languageOptions.map((option) => {
              const isSelected = language === option.code;

              return (
                <TouchableOpacity
                  key={option.code}
                  style={[
                    styles.languageButton,
                    isSelected && styles.languageButtonActive,
                  ]}
                  onPress={() => setLanguage(option.code)}
                >
                  <Text
                    style={[
                      styles.languageButtonText,
                      isSelected && styles.languageButtonTextActive,
                    ]}
                  >
                    {t(language, appText[option.labelKey])}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>{t(language, appText.searchCase)}</Text>

          <TextInput
            placeholder={t(language, appText.receiptPlaceholder)}
            placeholderTextColor="#94a3b8"
            value={receipt}
            onChangeText={setReceipt}
            autoCapitalize="characters"
            style={styles.input}
          />

          <TextInput
            placeholder={t(language, appText.nicknamePlaceholder)}
            placeholderTextColor="#94a3b8"
            value={nickname}
            onChangeText={setNickname}
            style={styles.input}
          />

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={checkStatus}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.buttonText}>
                  {t(language, appText.checkStatus)}
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.saveButton} onPress={saveCase}>
              <Text style={styles.buttonText}>{t(language, appText.save)}</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.helperText}>Backend URL: {apiConfig.baseUrl}</Text>
          <Text style={styles.helperText}>API Mode: {apiConfig.mode}</Text>
          {apiConfig.mode === "lan" ? (
            <Text style={styles.helperText}>LAN IP: {apiConfig.lanIp}</Text>
          ) : null}

          {errorState ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorTitle}>{getErrorTitle()}</Text>
              <Text style={styles.errorText}>{errorState.message}</Text>

              {lastRequestedReceipt ? (
                <TouchableOpacity
                  style={styles.retryButton}
                  onPress={retryLastRequest}
                  disabled={loading}
                >
                  <Text style={styles.retryButtonText}>
                    {t(language, appText.retry)}
                  </Text>
                </TouchableOpacity>
              ) : null}
            </View>
          ) : null}
        </View>

        <View style={styles.resultCard}>
          <View style={styles.resultHeaderRow}>
            <View style={styles.resultHeaderTextBlock}>
              <Text style={styles.label}>{t(language, appText.currentStatus)}</Text>
              <Text style={styles.status}>{currentStatus}</Text>
            </View>

            {(caseData || receipt.trim()) && (
              <TouchableOpacity
                style={styles.refreshButton}
                onPress={refreshCurrentCase}
                disabled={loading}
              >
                <Text style={styles.refreshButtonText}>
                  {t(language, appText.refresh)}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {(caseData || receipt.trim()) && (
            <Text style={styles.helperText}>
              {t(language, appText.refreshCurrentCaseHint)}
            </Text>
          )}

          {caseData ? (
            <>
              <Text style={styles.description}>{currentDescription}</Text>
              <Text style={styles.metaText}>
                {t(language, appText.receiptLabel)}: {caseData.receiptNumber}
              </Text>
              <Text style={styles.metaText}>
                {t(language, appText.formLabel)}: {caseData.formType}
              </Text>
              <Text style={styles.metaText}>
                {t(language, appText.updatedLabel)}:{" "}
                {new Date(caseData.updatedAt).toLocaleString()}
              </Text>
            </>
          ) : (
            <Text style={styles.placeholderText}>
              {t(language, appText.emptySearchState)}
            </Text>
          )}

          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${((stageIndex + 1) / stages.length) * 100}%` },
              ]}
            />
          </View>

          <View style={styles.timeline}>
            {stages.map((stage, index) => {
              const isActive = index <= stageIndex && !!caseData;

              return (
                <Text
                  key={stage.key}
                  style={[styles.timelineItem, isActive && styles.timelineActive]}
                >
                  {index + 1}. {stage.label}
                </Text>
              );
            })}
          </View>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>{t(language, appText.helpLegal)}</Text>

          <Link href="/privacy" asChild>
            <TouchableOpacity style={styles.infoButton}>
              <Text style={styles.infoButtonText}>
                {t(language, appText.openPrivacyPolicy)}
              </Text>
            </TouchableOpacity>
          </Link>

          <Link href="/support" asChild>
            <TouchableOpacity style={styles.infoButton}>
              <Text style={styles.infoButtonText}>
                {t(language, appText.openSupportScreen)}
              </Text>
            </TouchableOpacity>
          </Link>
        </View>

        <Text style={styles.sectionTitle}>{t(language, appText.savedCases)}</Text>
        {savedCases.length > 0 ? (
          <Text style={styles.savedHintText}>
            {t(language, appText.tapSavedCaseHint)}
          </Text>
        ) : null}

        {savedCases.length === 0 ? (
          <View style={styles.emptyStateCard}>
            <Text style={styles.savedSub}>{t(language, appText.noSavedCases)}</Text>
          </View>
        ) : null}

        {savedCases.map((item, index) => (
          <View key={`${item.receipt}-${index}`} style={styles.savedCard}>
            <TouchableOpacity
              style={styles.savedCaseButton}
              onPress={() => recheckSavedCase(item)}
              disabled={loading}
            >
              <View>
                <Text style={styles.savedTitle}>{item.nickname}</Text>
                <Text style={styles.savedSub}>{item.receipt}</Text>
                <Text style={styles.savedStatus}>{item.status}</Text>
                {item.updatedAt ? (
                  <Text style={styles.savedUpdatedText}>
                    {t(language, appText.updatedLabel)}:{" "}
                    {new Date(item.updatedAt).toLocaleString()}
                  </Text>
                ) : null}
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => deleteCase(index)}
            >
              <Text style={styles.deleteText}>{t(language, appText.delete)}</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#08101f",
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 32,
  },
  header: {
    color: "#60a5fa",
    fontWeight: "bold",
    letterSpacing: 2,
  },
  title: {
    fontSize: 32,
    color: "white",
    fontWeight: "bold",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#111c33",
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
  },
  languageCard: {
    backgroundColor: "#111c33",
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
  },
  languageTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  languageRow: {
    flexDirection: "row",
    gap: 10,
  },
  languageButton: {
    flex: 1,
    backgroundColor: "#0b1324",
    borderWidth: 1,
    borderColor: "#1e293b",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  languageButtonActive: {
    backgroundColor: "#3b82f6",
    borderColor: "#60a5fa",
  },
  languageButtonText: {
    color: "#cbd5e1",
    fontWeight: "600",
  },
  languageButtonTextActive: {
    color: "#ffffff",
  },
  sectionTitle: {
    color: "white",
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    backgroundColor: "#0b1324",
    color: "white",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 10,
  },
  button: {
    flex: 1,
    backgroundColor: "#3b82f6",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  saveButton: {
    flex: 1,
    backgroundColor: "#22c55e",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  helperText: {
    color: "#94a3b8",
    marginTop: 12,
    fontSize: 12,
  },
  errorBox: {
    marginTop: 12,
    backgroundColor: "#451a1a",
    borderWidth: 1,
    borderColor: "#7f1d1d",
    borderRadius: 10,
    padding: 12,
  },
  errorTitle: {
    color: "#ffffff",
    fontWeight: "700",
    marginBottom: 8,
  },
  errorText: {
    color: "#fecaca",
    lineHeight: 20,
  },
  retryButton: {
    marginTop: 12,
    alignSelf: "flex-start",
    backgroundColor: "#991b1b",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#ffffff",
    fontWeight: "700",
  },
  resultCard: {
    backgroundColor: "#111c33",
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
  },
  infoCard: {
    backgroundColor: "#111c33",
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
  },
  infoButton: {
    backgroundColor: "#0b1324",
    borderWidth: 1,
    borderColor: "#1e293b",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 10,
  },
  infoButtonText: {
    color: "#e2e8f0",
    fontWeight: "700",
  },
  resultHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
  },
  resultHeaderTextBlock: {
    flex: 1,
  },
  refreshButton: {
    backgroundColor: "#0b1324",
    borderWidth: 1,
    borderColor: "#1e293b",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
  },
  refreshButtonText: {
    color: "#e2e8f0",
    fontWeight: "700",
  },
  label: {
    color: "#94a3b8",
  },
  status: {
    color: "#22c55e",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 5,
  },
  description: {
    color: "#e2e8f0",
    marginTop: 12,
    lineHeight: 22,
  },
  placeholderText: {
    color: "#94a3b8",
    marginTop: 12,
    lineHeight: 22,
  },
  metaText: {
    color: "#cbd5e1",
    marginTop: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: "#1e293b",
    borderRadius: 999,
    marginTop: 16,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#22c55e",
    borderRadius: 999,
  },
  timeline: {
    marginTop: 16,
    gap: 8,
  },
  timelineItem: {
    color: "#64748b",
  },
  timelineActive: {
    color: "#e2e8f0",
    fontWeight: "600",
  },
  emptyStateCard: {
    backgroundColor: "#111c33",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  savedHintText: {
    color: "#94a3b8",
    marginBottom: 10,
  },
  savedCard: {
    backgroundColor: "#111c33",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  savedCaseButton: {
    flex: 1,
  },
  savedTitle: {
    color: "white",
    fontWeight: "bold",
  },
  savedSub: {
    color: "#94a3b8",
  },
  savedStatus: {
    color: "#22c55e",
    marginTop: 4,
  },
  savedUpdatedText: {
    color: "#64748b",
    marginTop: 4,
    fontSize: 12,
  },
  deleteButton: {
    backgroundColor: "#7f1d1d",
    padding: 10,
    borderRadius: 8,
  },
  deleteText: {
    color: "#fecaca",
  },
});
