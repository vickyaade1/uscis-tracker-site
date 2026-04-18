import { useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { appText, getLocalizedCaseText, t } from "../../config/i18n";
import { getFontStyle } from "../../config/typography";
import { useAppLanguage } from "../../context/AppLanguageContext";
import { fetchCaseStatus } from "../../services/caseStatus";
import {
  clearSavedCases,
  loadSavedCases as readSavedCases,
  removeSavedCase,
  type SavedCase,
  upsertSavedCase,
} from "../../services/savedCases";

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

function formatRelativeTime(value: string) {
  if (!value) {
    return "Not available yet";
  }

  const timestamp = new Date(value).getTime();

  if (Number.isNaN(timestamp)) {
    return "Not available yet";
  }

  const diffMs = Date.now() - timestamp;
  const diffMinutes = Math.max(1, Math.floor(diffMs / 60000));

  if (diffMinutes < 60) {
    return `${diffMinutes} minute${diffMinutes === 1 ? "" : "s"} ago`;
  }

  const diffHours = Math.floor(diffMinutes / 60);

  if (diffHours < 24) {
    return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
  }

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
}

export default function CasesScreen() {
  const { language } = useAppLanguage();
  const [savedCases, setSavedCases] = useState<SavedCase[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [activeReceipt, setActiveReceipt] = useState("");
  const regularText = getFontStyle(language, "regular");
  const mediumText = getFontStyle(language, "medium");
  const semiBoldText = getFontStyle(language, "semibold");
  const boldText = getFontStyle(language, "bold");

  const loadCases = useCallback(async () => {
    try {
      const nextSavedCases = await readSavedCases();
      setSavedCases(nextSavedCases);
    } catch (error) {
      console.log("[CasesTab] Failed to load saved cases", error);
    }
  }, []);

  const clearAllCases = async () => {
    try {
      const nextSavedCases = await clearSavedCases();
      setSavedCases(nextSavedCases);
    } catch (error) {
      console.log("[CasesTab] Failed to clear saved cases", error);
    }
  };

  const refreshOneCase = async (savedCase: SavedCase) => {
    try {
      setActiveReceipt(savedCase.receipt);
      const refreshedCase = await fetchCaseStatus(savedCase.receipt);
      const nextSavedCases = await upsertSavedCase({
        receipt: savedCase.receipt,
        nickname: savedCase.nickname,
        status: getLocalizedCaseText(language, refreshedCase.statusText),
        statusCode: refreshedCase.statusCode,
        updatedAt: refreshedCase.updatedAt,
      });

      setSavedCases(nextSavedCases);
    } catch (error) {
      console.log("[CasesTab] Failed to refresh case", error);
    } finally {
      setActiveReceipt("");
    }
  };

  const refreshAllCases = async () => {
    if (savedCases.length === 0) {
      return;
    }

    try {
      setRefreshing(true);
      let nextSavedCases = [...savedCases];

      for (const savedCase of nextSavedCases) {
        const refreshedCase = await fetchCaseStatus(savedCase.receipt);
        nextSavedCases = await upsertSavedCase({
          receipt: savedCase.receipt,
          nickname: savedCase.nickname,
          status: getLocalizedCaseText(language, refreshedCase.statusText),
          statusCode: refreshedCase.statusCode,
          updatedAt: refreshedCase.updatedAt,
        });
      }

      setSavedCases(nextSavedCases);
    } catch (error) {
      console.log("[CasesTab] Failed to refresh all cases", error);
    } finally {
      setRefreshing(false);
    }
  };

  const deleteCase = async (receipt: string) => {
    try {
      const nextSavedCases = await removeSavedCase(receipt);
      setSavedCases(nextSavedCases);
    } catch (error) {
      console.log("[CasesTab] Failed to delete case", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadCases();
    }, [loadCases])
  );

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refreshAllCases}
            tintColor="#8fc0ff"
          />
        }
      >
        <Text style={[styles.eyebrow, boldText]}>{t(language, appText.appName)}</Text>
        <Text style={[styles.title, boldText]}>My Cases</Text>
        <Text style={[styles.subtitle, regularText]}>
          Review the receipt numbers you saved, refresh them from the backend, and
          manage everything in one place.
        </Text>

        <View style={styles.summaryCard}>
          <View>
            <Text style={[styles.summaryLabel, regularText]}>Saved cases</Text>
            <Text style={[styles.summaryValue, boldText]}>{savedCases.length}</Text>
          </View>

          {savedCases.length > 0 ? (
            <TouchableOpacity style={styles.clearButton} onPress={clearAllCases}>
              <Text style={[styles.clearButtonText, mediumText]}>Clear All</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        {savedCases.length === 0 ? (
          <View style={styles.emptyCard}>
            <View style={styles.emptyIconHalo}>
              <Text style={styles.emptyIcon}>📁</Text>
            </View>
            <Text style={[styles.emptyTitle, semiBoldText]}>No saved cases yet</Text>
            <Text style={[styles.emptyText, regularText]}>
              Save a tracked case from the Home tab and it will appear here
              automatically.
            </Text>
          </View>
        ) : null}

        {savedCases.map((item, index) => {
          const badge = getStatusBadgeColors(item.statusCode);
          const isRefreshingCard = activeReceipt === item.receipt;

          return (
            <View key={`${item.receipt}-${index}`} style={styles.caseCard}>
              <TouchableOpacity
                onPress={() => refreshOneCase(item)}
                disabled={isRefreshingCard}
              >
                <View style={styles.badgeRow}>
                  <Text style={[styles.caseTitle, semiBoldText]}>{item.nickname}</Text>
                  <View
                    style={[
                      styles.statusBadge,
                      {
                        backgroundColor: badge.backgroundColor,
                        borderColor: badge.borderColor,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusBadgeText,
                        mediumText,
                        { color: badge.textColor },
                      ]}
                    >
                      {item.status || "Saved"}
                    </Text>
                  </View>
                </View>

                <Text style={[styles.caseReceipt, mediumText]}>{item.receipt}</Text>
                {item.statusCode ? (
                  <Text style={[styles.caseMeta, regularText]}>
                    Status code: {item.statusCode}
                  </Text>
                ) : null}
                <Text style={[styles.caseMeta, regularText]}>
                  Last updated: {formatRelativeTime(item.updatedAt)}
                </Text>
              </TouchableOpacity>

              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={styles.refreshButton}
                  onPress={() => refreshOneCase(item)}
                  disabled={isRefreshingCard}
                >
                  {isRefreshingCard ? (
                    <ActivityIndicator color="#dce8ff" size="small" />
                  ) : (
                    <Text style={[styles.refreshButtonText, mediumText]}>Refresh</Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => deleteCase(item.receipt)}
                >
                  <Text style={[styles.deleteButtonText, mediumText]}>
                    {t(language, appText.delete)}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
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
  eyebrow: {
    color: "#6ea8ff",
    fontSize: 12,
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  title: {
    color: "#ffffff",
    fontSize: 28,
    marginTop: 8,
  },
  subtitle: {
    color: "#8ba0bf",
    fontSize: 14,
    lineHeight: 22,
    marginTop: 10,
    marginBottom: 22,
  },
  summaryCard: {
    backgroundColor: "#0f1b2d",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#1b304f",
    padding: 20,
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  summaryLabel: {
    color: "#8ba0bf",
    fontSize: 14,
  },
  summaryValue: {
    color: "#ffffff",
    fontSize: 30,
    marginTop: 6,
  },
  clearButton: {
    backgroundColor: "#132238",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#294777",
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  clearButtonText: {
    color: "#8fc0ff",
    fontSize: 13,
  },
  emptyCard: {
    backgroundColor: "#0f1b2d",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#1b304f",
    padding: 24,
    alignItems: "center",
    marginBottom: 18,
  },
  emptyIconHalo: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: "#132238",
    borderWidth: 1,
    borderColor: "#294777",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },
  emptyIcon: {
    fontSize: 36,
  },
  emptyTitle: {
    color: "#ffffff",
    fontSize: 18,
  },
  emptyText: {
    color: "#8ba0bf",
    fontSize: 14,
    lineHeight: 22,
    marginTop: 8,
    textAlign: "center",
  },
  caseCard: {
    backgroundColor: "#0f1b2d",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#1b304f",
    padding: 20,
    marginBottom: 14,
  },
  badgeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  caseTitle: {
    flex: 1,
    color: "#ffffff",
    fontSize: 16,
  },
  statusBadge: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  statusBadgeText: {
    fontSize: 12,
  },
  caseReceipt: {
    color: "#dce8ff",
    fontSize: 15,
    marginTop: 14,
  },
  caseMeta: {
    color: "#8ba0bf",
    fontSize: 13,
    marginTop: 8,
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 16,
  },
  refreshButton: {
    backgroundColor: "#132238",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#294777",
    minWidth: 96,
    minHeight: 42,
    paddingHorizontal: 14,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  refreshButtonText: {
    color: "#8fc0ff",
    fontSize: 13,
  },
  deleteButton: {
    backgroundColor: "#32161b",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#7f1d1d",
    minWidth: 88,
    paddingHorizontal: 14,
    paddingVertical: 10,
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#fecaca",
    fontSize: 13,
  },
});
