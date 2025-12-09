export const translations = {
  fr: {
    nav: {
      timeline: "timeline",
      events: "événements",
      video: "vidéo teaser",
      magazine: "magazine",
      contact: "contact",
    },
    timeline: {
      20: "Skis hickory, remontée bricolée, profs improvisés : deux ambitieux fondent deux écoles de ski.",
      40: "Dans les années 50, les ESS du Haut-Plateau profitent du boom du ski, d’un domaine en essor et de la modernisation.",
      60: "Après un demi-siècle d’enseigne ment, nos écoles de ski arrivent au sommet d’un premier âge d’or.",
      80: "Au début des années 90, le snowboard procure des sensations de glisse incomparables à celles du ski.",
      100: "En 2016, les deux Ecoles décident d’unir leurs forces pour le bien des clients et pour se professionnaliser.",
    },
    contact:{
      nom: "Nom",
      email: "Email",
      message: "Message",
      envoyer: "Envoyer",
      complete: "Nom Complet",
      adresse: "Adresse Email",
      votre: "Votre message",
      suivez: "Suivez-nous"
    }
  },
  en: {
    nav: {
      timeline: "timeline",
      events: "events",
      video: "teaser video",
      magazine: "magazine",
      contact: "contact",
    },
    timeline: {
      20: "Hickory skis, a makeshift ski lift, improvised instructors: two ambitious men found two ski schools.",
      40: "In the 1950s, the social and solidarity economy (ESS) of the High Plateau benefited from the ski boom, a growing ski area and modernization.",
      60: "After half a century of teaching, our ski schools are reaching the peak of their first golden age.",
      80: "In the early 1990s, snowboarding provided gliding sensations incomparable to those of skiing.",
      100: "In 2016, the two schools decided to join forces for the benefit of clients and to become more professional.",
    },
     contact:{
      nom: "Name",
      email: "Email",
      message: "Message",
      envoyer: "Send",
       complete: "Full name",
      adresse: "Email address",
      votre: "Your message",
      suivez: "Follow us"
    }
  },
} as const;

export type Locale = keyof typeof translations;

export function getTranslation(locale: Locale, key: string): string {
  const keys = key.split(".");
  let value: any = translations[locale];

  for (const k of keys) {
    value = value?.[k];
  }

  return value || key;
}
