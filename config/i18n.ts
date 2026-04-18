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
    hi: "भाषा",
  },
  english: {
    en: "English",
    es: "Ingles",
    hi: "अंग्रेजी",
  },
  spanish: {
    en: "Spanish",
    es: "Espanol",
    hi: "स्पेनिश",
  },
  hindi: {
    en: "Hindi",
    es: "Hindi",
    hi: "हिंदी",
  },
  appName: {
    en: "USCIS TRACKER",
    es: "RASTREADOR USCIS",
    hi: "यूएससीआईएस ट्रैकर",
  },
  dashboardTitle: {
    en: "Case Dashboard",
    es: "Panel del Caso",
    hi: "केस डैशबोर्ड",
  },
  searchCase: {
    en: "Search your case",
    es: "Buscar su caso",
    hi: "अपना केस खोजें",
  },
  receiptPlaceholder: {
    en: "Receipt Number",
    es: "Numero de recibo",
    hi: "रसीद संख्या",
  },
  nicknamePlaceholder: {
    en: "Nickname (optional)",
    es: "Apodo (opcional)",
    hi: "निकनेम (वैकल्पिक)",
  },
  checkStatus: {
    en: "Check Status",
    es: "Ver estado",
    hi: "स्थिति जांचें",
  },
  save: {
    en: "Save",
    es: "Guardar",
    hi: "सेव करें",
  },
  retry: {
    en: "Retry",
    es: "Reintentar",
    hi: "फिर से प्रयास करें",
  },
  refresh: {
    en: "Refresh",
    es: "Actualizar",
    hi: "रिफ्रेश करें",
  },
  currentStatus: {
    en: "Current Status",
    es: "Estado actual",
    hi: "वर्तमान स्थिति",
  },
  emptyStatus: {
    en: "-",
    es: "-",
    hi: "-",
  },
  emptySearchState: {
    en: "Search for a receipt number to see the latest case status.",
    es: "Busque un numero de recibo para ver el estado mas reciente del caso.",
    hi: "नवीनतम केस स्थिति देखने के लिए रसीद संख्या खोजें।",
  },
  savedCases: {
    en: "Saved Cases",
    es: "Casos guardados",
    hi: "सेव किए गए केस",
  },
  noSavedCases: {
    en: "No saved cases yet. Check a case, then tap Save.",
    es: "Todavia no hay casos guardados. Consulte un caso y luego toque Guardar.",
    hi: "अभी तक कोई सेव किया गया केस नहीं है। पहले केस जांचें, फिर सेव करें।",
  },
  tapSavedCaseHint: {
    en: "Tap a saved case to check its latest status.",
    es: "Toque un caso guardado para consultar su estado mas reciente.",
    hi: "नवीनतम स्थिति देखने के लिए सेव किए गए केस पर टैप करें।",
  },
  delete: {
    en: "Delete",
    es: "Eliminar",
    hi: "हटाएं",
  },
  receiptLabel: {
    en: "Receipt",
    es: "Recibo",
    hi: "रसीद",
  },
  formLabel: {
    en: "Form",
    es: "Formulario",
    hi: "फॉर्म",
  },
  updatedLabel: {
    en: "Updated",
    es: "Actualizado",
    hi: "अपडेट किया गया",
  },
  stageCaseReceived: {
    en: "Case Received",
    es: "Caso recibido",
    hi: "केस प्राप्त हुआ",
  },
  stageBiometricsScheduled: {
    en: "Biometrics Scheduled",
    es: "Biometria programada",
    hi: "बायोमेट्रिक्स निर्धारित",
  },
  stageBiometricsCompleted: {
    en: "Biometrics Completed",
    es: "Biometria completada",
    hi: "बायोमेट्रिक्स पूरा हुआ",
  },
  stageActivelyReviewing: {
    en: "Case Actively Reviewing",
    es: "Caso en revision activa",
    hi: "केस सक्रिय समीक्षा में है",
  },
  stageDecision: {
    en: "Decision",
    es: "Decision",
    hi: "निर्णय",
  },
  saveCaseFirstError: {
    en: "Check a case first before saving it.",
    es: "Primero consulte un caso antes de guardarlo.",
    hi: "सेव करने से पहले पहले केस जांचें।",
  },
  duplicateCaseError: {
    en: "This receipt number is already saved.",
    es: "Este numero de recibo ya esta guardado.",
    hi: "यह रसीद संख्या पहले से सेव है।",
  },
  receiptRequiredError: {
    en: "Please enter a receipt number.",
    es: "Ingrese un numero de recibo.",
    hi: "कृपया रसीद संख्या दर्ज करें।",
  },
  receiptFormatError: {
    en: "Receipt number must look like ABC1234567890.",
    es: "El numero de recibo debe verse como ABC1234567890.",
    hi: "रसीद संख्या ABC1234567890 जैसी होनी चाहिए।",
  },
  validationErrorTitle: {
    en: "Please check your receipt number.",
    es: "Revise su numero de recibo.",
    hi: "कृपया अपनी रसीद संख्या जांचें।",
  },
  backendErrorTitle: {
    en: "The server could not complete that request.",
    es: "El servidor no pudo completar esa solicitud.",
    hi: "सर्वर यह अनुरोध पूरा नहीं कर सका।",
  },
  networkErrorTitle: {
    en: "Could not reach the backend server.",
    es: "No se pudo conectar con el servidor.",
    hi: "बैकएंड सर्वर तक पहुंचा नहीं जा सका।",
  },
  timeoutErrorTitle: {
    en: "The request timed out.",
    es: "La solicitud excedio el tiempo de espera.",
    hi: "अनुरोध का समय समाप्त हो गया।",
  },
  unknownErrorTitle: {
    en: "Something unexpected happened.",
    es: "Ocurrio algo inesperado.",
    hi: "कुछ अप्रत्याशित हुआ।",
  },
  networkErrorHelp: {
    en: "Make sure the backend is running and your phone and computer are on the same Wi-Fi.",
    es: "Asegurese de que el backend este ejecutandose y que su telefono y computadora esten en la misma red Wi-Fi.",
    hi: "सुनिश्चित करें कि बैकएंड चल रहा है और आपका फोन व कंप्यूटर एक ही वाई-फाई पर हैं।",
  },
  refreshCurrentCaseHint: {
    en: "Refresh the currently selected case.",
    es: "Actualice el caso seleccionado actualmente.",
    hi: "वर्तमान चयनित केस को रिफ्रेश करें।",
  },
  helpLegal: {
    en: "Help & Legal",
    es: "Ayuda y legal",
    hi: "मदद और कानूनी जानकारी",
  },
  privacyPolicy: {
    en: "Privacy Policy",
    es: "Politica de privacidad",
    hi: "गोपनीयता नीति",
  },
  supportContact: {
    en: "Support & Contact",
    es: "Soporte y contacto",
    hi: "सहायता और संपर्क",
  },
  openPrivacyPolicy: {
    en: "Open Privacy Policy",
    es: "Abrir politica de privacidad",
    hi: "गोपनीयता नीति खोलें",
  },
  openSupportScreen: {
    en: "Open Support Screen",
    es: "Abrir pantalla de soporte",
    hi: "सहायता स्क्रीन खोलें",
  },
  privacyIntro: {
    en: "This app helps users check USCIS case updates. Receipt numbers may be stored on your device if you save cases.",
    es: "Esta aplicacion ayuda a los usuarios a revisar actualizaciones de casos USCIS. Los numeros de recibo pueden guardarse en su dispositivo si guarda casos.",
    hi: "यह ऐप उपयोगकर्ताओं को यूएससीआईएस केस अपडेट जांचने में मदद करता है। यदि आप केस सेव करते हैं, तो रसीद संख्या आपके डिवाइस पर संग्रहीत की जा सकती है।",
  },
  privacyReceiptNumbers: {
    en: "Receipt numbers and nicknames are only used to look up case status and support saved-case features.",
    es: "Los numeros de recibo y apodos solo se usan para consultar el estado del caso y guardar casos.",
    hi: "रसीद संख्या और निकनेम केवल केस स्थिति देखने और सेव किए गए केस फीचर के लिए उपयोग किए जाते हैं।",
  },
  privacyAnalytics: {
    en: "If analytics, diagnostics, or crash reporting tools are added later, they may collect device and error information to improve reliability.",
    es: "Si mas adelante se agregan herramientas de analitica, diagnostico o reportes de fallos, estas pueden recopilar informacion del dispositivo y errores para mejorar la confiabilidad.",
    hi: "यदि बाद में एनालिटिक्स, डायग्नोस्टिक्स या क्रैश रिपोर्टिंग टूल जोड़े जाते हैं, तो वे विश्वसनीयता सुधारने के लिए डिवाइस और त्रुटि जानकारी एकत्र कर सकते हैं।",
  },
  privacyLegalAdvice: {
    en: "This app is for informational purposes only and does not provide legal advice, legal representation, or official USCIS decisions.",
    es: "Esta aplicacion es solo para fines informativos y no proporciona asesoria legal, representacion legal ni decisiones oficiales de USCIS.",
    hi: "यह ऐप केवल जानकारी के उद्देश्य से है और कानूनी सलाह, कानूनी प्रतिनिधित्व या आधिकारिक यूएससीआईएस निर्णय प्रदान नहीं करता।",
  },
  privacyEditLater: {
    en: "Replace this placeholder policy with your final privacy policy before publishing to Google Play.",
    es: "Reemplace esta politica provisional por su politica final antes de publicar en Google Play.",
    hi: "Google Play पर प्रकाशित करने से पहले इस अस्थायी नीति को अपनी अंतिम गोपनीयता नीति से बदलें।",
  },
  supportIntro: {
    en: "Use this screen to help users contact you, report issues, or ask basic app questions.",
    es: "Use esta pantalla para que los usuarios puedan contactarlo, reportar problemas o hacer preguntas basicas sobre la aplicacion.",
    hi: "इस स्क्रीन का उपयोग करें ताकि उपयोगकर्ता आपसे संपर्क कर सकें, समस्याओं की रिपोर्ट कर सकें या ऐप से जुड़े प्रश्न पूछ सकें।",
  },
  supportEmailLabel: {
    en: "Support Email",
    es: "Correo de soporte",
    hi: "सहायता ईमेल",
  },
  supportEmailValue: {
    en: "[email protected]",
    es: "[email protected]",
    hi: "[email protected]",
  },
  supportResponseTime: {
    en: "Typical response time: 2-3 business days.",
    es: "Tiempo de respuesta habitual: 2-3 dias habiles.",
    hi: "सामान्य उत्तर समय: 2-3 कार्यदिवस।",
  },
  supportWhatToInclude: {
    en: "When contacting support, include your app version, device type, and a short description of the issue.",
    es: "Cuando contacte al soporte, incluya la version de la app, el tipo de dispositivo y una breve descripcion del problema.",
    hi: "सहायता से संपर्क करते समय ऐप संस्करण, डिवाइस प्रकार और समस्या का छोटा विवरण शामिल करें।",
  },
  supportNotEmergency: {
    en: "Support cannot provide legal advice or speed up USCIS processing.",
    es: "El soporte no puede proporcionar asesoria legal ni acelerar el procesamiento de USCIS.",
    hi: "सहायता कानूनी सलाह नहीं दे सकती और यूएससीआईएस प्रक्रिया को तेज नहीं कर सकती।",
  },
  backToHome: {
    en: "Back to Home",
    es: "Volver al inicio",
    hi: "होम पर वापस जाएं",
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
