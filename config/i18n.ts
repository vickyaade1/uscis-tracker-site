export type AppLanguage = "en" | "es" | "hi";

type TranslationSet = {
  en: string;
  es: string;
  hi: string;
};

export const DEFAULT_LANGUAGE: AppLanguage = "en";

export const appText = {
  language: {
    en: "Language",
    es: "Idioma",
    hi: "Bhasha",
  },
  english: {
    en: "English",
    es: "Ingles",
    hi: "Angrezi",
  },
  spanish: {
    en: "Spanish",
    es: "Espanol",
    hi: "Spanish",
  },
  hindi: {
    en: "Hindi",
    es: "Hindi",
    hi: "Hindi",
  },
  appName: {
    en: "USCIS TRACKER",
    es: "RASTREADOR USCIS",
    hi: "USCIS TRACKER",
  },
  dashboardTitle: {
    en: "Case Dashboard",
    es: "Panel del Caso",
    hi: "Case Dashboard",
  },
  searchCase: {
    en: "Search your case",
    es: "Buscar su caso",
    hi: "Search your case",
  },
  receiptPlaceholder: {
    en: "Receipt Number",
    es: "Numero de recibo",
    hi: "Receipt Number",
  },
  nicknamePlaceholder: {
    en: "Nickname (optional)",
    es: "Apodo (opcional)",
    hi: "Nickname (optional)",
  },
  checkStatus: {
    en: "Check Status",
    es: "Ver estado",
    hi: "Check Status",
  },
  save: {
    en: "Save",
    es: "Guardar",
    hi: "Save",
  },
  retry: {
    en: "Retry",
    es: "Reintentar",
    hi: "Retry",
  },
  refresh: {
    en: "Refresh",
    es: "Actualizar",
    hi: "Refresh",
  },
  currentStatus: {
    en: "Current Status",
    es: "Estado actual",
    hi: "Current Status",
  },
  emptyStatus: {
    en: "-",
    es: "-",
    hi: "-",
  },
  emptySearchState: {
    en: "Search for a receipt number to see the latest case status.",
    es: "Busque un numero de recibo para ver el estado mas reciente del caso.",
    hi: "Search for a receipt number to see the latest case status.",
  },
  savedCases: {
    en: "Saved Cases",
    es: "Casos guardados",
    hi: "Saved Cases",
  },
  noSavedCases: {
    en: "No saved cases yet. Check a case, then tap Save.",
    es: "Todavia no hay casos guardados. Consulte un caso y luego toque Guardar.",
    hi: "No saved cases yet. Check a case, then tap Save.",
  },
  tapSavedCaseHint: {
    en: "Tap a saved case to check its latest status.",
    es: "Toque un caso guardado para consultar su estado mas reciente.",
    hi: "Tap a saved case to check its latest status.",
  },
  delete: {
    en: "Delete",
    es: "Eliminar",
    hi: "Delete",
  },
  receiptLabel: {
    en: "Receipt",
    es: "Recibo",
    hi: "Receipt",
  },
  formLabel: {
    en: "Form",
    es: "Formulario",
    hi: "Form",
  },
  updatedLabel: {
    en: "Updated",
    es: "Actualizado",
    hi: "Updated",
  },
  stageCaseReceived: {
    en: "Case Received",
    es: "Caso recibido",
    hi: "Case Received",
  },
  stageBiometricsScheduled: {
    en: "Biometrics Scheduled",
    es: "Biometria programada",
    hi: "Biometrics Scheduled",
  },
  stageBiometricsCompleted: {
    en: "Biometrics Completed",
    es: "Biometria completada",
    hi: "Biometrics Completed",
  },
  stageActivelyReviewing: {
    en: "Case Actively Reviewing",
    es: "Caso en revision activa",
    hi: "Case Actively Reviewing",
  },
  stageDecision: {
    en: "Decision",
    es: "Decision",
    hi: "Decision",
  },
  saveCaseFirstError: {
    en: "Check a case first before saving it.",
    es: "Primero consulte un caso antes de guardarlo.",
    hi: "Check a case first before saving it.",
  },
  duplicateCaseError: {
    en: "This receipt number is already saved.",
    es: "Este numero de recibo ya esta guardado.",
    hi: "This receipt number is already saved.",
  },
  receiptRequiredError: {
    en: "Please enter a receipt number.",
    es: "Ingrese un numero de recibo.",
    hi: "Please enter a receipt number.",
  },
  receiptFormatError: {
    en: "Receipt number must look like ABC1234567890.",
    es: "El numero de recibo debe verse como ABC1234567890.",
    hi: "Receipt number must look like ABC1234567890.",
  },
  validationErrorTitle: {
    en: "Please check your receipt number.",
    es: "Revise su numero de recibo.",
    hi: "Please check your receipt number.",
  },
  backendErrorTitle: {
    en: "The server could not complete that request.",
    es: "El servidor no pudo completar esa solicitud.",
    hi: "The server could not complete that request.",
  },
  networkErrorTitle: {
    en: "Could not reach the backend server.",
    es: "No se pudo conectar con el servidor.",
    hi: "Could not reach the backend server.",
  },
  timeoutErrorTitle: {
    en: "The request timed out.",
    es: "La solicitud excedio el tiempo de espera.",
    hi: "The request timed out.",
  },
  unknownErrorTitle: {
    en: "Something unexpected happened.",
    es: "Ocurrio algo inesperado.",
    hi: "Something unexpected happened.",
  },
  networkErrorHelp: {
    en: "Make sure the backend is running and your phone and computer are on the same Wi-Fi.",
    es: "Asegurese de que el backend este ejecutandose y que su telefono y computadora esten en la misma red Wi-Fi.",
    hi: "Make sure the backend is running and your phone and computer are on the same Wi-Fi.",
  },
  refreshCurrentCaseHint: {
    en: "Refresh the currently selected case.",
    es: "Actualice el caso seleccionado actualmente.",
    hi: "Refresh the currently selected case.",
  },
  helpLegal: {
    en: "Help & Legal",
    es: "Ayuda y legal",
    hi: "Help & Legal",
  },
  privacyPolicy: {
    en: "Privacy Policy",
    es: "Politica de privacidad",
    hi: "Privacy Policy",
  },
  supportContact: {
    en: "Support & Contact",
    es: "Soporte y contacto",
    hi: "Support & Contact",
  },
  openPrivacyPolicy: {
    en: "Open Privacy Policy",
    es: "Abrir politica de privacidad",
    hi: "Open Privacy Policy",
  },
  openSupportScreen: {
    en: "Open Support Screen",
    es: "Abrir pantalla de soporte",
    hi: "Open Support Screen",
  },
  privacyIntro: {
    en: "This app helps users check USCIS case updates. Receipt numbers may be stored on your device if you save cases.",
    es: "Esta aplicacion ayuda a los usuarios a revisar actualizaciones de casos USCIS. Los numeros de recibo pueden guardarse en su dispositivo si guarda casos.",
    hi: "This app helps users check USCIS case updates. Receipt numbers may be stored on your device if you save cases.",
  },
  privacyReceiptNumbers: {
    en: "Receipt numbers and nicknames are only used to look up case status and support saved-case features.",
    es: "Los numeros de recibo y apodos solo se usan para consultar el estado del caso y guardar casos.",
    hi: "Receipt numbers and nicknames are only used to look up case status and support saved-case features.",
  },
  privacyAnalytics: {
    en: "If analytics, diagnostics, or crash reporting tools are added later, they may collect device and error information to improve reliability.",
    es: "Si mas adelante se agregan herramientas de analitica, diagnostico o reportes de fallos, estas pueden recopilar informacion del dispositivo y errores para mejorar la confiabilidad.",
    hi: "If analytics, diagnostics, or crash reporting tools are added later, they may collect device and error information to improve reliability.",
  },
  privacyLegalAdvice: {
    en: "This app is for informational purposes only and does not provide legal advice, legal representation, or official USCIS decisions.",
    es: "Esta aplicacion es solo para fines informativos y no proporciona asesoria legal, representacion legal ni decisiones oficiales de USCIS.",
    hi: "This app is for informational purposes only and does not provide legal advice, legal representation, or official USCIS decisions.",
  },
  privacyEditLater: {
    en: "Replace this placeholder policy with your final privacy policy before publishing to Google Play.",
    es: "Reemplace esta politica provisional por su politica final antes de publicar en Google Play.",
    hi: "Replace this placeholder policy with your final privacy policy before publishing to Google Play.",
  },
  supportIntro: {
    en: "Use this screen to help users contact you, report issues, or ask basic app questions.",
    es: "Use esta pantalla para que los usuarios puedan contactarlo, reportar problemas o hacer preguntas basicas sobre la aplicacion.",
    hi: "Use this screen to help users contact you, report issues, or ask basic app questions.",
  },
  supportEmailLabel: {
    en: "Support Email",
    es: "Correo de soporte",
    hi: "Support Email",
  },
  supportEmailValue: {
    en: "[email protected]",
    es: "[email protected]",
    hi: "[email protected]",
  },
  supportResponseTime: {
    en: "Typical response time: 2-3 business days.",
    es: "Tiempo de respuesta habitual: 2-3 dias habiles.",
    hi: "Typical response time: 2-3 business days.",
  },
  supportWhatToInclude: {
    en: "When contacting support, include your app version, device type, and a short description of the issue.",
    es: "Cuando contacte al soporte, incluya la version de la app, el tipo de dispositivo y una breve descripcion del problema.",
    hi: "When contacting support, include your app version, device type, and a short description of the issue.",
  },
  supportNotEmergency: {
    en: "Support cannot provide legal advice or speed up USCIS processing.",
    es: "El soporte no puede proporcionar asesoria legal ni acelerar el procesamiento de USCIS.",
    hi: "Support cannot provide legal advice or speed up USCIS processing.",
  },
  backToHome: {
    en: "Back to Home",
    es: "Volver al inicio",
    hi: "Back to Home",
  },
} satisfies Record<string, TranslationSet>;

export function t(
  language: AppLanguage,
  value: TranslationSet | undefined,
  fallback = ""
) {
  if (!value) {
    return fallback;
  }

  return value[language] || value.en || fallback;
}

export function getLocalizedCaseText(
  language: AppLanguage,
  value?: Partial<TranslationSet>
) {
  if (!value) {
    return "";
  }

  return value[language] || value.en || "";
}
