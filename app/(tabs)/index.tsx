import Constants from "expo-constants";
import { Link, useFocusEffect } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
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
  appText,
  getLocalizedCaseText,
  t,
  type AppLanguage,
} from "../../config/i18n";
import { getFontStyle } from "../../config/typography";
import { useAppLanguage } from "../../context/AppLanguageContext";
import {
  fetchCaseStatus,
  getCaseStatusErrorType,
  type CaseStatusErrorType,
  type NormalizedCaseStatus,
} from "../../services/caseStatus";
import {
  loadSavedCases,
  type SavedCase,
  upsertSavedCase,
} from "../../services/savedCases";

type RequestErrorState = {
  type: CaseStatusErrorType;
  message: string;
};

const languageOptions: {
  code: AppLanguage;
  labelKey: keyof typeof appText;
  flag: string;
}[] = [
  { code: "en", labelKey: "english", flag: "🇺🇸" },
  { code: "es", labelKey: "spanish", flag: "🇲🇽" },
  { code: "hi", labelKey: "hindi", flag: "🇮🇳" },
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

function getStatusBadgeColors(statusCode?: string) {
  if (statusCode === "case-approved") {
    return {
      backgroundColor: "#0f2d1f",
      borderColor: "#1f8f5f",
      textColor: "#7ff2bc",
    };
  }

  if (statusCode === "case-denied") {
    return {
      backgroundColor: "#32161b",
      borderColor: "#8f2e41",
      textColor: "#ff9db1",
    };
  }

  if (statusCode === "case-actively-reviewing") {
    return {
      backgroundColor: "#112744",
      borderColor: "#2e6bb9",
      textColor: "#8fc0ff",
    };
  }

  return {
    backgroundColor: "#112744",
    borderColor: "#2b5ea8",
    textColor: "#9bc2ff",
  };
}

export default function Dashboard() {
  const { language, setLanguage } = useAppLanguage();
  const [receipt, setReceipt] = useState("");
  const [nickname, setNickname] = useState("");
  const [savedCases, setSavedCases] = useState<SavedCase[]>([]);
  const [caseData, setCaseData] = useState<NormalizedCaseStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorState, setErrorState] = useState<RequestErrorState | null>(null);
  const [lastRequestedReceipt, setLastRequestedReceipt] = useState("");

  const apiConfig = useMemo(() => getApiConfigSummary(), []);
  const appVersion = Constants.expoConfig?.version || "1.0.0";
  const regularText = getFontStyle(language, "regular");
  const mediumText = getFontStyle(language, "medium");
  const semiBoldText = getFontStyle(language, "semibold");
  const boldText = getFontStyle(language, "bold");
  const stageIndex = getStageIndex(caseData?.statusCode);
  const totalSteps = 5;
  const currentStep = caseData ? stageIndex + 1 : 0;
  const currentStatus =
    getLocalizedCaseText(language, caseData?.statusText) ||
    t(language, appText.emptyStatus, "-");
  const currentDescription = getLocalizedCaseText(
    language,
    caseData?.statusDescription
  );
  const statusBadge = getStatusBadgeColors(caseData?.statusCode);
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

  const syncSavedCases = useCallback(async () => {
    try {
      const nextSavedCases = await loadSavedCases();
      setSavedCases(nextSavedCases);
    } catch (error) {
      console.log("[SavedCases] Failed to load saved cases", error);
      setErrorState({
        type: "unknown",
        message: "Could not load saved cases from this device.",
      });
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      syncSavedCases();
    }, [syncSavedCases])
  );

  const buildErrorState = (error: unknown): RequestErrorState => {
    const errorType = getCaseStatusErrorType(error);
    const detail =
      error instanceof Error ? error.message : "Something went wrong.";

    if (errorType === "network") {
      return {
        type: errorType,
        message: `${detail} ${t(language, appText.networkErrorHelp)}`,
      };
    }

    return {
      type: errorType,
      message: detail,
    };
  };

  const updateSavedCaseAfterRefresh = async (
    refreshedCase: NormalizedCaseStatus,
    savedNickname?: string
  ) => {
    const existingSavedCase = savedCases.find(
      (item) => item.receipt === refreshedCase.receiptNumber
    );

    if (!existingSavedCase) {
      return;
    }

    try {
      const nextSavedCases = await upsertSavedCase({
        receipt: refreshedCase.receiptNumber,
        nickname: savedNickname || existingSavedCase.nickname,
        status: getLocalizedCaseText(language, refreshedCase.statusText),
        statusCode: refreshedCase.statusCode,
        updatedAt: refreshedCase.updatedAt,
      });

      setSavedCases(nextSavedCases);
    } catch (error) {
      console.log("[SavedCases] Failed to refresh saved case", error);
    }
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
        await updateSavedCaseAfterRefresh(nextCaseData, options.nicknameOverride);
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

    void (async () => {
      try {
        const nextSavedCases = await upsertSavedCase({
          receipt: caseData.receiptNumber,
          nickname: nickname.trim() || "My Case",
          status: getLocalizedCaseText(language, caseData.statusText),
          statusCode: caseData.statusCode,
          updatedAt: caseData.updatedAt,
        });

        setSavedCases(nextSavedCases);
        setErrorState(null);
        setNickname("");
      } catch (error) {
        console.log("[SavedCases] Failed to save case", error);
        setErrorState({
          type: "unknown",
          message: "Could not save this case on your device.",
        });
      }
    })();
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
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.header, boldText]}>{t(language, appText.appName)}</Text>
        <Text style={[styles.title, boldText]}>{t(language, appText.dashboardTitle)}</Text>
        <Text style={[styles.subtitle, regularText]}>
          Track USCIS progress, save your receipt numbers, and re-check updates in
          one place.
        </Text>

        <View style={styles.languageCard}>
          <Text style={[styles.sectionTitle, semiBoldText]}>
            {t(language, appText.language)}
          </Text>
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
                      mediumText,
                      isSelected && styles.languageButtonTextActive,
                    ]}
                  >
                    {option.flag} {t(language, appText[option.labelKey])}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={[styles.sectionTitle, semiBoldText]}>
            {t(language, appText.searchCase)}
          </Text>

          <View style={styles.inputWrapper}>
            <Text style={styles.inputIcon}>📄</Text>
            <TextInput
              placeholder={t(language, appText.receiptPlaceholder)}
              placeholderTextColor="#7d8ca7"
              value={receipt}
              onChangeText={setReceipt}
              autoCapitalize="characters"
              style={[styles.input, regularText]}
            />
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.inputIcon}>🏷️</Text>
            <TextInput
              placeholder={t(language, appText.nicknamePlaceholder)}
              placeholderTextColor="#7d8ca7"
              value={nickname}
              onChangeText={setNickname}
              style={[styles.input, regularText]}
            />
          </View>

          <TouchableOpacity
            style={[styles.primaryActionButton, loading && styles.buttonDisabled]}
            onPress={checkStatus}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={[styles.primaryActionText, boldText]}>
                {t(language, appText.checkStatus)}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryActionButton} onPress={saveCase}>
            <Text style={[styles.secondaryActionText, boldText]}>
              {t(language, appText.save)}
            </Text>
          </TouchableOpacity>

          {__DEV__ ? (
            <View style={styles.debugBox}>
              <Text style={[styles.debugText, regularText]}>
                Backend URL: {apiConfig.baseUrl}
              </Text>
              <Text style={[styles.debugText, regularText]}>
                API Mode: {apiConfig.mode}
              </Text>
              {apiConfig.mode === "lan" ? (
                <Text style={[styles.debugText, regularText]}>
                  LAN IP: {apiConfig.lanIp}
                </Text>
              ) : null}
            </View>
          ) : null}

          {errorState ? (
            <View style={styles.errorBox}>
              <Text style={[styles.errorTitle, boldText]}>{getErrorTitle()}</Text>
              <Text style={[styles.errorText, regularText]}>{errorState.message}</Text>

              {lastRequestedReceipt ? (
                <TouchableOpacity
                  style={styles.retryButton}
                  onPress={retryLastRequest}
                  disabled={loading}
                >
                  <Text style={[styles.retryButtonText, boldText]}>
                    {t(language, appText.retry)}
                  </Text>
                </TouchableOpacity>
              ) : null}
            </View>
          ) : null}
        </View>

        <View style={[styles.card, styles.statusCard]}>
          <View style={styles.statusTopRow}>
            <View style={styles.statusTextBlock}>
              <Text style={[styles.statusLabel, regularText]}>
                {t(language, appText.currentStatus)}
              </Text>
              <Text style={[styles.statusTitle, boldText]}>{currentStatus}</Text>
            </View>

            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor: statusBadge.backgroundColor,
                  borderColor: statusBadge.borderColor,
                },
              ]}
            >
              <Text
                style={[
                  styles.statusBadgeText,
                  mediumText,
                  { color: statusBadge.textColor },
                ]}
              >
                {caseData ? currentStatus : "Waiting"}
              </Text>
            </View>
          </View>

          <View style={styles.stepRow}>
            <Text style={[styles.stepLabel, mediumText]}>
              {caseData ? `Step ${currentStep} of ${totalSteps}` : `Step 0 of ${totalSteps}`}
            </Text>

            {(caseData || receipt.trim()) && (
              <TouchableOpacity
                style={styles.refreshButton}
                onPress={refreshCurrentCase}
                disabled={loading}
              >
                <Text style={[styles.refreshButtonText, boldText]}>
                  {t(language, appText.refresh)}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {caseData ? (
            <>
              <Text style={[styles.description, regularText]}>{currentDescription}</Text>
              <Text style={[styles.metaText, regularText]}>
                {t(language, appText.receiptLabel)}: {caseData.receiptNumber}
              </Text>
              <Text style={[styles.metaText, regularText]}>
                {t(language, appText.formLabel)}: {caseData.formType}
              </Text>
              <Text style={[styles.metaText, regularText]}>
                {t(language, appText.updatedLabel)}:{" "}
                {new Date(caseData.updatedAt).toLocaleString()}
              </Text>
            </>
          ) : (
            <Text style={[styles.placeholderText, regularText]}>
              {t(language, appText.emptySearchState)}
            </Text>
          )}

          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                { width: `${((stageIndex + 1) / totalSteps) * 100}%` },
              ]}
            />
          </View>

          <View style={styles.timeline}>
            {stages.map((stage, index) => {
              const isCompleted = !!caseData && index < stageIndex;
              const isCurrent = !!caseData && index === stageIndex;

              return (
                <View key={stage.key} style={styles.timelineRow}>
                  <View style={styles.timelineRail}>
                    {index < stages.length - 1 ? (
                      <View
                        style={[
                          styles.timelineLine,
                          (isCompleted || isCurrent) && styles.timelineLineActive,
                        ]}
                      />
                    ) : null}
                    <View
                      style={[
                        styles.timelineDot,
                        isCompleted && styles.timelineDotCompleted,
                        isCurrent && styles.timelineDotCurrent,
                      ]}
                    />
                  </View>

                  <Text
                    style={[
                      styles.timelineText,
                      regularText,
                      isCompleted && styles.timelineTextCompleted,
                      isCurrent && styles.timelineTextCurrent,
                      isCurrent && boldText,
                    ]}
                  >
                    {stage.label}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={[styles.sectionTitle, semiBoldText]}>
            {t(language, appText.helpLegal)}
          </Text>

          <Link href="/privacy" asChild>
            <TouchableOpacity style={styles.infoButton}>
              <Text style={[styles.infoButtonText, boldText]}>
                {t(language, appText.openPrivacyPolicy)}
              </Text>
            </TouchableOpacity>
          </Link>

          <Link href="/support" asChild>
            <TouchableOpacity style={styles.infoButton}>
              <Text style={[styles.infoButtonText, boldText]}>
                {t(language, appText.openSupportScreen)}
              </Text>
            </TouchableOpacity>
          </Link>
        </View>

        <Text style={[styles.versionText, regularText]}>
          CaseTrack USCIS v{appVersion}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#07111f",
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 120,
  },
  header: {
    color: "#6ea8ff",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  title: {
    fontSize: 28,
    color: "#ffffff",
    fontWeight: "700",
    marginTop: 8,
  },
  subtitle: {
    color: "#8ba0bf",
    fontSize: 14,
    lineHeight: 22,
    marginTop: 10,
    marginBottom: 22,
  },
  card: {
    backgroundColor: "#0f1b2d",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#1b304f",
    padding: 20,
    marginBottom: 20,
    shadowColor: "#020817",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.28,
    shadowRadius: 20,
    elevation: 10,
  },
  languageCard: {
    backgroundColor: "#0f1b2d",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#1b304f",
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    color: "#ffffff",
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
    backgroundColor: "#0a1526",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#203553",
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: "center",
  },
  languageButtonActive: {
    backgroundColor: "#15345c",
    borderColor: "#5f9bff",
    shadowColor: "#3b82f6",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.45,
    shadowRadius: 14,
    elevation: 10,
  },
  languageButtonText: {
    color: "#b2c2dc",
    fontSize: 13,
  },
  languageButtonTextActive: {
    color: "#ffffff",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0a1526",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#1e3351",
    paddingHorizontal: 14,
    marginBottom: 12,
  },
  inputIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: "#ffffff",
    fontSize: 14,
    paddingVertical: 17,
  },
  primaryActionButton: {
    backgroundColor: "#2563eb",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 4,
    borderWidth: 1,
    borderColor: "#5f9bff",
    shadowColor: "#2563eb",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 10,
  },
  primaryActionText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "700",
  },
  secondaryActionButton: {
    backgroundColor: "#15803d",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#30b86a",
  },
  secondaryActionText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "700",
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  debugBox: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#1c2a43",
  },
  debugText: {
    color: "#60708f",
    fontSize: 11,
    marginTop: 4,
  },
  errorBox: {
    marginTop: 16,
    backgroundColor: "#32161b",
    borderWidth: 1,
    borderColor: "#7f1d1d",
    borderRadius: 14,
    padding: 14,
  },
  errorTitle: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 6,
  },
  errorText: {
    color: "#fecaca",
    fontSize: 14,
    lineHeight: 21,
  },
  retryButton: {
    alignSelf: "flex-start",
    marginTop: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: "#8f1d1d",
    borderRadius: 10,
  },
  retryButtonText: {
    color: "#ffffff",
    fontWeight: "700",
  },
  statusCard: {
    borderColor: "#294777",
    shadowColor: "#1d4ed8",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.16,
    shadowRadius: 18,
  },
  statusTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
  },
  statusTextBlock: {
    flex: 1,
  },
  statusLabel: {
    color: "#8ba0bf",
    fontSize: 13,
  },
  statusTitle: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "700",
    marginTop: 6,
  },
  statusBadge: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  stepRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 18,
  },
  stepLabel: {
    color: "#9bb0ce",
    fontSize: 13,
  },
  refreshButton: {
    backgroundColor: "#0a1526",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#294777",
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  refreshButtonText: {
    color: "#dce8ff",
    fontSize: 13,
    fontWeight: "700",
  },
  description: {
    color: "#d5e1f4",
    fontSize: 14,
    lineHeight: 22,
    marginTop: 14,
  },
  metaText: {
    color: "#91a3bf",
    fontSize: 13,
    marginTop: 8,
  },
  placeholderText: {
    color: "#91a3bf",
    fontSize: 14,
    lineHeight: 22,
    marginTop: 14,
  },
  progressTrack: {
    height: 14,
    borderRadius: 999,
    backgroundColor: "#102038",
    overflow: "hidden",
    marginTop: 18,
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: "#3b82f6",
  },
  timeline: {
    marginTop: 22,
    gap: 6,
  },
  timelineRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    minHeight: 56,
  },
  timelineRail: {
    width: 28,
    alignItems: "center",
    position: "relative",
  },
  timelineLine: {
    position: "absolute",
    top: 16,
    bottom: -18,
    width: 2,
    backgroundColor: "#24344d",
  },
  timelineLineActive: {
    backgroundColor: "#3b82f6",
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 999,
    marginTop: 2,
    backgroundColor: "#46566f",
    borderWidth: 2,
    borderColor: "#46566f",
  },
  timelineDotCompleted: {
    backgroundColor: "#3b82f6",
    borderColor: "#60a5fa",
  },
  timelineDotCurrent: {
    backgroundColor: "#ffffff",
    borderColor: "#60a5fa",
    shadowColor: "#60a5fa",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 8,
  },
  timelineText: {
    flex: 1,
    color: "#667792",
    fontSize: 14,
    paddingBottom: 14,
  },
  timelineTextCompleted: {
    color: "#77aaff",
  },
  timelineTextCurrent: {
    color: "#ffffff",
    fontWeight: "700",
  },
  infoButton: {
    backgroundColor: "#0a1526",
    borderWidth: 1,
    borderColor: "#1e3351",
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 10,
  },
  infoButtonText: {
    color: "#e2e8f0",
    fontWeight: "700",
  },
  versionText: {
    color: "#60708f",
    fontSize: 12,
    textAlign: "center",
    marginTop: 8,
  },
});
