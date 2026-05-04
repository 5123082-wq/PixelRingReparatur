import { SITE_CONFIG } from '@/lib/site-config';

export type LegalPageKey = 'impressum' | 'privacy';

type LegalContent = {
  title: string;
  description: string;
};

const company = SITE_CONFIG.company;
const address = `${company.address.street}\n${company.address.city}\n${company.address.country}`;

export const LEGAL_NOTICE_BY_LOCALE: Record<string, string> = {
  de: 'Dieses Dokument ist rechtlich bindend in seiner deutschen Fassung.',
  en: 'This document is legally binding in its German version. The original German text is shown below.',
  ru: 'Этот документ имеет юридическую силу только в немецкой версии. Ниже показан оригинальный немецкий текст.',
  tr: 'Bu belge yalnizca Almanca surumunde hukuken baglayicidir. Asagida orijinal Almanca metin gosterilmektedir.',
  pl: 'Ten dokument jest prawnie wiazacy wylacznie w wersji niemieckiej. Ponizej pokazano oryginalny tekst niemiecki.',
  ar: 'هذا المستند ملزم قانونيا فقط بنسخته الالمانية. يعرض ادناه النص الالماني الاصلي.',
};

export const CODE_OWNED_LEGAL_CONTENT: Record<LegalPageKey, LegalContent> = {
  impressum: {
    title: 'Impressum',
    description: `Angaben gemäß § 5 DDG

Anbieter
${company.legalName}
${address}

Kontakt
E-Mail: ${company.email}

Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV
${company.legalName}
${address}

Online-Streitbeilegung
Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung bereit:
https://ec.europa.eu/consumers/odr

Hinweis nach § 36 VSBG
Wir sind nicht verpflichtet und nicht bereit, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.

Haftung für Inhalte
Die Inhalte dieser Website wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte übernehmen wir jedoch keine Gewähr.

Haftung für Links
Diese Website kann Links zu externen Websites Dritter enthalten, auf deren Inhalte wir keinen Einfluss haben. Für diese fremden Inhalte übernehmen wir keine Gewähr.`,
  },
  privacy: {
    title: 'Datenschutzerklärung',
    description: `1. Allgemeine Hinweise
Der Schutz personenbezogener Daten ist uns wichtig. Wir verarbeiten personenbezogene Daten vertraulich und entsprechend den geltenden Datenschutzvorschriften, insbesondere der Datenschutz-Grundverordnung (DSGVO) und dem Bundesdatenschutzgesetz (BDSG).

2. Verantwortlicher
${company.legalName}
${address}
E-Mail: ${company.email}

3. Zwecke und Rechtsgrundlagen der Verarbeitung
Wir verarbeiten personenbezogene Daten zur Bearbeitung von Anfragen, zur Kommunikation mit Interessenten und Kunden, zur Bereitstellung und technischen Sicherheit dieser Website sowie zur Erfüllung gesetzlicher Pflichten.

Rechtsgrundlagen können je nach Fall Art. 6 Abs. 1 lit. a, b, c oder f DSGVO sein.

4. Server-Logfiles
Beim Besuch dieser Website können technisch erforderliche Verbindungsdaten verarbeitet werden, zum Beispiel IP-Adresse, Datum und Uhrzeit, aufgerufene URL, Referrer, Browserinformationen und User-Agent. Die Verarbeitung erfolgt zur Gewährleistung von Stabilität und Sicherheit.

5. Cookies und ähnliche Technologien
Wir verwenden technisch erforderliche Cookies, die für den Betrieb der Website notwendig sind, zum Beispiel Sicherheits-, Sitzungs- oder Sprachfunktionen. Soweit Cookies oder vergleichbare Technologien technisch nicht erforderlich sind, werden sie nur nach vorheriger Einwilligung verwendet.

6. Kontaktanfragen und Service-Anfragen
Wenn Sie uns kontaktieren oder eine Anfrage senden, verarbeiten wir die von Ihnen übermittelten Angaben zur Bearbeitung der Anfrage und für Anschlussfragen. Dazu können Name, Kontaktdaten, Standortangaben, Nachrichteninhalte und übermittelte Dateien gehören.

7. Empfänger und Auftragsverarbeitung
Wir können technische Dienstleister einsetzen, zum Beispiel für Hosting, Infrastruktur, Kommunikation oder Support. Diese verarbeiten Daten nur auf Grundlage geeigneter vertraglicher und datenschutzrechtlicher Vereinbarungen.

8. Speicherdauer
Wir speichern personenbezogene Daten nur so lange, wie es für die jeweiligen Zwecke erforderlich ist oder gesetzliche Aufbewahrungspflichten bestehen.

9. Ihre Rechte
Sie haben nach DSGVO insbesondere das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit sowie Widerspruch gegen bestimmte Verarbeitungen. Eine erteilte Einwilligung können Sie jederzeit mit Wirkung für die Zukunft widerrufen.

10. Beschwerderecht
Sie haben das Recht, sich bei einer Datenschutzaufsichtsbehörde zu beschweren.

11. Datensicherheit
Diese Website nutzt technische und organisatorische Maßnahmen zum Schutz Ihrer Daten sowie eine verschlüsselte Übertragung per TLS/SSL.

12. Stand und Aktualisierung
Wir behalten uns vor, diese Datenschutzerklärung zu aktualisieren, wenn technische, rechtliche oder organisatorische Änderungen dies erforderlich machen.`,
  },
};

export function containsStaleLegalContent(value: string): boolean {
  return /\bTMG\b|NVKV|Ivan Novikov|Dannenwalder Weg 110 13439 Berlin|info@nvkv\.de|DE367887602/i.test(value);
}
