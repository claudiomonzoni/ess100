export const translations = {
  fr: {
    nav: {
      histoire: "histoire",
      events: "événements",
      video: "vidéo teaser",
      magazine: "magazine",
      contact: "contact"
    }
  },
  en: {
    nav: {
      histoire: "history",
      events: "events",
      video: "teaser video",
      magazine: "magazine",
      contact: "contact"
    }
  }
} as const;

export type Locale = keyof typeof translations;

export function getTranslation(locale: Locale, key: string): string {
  const keys = key.split('.');
  let value: any = translations[locale];
  
  for (const k of keys) {
    value = value?.[k];
  }
  
  return value || key;
}
