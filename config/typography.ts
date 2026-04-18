import type { AppLanguage } from "./i18n";

type HindiFontVariant = "regular" | "medium" | "semibold" | "bold";

function getHindiFontFamily(variant: HindiFontVariant) {
  if (variant === "medium") {
    return "NotoSansDevanagariMedium";
  }

  if (variant === "semibold") {
    return "NotoSansDevanagariSemiBold";
  }

  if (variant === "bold") {
    return "NotoSansDevanagariBold";
  }

  return "NotoSansDevanagari";
}

export function getFontStyle(
  language: AppLanguage,
  variant: HindiFontVariant = "regular"
) {
  if (language !== "hi") {
    return {};
  }

  return {
    fontFamily: getHindiFontFamily(variant),
  };
}
