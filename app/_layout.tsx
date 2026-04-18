import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  NotoSansDevanagari_400Regular,
  NotoSansDevanagari_500Medium,
  NotoSansDevanagari_600SemiBold,
  NotoSansDevanagari_700Bold,
} from "@expo-google-fonts/noto-sans-devanagari";
import { useFonts } from "expo-font";
import { Stack, usePathname, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { AppLanguageProvider } from "../context/AppLanguageContext";

const ONBOARDING_SEEN_KEY = "onboardingSeen";

SplashScreen.preventAutoHideAsync().catch(() => {
  // Ignore repeated calls during fast refresh.
});

export default function RootLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const [fontsLoaded] = useFonts({
    NotoSansDevanagari: NotoSansDevanagari_400Regular,
    NotoSansDevanagariMedium: NotoSansDevanagari_500Medium,
    NotoSansDevanagariSemiBold: NotoSansDevanagari_600SemiBold,
    NotoSansDevanagariBold: NotoSansDevanagari_700Bold,
  });
  const [onboardingChecked, setOnboardingChecked] = useState(false);
  const [shouldShowOnboarding, setShouldShowOnboarding] = useState(false);

  useEffect(() => {
    const loadOnboardingState = async () => {
      try {
        const seenOnboarding = await AsyncStorage.getItem(ONBOARDING_SEEN_KEY);
        setShouldShowOnboarding(seenOnboarding !== "true");
      } catch (error) {
        console.log("[RootLayout] Failed to read onboarding state", error);
        setShouldShowOnboarding(true);
      } finally {
        setOnboardingChecked(true);
      }
    };

    loadOnboardingState();
  }, []);

  useEffect(() => {
    if (!fontsLoaded || !onboardingChecked) {
      return;
    }

    SplashScreen.hideAsync().catch(() => {
      // Ignore splash hide errors during refresh.
    });
  }, [fontsLoaded, onboardingChecked]);

  useEffect(() => {
    if (!fontsLoaded || !onboardingChecked) {
      return;
    }

    if (shouldShowOnboarding && pathname !== "/onboarding") {
      router.replace("/onboarding");
      return;
    }

    if (!shouldShowOnboarding && pathname === "/onboarding") {
      router.replace("/(tabs)");
    }
  }, [fontsLoaded, onboardingChecked, pathname, router, shouldShowOnboarding]);

  if (!fontsLoaded || !onboardingChecked) {
    return null;
  }

  return (
    <AppLanguageProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="privacy" />
        <Stack.Screen name="support" />
        <Stack.Screen name="modal" options={{ presentation: "modal" }} />
      </Stack>
    </AppLanguageProvider>
  );
}
