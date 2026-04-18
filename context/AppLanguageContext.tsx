import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { DEFAULT_LANGUAGE, type AppLanguage } from "../config/i18n";

const LANGUAGE_STORAGE_KEY = "appLanguage";

type AppLanguageContextValue = {
  language: AppLanguage;
  setLanguage: (nextLanguage: AppLanguage) => Promise<void>;
};

const AppLanguageContext = createContext<AppLanguageContextValue | null>(null);

export function AppLanguageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [language, setLanguageState] = useState<AppLanguage>(DEFAULT_LANGUAGE);

  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const storedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);

        if (
          storedLanguage === "en" ||
          storedLanguage === "es" ||
          storedLanguage === "hi"
        ) {
          setLanguageState(storedLanguage);
        }
      } catch (error) {
        console.log("[Language] Failed to load language", error);
      }
    };

    loadLanguage();
  }, []);

  const setLanguage = async (nextLanguage: AppLanguage) => {
    setLanguageState(nextLanguage);

    try {
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, nextLanguage);
    } catch (error) {
      console.log("[Language] Failed to save language", error);
    }
  };

  const value = useMemo(
    () => ({
      language,
      setLanguage,
    }),
    [language]
  );

  return (
    <AppLanguageContext.Provider value={value}>
      {children}
    </AppLanguageContext.Provider>
  );
}

export function useAppLanguage() {
  const context = useContext(AppLanguageContext);

  if (!context) {
    throw new Error("useAppLanguage must be used inside AppLanguageProvider.");
  }

  return context;
}
