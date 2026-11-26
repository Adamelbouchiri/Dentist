import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import en from "./locales/en";
import fr from "./locales/fr";
import ar from "./locales/ar";

export const languages = [
  { code: "en", label: "English", short: "EN", dir: "ltr" },
  { code: "fr", label: "Français", short: "FR", dir: "ltr" },
  { code: "ar", label: "العربية", short: "ع", dir: "rtl" },
];

const applyDirection = (lng) => {
  const lang = languages.find((l) => lng?.startsWith(l.code)) ?? languages[0];
  document.documentElement.lang = lang.code;
  document.documentElement.dir = lang.dir;
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: { en: { translation: en }, fr: { translation: fr }, ar: { translation: ar } },
    fallbackLng: "en",
    supportedLngs: languages.map((l) => l.code),
    nonExplicitSupportedLngs: true,
    interpolation: { escapeValue: false },
    detection: { order: ["localStorage", "navigator"], caches: ["localStorage"], lookupLocalStorage: "lang" },
    returnNull: false,
  });

applyDirection(i18n.resolvedLanguage);
i18n.on("languageChanged", applyDirection);

export default i18n;
