'use client';

import React, { useState, useEffect } from 'react';
import LeistungenRequestButton from '@/components/leistungen/LeistungenRequestButton';
import Image from 'next/image';

const LogoRingDot = ({ className = 'w-3 h-3' }: { className?: string }) => (
  <span className={`${className} inline-flex items-center justify-center shrink-0`}>
    <svg className="w-full h-full" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="38" stroke="currentColor" strokeWidth="12" />
      <circle cx="50" cy="50" r="14" fill="currentColor" />
    </svg>
  </span>
);

type Locale = 'de' | 'en' | 'ru' | 'tr' | 'pl' | 'ar';

type SectorKey = 'restaurants' | 'retail' | 'salons' | 'dealers' | 'clinics' | 'hotels' | 'offices';

const SECTOR_KEYS: SectorKey[] = ['restaurants', 'retail', 'salons', 'dealers', 'clinics', 'hotels', 'offices'];

interface HotspotData {
  id: string;
  label: string;
  dot: { x: number; y: number };
  pill: { x: number; y: number };
  description: string;
}

interface SectorData {
  id: SectorKey;
  title: string;
  tag: string;
  description: string;
  assetsTitle: string;
  assets: string[];
  problemsTitle: string;
  problems: string[];
  solutionTitle: string;
  solution: string;
  ctaText: string;
  hotspots?: HotspotData[];
}

const SECTORS_LOCALES: Record<Locale, Record<SectorKey, SectorData>> = {
  de: {
    restaurants: {
      id: 'restaurants',
      title: 'Gastronomie & Restaurants',
      tag: 'Restaurant / Café / Bar',
      description: 'Reparatur von klassischen Neonröhren, LED-Leuchtkästen, Menüboards und Werbefolien. Speisekarten und Plakate werden im Rahmen von regelmäßigen Audits direkt vor Ort erneuert.',
      assetsTitle: 'Werbe-Assets',
      assets: ['Neon-Lichtwerbung', 'Digitale Menüboards', 'Schaufensterfolierung', 'Kundenstopper'],
      problemsTitle: 'Typische Probleme',
      problems: ['Flackerndes Neon', 'Defekte Trafos & Kabel', 'Verschmutzte Menükarten', 'Trübe Acrylfronten'],
      solutionTitle: 'PixelRing Lösung',
      solution: 'Proaktiver Austausch defekter Netzteile, Reparatur von klassischen Röhren und Sofort-Tausch zerrissener oder veralteter Werbeplakate.',
      ctaText: 'Service für Gastronomie starten',
      hotspots: [
        {
          id: 'exterior',
          label: 'Außenwerbung',
          dot: { x: 25, y: 50 },
          pill: { x: 12, y: 25 },
          description: 'Wir führen ein gründliches Audit der Außenwerbung durch, um versteckte Mängel zu identifizieren. Wir warten und reparieren Fassadenschilder, modernisieren sie, erneuern Leuchtelemente und verleihen ihnen wieder ein makelloses Aussehen.'
        },
        {
          id: 'interior',
          label: 'Innenwerbung & Lichtwerbung',
          dot: { x: 75, y: 50 },
          pill: { x: 72, y: 25 },
          description: 'Wir prüfen die Innenbeleuchtung, Leuchtkästen und digitale Displays. Wir diagnostizieren Elektronik und Verkabelung, beheben Flackern, tauschen Netzteile aus und reparieren Menübildschirme.'
        }
      ]
    },
    retail: {
      id: 'retail',
      title: 'Einzelhandel & Filialen',
      tag: 'Boutiquen / Kaufhäuser / Stores',
      description: 'Wartung von leuchtenden Profilbuchstaben, Schaufenster-Folierungen und Großdisplays für ein einheitliches und makelloses Markenbild an allen Standorten.',
      assetsTitle: 'Werbe-Assets',
      assets: ['LED-Profilbuchstaben', 'Schaufensterfolierungen', 'Spanntransparent-Systeme', 'Eingangs-Pylone'],
      problemsTitle: 'Typische Probleme',
      problems: ['Teilausfall LED-Module', 'Abgelöste Folienkanten', 'Verschmutzte Fronten', 'Verkabelungsfehler'],
      solutionTitle: 'PixelRing Lösung',
      solution: 'Regelmäßige Inspektion der Ausleuchtung, nass/trockene Folienreparaturen und standardisierte SLAs für schnelle Reaktionszeiten.',
      ctaText: 'Service für Einzelhandel starten',
      hotspots: [
        {
          id: 'exterior',
          label: 'Fassadenwerbung',
          dot: { x: 25, y: 50 },
          pill: { x: 12, y: 25 },
          description: 'Wir prüfen und warten beleuchtete Profilbuchstaben, Schaufensterfolierungen und Pylone. Wir diagnostizieren Teilausfälle von LED-Modulen, ersetzen defekte Einheiten und geben Ihrer Fassade wieder ein einheitliches, strahlendes Markenbild.'
        },
        {
          id: 'interior',
          label: 'Innenbeleuchtung & Beschilderung',
          dot: { x: 75, y: 50 },
          pill: { x: 72, y: 25 },
          description: 'Wir überprüfen Innenraumbeleuchtung, hinterleuchtete Logoboards und Regalbeleuchtung. Wir beseitigen Flimmern, tauschen Treiber aus und sorgen für eine gleichmäßige, markenkonforme Ausleuchtung aller Präsentationsflächen.'
        }
      ]
    },
    salons: {
      id: 'salons',
      title: 'Beauty, Wellness & Salons',
      tag: 'Friseure / Spas / Fitnessstudios',
      description: 'Elegante Lichtlösungen, Premium-Acrylschilder und optisch ansprechende Sichtschutzfolien für einen stilvollen und einladenden ersten Eindruck.',
      assetsTitle: 'Werbe-Assets',
      assets: ['Filigrane Neon-Schriftzüge', 'Mattierte Glasfolien', 'Hinterleuchtete Preistafeln', 'Eingangsschilder'],
      problemsTitle: 'Typische Probleme',
      problems: ['Ungleichmäßige Helligkeit', 'Blasen unter der Sichtschutzfolie', 'Lockere Wandbefestigungen', 'Kratzer im Acrylglasschild'],
      solutionTitle: 'PixelRing Lösung',
      solution: 'Präzisionsmontage von matten Sichtschutzfolien und feines LED-Tuning für eine harmonische, blendfreie Ausleuchtung.',
      ctaText: 'Service für Salons starten',
      hotspots: [
        {
          id: 'exterior',
          label: 'Außenwerbung & Schaufenster',
          dot: { x: 25, y: 50 },
          pill: { x: 12, y: 25 },
          description: 'Wir warten und restaurieren mattierte Sichtschutzfolien, runde Leuchtlogos und Eingangsschilder. Wir entfernen Luftblasen, beheben Folienabplatzungen und erneuern defekte Befestigungen — damit Ihr Salon von außen stets einladend und gepflegt wirkt.'
        },
        {
          id: 'interior',
          label: 'Innendekoration & Lichtschriftzüge',
          dot: { x: 75, y: 50 },
          pill: { x: 72, y: 25 },
          description: 'Wir prüfen filigrane Neon-Schriftzüge, Spiegel-Hinterbeleuchtungen und hinterleuchtete Preistafeln. Wir stellen die Leuchtstärke gleichmäßig ein, tauschen defekte Transformatoren aus und sorgen für eine entspannte, blendfreie Atmosphäre.'
        }
      ]
    },
    dealers: {
      id: 'dealers',
      title: 'Autohäuser & Kfz-Betriebe',
      tag: 'Showrooms / Werkstätten',
      description: 'Instandhaltung von meterhohen Werbepylonen, Fahnensystemen und Orientierungsschildern auf dem gesamten Freigelände.',
      assetsTitle: 'Werbe-Assets',
      assets: ['Großpylone (bis 8m)', 'Flaggensysteme', 'Wegweiser & Stelen', 'Fassaden-Logos'],
      problemsTitle: 'Typische Probleme',
      problems: ['Sturmschäden an Werbefahnen', 'Elektrikfehler im Außenbereich', 'Ausgebleichte Großdrucke', 'Korrosion an Trägern'],
      solutionTitle: 'PixelRing Lösung',
      solution: 'Professioneller Hubwageneinsatz für Arbeiten in Höhen, Überprüfung von Starkstrom-Komponenten und Austausch windbeschädigter Elemente.',
      ctaText: 'Service für Autohäuser starten',
      hotspots: [
        {
          id: 'exterior',
          label: 'Pylone & Außenwerbung',
          dot: { x: 25, y: 50 },
          pill: { x: 12, y: 25 },
          description: 'Wir warten und instandhalten meterhohe Werbepylone, Fahnensysteme und Fassaden-Markenlogos. Wir beheben Witterungsschäden, tauschen windbeschädigte Elemente aus und stellen die Stromversorgung im Außenbereich sicher — damit Ihr Standort weithin sichtbar bleibt.'
        },
        {
          id: 'interior',
          label: 'Showroom-Beschriftung & Licht',
          dot: { x: 75, y: 50 },
          pill: { x: 72, y: 25 },
          description: 'Wir überprüfen Marken-Grafikwände, Orientierungsbeschilderungen und Spotbeleuchtungen im Schauraum. Wir kalibrieren Lichtszenen für optimale Fahrzeugpräsentation und aktualisieren veraltete Preisschilder und Modellbezeichnungen.'
        }
      ]
    },
    clinics: {
      id: 'clinics',
      title: 'Arztpraxen & Apotheken',
      tag: 'Praxen / Kliniken / Apotheken',
      description: 'Präzise Werbeanlagen, Leuchtapothekenkreuze und barrierefreie Leitsysteme nach gesetzlichen Vorgaben.',
      assetsTitle: 'Werbe-Assets',
      assets: ['Apotheken-Leuchtkreuze', 'Messing- & Glasschilder', 'Wegweiser (Innen/Außen)', 'Türbeschriftungen'],
      problemsTitle: 'Typische Probleme',
      problems: ['Defekte im Apothekenkreuz', 'Ungenaue Wegbeschreibungen', 'Vergilbte Kunststoffe', 'Fehlerhafte Dämmerungssensoren'],
      solutionTitle: 'PixelRing Lösung',
      solution: 'Schneller Austausch von Steuerelementen, Reinigung verwitterter Abdeckungen und präzise Anpassung von Wegebeschilderungen.',
      ctaText: 'Service für Praxen/Apotheken starten',
      hotspots: [
        {
          id: 'exterior',
          label: 'Außenschilder & Apothekenzeichen',
          dot: { x: 25, y: 50 },
          pill: { x: 12, y: 25 },
          description: 'Wir warten leuchtende Apothekenkreuze, polieren verwitterte Messing-Schilder und prüfen Dämmerungsschalter. Wir beheben Ausfälle in der Steuerplatine, erneuern Leuchtmittel und sorgen für eine einwandfreie, gesetzeskonforme Außenkennzeichnung.'
        },
        {
          id: 'interior',
          label: 'Leitsystem & Beschilderung innen',
          dot: { x: 75, y: 50 },
          pill: { x: 72, y: 25 },
          description: 'Wir überprüfen Wegweiser, Zimmernummern und Praxisbeschilderungen im Innenbereich. Wir aktualisieren veraltete Bereichsangaben, ersetzen vergilbte Kunststoffabdeckungen und stellen die Beleuchtung von Hinweistafeln sicher.'
        }
      ]
    },
    hotels: {
      id: 'hotels',
      title: 'Hotels & Gastgewerbe',
      tag: 'Hotels / Pensionen / Hostels',
      description: 'Repräsentative Eingangsbereiche, beleuchtete Dachwerbung und stilvolle Orientierungssysteme für Flure, Zimmer und Lobbys.',
      assetsTitle: 'Werbe-Assets',
      assets: ['Dach-Werbeanlagen', 'Eingangs-Marquees', 'Rezeptions-Schriftzüge', 'Zimmerbeschilderungen'],
      problemsTitle: 'Typische Probleme',
      problems: ['Ausfall von Dachbuchstaben', 'Wasserschäden in Lichtboxen', 'Korrodierte Verankerungen', 'Veraltete Flurbeschilderung'],
      solutionTitle: 'PixelRing Lösung',
      solution: 'Höhenarbeiten und seilunterstützte Wartung an Fassaden, Austausch von Dichtungen und Erhalt der Fernwirkung.',
      ctaText: 'Service für Hotels starten',
      hotspots: [
        {
          id: 'exterior',
          label: 'Fassade & Dachbeschriftung',
          dot: { x: 25, y: 50 },
          pill: { x: 12, y: 25 },
          description: 'Wir warten und reparieren beleuchtete Dachbuchstaben, Eingangs-Marquees und Fahnenmasten. Wir beseitigen Wassereinbrüche in Lichtboxen, tauschen korrodierte Befestigungen aus und erhalten die Fernwirkung Ihres Hauses zu jeder Tageszeit.'
        },
        {
          id: 'interior',
          label: 'Rezeption & Leitsystem',
          dot: { x: 75, y: 50 },
          pill: { x: 72, y: 25 },
          description: 'Wir prüfen hinterleuchtete Empfangslogos, Korridor-Wegweiser und Zimmernummern. Wir ersetzen veraltete Richtungspfeile, aktualisieren Etagenbeschilderungen und sorgen für ein einheitliches, hochwertiges Erscheinungsbild in allen Gästebereichen.'
        }
      ]
    },
    offices: {
      id: 'offices',
      title: 'Büros & Kanzleien',
      tag: 'Kanzleien / Agenturen / Coworking',
      description: 'Seriöse Acrylschilder, Folierung von Glastrennwänden als Sichtschutz und flexible Wechselsysteme für Türbeschriftungen.',
      assetsTitle: 'Werbe-Assets',
      assets: ['Kanzleischilder (Acryl/Metall)', 'Glastrennwand-Folien', 'Logo-Empfangswände', 'Wechselschilder'],
      problemsTitle: 'Typische Probleme',
      problems: ['Blasenbildungen in Milchglasfolien', 'Lose Distanzhalter', 'Veraltete Namensschilder', 'Defekte LED-Strahler'],
      solutionTitle: 'PixelRing Lösung',
      solution: 'Passgenaue Folierung vor Ort und prompte Aktualisierung von Beschriftungen bei Mieterwechseln.',
      ctaText: 'Service für Büros starten',
      hotspots: [
        {
          id: 'exterior',
          label: 'Eingang & Kanzleischilder',
          dot: { x: 25, y: 50 },
          pill: { x: 12, y: 25 },
          description: 'Wir warten Mieterdirektories aus Messing, Gebäudenamensschilder und Außenbeleuchtung am Eingang. Wir polieren angelaufene Oberflächen, aktualisieren Unternehmenseinträge und sichern lose Wandbefestigungen — für einen seriösen ersten Eindruck.'
        },
        {
          id: 'interior',
          label: 'Empfang & Glastrennwände',
          dot: { x: 75, y: 50 },
          pill: { x: 72, y: 25 },
          description: 'Wir prüfen hinterleuchtete Firmenlogos, Milchglasfolien auf Trennwänden und Türbeschilderungen. Wir entfernen Luftblasen in Folien, ersetzen veraltete Namensschilder und sorgen für eine gepflegte, professionelle Innenraumatmosphäre.'
        }
      ]
    }
  },
  en: {
    restaurants: {
      id: 'restaurants',
      title: 'Gastronomy & Restaurants',
      tag: 'Restaurant / Cafe / Bar',
      description: 'Repairing classic neon, LED lightboxes, menu boards, and advertising vinyls. Menus and posters are directly replaced on-site during audits.',
      assetsTitle: 'Advertising Assets',
      assets: ['Neon illuminated signs', 'Digital menu boards', 'Window vinyl branding', 'A-boards / Sidewalk signs'],
      problemsTitle: 'Typical Issues',
      problems: ['Flickering neon letters', 'Faulty power supply', 'Torn or dirty menu cards', 'Cloudy acrylic covers'],
      solutionTitle: 'PixelRing Solution',
      solution: 'Proactive replacement of faulty drivers, repair of neon glass tubes, and immediate replacement of damaged marketing posters.',
      ctaText: 'Start Gastronomy Service',
      hotspots: [
        {
          id: 'exterior',
          label: 'Outdoor Signage',
          dot: { x: 25, y: 50 },
          pill: { x: 12, y: 25 },
          description: 'We conduct a thorough audit of outdoor advertising, identifying hidden defects. We maintain and repair facade signage, modernize them, update lighting elements, and restore their flawless premium look.'
        },
        {
          id: 'interior',
          label: 'Indoor Lighting & Displays',
          dot: { x: 75, y: 50 },
          pill: { x: 72, y: 25 },
          description: 'We inspect interior lighting, lightboxes, and digital screens. We diagnose electronics and wiring, eliminate flickering, replace power supplies, and repair digital menu boards.'
        }
      ]
    },
    retail: {
      id: 'retail',
      title: 'Retail & Chains',
      tag: 'Boutiques / Department Stores',
      description: 'Maintenance of illuminated 3D letters, window displays, and large flex face signs. We keep a flawless brand image across all sites.',
      assetsTitle: 'Advertising Assets',
      assets: ['3D LED channel letters', 'Window decals & graphics', 'Flex face sign systems', 'Entrance pylon signs'],
      problemsTitle: 'Typical Issues',
      problems: ['Partial LED failure', 'Peeling vinyl edges', 'Dirty acrylic sign fronts', 'Wiring failures'],
      solutionTitle: 'PixelRing Solution',
      solution: 'Regular illumination audits, wet/dry vinyl replacement, and standardized SLAs for quick emergency callouts.',
      ctaText: 'Start Retail Service',
      hotspots: [
        {
          id: 'exterior',
          label: 'Facade & Exterior Signage',
          dot: { x: 25, y: 50 },
          pill: { x: 12, y: 25 },
          description: 'We inspect and service illuminated 3D channel letters, window vinyl decals and entrance pylons. We diagnose partial LED module failures, replace faulty units, and restore a cohesive, bright brand image to your storefront facade.'
        },
        {
          id: 'interior',
          label: 'Interior Lighting & Displays',
          dot: { x: 75, y: 50 },
          pill: { x: 72, y: 25 },
          description: 'We check in-store lighting, backlit logo panels, and shelf display lighting. We eliminate flickering, replace LED drivers, and ensure perfectly even, brand-consistent illumination across all product presentation areas.'
        }
      ]
    },
    salons: {
      id: 'salons',
      title: 'Beauty, Wellness & Salons',
      tag: 'Hairdressers / Spas / Gyms',
      description: 'Elegant lighting solutions, premium signs, and privacy window films for a stylish and welcoming first impression.',
      assetsTitle: 'Advertising Assets',
      assets: ['Delicate neon scripts', 'Frosted window films', 'Backlit pricing boards', 'Reception signs'],
      problemsTitle: 'Typical Issues',
      problems: ['Uneven light output', 'Air bubbles in privacy film', 'Loose wall spacers', 'Scratched acrylic signs'],
      solutionTitle: 'PixelRing Solution',
      solution: 'High-precision application of frosted glass film and custom LED calibration for smooth, glare-free ambient lighting.',
      ctaText: 'Start Salons Service',
      hotspots: [
        {
          id: 'exterior',
          label: 'Window & Entrance Branding',
          dot: { x: 25, y: 50 },
          pill: { x: 12, y: 25 },
          description: 'We service and restore frosted privacy films, glowing circular logo signs, and entrance board signage. We remove air bubbles, fix peeling vinyl, and replace loose mounting hardware so your salon always looks clean and inviting from outside.'
        },
        {
          id: 'interior',
          label: 'Interior Neon & Lighting',
          dot: { x: 75, y: 50 },
          pill: { x: 72, y: 25 },
          description: 'We inspect delicate neon script signs, mirror backlighting, and illuminated pricing boards. We calibrate light output for even ambient warmth, replace faulty transformers, and ensure a relaxed, glare-free atmosphere throughout.'
        }
      ]
    },
    dealers: {
      id: 'dealers',
      title: 'Car Dealerships & Auto Centers',
      tag: 'Showrooms / Workshops',
      description: 'Maintenance of tall freestanding pylons, flagpole banners, and directional signage across large outdoor forecourts.',
      assetsTitle: 'Advertising Assets',
      assets: ['Freestanding pylons (up to 8m)', 'Flagpole banner systems', 'Wayfinding signage', 'Facade brand logos'],
      problemsTitle: 'Typical Issues',
      problems: ['Storm damages to flags', 'Outdoor electrical faults', 'Faded vinyl wraps', 'Corrosion on steel supports'],
      solutionTitle: 'PixelRing Solution',
      solution: 'Coordination of cherry pickers for high-level operations, testing of main power systems, and replacement of weathered parts.',
      ctaText: 'Start Dealership Service',
      hotspots: [
        {
          id: 'exterior',
          label: 'Pylons & Outdoor Advertising',
          dot: { x: 25, y: 50 },
          pill: { x: 12, y: 25 },
          description: 'We service and maintain large freestanding advertising pylons, flagpole banners, and facade brand logos. We repair storm damage, replace wind-damaged elements, and test outdoor power supply systems to ensure your dealership remains prominently visible.'
        },
        {
          id: 'interior',
          label: 'Showroom Branding & Lighting',
          dot: { x: 75, y: 50 },
          pill: { x: 72, y: 25 },
          description: 'We inspect brand graphic walls, directional navigation signage, and showroom spotlighting. We calibrate lighting scenes for optimal vehicle presentation and update outdated model or price labels on digital and static displays.'
        }
      ]
    },
    clinics: {
      id: 'clinics',
      title: 'Medical Practices & Pharmacies',
      tag: 'Practices / Clinics / Pharmacies',
      description: 'Precise illuminated signs, green pharmacy crosses, and barrier-free wayfinding complying with legal regulations.',
      assetsTitle: 'Advertising Assets',
      assets: ['Illuminated pharmacy crosses', 'Brass & glass plaques', 'Indoor & outdoor directional signs', 'Door lettering'],
      problemsTitle: 'Typical Issues',
      problems: ['Flickering pharmacy crosses', 'Outdated layout texts', 'Hazy glass plates', 'Faulty light sensors'],
      solutionTitle: 'PixelRing Solution',
      solution: 'Rapid replacement of flashing controller modules, cleaning of glass plates, and prompt update of directional lettering.',
      ctaText: 'Start Clinics Service',
      hotspots: [
        {
          id: 'exterior',
          label: 'Pharmacy Signs & Exterior Plaques',
          dot: { x: 25, y: 50 },
          pill: { x: 12, y: 25 },
          description: 'We service LED pharmacy cross signs, polish weathered brass entrance plaques, and test daylight sensors. We repair controller board failures, replace lighting elements, and ensure fully compliant, clearly visible exterior identification for your practice.'
        },
        {
          id: 'interior',
          label: 'Wayfinding & Interior Signage',
          dot: { x: 75, y: 50 },
          pill: { x: 72, y: 25 },
          description: 'We inspect internal wayfinding signs, room labels, and practice identification boards. We update outdated department listings, replace yellowed plastic covers on sign holders, and ensure proper illumination of all directional indicators.'
        }
      ]
    },
    hotels: {
      id: 'hotels',
      title: 'Hotels & Hospitality',
      tag: 'Hotels / Guesthouses / Hostels',
      description: 'Prestigious lobby branding, illuminated rooftop letters, and elegant direction signs for corridors and rooms.',
      assetsTitle: 'Advertising Assets',
      assets: ['Rooftop channel letters', 'Entrance canopy signage', 'Lobby reception logos', 'Corridor room numbers'],
      problemsTitle: 'Typical Issues',
      problems: ['Rooftop sign blackout', 'Water ingress in lightboxes', 'Rusting support frames', 'Outdated room signs'],
      solutionTitle: 'PixelRing Solution',
      solution: 'Rope-access and high-level structural checkups, cleaning of large letters, and replacement of waterproof LED components.',
      ctaText: 'Start Hotel Service',
      hotspots: [
        {
          id: 'exterior',
          label: 'Facade & Rooftop Lettering',
          dot: { x: 25, y: 50 },
          pill: { x: 12, y: 25 },
          description: 'We service and repair illuminated rooftop channel letters, entrance canopy marquees, and flagpole systems. We eliminate water ingress in lightboxes, replace corroded anchors, and maintain maximum visibility of your hotel facade at any time of day or night.'
        },
        {
          id: 'interior',
          label: 'Reception & Wayfinding',
          dot: { x: 75, y: 50 },
          pill: { x: 72, y: 25 },
          description: 'We inspect backlit reception logos, corridor wayfinding signs, and room number plaques. We replace outdated directional arrows, update floor identification signage, and maintain a consistent premium appearance across all guest-facing areas.'
        }
      ]
    },
    offices: {
      id: 'offices',
      title: 'Offices & Corporate Hubs',
      tag: 'Offices / Agencies / Coworking',
      description: 'Sophisticated acrylic directories, frosted glass partition wraps, and exchangeable door labels.',
      assetsTitle: 'Advertising Assets',
      assets: ['Acrylic name plaques', 'Glass wall partition films', 'Logo backdrop panels', 'Directory door boards'],
      problemsTitle: 'Typical Issues',
      problems: ['Bubbling glass films', 'Loose metallic standoff caps', 'Outdated name updates', 'Failed spot lighting'],
      solutionTitle: 'PixelRing Solution',
      solution: 'Flawless dust-free vinyl application on site and prompt update of tenant listings during move-ins.',
      ctaText: 'Start Offices Service',
      hotspots: [
        {
          id: 'exterior',
          label: 'Entrance & Directory Signage',
          dot: { x: 25, y: 50 },
          pill: { x: 12, y: 25 },
          description: 'We service brass tenant directory plaques, building name signs, and entrance spotlights. We polish tarnished surfaces, update company listings, and secure loose wall mounts for a professional and trustworthy first impression at your building entrance.'
        },
        {
          id: 'interior',
          label: 'Reception & Glass Partitions',
          dot: { x: 75, y: 50 },
          pill: { x: 72, y: 25 },
          description: 'We inspect backlit corporate logo walls, frosted glass partition films, and door name plaques. We remove air bubbles from films, replace outdated name labels, and maintain a clean, professional interior atmosphere throughout the office floors.'
        }
      ]
    }
  },
  ru: {
    restaurants: {
      id: 'restaurants',
      title: 'Рестораны и Кафе',
      tag: 'Ресторан / Кафе / Бар',
      description: 'Ремонт классического неона, световых коробов, меню-бордов и рекламных пленок. Меню и плакаты обновляются нашими специалистами в рамках аудитов непосредственно на объекте.',
      assetsTitle: 'Рекламные носители',
      assets: ['Неоновые вывески', 'Цифровые меню-борды', 'Оформление витрин пленкой', 'Меловые штендеры'],
      problemsTitle: 'Частые проблемы',
      problems: ['Мерцание неоновых букв', 'Неисправные трансформаторы', 'Испорченные меню-карты', 'Помутнение акрила'],
      solutionTitle: 'Решение PixelRing',
      solution: 'Оперативная замена блоков питания, ремонт стеклянных трубок и немедленная замена изношенных рекламных плакатов.',
      ctaText: 'Начать обслуживание ресторанов',
      hotspots: [
        {
          id: 'exterior',
          label: 'Внешнее оформление',
          dot: { x: 25, y: 50 },
          pill: { x: 12, y: 25 },
          description: 'Мы проводим тщательный аудит наружной рекламы, выявляя скрытые дефекты. Обслуживаем и ремонтируем фасадные вывески, модернизируем их, обновляем световые элементы и возвращаем им безупречный вид.'
        },
        {
          id: 'interior',
          label: 'Внутреннее оформление',
          dot: { x: 75, y: 50 },
          pill: { x: 72, y: 25 },
          description: 'Проверяем внутреннее освещение, световые короба и цифровые дисплеи. Проводим диагностику электроники и проводки, устраняем мерцание, меняем блоки питания и ремонтируем экраны меню.'
        }
      ]
    },
    retail: {
      id: 'retail',
      title: 'Розничные сети и Ритейл',
      tag: 'Бутики / Универмаги / Сети',
      description: 'Обслуживание объемных световых букв, витринной графики и масштабных световых коробов. Поддержание идеального вида бренда на всех объектах сети.',
      assetsTitle: 'Рекламные носители',
      assets: ['Светодиодные объемные буквы', 'Витринная аппликация', 'Текстильные лайтбоксы', 'Входные стелы'],
      problemsTitle: 'Частые проблемы',
      problems: ['Частичный отказ диодов', 'Отслаивание краев пленки', 'Пыль внутри коробов', 'Ошибки подключения'],
      solutionTitle: 'Решение PixelRing',
      solution: 'Регулярная проверка яркости свечения, влажная/сухая замена испорченной пленки и соглашения SLA для сетевых точек.',
      ctaText: 'Начать обслуживание ритейла',
      hotspots: [
        {
          id: 'exterior',
          label: 'Фасадная реклама',
          dot: { x: 25, y: 50 },
          pill: { x: 12, y: 25 },
          description: 'Проверяем и обслуживаем световые объемные буквы, витринную графику и входные стелы. Диагностируем частичные отказы диодных модулей, заменяем неисправные блоки и восстанавливаем единый, яркий фирменный облик фасада.'
        },
        {
          id: 'interior',
          label: 'Внутреннее освещение и вывески',
          dot: { x: 75, y: 50 },
          pill: { x: 72, y: 25 },
          description: 'Проверяем торговое освещение, лайтбоксы с логотипом и подсветку полок. Устраняем мерцание, меняем диодные драйверы и обеспечиваем равномерную, соответствующую бренду подсветку всех зон выкладки товара.'
        }
      ]
    },
    salons: {
      id: 'salons',
      title: 'Красота, Салоны и Фитнес',
      tag: 'Парикмахерские / Спа / Студии',
      description: 'Изящное световое оформление, премиальные акриловые таблички и стильная матовая пленка на окнах для создания уюта.',
      assetsTitle: 'Рекламные носители',
      assets: ['Тонкие неоновые надписи', 'Матирование стекол (пленка)', 'Лайтбоксы с ценами', 'Интерьерные логотипы'],
      problemsTitle: 'Частые проблемы',
      problems: ['Неравномерное свечение', 'Пузыри воздуха под пленкой', 'Люфт настенных крепежей', 'Царапины на акриле'],
      solutionTitle: 'Решение PixelRing',
      solution: 'Профессиональная поклейка матовых пленок без пыли и точечная настройка диодов для мягкого заполняющего света.',
      ctaText: 'Начать обслуживание салонов',
      hotspots: [
        {
          id: 'exterior',
          label: 'Витрина и фасадное оформление',
          dot: { x: 25, y: 50 },
          pill: { x: 12, y: 25 },
          description: 'Обслуживаем и восстанавливаем матовые пленки на стеклах, круглые световые логотипы и входные вывески. Устраняем пузыри, отслоения пленки и ненадежные крепления — чтобы ваш салон всегда выглядел аккуратно и привлекательно снаружи.'
        },
        {
          id: 'interior',
          label: 'Неоновые вывески и освещение',
          dot: { x: 75, y: 50 },
          pill: { x: 72, y: 25 },
          description: 'Проверяем тонкие неоновые надписи, подсветку зеркал и световые прайс-борды. Настраиваем яркость для равномерного мягкого света, меняем неисправные трансформаторы и создаем комфортную, безбликовую атмосферу.'
        }
      ]
    },
    dealers: {
      id: 'dealers',
      title: 'Автосалоны и Сервисы',
      tag: 'Шоурумы / Автосервисы',
      description: 'Техническое обслуживание высоких отдельно стоящих рекламных стел, флагштоков и навигации на открытых площадках.',
      assetsTitle: 'Рекламные носители',
      assets: ['Рекламные стелы (до 8м)', 'Флагштоки с баннерами', 'Навигационные пилоны', 'Фасадные эмблемы брендов'],
      problemsTitle: 'Частые проблемы',
      problems: ['Повреждение баннеров ветром', 'Замыкания внешней электрики', 'Выцветание крупных принтов', 'Ржавчина на металлокаркасе'],
      solutionTitle: 'Решение PixelRing',
      solution: 'Координация автовышек для высотных работ, диагностика силовых линий и замена изношенных элементов конструкции.',
      ctaText: 'Начать обслуживание автосалонов',
      hotspots: [
        {
          id: 'exterior',
          label: 'Стелы и наружная реклама',
          dot: { x: 25, y: 50 },
          pill: { x: 12, y: 25 },
          description: 'Обслуживаем и содержим в порядке высокие рекламные стелы, флагштоки с баннерами и фасадные эмблемы брендов. Устраняем погодные повреждения, заменяем ветровые элементы и проверяем внешнюю электропроводку — ваш объект всегда заметен издалека.'
        },
        {
          id: 'interior',
          label: 'Брендинг и освещение шоурума',
          dot: { x: 75, y: 50 },
          pill: { x: 72, y: 25 },
          description: 'Проверяем брендированные панели-стены, навигационные указатели и точечное освещение шоурума. Настраиваем световые сцены для оптимальной подачи автомобилей и обновляем устаревшие ценники и обозначения моделей.'
        }
      ]
    },
    clinics: {
      id: 'clinics',
      title: 'Клиники и Аптеки',
      tag: 'Кабинеты / Клиники / Аптеки',
      description: 'Светодиодные аптечные кресты, аккуратные таблички и интуитивная навигация в соответствии со стандартами.',
      assetsTitle: 'Рекламные носители',
      assets: ['Светодиодные кресты', 'Таблички из латуни и стекла', 'Указатели (внутри/снаружи)', 'Маркировка на дверях'],
      problemsTitle: 'Частые проблемы',
      problems: ['Сбои анимации аптечного креста', 'Устаревшие списки услуг', 'Потемнение защитного стекла', 'Поломка датчиков света'],
      solutionTitle: 'Решение PixelRing',
      solution: 'Срочный ремонт контроллеров анимации, полировка стекол и быстрая замена фотодатчиков день/ночь.',
      ctaText: 'Начать обслуживание клиник',
      hotspots: [
        {
          id: 'exterior',
          label: 'Вывески и наружные таблички',
          dot: { x: 25, y: 50 },
          pill: { x: 12, y: 25 },
          description: 'Обслуживаем LED аптечные кресты, полируем потемневшие латунные таблички у входа и проверяем датчики освещённости. Ремонтируем платы управления, меняем источники света и обеспечиваем корректную, заметную наружную идентификацию.'
        },
        {
          id: 'interior',
          label: 'Навигация и внутренние указатели',
          dot: { x: 75, y: 50 },
          pill: { x: 72, y: 25 },
          description: 'Проверяем внутренние навигационные знаки, номера кабинетов и таблички с наименованиями. Обновляем устаревшие перечни услуг, заменяем пожелтевшие пластиковые кожухи и обеспечиваем подсветку всех указателей.'
        }
      ]
    },
    hotels: {
      id: 'hotels',
      title: 'Отели и Гостиницы',
      tag: 'Отели / Хостелы / Гостевые дома',
      description: 'Премиальное оформление входных зон, крышные световые установки и единая навигационная система для этажей и номеров.',
      assetsTitle: 'Рекламные носители',
      assets: ['Крышные вывески', 'Козырьковые световые порталы', 'Логотипы на ресепшн', 'Номера комнат и указатели'],
      problemsTitle: 'Частые проблемы',
      problems: ['Погасла буква на крыше', 'Проникновение воды в буквы', 'Ослабление анкеров на высоте', 'Износ дверных табличек'],
      solutionTitle: 'Решение PixelRing',
      solution: 'Промышленные альпинисты для работ на фасадах, герметизация стыков и поддержание презентабельного вида отеля.',
      ctaText: 'Начать обслуживание отелей',
      hotspots: [
        {
          id: 'exterior',
          label: 'Фасад и крышные буквы',
          dot: { x: 25, y: 50 },
          pill: { x: 12, y: 25 },
          description: 'Обслуживаем и ремонтируем светящиеся крышные буквы, козырьки-маркизы у входа и флагштоки. Устраняем проникновение воды в световые панели, меняем проржавевшие анкеры и поддерживаем максимальную видимость фасада в любое время суток.'
        },
        {
          id: 'interior',
          label: 'Ресепшн и навигация',
          dot: { x: 75, y: 50 },
          pill: { x: 72, y: 25 },
          description: 'Проверяем подсвеченные логотипы на ресепшн, указатели по этажам и таблички с номерами комнат. Заменяем устаревшие стрелки-указатели, обновляем нумерацию этажей и поддерживаем единый премиальный облик во всех гостевых зонах.'
        }
      ]
    },
    offices: {
      id: 'offices',
      title: 'Офисы и Представительства',
      tag: 'Kанцелярии / Агентства / Коворкинги',
      description: 'Презентабельные акриловые таблички, тонирование стеклянных перегородок и модульные системы сменных именных указателей.',
      assetsTitle: 'Рекламные носители',
      assets: ['Акриловые вывески на дистанцерах', 'Матовые пленки на стеклах', 'Фирменные панно в приемной', 'Сменные таблички кабинетов'],
      problemsTitle: 'Частые проблемы',
      problems: ['Пузырение пленок на стекле', 'Утеря металлических колпачков', 'Ошибки в написании имен', 'Перегоревшие точечные споты'],
      solutionTitle: 'Решение PixelRing',
      solution: 'Аккуратное тонирование стекол перегородок без стыков и оперативное обновление табличек при смене арендаторов.',
      ctaText: 'Начать обслуживание офисов',
      hotspots: [
        {
          id: 'exterior',
          label: 'Вход и таблички компаний',
          dot: { x: 25, y: 50 },
          pill: { x: 12, y: 25 },
          description: 'Обслуживаем латунные указатели арендаторов, таблички с именем здания и входную подсветку. Полируем потемневшие поверхности, обновляем списки компаний и укрепляем ослабшие настенные крепления — для солидного первого впечатления.'
        },
        {
          id: 'interior',
          label: 'Ресепшн и стеклянные перегородки',
          dot: { x: 75, y: 50 },
          pill: { x: 72, y: 25 },
          description: 'Проверяем подсвеченные корпоративные логотипы, матовые пленки на стеклянных перегородках и дверные таблички. Устраняем пузыри в пленках, меняем устаревшие именные таблички и поддерживаем аккуратную, профессиональную атмосферу.'
        }
      ]
    }
  },
  tr: {
    restaurants: {
      id: 'restaurants',
      title: 'Gastronomi & Restoranlar',
      tag: 'Restoran / Kafe / Bar',
      description: 'Klasik neon tüplerin, LED ışıklı kutuların, menü panolarının ve reklam folyolarının onarımı. Menüler ve posterler, denetimler sırasında doğrudan yerinde yenilenir.',
      assetsTitle: 'Reklam Varlıkları',
      assets: ['Neon Işıklı Tabela', 'Dijital Menü Panoları', 'Vitrin Folyosu', 'Kaldırım Panoları'],
      problemsTitle: 'Tipik Sorunlar',
      problems: ['Titreşen neon harfler', 'Arızalı trafolar', 'Yırtık veya kirli menüler', 'Bulanık akrilik yüzeyler'],
      solutionTitle: 'PixelRing Çözümü',
      solution: 'Arızalı güç kaynaklarının proaktif değişimi, klasik tüp onarımı ve yıpranmış afişlerin anında yenilenmesi.',
      ctaText: 'Gastronomi Servisini Başlat',
      hotspots: [
        {
          id: 'exterior',
          label: 'Dış Mekan Reklamı',
          dot: { x: 25, y: 50 },
          pill: { x: 12, y: 25 },
          description: 'Dış mekan reklamlarının kapsamlı bir denetimini gerçekleştiriyor, gizli kusurları tespit ediyoruz. Cephe tabelalarının bakım ve onarımını yapıyor, modernize ediyor, ışıklandırma elemanlarını yeniliyor ve onlara kusursuz bir görünüm kazandırıyoruz.'
        },
        {
          id: 'interior',
          label: 'İç Mekan Işıklandırma',
          dot: { x: 75, y: 50 },
          pill: { x: 72, y: 25 },
          description: 'İç mekan aydınlatmalarını, ışıklı kutuları ve dijital ekranları kontrol ediyoruz. Elektronik aksam ve kablolamayı teşhis ediyor, titremeyi gideriyor, güç kaynaklarını değiştiriyor ve dijital menü panolarını onarıyoruz.'
        }
      ]
    },
    retail: {
      id: 'retail',
      title: 'Perakende & Mağazalar',
      tag: 'Butikler / Büyük Mağazalar / Şubeler',
      description: 'Tüm şubelerde tutarlı ve kusursuz bir marka imajı için ışıklı 3D harflerin, vitrin folyolarının ve büyük panoların bakımı.',
      assetsTitle: 'Reklam Varlıkları',
      assets: ['LED 3D Kanal Harfler', 'Vitrin Dekoru & Grafikler', 'Germe Tabela Sistemleri', 'Giriş Pilonları'],
      problemsTitle: 'Tipik Sorunlar',
      problems: ['LED modüllerin kısmi kaybı', 'Kalkan folyo kenarları', 'Kirli akrilik yüzeyler', 'Kablo bağlantı hataları'],
      solutionTitle: 'PixelRing Çözümü',
      solution: 'Aydınlatma durumunun düzenli denetimi, ıslak/kuru folyo onarımları ve hızlı müdahale için standart SLA anlaşmaları.',
      ctaText: 'Perakende Servisini Başlat',
      hotspots: [
        {
          id: 'exterior',
          label: 'Cephe Tabelaları',
          dot: { x: 25, y: 50 },
          pill: { x: 12, y: 25 },
          description: 'Işıklı 3D kanal harfleri, vitrin folyo grafiklerini ve giriş pilonlarını denetleyip bakımını yapıyoruz. LED modüllerinin kısmi arızalarını teşhis ediyor, hatalı üniteleri değiştiriyor ve cephenize yeniden bütünleşik, parlak bir marka görünümü kazandırıyoruz.'
        },
        {
          id: 'interior',
          label: 'İç Mekan Aydınlatma & Tabelalar',
          dot: { x: 75, y: 50 },
          pill: { x: 72, y: 25 },
          description: 'Mağaza içi aydınlatmayı, arka ışıklı logo panellerini ve raf ekran ışığını kontrol ediyoruz. Titreşimi ortadan kaldırıyor, LED sürücüleri değiştiriyor ve tüm ürün sunum alanlarında eşit, marka uyumlu aydınlatma sağlıyoruz.'
        }
      ]
    },
    salons: {
      id: 'salons',
      title: 'Güzellik, Wellness & Salonlar',
      tag: 'Kuaförler / Spalar / Salonlar',
      description: 'Şık ve davetkar bir ilk izlenim için zarif aydınlatma çözümleri, premium akrilik tabelalar ve estetik kumlama cam folyoları.',
      assetsTitle: 'Reklam Varlıkları',
      assets: ['Zarif Neon Yazılar', 'Mat Kumlu Cam Folyosu', 'Işıklı Fiyat Panoları', 'Giriş Tabelaları'],
      problemsTitle: 'Tipik Sorunlar',
      problems: ['Düzensiz parlaklık', 'Kumlama folyosunda hava kabarcıkları', 'Gevşek duvar bağlantıları', 'Akrilik levhada çizikler'],
      solutionTitle: 'PixelRing Çözümü',
      solution: 'Mat kumlama folyolarının hassas uygulaması ve göz almayan, yumuşak bir aydınlatma için ince LED kalibrasyonu.',
      ctaText: 'Salon Servisini Başlat',
      hotspots: [
        {
          id: 'exterior',
          label: 'Vitrin & Giriş Görselleri',
          dot: { x: 25, y: 50 },
          pill: { x: 12, y: 25 },
          description: 'Mat kumlama folyolarını, dairesel ışıklı logo tabelalarını ve giriş yönlendirmelerini bakımlıyor ve yeniliyoruz. Hava kabarcıklarını gideriyor, soyulan folyoları onarıyor ve gevşek montaj vidalarını değiştiriyoruz; böylece salonunuz dışarıdan her zaman davetkar görünür.'
        },
        {
          id: 'interior',
          label: 'İç Mekan Neon & Aydınlatma',
          dot: { x: 75, y: 50 },
          pill: { x: 72, y: 25 },
          description: 'Zarif neon yazıları, ayna arka aydınlatmalarını ve ışıklı fiyat panolarını kontrol ediyoruz. Eşit ambiyans ışığı için parlaklığı kalibre ediyor, arızalı transformatörleri değiştiriyor ve göz almayan, rahatlatıcı bir atmosfer sağlıyoruz.'
        }
      ]
    },
    dealers: {
      id: 'dealers',
      title: 'Oto Galerileri & Servisler',
      tag: 'Showroomlar / Servisler',
      description: 'Geniş açık alanlardaki metrelerce yükseklikteki reklam pilonlarının, bayrak direklerinin ve yönlendirme tabelalarının bakımı.',
      assetsTitle: 'Reklam Varlıkları',
      assets: ['Büyük Pilonlar (8 metreye kadar)', 'Bayrak Direği Sistemleri', 'Yönlendirme Panoları', 'Cephe Logoları'],
      problemsTitle: 'Tipik Sorunlar',
      problems: ['Rüzgar kaynaklı bayrak hasarları', 'Dış mekan elektrik arızaları', 'Solmuş büyük afişler', 'Taşıyıcılarda korozyon'],
      solutionTitle: 'PixelRing Çözümü',
      solution: 'Yükseklerde çalışma için sepetli araç koordinasyonu, ana güç hatlarının testi ve yıpranmış parçaların değişimi.',
      ctaText: 'Oto Galeri Servisini Başlat',
      hotspots: [
        {
          id: 'exterior',
          label: 'Pilonlar & Dış Mekan Reklamları',
          dot: { x: 25, y: 50 },
          pill: { x: 12, y: 25 },
          description: 'Büyük bağımsız reklam pilonlarını, bayrak direği sistemlerini ve cephe marka logolarını servisleyip bakımını yapıyoruz. Fırtına hasarlarını onarıyor, rüzgarda zarar gören elemanları değiştiriyor ve dış mekan güç sistemlerini test ediyoruz.'
        },
        {
          id: 'interior',
          label: 'Showroom Markalama & Aydınlatma',
          dot: { x: 75, y: 50 },
          pill: { x: 72, y: 25 },
          description: 'Marka grafik duvarlarını, yönlendirme tabelalarını ve showroom spot aydınlatmalarını denetliyoruz. Araç sunumunu optimize etmek için ışık senaryolarını kalibre ediyor ve eski model veya fiyat etiketlerini güncelliyoruz.'
        }
      ]
    },
    clinics: {
      id: 'clinics',
      title: 'Muayenehaneler & Eczaneler',
      tag: 'Poliklinikler / Klinikler / Eczaneler',
      description: 'Yasal mevzuata uygun hassas tabelalar, ışıklı eczane yeşil haçları ve engelsiz yönlendirme sistemleri.',
      assetsTitle: 'Reklam Varlıkları',
      assets: ['Işıklı Eczane Haçı', 'Pirinç & Cam Tabelalar', 'Yönlendirmeler (İç/Dış)', 'Kapı Yazıları'],
      problemsTitle: 'Tipik Sorunlar',
      problems: ['Eczane haçında LED arızaları', 'Eski veya hatalı yazılar', 'Matlaşmış cam yüzeyler', 'Arızalı ışık sensörleri'],
      solutionTitle: 'PixelRing Çözümü',
      solution: 'Animasyon kontrolörlerinin hızlı onarımı, cam temizliği ve gün ışığı sensörlerinin kısa sürede değişimi.',
      ctaText: 'Muayenehane Servisini Başlat',
      hotspots: [
        {
          id: 'exterior',
          label: 'Eczane İşaretleri & Dış Levhalar',
          dot: { x: 25, y: 50 },
          pill: { x: 12, y: 25 },
          description: 'LED eczane haçı işaretlerini servisliyoruz, aşınmış pirinç giriş levhalarını cilalıyor ve gün ışığı sensörlerini test ediyoruz. Kontrolör kart arızalarını onarıyor, aydınlatma elemanlarını değiştiriyor ve eksiksiz görünür dış tanımlama sağlıyoruz.'
        },
        {
          id: 'interior',
          label: 'Yönlendirme & İç Mekan Tabelaları',
          dot: { x: 75, y: 50 },
          pill: { x: 72, y: 25 },
          description: 'İç mekan yönlendirme tabelalarını, oda etiketlerini ve muayenehane tanımlama panolarını denetliyoruz. Eski bölüm listelerini güncelliyor, sararmış plastik kapakları değiştiriyor ve tüm yönlendirici levhaların doğru aydınlanmasını sağlıyoruz.'
        }
      ]
    },
    hotels: {
      id: 'hotels',
      title: 'Oteller & Konaklama',
      tag: 'Oteller / Pansiyonlar / Hosteller',
      description: 'Prestijli giriş alanları, aydınlatmalı çatı tabelaları ve koridor, oda ve lobiler için şık yönlendirme sistemleri.',
      assetsTitle: 'Reklam Varlıkları',
      assets: ['Çatı Tabelaları', 'Giriş Kanopi Tabelaları', 'Resepsiyon Logoları', 'Oda Numaralandırmaları'],
      problemsTitle: 'Tipik Sorunlar',
      problems: ['Çatı harflerinin sönmesi', 'Işıklı kutularda su sızıntısı', 'Paslanmış montaj aparatları', 'Eski koridor tabelaları'],
      solutionTitle: 'PixelRing Çözümü',
      solution: 'Fasatlarda endüstriyel dağcılık ve yüksek seviye montaj desteği, conta değişimi ve tabelanın uzak görünürlüğünün korunması.',
      ctaText: 'Otel Servisini Başlat',
      hotspots: [
        {
          id: 'exterior',
          label: 'Cephe & Çatı Harfleri',
          dot: { x: 25, y: 50 },
          pill: { x: 12, y: 25 },
          description: 'Işıklı çatı kanalı harflerini, giriş kanopi marquee tabelalarını ve bayrak direği sistemlerini onarıp bakımını yapıyoruz. Işıklı kutulardaki su sızıntısını gideriyor, paslanmış sabitleme aparatlarını değiştiriyor ve otelin cephesini her saatte görünür kılıyoruz.'
        },
        {
          id: 'interior',
          label: 'Resepsiyon & Yönlendirme',
          dot: { x: 75, y: 50 },
          pill: { x: 72, y: 25 },
          description: 'Arka aydınlatmalı resepsiyon logolarını, koridor yönlendirme tabelalarını ve oda numarası levhalarını denetliyoruz. Eski yön oklarını değiştiriyor, kat tanımlama tabelalarını güncelliyor ve tüm misafir alanlarında tutarlı premium görünümü koruyoruz.'
        }
      ]
    },
    offices: {
      id: 'offices',
      title: 'Ofisler & Merkezler',
      tag: 'Kolektif Ofisler / Acenteler / Ortak Alanlar',
      description: 'Nezih akrilik tabelalar, cam bölmeler için mat folyolar ve kapı tabelaları için pratik değiştirilebilir sistemler.',
      assetsTitle: 'Reklam Varlıkları',
      assets: ['Akrilik Tabelalar', 'Mat Cam Bölme Folyoları', 'Giriş Duvarı Logoları', 'Değiştirilebilir İsimlikler'],
      problemsTitle: 'Tipik Sorunlar',
      problems: ['Folyolarda kabarma', 'Gevşek metal mesafe vidaları', 'Güncel olmayan isim bilgileri', 'Arızalı LED spotlar'],
      solutionTitle: 'PixelRing Çözümü',
      solution: 'Cam bölmelerin hatasız kumlanması ve kiracı değişimlerinde isim tabelalarının hızla güncellenmesi.',
      ctaText: 'Ofis Servisini Başlat',
      hotspots: [
        {
          id: 'exterior',
          label: 'Giriş & Kiracı Tabloları',
          dot: { x: 25, y: 50 },
          pill: { x: 12, y: 25 },
          description: 'Pirinç kiracı dizin levhalarını, bina adı tabelalarını ve giriş spot aydınlatmalarını servisliyor ve bakımını yapıyoruz. Kararmış yüzeyleri cilalıyor, şirket listelerini güncelliyor ve gevşek duvar montajlarını sabitleyor; profesyonel bir ilk izlenim için.'
        },
        {
          id: 'interior',
          label: 'Resepsiyon & Cam Bölmeler',
          dot: { x: 75, y: 50 },
          pill: { x: 72, y: 25 },
          description: 'Arka aydınlatmalı kurumsal logo duvarlarını, mat cam bölme folyolarını ve kapı isimliklerini denetliyoruz. Folyolardaki hava kabarcıklarını gideriyor, eski isim etiketlerini değiştiriyor ve ofis katlarında temiz, profesyonel bir iç mekan ortamını koruyoruz.'
        }
      ]
    }
  },
  pl: {
    restaurants: {
      id: 'restaurants',
      title: 'Gastronomia i Restauracje',
      tag: 'Restauracja / Kawiarnia / Bar',
      description: 'Naprawa tradycyjnych neonów szklanych, kasetonów LED, tablic menu oraz folii reklamowych. Wymiana plakatów i kart menu odbywa się na miejscu podczas audytów.',
      assetsTitle: 'Nośniki Reklamy',
      assets: ['Szklane neony', 'Cyfrowe tablice menu', 'Grafika na witrynach', 'Potykacze reklamowe'],
      problemsTitle: 'Typowe Problemy',
      problems: ['Migające litery neonowe', 'Uszkodzone transformatory', 'Zniszczone karty menu', 'Zmatowiałe fronty akrylowe'],
      solutionTitle: 'Rozwiązanie PixelRing',
      solution: 'Proaktywna wymiana zasilaczy, naprawa rurek szklanych oraz natychmiastowy montaż nowych plakatów w miejsce zniszczonych.',
      ctaText: 'Rozpocznij Serwis dla Gastronomii',
      hotspots: [
        {
          id: 'exterior',
          label: 'Reklama zewnętrzna',
          dot: { x: 25, y: 50 },
          pill: { x: 12, y: 25 },
          description: 'Przeprowadzamy szczegółowy audyt reklamy zewnętrznej, wykrywając ukryte wady. Serwisujemy i naprawiamy szyldy elewacyjne, modernizujemy je, wymieniamy elementy świetlne i przywracamy im nienaganny wygląd.'
        },
        {
          id: 'interior',
          label: 'Reklama wewnętrzna i świetlna',
          dot: { x: 75, y: 50 },
          pill: { x: 72, y: 25 },
          description: 'Sprawdzamy oświetlenie wewnętrzne, kasetony świetlne i ekrany cyfrowe. Diagnozujemy elektronikę i okablowanie, eliminujemy migotanie, wymieniamy zasilacze i naprawiamy cyfrowe ekrany menu.'
        }
      ]
    },
    retail: {
      id: 'retail',
      title: 'Handel Detaliczny i Sieci',
      tag: 'Butiki / Domy Towarowe / Sieci',
      description: 'Konserwacja podświetlanych liter 3D, folii witrynowych i kasetonów z tkaniny napinanej dla spójnego wizerunku we wszystkich lokalizacjach.',
      assetsTitle: 'Nośniki Reklamy',
      assets: ['Litery przestrzenne LED', 'Folie witrynowe & naklejki', 'Kasetony z elastycznym licem', 'Pylony wjazdowe'],
      problemsTitle: 'Typowe Problemy',
      problems: ['Częściowy zanik diod LED', 'Odklejające się krawędzie folii', 'Zabrudzenia wewnątrz kasetonu', 'Błędy w okablowaniu'],
      solutionTitle: 'Rozwiązanie PixelRing',
      solution: 'Cykliczne audyty natężenia światła, aplikacja folii na mokro/sucho oraz umowy SLA zapewniające ekspresową pomoc dla sieci.',
      ctaText: 'Rozpocznij Serwis dla Handlu',
      hotspots: [
        {
          id: 'exterior',
          label: 'Reklama Elewacyjna',
          dot: { x: 25, y: 50 },
          pill: { x: 12, y: 25 },
          description: 'Kontrolujemy i serwisujemy podświetlane litery przestrzenne, folie witrynowe i pylony wejściowe. Diagnozujemy częściowe awarie modułów LED, wymieniamy uszkodzone jednostki i przywracamy spójny, jasny wygląd marki na elewacji.'
        },
        {
          id: 'interior',
          label: 'Oświetlenie & Oznakowanie Wnętrza',
          dot: { x: 75, y: 50 },
          pill: { x: 72, y: 25 },
          description: 'Sprawdzamy oświetlenie sklepowe, podświetlane panele logotypów i oświetlenie regałów. Eliminujemy migotanie, wymieniamy sterowniki LED i zapewniamy równomierne, zgodne z marką oświetlenie we wszystkich strefach ekspozycji.'
        }
      ]
    },
    salons: {
      id: 'salons',
      title: 'Uroda, Wellness i Salony',
      tag: 'Fryzjerzy / Gabinety Spa / Fitness',
      description: 'Eleganckie oświetlenie, szyldy z akrylu i estetyczne folie szronione na szyby w celu stworzenia klimatycznej i intymnej przestrzeni.',
      assetsTitle: 'Nośniki Reklamy',
      assets: ['Precyzyjne napisy neonowe', 'Folie szronione / mleczne', 'Podświetlane cenniki', 'Logotypy wewnętrzne'],
      problemsTitle: 'Typowe Problemy',
      problems: ['Nierównomierne świecenie', 'Bąble pod folią matującą', 'Poluzowane mocowania dystansowe', 'Zarysowania na szyldzie akrylowym'],
      solutionTitle: 'Rozwiązanie PixelRing',
      solution: 'Bezpyłowa aplikacja folii szronionej oraz kalibracja diod LED w celu uzyskania przyjemnego, miękkiego światła.',
      ctaText: 'Rozpocznij Serwis dla Salonów',
      hotspots: [
        {
          id: 'exterior',
          label: 'Witryna & Oznakowanie Wejścia',
          dot: { x: 25, y: 50 },
          pill: { x: 12, y: 25 },
          description: 'Serwisujemy i odnawiamy matowe folie szronione, okrągłe świecące logo i szyldy wejściowe. Usuwamy bąble powietrza, naprawiamy złuszczające się folie i wymieniamy poluzowane mocowania, aby salon zawsze wyglądał schludnie i atrakcyjnie z zewnątrz.'
        },
        {
          id: 'interior',
          label: 'Neony & Oświetlenie Wewnętrzne',
          dot: { x: 75, y: 50 },
          pill: { x: 72, y: 25 },
          description: 'Sprawdzamy delikatne napisy neonowe, podświetlenie luster i podświetlane cenniki. Kalibrujemy natężenie światła dla równomiernego, ciepłego ambientu, wymieniamy wadliwe transformatory i dbamy o relaksującą, pozbawioną odblasków atmosferę.'
        }
      ]
    },
    dealers: {
      id: 'dealers',
      title: 'Salony Samochodowe i Serwisy',
      tag: 'Salony / Warsztaty / Autoryzowane Serwisy',
      description: 'Utrzymanie wielkich pylonów reklamowych, systemów masztów flagowych oraz zewnętrznej nawigacji na dużym terenie placówki.',
      assetsTitle: 'Nośniki Reklamy',
      assets: ['Pylony wolnostojące (do 8m)', 'Systemy masztów i flag', 'Pylony kierunkowe', 'Logotypy elewacyjne'],
      problemsTitle: 'Typowe Problemy',
      problems: ['Uszkodzenie flag przez wiatr', 'Awarie elektryczne na zewnątrz', 'Wyblakłe grafiki wielkoformatowe', 'Korozja na elementach nośnych'],
      solutionTitle: 'Rozwiązanie PixelRing',
      solution: 'Organizacja zwyżek do prac na wysokościach, pomiary instalacji elektrycznych oraz wymiana zniszczonych elementów ekspozycji.',
      ctaText: 'Rozpocznij Serwis dla Salonów Samochodowych',
      hotspots: [
        {
          id: 'exterior',
          label: 'Pylony & Reklama Zewnętrzna',
          dot: { x: 25, y: 50 },
          pill: { x: 12, y: 25 },
          description: 'Serwisujemy duże wolnostojące pylony reklamowe, systemy masztów flagowych i logotypy elewacyjne marek. Naprawiamy uszkodzenia burzowe, wymieniamy elementy zniszczone przez wiatr i testujemy zewnętrzne instalacje elektryczne.'
        },
        {
          id: 'interior',
          label: 'Branding & Oświetlenie Salonu',
          dot: { x: 75, y: 50 },
          pill: { x: 72, y: 25 },
          description: 'Sprawdzamy ścianki graficzne marek, tablice nawigacyjne i oświetlenie punktowe salonu. Kalibrujemy scenariusze oświetlenia dla optymalnej prezentacji pojazdów i aktualizujemy przestarzałe etykiety modeli i cen.'
        }
      ]
    },
    clinics: {
      id: 'clinics',
      title: 'Gabinety i Apteki',
      tag: 'Gabinety / Przychodnie / Apteki',
      description: 'Precyzyjnie wykonane szyldy, apteczne krzyże LED oraz czytelne systemy informacji wizualnej zgodne z prawem farmaceutycznym.',
      assetsTitle: 'Nośniki Reklamy',
      assets: ['Apteczne krzyże LED', 'Tablice z mosiądzu i szkła', 'Tablice kierunkowe', 'Oznakowanie drzwi'],
      problemsTitle: 'Typowe Problemy',
      problems: ['Awarie animacji krzyża LED', 'Nieaktualne tablice informacyjne', 'Zmatowiałe szkło osłonowe', 'Uszkodzone czujniki zmierzchu'],
      solutionTitle: 'Rozwiązanie PixelRing',
      solution: 'Naprawa sterowników animacji, czyszczenie kloszy oraz natychmiastowa wymiana sensorów zmierzchowych.',
      ctaText: 'Rozpocznij Serwis dla Gabinetów/Aptek',
      hotspots: [
        {
          id: 'exterior',
          label: 'Znaki Apteczne & Tablice Zewnętrzne',
          dot: { x: 25, y: 50 },
          pill: { x: 12, y: 25 },
          description: 'Serwisujemy krzyże LED apteczne, polerujemy wyblakłe mosiężne tablice wejściowe i testujemy czujniki zmierzchowe. Naprawiamy uszkodzone sterowniki, wymieniamy elementy świetlne i zapewniamy w pełni widoczne, zgodne z przepisami oznakowanie zewnętrzne.'
        },
        {
          id: 'interior',
          label: 'Systemy Orientacji & Tablice Wewnętrzne',
          dot: { x: 75, y: 50 },
          pill: { x: 72, y: 25 },
          description: 'Sprawdzamy wewnętrzne tablice kierunkowe, oznaczenia pokoi i tablice identyfikacyjne gabinetu. Aktualizujemy przestarzałe spisy działów, wymieniamy pożółkłe osłony plastikowe i zapewniamy właściwe podświetlenie wszystkich wskaźników.'
        }
      ]
    },
    hotels: {
      id: 'hotels',
      title: 'Hotele i Pensjonaty',
      tag: 'Hotele / Pensjonaty / Hostele',
      description: 'Oznakowanie prestiżowych stref wejściowych, wielkogabarytowe reklamy dachowe oraz spójna nawigacja korytarzowa i pokojowa.',
      assetsTitle: 'Nośniki Reklamy',
      assets: ['Wielkie litery dachowe', 'Szyldy nad wejściem (Canopy)', 'Loga w recepcji', 'Numeracja pokoi'],
      problemsTitle: 'Typowe Problemy',
      problems: ['Zgaszona litera na dachu', 'Woda wewnątrz kasetonu', 'Korozja kotew mocujących', 'Nieczytelne oznaczenia pięter'],
      solutionTitle: 'Rozwiązanie PixelRing',
      solution: 'Prace alpinistyczne przy konserwacji liter dachowych, wymiana uszczelek oraz dbanie o doskonałą widoczność z oddali.',
      ctaText: 'Rozpocznij Serwis dla Hoteli',
      hotspots: [
        {
          id: 'exterior',
          label: 'Elewacja & Litery Dachowe',
          dot: { x: 25, y: 50 },
          pill: { x: 12, y: 25 },
          description: 'Serwisujemy i naprawiamy podświetlane litery dachowe, zadaszenia markizowe nad wejściem i systemy masztów flagowych. Eliminujemy przecieki wody w kasetonie, wymieniamy skorodowane kotwy i utrzymujemy maksymalną widoczność hotelu o każdej porze.'
        },
        {
          id: 'interior',
          label: 'Recepcja & System Orientacji',
          dot: { x: 75, y: 50 },
          pill: { x: 72, y: 25 },
          description: 'Sprawdzamy podświetlane loga recepcji, tablice kierunkowe na korytarzach i tabliczki z numerami pokoi. Wymieniamy przestarzałe strzałki kierunkowe, aktualizujemy oznakowanie pięter i dbamy o spójny premium wygląd we wszystkich strefach gościnnych.'
        }
      ]
    },
    offices: {
      id: 'offices',
      title: 'Biura i Kancelarie',
      tag: 'Kancelarie / Agencje / Coworkingi',
      description: 'Szyldy z plexi, matowienie szklanych ścianek działowych oraz elastyczne modułowe tabliczki na drzwi.',
      assetsTitle: 'Nośniki Reklamy',
      assets: ['Szyldy akrylowe i metalowe', 'Matowe folie na ściankach szklanych', 'Panele z logiem w lobby', 'Wymienne tabliczki drzwiowe'],
      problemsTitle: 'Typowe Problemy',
      problems: ['Pęcherze powietrza na folii', 'Brakujące metalowe dystanse', 'Nieaktualne nazwiska najemców', 'Zepsute reflektory LED'],
      solutionTitle: 'Rozwiązanie PixelRing',
      solution: 'Profesjonalne wyklejanie folii matowych bez zanieczyszczeń oraz natychmiastowa wymiana tabliczek przy zmianach kadrowych.',
      ctaText: 'Rozpocznij Serwis dla Biur',
      hotspots: [
        {
          id: 'exterior',
          label: 'Wejście & Tablice Najemców',
          dot: { x: 25, y: 50 },
          pill: { x: 12, y: 25 },
          description: 'Serwisujemy mosiężne tablice katalogów najemców, szyldy z nazwą budynku i oświetlenie wejścia. Polerujemy przyciemnione powierzchnie, aktualizujemy wpisy firm i zabezpieczamy luźne mocowania ścienne — dla profesjonalnego pierwszego wrażenia.'
        },
        {
          id: 'interior',
          label: 'Recepcja & Szklane Ścianki',
          dot: { x: 75, y: 50 },
          pill: { x: 72, y: 25 },
          description: 'Sprawdzamy podświetlane ścianki z logotypami firmowymi, folie szronione na szklanych ściankach działowych i tabliczki drzwiowe. Usuwamy bąble powietrza z folii, wymieniamy nieaktualne tabliczki z nazwiskami i dbamy o schludny, profesjonalny klimat biura.'
        }
      ]
    }
  },
  ar: {
    restaurants: {
      id: 'restaurants',
      title: 'المطاعم والمقاهي',
      tag: 'مطعم / مقهى / بار',
      description: 'إصلاح أنابيب النيون الكلاسيكية، وصناديق الضوء LED، ولوحات القوائم، وفينيل الإعلانات. نقوم بتحديث القوائم والملصقات مباشرة في الموقع أثناء عمليات التدقيق الدوري.',
      assetsTitle: 'الأصول الإعلانية',
      assets: ['لوحات نيون مضيئة', 'لوحات قوائم رقمية', 'ملصقات واجهات الفينيل', 'لوحات الرصيف القائمة'],
      problemsTitle: 'المشاكل الشائعة',
      problems: ['وميض في أحرف النيون', 'تلف المحولات والأسلاك', 'قوائم طعام ممزقة أو متسخة', 'بهتان أغطية الأكريليك'],
      solutionTitle: 'حل بكسل رينج',
      solution: 'استبدال استباقي لمصادر الطاقة التالفة، وإصلاح أنابيب النيون الزجاجية، وتغيير فوري للملصقات التالفة.',
      ctaText: 'بدء خدمة المطاعم',
      hotspots: [
        {
          id: 'exterior',
          label: 'التصميم الخارجي',
          dot: { x: 25, y: 50 },
          pill: { x: 12, y: 25 },
          description: 'نقوم بإجراء تدقيق شامل للإعلانات الخارجية لتحديد العيوب الخفية. نقوم بصيانة وإصلاح اللوحات الإعلانية للواجهات وتحديثها وتجديد عناصر الإضاءة وإعادتها لمظهرها الممتاز الخالي من العيوب.'
        },
        {
          id: 'interior',
          label: 'التصميم الداخلي واللوحات المضيئة',
          dot: { x: 75, y: 50 },
          pill: { x: 72, y: 25 },
          description: 'نقوم بفحص الإضاءة الداخلية، وصناديق الضوء، والشاشات الرقمية. نقوم بتشخيص الأعطال الإلكترونية والتوصيلات، والقضاء على الوميض، واستبدال مصادر الطاقة، وإصلاح لوحات القوائم الرقمية.'
        }
      ]
    },
    retail: {
      id: 'retail',
      title: 'محلات التجزئة والفروع',
      tag: 'بوتيكات / متاجر كبرى / فروع',
      description: 'صيانة الحروف ثلاثية الأبعاد المضيئة، وملصقات النوافذ، واللوحات الإعلانية الكبيرة لضمان مظهر متناسق للعلامة التجارية في جميع الفروع.',
      assetsTitle: 'الأصول الإعلانية',
      assets: ['حروف بارزة LED ثلاثية الأبعاد', 'ملصقات ورسومات النوافذ', 'أنظمة اللوحات المرنة', 'أعمدة اللوحات الإعلانية عند المداخل'],
      problemsTitle: 'المشاكل الشائعة',
      problems: ['تلف جزئي لوحدات LED', 'انفصال حواف الفينيل', 'اتساخ واجهات الأكريليك للوحات', 'أخطاء في التوصيلات الكهربائية'],
      solutionTitle: 'حل بكسل رينج',
      solution: 'تدقيق دوري لمستويات الإضاءة، وإصلاح ملصقات الفينيل (على الرطب/الجاف)، واتفاقيات مستوي الخدمة (SLA) للاستجابة السريعة.',
      ctaText: 'بدء خدمة محلات التجزئة',
      hotspots: [
        {
          id: 'exterior',
          label: 'لافتات الواجهة الخارجية',
          dot: { x: 25, y: 50 },
          pill: { x: 12, y: 25 },
          description: 'نفحص ونصون الحروف البارزة المضيئة ثلاثية الأبعاد، وملصقات فينيل النوافذ، وأعمدة لوحات المداخل. نشخّص الأعطال الجزئية في وحدات LED، نستبدل الوحدات المعطوبة، ونعيد للواجهة مظهر علامتها التجارية المتسق والمضيء.'
        },
        {
          id: 'interior',
          label: 'إضاءة وتجهيزات الداخل',
          dot: { x: 75, y: 50 },
          pill: { x: 72, y: 25 },
          description: 'نتحقق من إضاءة المتجر الداخلية، ولوحات الشعار المضاءة خلفياً، وإضاءة الرفوف. نزيل الوميض، نستبدل محركات LED، ونضمن إضاءة متساوية ومتوافقة مع العلامة التجارية على كل مساحات العرض.'
        }
      ]
    },
    salons: {
      id: 'salons',
      title: 'التجميل والياقة البرينية',
      tag: 'صالونات حلاقة / سبا / مراكز لياقة',
      description: 'حلول إضاءة أنيقة، ولوحات أكريليك فاخرة، وملصقات تظليل النوافذ لتوفير الخصوصية والمظهر الجمالي والترحيبي.',
      assetsTitle: 'الأصول الإعلانية',
      assets: ['خطوط نيون دقيقة', 'ملصقات تظليل الزجاج المطفية', 'لوحات أسعار صالحة', 'لوحات الترحيب بالمذاخل'],
      problemsTitle: 'المشاكل الشائعة',
      problems: ['إضاءة غير متساوية السطوع', 'فقاعات هواء تحت ملصقات تظليل النوافذ', 'ارتخاء مثبتات الحائط', 'خدوش في لوحة الأكريليك'],
      solutionTitle: 'حل بكسل رينج',
      solution: 'تركيب دقيق لملصقات تظليل الزجاج بدون غبار، وتعديل إضاءة الـ LED للحصول على إضاءة محيطية دافئة وغير مبهرة.',
      ctaText: 'بدء خدمة الصالونات',
      hotspots: [
        {
          id: 'exterior',
          label: 'الواجهة الزجاجية والمدخل',
          dot: { x: 25, y: 50 },
          pill: { x: 12, y: 25 },
          description: 'نصون ونجدد أفلام الخصوصية المطفية، ولافتات الشعار الدائرية المضيئة، وتوجيهات المدخل. نزيل فقاعات الهواء، نصلح الأفلام المتقشرة، ونستبدل المثبتات المفككة — لتبقى واجهة صالونك نظيفة وجذابة دائماً.'
        },
        {
          id: 'interior',
          label: 'النيون والإضاءة الداخلية',
          dot: { x: 75, y: 50 },
          pill: { x: 72, y: 25 },
          description: 'نفحص نصوص النيون الرفيعة، وإضاءة المرايا الخلفية، ولوحات الأسعار المضيئة. نضبط مستوى الإضاءة للحصول على أجواء دافئة ومتساوية، نستبدل المحولات المعطلة، ونضمن جواً مريحاً خالياً من الوهج.'
        }
      ]
    },
    dealers: {
      id: 'dealers',
      title: 'معارض ومراكز السيارات',
      tag: 'صالات عرض / مراكز صيانة',
      description: 'صيانة اللوحات الإعلانية الضخمة القائمة بذاتها، وأنظمة السواري والرايات، واللوحات الإرشادية في الساحات الخارجية الكبيرة.',
      assetsTitle: 'الأصول الإعلانية',
      assets: ['أعمدة لوحات ضخمة (حتى 8 أمتار)', 'أنظمة سواري ورايات', 'أعمدة إرشادية وتوجيهية', 'شعارات العلامات التجارية على الواجهة'],
      problemsTitle: 'المشاكل الشائعة',
      problems: ['تلف الرايات بفعل الرياح', 'أعطال كهربائية خارجية', 'بهتان الطباعة الكبيرة', 'صدأ في الهياكل الداعمة'],
      solutionTitle: 'حل بكسل رينج',
      solution: 'توفير رافعات سلة للعمل على الارتفاعات العلية، وفحص الأنظمة الكهربائية الرئيسية، واستبدال الأجزاء المتضررة بفعل الرياح.',
      ctaText: 'بدء خدمة معارض السيارات',
      hotspots: [
        {
          id: 'exterior',
          label: 'الأعمدة والإعلانات الخارجية',
          dot: { x: 25, y: 50 },
          pill: { x: 12, y: 25 },
          description: 'نصون ونعتني بالأعمدة الإعلانية الضخمة، وأنظمة سواري الرايات، وشعارات العلامات التجارية على الواجهات. نصلح أضرار العواصف، نستبدل العناصر المتضررة بفعل الرياح، ونختبر أنظمة الطاقة الخارجية لضمان الظهور المستمر.'
        },
        {
          id: 'interior',
          label: 'علامة الصالة وإضاءتها',
          dot: { x: 75, y: 50 },
          pill: { x: 72, y: 25 },
          description: 'نفحص جدران الرسومات التجارية، ولافتات التوجيه الداخلية، وإضاءة الصالة. نضبط مشاهد الإضاءة لعرض السيارات بأفضل صورة، ونحدّث ملصقات الموديلات والأسعار القديمة.'
        }
      ]
    },
    clinics: {
      id: 'clinics',
      title: 'المصحات والعيادات الطبية والصيدليات',
      tag: 'عيادات / صيدليات / مراكز طبية',
      description: 'لوحات إعلانية دقيقة، وعلامات صيدليات خضراء مضيئة، وأنظمة توجيه ميسرة للمرضى وفقاً للمعايير القانونية.',
      assetsTitle: 'الأصول الإعلانية',
      assets: ['علامات صيدلية خضراء مضيئة', 'لوحات نحاسية وزجاجية للمسميات', 'لوحات إرشادية (داخلية/خارجية)', 'مسميات الأبواب والتؾصصات'],
      problemsTitle: 'المشاكل الشائعة',
      problems: ['أعطال في حركة إضاءة علامة الصيدلية', 'مسميات وقوائم خدمات قسمية قديمة', 'ضبابية في الزجاج الواقي', 'عطل في مستشعرات الضوء التلقائية'],
      solutionTitle: 'حل بكسل رينج',
      solution: 'إصلاح فوري للوحات التحكم بحركة الإضاءة، وتلميع الزجاج، واستبدال مستشعرات الإضاءة الليلية التلقائية.',
      ctaText: 'بدء خدمة العيادات/الصيدليات',
      hotspots: [
        {
          id: 'exterior',
          label: 'علامات الصيدلية واللوحات الخارجية',
          dot: { x: 25, y: 50 },
          pill: { x: 12, y: 25 },
          description: 'نصون علامات الصيدلية الخضراء LED، نلمّع الألواح النحاسية المتجوية عند المدخل، ونختبر مستشعرات الضوء. نصلح أعطال لوحات التحكم، نستبدل عناصر الإضاءة، ونضمن تعريفاً خارجياً واضحاً ومتوافقاً مع المعايير القانونية.'
        },
        {
          id: 'interior',
          label: 'نظام التوجيه واللافتات الداخلية',
          dot: { x: 75, y: 50 },
          pill: { x: 72, y: 25 },
          description: 'نفحص لافتات التوجيه الداخلية، وأرقام الغرف، وأسماء التخصصات. نحدّث قوائم الأقسام القديمة، نستبدل الأغطية البلاستيكية المتصفرة، ونضمن إضاءة مناسبة لجميع المؤشرات الإرشادية.'
        }
      ]
    },
    hotels: {
      id: 'hotels',
      title: 'الفنادق والضيافة',
      tag: 'فنادق / دور يافة / نزل',
      description: 'لوحات مداخل فاخرة، وشعارات مضيئة ضخمة على الأسطح، وأنظمة إرشادية أنيقة للممرات والغرف واللوبي.',
      assetsTitle: 'الأصول الإعلانية',
      assets: ['لوحات أسطح ضخمة', 'لوحات مظلات المداخل', 'شعارات الاستقبال باللوبي', 'أرقام الغرف ومؤشرات الممرات'],
      problemsTitle: 'المشاكل الشائعة',
      problems: ['انطفاء حرف في لوحة السطح', 'تسرب المياه لداخل صناديق الضوء', 'صدأ في هياكل  التثبيت المرتفعة', 'مؤشرات ممرات قديمة'],
      solutionTitle: 'حل بكسل رينج',
      solution: 'استخدام متسلقين صناعيين لصيانة  الواجهات العلية، وتبديل مواد منع التسرب، والحفاظ على وضوح الرؤية عن بعد.',
      ctaText: 'بدء خدمة الفنادق',
      hotspots: [
        {
          id: 'exterior',
          label: 'الواجهة وحروف السطح',
          dot: { x: 25, y: 50 },
          pill: { x: 12, y: 25 },
          description: 'نصون ونصلح حروف السطح المضيئة، وكانوبي مدخل الفندق، وأنظمة الرايات. نعالج تسرب المياه في اللوحات المضيئة، نستبدل المراسي الصدئة، ونحافظ على أقصى قدر من الظهور لواجهة الفندق في أي وقت من اليوم.'
        },
        {
          id: 'interior',
          label: 'الاستقبال والتوجيه',
          dot: { x: 75, y: 50 },
          pill: { x: 72, y: 25 },
          description: 'نفحص شعارات الاستقبال المضاءة خلفياً، ولافتات التوجيه في الممرات، وأرقام الغرف. نستبدل الأسهم الإرشادية القديمة، نحدّث لافتات الطوابق، ونحافظ على مظهر فاخر متسق في جميع مناطق الضيوف.'
        }
      ]
    },
    offices: {
      id: 'offices',
      title: 'المكاتب والشركات',
      tag: 'مكاتب / مساحات عمل / وكالات',
      description: 'لوحات أكريليك أنيقة، وتظليل الحواجز الزجاجية لتوفير الخصوصية، وأنظمة مرنة قابلة للاستبدال لمسميات الأبواب.',
      assetsTitle: 'الأصول الإعلانية',
      assets: ['لوحات مسميات أكريليك ومعدن', 'ملصقات تظليل الحواجز الزجاجية', 'شعارات جدارية بالاستقبال', 'لوحات أبواب قابلة للتغيير'],
      problemsTitle: 'المشاكل الشائعة',
      problems: ['فقاعات هواء في ملصقات الحواجز الزجاجية', 'فقدان أغطيم المسافات المعدنية', 'مسميات مستأجريم قديمة', 'تلف كشافات إضاءة الـ LED'],
      solutionTitle: 'حل بكسل رينج',
      solution: 'تركيب دقيق لملصقات تظليل الحواجز الزجاجية دون فراغات، وتحديث فوري لمسميات الأبواب عند انتقال المستأجرين.',
      ctaText: 'بدء خدمة المكاتب',
      hotspots: [
        {
          id: 'exterior',
          label: 'المدخل ولوحات المستأجرين',
          dot: { x: 25, y: 50 },
          pill: { x: 12, y: 25 },
          description: 'نصون ألواح دليل المستأجرين النحاسية، ولافتات اسم المبنى، وإضاءة المدخل. نلمّع الأسطح المتعتمة، نحدّث قوائم الشركات، ونثبت المثبتات الجدارية المفككة — لانطباع أول احترافي وموثوق.'
        },
        {
          id: 'interior',
          label: 'الاستقبال والأقسام الزجاجية',
          dot: { x: 75, y: 50 },
          pill: { x: 72, y: 25 },
          description: 'نفحص جدران الشعارات المضاءة خلفياً، وأفلام التظليل على الأقسام الزجاجية، وبطاقات أسماء الأبواب. نزيل فقاعات الهواء من الأفلام، نستبدل البطاقات الاسمية القديمة، ونحافظ على أجواء داخلية أنيقة واحترافية في طوابق المكاتب.'
        }
      ]
    }
  }
};

interface BusinessShowcaseProps {
  locale: string;
}

export default function BusinessShowcase({ locale }: BusinessShowcaseProps) {
  const currentLocale = (SECTORS_LOCALES[locale as Locale] ? locale : 'de') as Locale;
  const t = SECTORS_LOCALES[currentLocale];
  const isRtl = currentLocale === 'ar';

  const [activeSector, setActiveSector] = useState<SectorKey>('restaurants');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleHashOrQuery = () => {
        const params = new URLSearchParams(window.location.search);
        const sectorParam = params.get('sector') as SectorKey;
        if (sectorParam && SECTOR_KEYS.includes(sectorParam)) {
          setActiveSector(sectorParam);
        } else {
          const hash = window.location.hash.replace('#', '') as SectorKey;
          if (hash && SECTOR_KEYS.includes(hash)) {
            setActiveSector(hash);
          }
        }
      };

      handleHashOrQuery();
      window.addEventListener('hashchange', handleHashOrQuery);
      return () => window.removeEventListener('hashchange', handleHashOrQuery);
    }
  }, []);

  const activeData = t[activeSector];

  const [activeHotspotId, setActiveHotspotId] = useState<string | null>(null);
  const currentHotspotId = activeData.hotspots?.some((hotspot) => hotspot.id === activeHotspotId)
    ? activeHotspotId
    : activeData.hotspots?.[0]?.id ?? null;

  const containerRef = React.useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragSplitRatio, setDragSplitRatio] = useState<number | null>(null);

  const calculateRatio = (clientX: number) => {
    if (!containerRef.current) return 0.5;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const ratio = x / rect.width;
    return Math.max(0.3, Math.min(0.7, ratio));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    const touch = e.touches[0];
    setDragSplitRatio(calculateRatio(touch.clientX));
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    setDragSplitRatio(calculateRatio(touch.clientX));
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (dragSplitRatio !== null) {
      if (dragSplitRatio > 0.5) {
        setActiveHotspotId('exterior');
      } else {
        setActiveHotspotId('interior');
      }
    }
    setDragSplitRatio(null);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Left click only
    setIsDragging(true);
    setDragSplitRatio(calculateRatio(e.clientX));
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      setDragSplitRatio(calculateRatio(e.clientX));
    };

    const handleMouseUp = () => {
      if (!isDragging) return;
      setIsDragging(false);
      if (dragSplitRatio !== null) {
        if (dragSplitRatio > 0.5) {
          setActiveHotspotId('exterior');
        } else {
          setActiveHotspotId('interior');
        }
      }
      setDragSplitRatio(null);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragSplitRatio]);

  const DEFAULT_HOTSPOT_HELP: Record<Locale, string> = {
    de: 'Klicken Sie auf die verschiedenen Bereiche des Fotos, um Service-Details anzuzeigen.',
    en: 'Click on the different areas of the photo to view servicing details.',
    ru: 'Нажмите на различные области фотографии, чтобы увидеть детали обслуживания.',
    tr: 'Servis detaylarını görmek için fotoğrafın farklı alanlarına tıklayın.',
    pl: 'Kliknij różne obszary na zdjęciu, aby wyświetlić szczegóły serwisu.',
    ar: 'انقر على المناطق المختلفة في الصورة لعرض تفاصيل الخدمة.'
  };


  const getSectorImages = (sector: SectorKey) => {
    if (sector === 'restaurants') {
      return {
        exterior: '/images/business/restaurant_exterior.png',
        interior: '/images/business/restaurant_lightbox.png',
        exteriorAlt: 'Restaurant Exterior',
        interiorAlt: 'Restaurant Interior',
      };
    }
    return {
      exterior: `/images/business/${sector}_exterior.png`,
      interior: `/images/business/${sector}_interior.png`,
      exteriorAlt: `${sector} exterior signage`,
      interiorAlt: `${sector} interior signage`,
    };
  };

    const renderInteractivePhotoShowcase = () => {
    if (!activeData.hotspots) return null;

    const currentHotspot = activeData.hotspots.find(h => h.id === currentHotspotId);
    
    // Localized services title
    const servicesTitle = {
      de: 'Ausgeführte Arbeiten & Audit',
      en: 'Performed Services & Audit',
      ru: 'Выполняемые работы и аудит',
      tr: 'Gerçekleştirilen Hizmetler ve Denetim',
      pl: 'Wykonywane prace i audyt',
      ar: 'الأعمال المنجزة والتدقيق'
    }[currentLocale];


    const currentRatio = isDragging && dragSplitRatio !== null 
      ? dragSplitRatio 
      : (currentHotspotId === 'exterior' ? 0.7 : 0.3);

    // Slant offset - 5% slant
    const slant = 0.05;
    const x1 = (currentRatio + slant) * 100;
    const x2 = (currentRatio - slant) * 100;

    const transitionClass = isDragging ? 'transition-none duration-0' : 'transition-all duration-500 ease-out';

    return (
      <div className="flex flex-col gap-3 w-full">
        {/* Detail Panel above the image */}
        <div className="min-h-[85px] transition-all duration-300">
          {currentHotspot ? (
            <div className="w-full p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex flex-col gap-2">
              {/* Active Block Title/Label */}
              <div className="flex items-center gap-2 pb-1.5 border-b border-white/5">
                <LogoRingDot className="w-3 h-3 text-[#B8643E]" />
                <h4 className="font-bold text-[12.5px] text-white">
                  {currentHotspot.label}
                </h4>
              </div>
              <div>
                <span className="text-emerald-400 font-extrabold uppercase tracking-wider text-[8.5px] block mb-0.5">
                  {servicesTitle}
                </span>
                <p className="text-slate-200 leading-relaxed text-[12.5px]">
                  {currentHotspot.description}
                </p>
              </div>
            </div>
          ) : (
            <div className="w-full p-3.5 rounded-2xl border border-dashed border-white/10 flex items-center justify-center min-h-[85px]">
              <p className="text-[12.5px] text-slate-400 text-center">
                {DEFAULT_HOTSPOT_HELP[currentLocale]}
              </p>
            </div>
          )}
        </div>

        {/* Main Photo Container - Aspect 16:9 on mobile, flatter 2.1:1 on desktop */}
        <div 
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="relative w-full aspect-[16/9] lg:aspect-[21/10] rounded-2xl overflow-hidden border border-slate-800/80 shadow-2xl bg-[#070E17] select-none group touch-none"
        >
          {/* Panel 1: Left - Restaurant Exterior */}
          <div 
            className={`absolute inset-0 group/panel-ext cursor-pointer ${transitionClass}`}
            style={{ 
              clipPath: `polygon(0 0, ${x1}% 0, ${x2}% 100%, 0 100%)`,
              zIndex: currentHotspotId === 'exterior' ? 12 : 5
            }}
            onClick={() => {
              if (!isDragging) setActiveHotspotId('exterior');
            }}
          >
            <Image
              src={getSectorImages(activeSector).exterior}
              alt={getSectorImages(activeSector).exteriorAlt}
              fill
              className={`object-cover transition-transform duration-700 ease-out select-none pointer-events-none ${
                currentHotspotId === 'exterior' ? 'scale-105 opacity-100 brightness-110' : 'scale-100 opacity-75 brightness-[0.75] group-hover/panel-ext:brightness-95 group-hover/panel-ext:scale-[1.02]'
              }`}
              sizes="(max-width: 1024px) 100vw, 800px"
              priority
            />
            <div className={`absolute inset-0 bg-[#B8643E]/10 transition-opacity duration-300 pointer-events-none ${currentHotspotId === 'exterior' ? 'opacity-100' : 'opacity-0'}`} />
          </div>

          {/* Panel 2: Right - Interior Lightbox */}
          <div 
            className={`absolute inset-0 group/panel-light cursor-pointer ${transitionClass}`}
            style={{ 
              clipPath: `polygon(${x1}% 0, 100% 0, 100% 100%, ${x2}% 100%)`,
              zIndex: currentHotspotId === 'interior' ? 12 : 5
            }}
            onClick={() => {
              if (!isDragging) setActiveHotspotId('interior');
            }}
          >
            <Image
              src={getSectorImages(activeSector).interior}
              alt={getSectorImages(activeSector).interiorAlt}
              fill
              className={`object-cover transition-transform duration-700 ease-out select-none pointer-events-none ${
                currentHotspotId === 'interior' ? 'scale-105 opacity-100 brightness-110' : 'scale-100 opacity-75 brightness-[0.75] group-hover/panel-light:brightness-95 group-hover/panel-light:scale-[1.02]'
              }`}
              sizes="(max-width: 1024px) 100vw, 800px"
              priority
            />
            <div className={`absolute inset-0 bg-[#B8643E]/10 transition-opacity duration-300 pointer-events-none ${currentHotspotId === 'interior' ? 'opacity-100' : 'opacity-0'}`} />
          </div>

          {/* Semi-transparent dark vignette overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/25 pointer-events-none z-10" />

          {/* Separator Lines (HTML/CSS clipped divs for perfect transition synchronization) */}
          {/* Glow outer divider line */}
          <div
            className={`absolute inset-0 bg-[#B8643E] opacity-50 z-20 pointer-events-none ${transitionClass}`}
            style={{
              clipPath: `polygon(${(x1 - 0.35)}% 0, ${(x1 + 0.35)}% 0, ${(x2 + 0.35)}% 100%, ${(x2 - 0.35)}% 100%)`
            }}
          />
          {/* Sharp inner divider line */}
          <div
            className={`absolute inset-0 bg-white/85 z-20 pointer-events-none ${transitionClass}`}
            style={{
              clipPath: `polygon(${(x1 - 0.1)}% 0, ${(x1 + 0.1)}% 0, ${(x2 + 0.1)}% 100%, ${(x2 - 0.1)}% 100%)`
            }}
          />

          {/* Glassmorphic Swipe Handle */}
          <div 
            className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-30 cursor-ew-resize flex flex-col items-center select-none ${transitionClass}`}
            style={{ 
              left: `${currentRatio * 100}%`,
            }}
          >

            {/* Circular Handle Button */}
            <div className="w-9 h-9 rounded-full bg-[#0D1B2A]/90 border border-[#B8643E] backdrop-blur-md flex items-center justify-center shadow-[0_0_12px_rgba(184,100,62,0.4)] transition-all duration-300 hover:scale-110 hover:shadow-[0_0_18px_rgba(184,100,62,0.6)] active:scale-95">
              <div className="flex items-center gap-0.5 text-white">
                {/* Custom SVG Left Arrow */}
                <svg className="w-3 h-3 fill-current text-slate-300" viewBox="0 0 24 24">
                  <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"/>
                </svg>
                {/* Custom SVG Right Arrow */}
                <svg className="w-3 h-3 fill-current text-slate-300" viewBox="0 0 24 24">
                  <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  // Helper function to return SVG elements based on selected sector
  const renderStorefrontGraphic = (sector: SectorKey) => {
    switch (sector) {
      case 'restaurants':
        return (
          <svg className="w-full max-w-[280px] h-auto" viewBox="0 0 200 150" fill="none">
            {/* Background structure */}
            <rect x="10" y="40" width="180" height="100" rx="4" fill="#0A1420" stroke="#1E293B" strokeWidth="2" />
            <line x1="10" y1="120" x2="190" y2="120" stroke="#1E293B" strokeWidth="2" />
            {/* Windows and doors */}
            <rect x="25" y="80" width="40" height="40" rx="2" fill="#0f1f33" stroke="#1E293B" />
            <rect x="135" y="80" width="40" height="40" rx="2" fill="#0f1f33" stroke="#1E293B" />
            <rect x="80" y="70" width="40" height="50" rx="2" fill="#0c1a2b" stroke="#1E293B" />
            {/* Door handle */}
            <line x1="110" y1="95" x2="110" y2="105" stroke="#334155" strokeWidth="2" />

            {/* Neon Cafe Sign */}
            <g className="animate-[pulse_2s_infinite]">
              <path d="M 65 30 L 135 30 L 135 55 L 65 55 Z" fill="#0D1B2A" stroke="#B8643E" strokeWidth="2" />
              <text x="100" y="47" fill="#B8643E" fontSize="11" fontWeight="bold" textAnchor="middle" letterSpacing="2" className="font-sans drop-shadow-[0_0_8px_#B8643E]">
                CAFE
              </text>
              {/* Glowing wires decoration */}
              <path d="M 100 18 Q 80 15 65 30 M 100 18 Q 120 15 135 30" stroke="#B8643E" strokeWidth="1" strokeDasharray="2,2" opacity="0.6" />
            </g>

            {/* Side-mounted Menu box */}
            <rect x="15" y="65" width="20" height="28" rx="1" fill="#0A1420" stroke="#B8643E" strokeWidth="1.5" />
            <rect x="18" y="68" width="14" height="22" rx="0.5" fill="#FFFBEB" opacity="0.9" className="animate-pulse" />
            <line x1="20" y1="73" x2="30" y2="73" stroke="#B8643E" strokeWidth="1" />
            <line x1="20" y1="77" x2="28" y2="77" stroke="#B8643E" strokeWidth="1" />
            <line x1="20" y1="81" x2="30" y2="81" stroke="#B8643E" strokeWidth="1" />
            <line x1="20" y1="85" x2="26" y2="85" stroke="#B8643E" strokeWidth="1" />
          </svg>
        );

      case 'retail':
        return (
          <svg className="w-full max-w-[280px] h-auto" viewBox="0 0 200 150" fill="none">
            {/* Storefront Outline */}
            <rect x="10" y="40" width="180" height="100" rx="2" fill="#09121E" stroke="#1E293B" strokeWidth="2" />
            {/* Large show windows */}
            <rect x="20" y="65" width="65" height="55" rx="1" fill="#0E1C2E" stroke="#1E293B" />
            <rect x="115" y="65" width="65" height="55" rx="1" fill="#0E1C2E" stroke="#1E293B" />
            {/* Center Door */}
            <rect x="90" y="65" width="20" height="55" rx="1" fill="#0B1625" stroke="#1E293B" />
            
            {/* Custom Retail Illuminated Letters */}
            <g className="animate-pulse">
              <text x="100" y="54" fill="#E2E8F0" fontSize="12" fontWeight="bold" textAnchor="middle" letterSpacing="4" className="font-sans drop-shadow-[0_0_10px_rgba(226,228,240,0.8)]">
                BOUTIQUE
              </text>
              <line x1="20" y1="58" x2="180" y2="58" stroke="#1E293B" strokeWidth="1" />
            </g>

            {/* Window mannequins / decal silhouettes */}
            <path d="M35 110 L45 85 L55 110 Z" fill="#1E293B" opacity="0.5" />
            <path d="M145 110 L155 85 L165 110 Z" fill="#1E293B" opacity="0.5" />
          </svg>
        );

      case 'salons':
        return (
          <svg className="w-full max-w-[280px] h-auto" viewBox="0 0 200 150" fill="none">
            <rect x="10" y="45" width="180" height="95" rx="6" fill="#0A1320" stroke="#1E293B" strokeWidth="2" />
            <rect x="35" y="75" width="45" height="65" fill="#0E1D30" stroke="#1E293B" />
            <rect x="120" y="75" width="45" height="65" fill="#0E1D30" stroke="#1E293B" />
            <rect x="85" y="75" width="30" height="65" fill="#09121F" stroke="#1E293B" />

            {/* Frosted Film mockup on windows */}
            <rect x="38" y="90" width="39" height="30" fill="#E2E8F0" opacity="0.2" rx="1" />
            <rect x="123" y="90" width="39" height="30" fill="#E2E8F0" opacity="0.2" rx="1" />
            {/* Elegant Logo decal lines */}
            <circle cx="57.5" cy="105" r="5" stroke="#E2E8F0" strokeWidth="0.75" opacity="0.4" />
            <circle cx="142.5" cy="105" r="5" stroke="#E2E8F0" strokeWidth="0.75" opacity="0.4" />

            {/* Backlit Circular Halo Sign */}
            <g className="animate-[pulse_3s_infinite]">
              <circle cx="100" cy="38" r="18" fill="#0A1320" stroke="#B8643E" strokeWidth="1.5" className="drop-shadow-[0_0_12px_rgba(184,100,62,0.6)]" />
              <path d="M94 38 C 94 34, 106 34, 106 38 C 106 42, 94 42, 94 38 Z" stroke="#B8643E" strokeWidth="1" />
              <text x="100" y="49" fill="#B8643E" fontSize="5" fontWeight="bold" textAnchor="middle" letterSpacing="1">
                SPA
              </text>
            </g>
          </svg>
        );

      case 'dealers':
        return (
          <svg className="w-full max-w-[280px] h-auto" viewBox="0 0 200 150" fill="none">
            {/* Showroom Building */}
            <path d="M10 50 L130 50 L130 130 L10 130 Z" fill="#0A1320" stroke="#1E293B" strokeWidth="2" />
            <rect x="20" y="70" width="100" height="60" fill="#0E1D30" stroke="#1E293B" />
            <line x1="53" y1="70" x2="53" y2="130" stroke="#1E293B" />
            <line x1="86" y1="70" x2="86" y2="130" stroke="#1E293B" />

            {/* Car shape silhouette inside showroom */}
            <path d="M 40 120 C 45 110, 75 110, 80 120 Z" fill="#1E293B" opacity="0.6" />
            <circle cx="48" cy="120" r="3" fill="#334155" />
            <circle cx="72" cy="120" r="3" fill="#334155" />

            {/* Glowing Brand Facade Logo */}
            <polygon points="60,57 75,57 70,64 65,64" fill="#38BDF8" className="animate-pulse drop-shadow-[0_0_6px_#38BDF8]" />
            
            {/* Massive Signage Pylon */}
            <g>
              {/* Main Pillar support */}
              <rect x="155" y="25" width="6" height="105" fill="#1E293B" />
              {/* Foundation base */}
              <rect x="145" y="125" width="26" height="5" fill="#334155" />
              {/* Glowing Pylon Board */}
              <rect x="142" y="25" width="32" height="55" rx="3" fill="#0A1320" stroke="#38BDF8" strokeWidth="2" className="animate-pulse drop-shadow-[0_0_10px_rgba(56,189,248,0.4)]" />
              {/* Brand indicators */}
              <circle cx="158" cy="38" r="5" stroke="#38BDF8" strokeWidth="1.5" />
              <line x1="148" y1="52" x2="168" y2="52" stroke="#38BDF8" strokeWidth="1.5" />
              <line x1="148" y1="60" x2="168" y2="60" stroke="#38BDF8" strokeWidth="1" />
              <line x1="148" y1="68" x2="162" y2="68" stroke="#38BDF8" strokeWidth="1" />
            </g>
          </svg>
        );

      case 'clinics':
        return (
          <svg className="w-full max-w-[280px] h-auto" viewBox="0 0 200 150" fill="none">
            {/* Clean Clinic Entrance */}
            <rect x="20" y="50" width="160" height="90" rx="3" fill="#0A1421" stroke="#1E293B" strokeWidth="2" />
            {/* Glass door */}
            <rect x="80" y="75" width="40" height="65" fill="#0E1D31" stroke="#1E293B" />
            <line x1="100" y1="75" x2="100" y2="140" stroke="#1E293B" />
            
            {/* Apotheke / Clinic sign plate */}
            <rect x="35" y="75" width="35" height="25" rx="1" fill="#080E17" stroke="#1E293B" />
            <line x1="40" y1="83" x2="65" y2="83" stroke="#94A3B8" strokeWidth="1.5" />
            <line x1="40" y1="90" x2="58" y2="90" stroke="#94A3B8" strokeWidth="1" />

            {/* Glowing Green Cross Pharmacy Sign */}
            <g className="animate-[pulse_1.5s_infinite]">
              <path d="M 135 25 L 147 25 L 147 37 L 159 37 L 159 49 L 147 49 L 147 61 L 135 61 L 135 49 L 123 49 L 123 37 L 135 37 Z" fill="#10B981" stroke="#10B981" strokeWidth="1.5" className="drop-shadow-[0_0_12px_#10B981]" />
              {/* Inner glowing core */}
              <path d="M 138 34 L 144 34 L 144 40 L 150 40 L 150 46 L 144 46 L 144 52 L 138 52 L 138 46 L 132 46 L 132 40 L 138 40 Z" fill="#FFF" opacity="0.6" />
              {/* Bracket mount */}
              <line x1="110" y1="43" x2="123" y2="43" stroke="#1E293B" strokeWidth="2" />
            </g>
          </svg>
        );

      case 'hotels':
        return (
          <svg className="w-full max-w-[280px] h-auto" viewBox="0 0 200 150" fill="none">
            {/* Grand Hotel Facade */}
            <rect x="30" y="55" width="140" height="85" rx="3" fill="#0A1320" stroke="#1E293B" strokeWidth="2" />
            {/* Columns */}
            <rect x="40" y="70" width="8" height="70" fill="#0D1B2D" stroke="#1E293B" />
            <rect x="152" y="70" width="8" height="70" fill="#0D1B2D" stroke="#1E293B" />
            {/* Entrance Marquee Canopy */}
            <path d="M 70 100 L 130 100 L 120 115 L 80 115 Z" fill="#070E17" stroke="#1E293B" />
            <rect x="85" y="115" width="30" height="25" fill="#0C1A2B" stroke="#1E293B" />

            {/* Glowing Roof Top HOTEL sign */}
            <g className="animate-pulse">
              <text x="100" y="45" fill="#B8643E" fontSize="15" fontWeight="extrabold" textAnchor="middle" letterSpacing="4" className="font-sans drop-shadow-[0_0_12px_#B8643E]">
                HOTEL
              </text>
              <line x1="50" y1="48" x2="150" y2="48" stroke="#B8643E" strokeWidth="1.5" />
              {/* Scaffolding structure behind letters */}
              <line x1="60" y1="48" x2="60" y2="55" stroke="#1E293B" />
              <line x1="80" y1="48" x2="80" y2="55" stroke="#1E293B" />
              <line x1="100" y1="48" x2="100" y2="55" stroke="#1E293B" />
              <line x1="120" y1="48" x2="120" y2="55" stroke="#1E293B" />
              <line x1="140" y1="48" x2="140" y2="55" stroke="#1E293B" />
            </g>

            {/* Warm window spots */}
            <rect x="58" y="70" width="12" height="15" fill="#FFFBEB" opacity="0.15" />
            <rect x="82" y="70" width="12" height="15" fill="#FFFBEB" opacity="0.15" />
            <rect x="106" y="70" width="12" height="15" fill="#FFFBEB" opacity="0.15" />
            <rect x="130" y="70" width="12" height="15" fill="#FFFBEB" opacity="0.15" />
          </svg>
        );

      case 'offices':
        return (
          <svg className="w-full max-w-[280px] h-auto" viewBox="0 0 200 150" fill="none">
            {/* Corporate Building entrance */}
            <rect x="15" y="45" width="170" height="95" rx="2" fill="#0A1420" stroke="#1E293B" strokeWidth="2" />
            {/* Large modern glass panels */}
            <rect x="25" y="65" width="60" height="75" fill="#0E1C2E" stroke="#1E293B" />
            <rect x="115" y="65" width="60" height="75" fill="#0E1C2E" stroke="#1E293B" />
            
            {/* Sliding Glass Doors */}
            <rect x="90" y="65" width="20" height="75" fill="#080E17" stroke="#1E293B" />

            {/* Engraved Logo Brass Plate next to door */}
            <g className="animate-pulse">
              <rect x="93" y="78" width="14" height="22" rx="0.5" fill="#D97706" opacity="0.8" className="drop-shadow-[0_0_5px_rgba(217,119,6,0.5)]" />
              <line x1="96" y1="83" x2="104" y2="83" stroke="#000" strokeWidth="0.75" />
              <line x1="96" y1="87" x2="102" y2="87" stroke="#000" strokeWidth="0.5" />
              <line x1="96" y1="91" x2="104" y2="91" stroke="#000" strokeWidth="0.5" />
              
              {/* Overhead Spot lights on facade */}
              <circle cx="100" cy="55" r="1.5" fill="#FFF" />
              <polygon points="100,55 90,65 110,65" fill="#FFFBEB" opacity="0.08" />
            </g>

            {/* Vertical directory sign silhouette inside glass */}
            <rect x="32" y="75" width="12" height="50" fill="#1E293B" opacity="0.5" />
          </svg>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`w-full ${isRtl ? 'rtl' : 'ltr'}`} dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start lg:items-stretch">
        
        {/* MOBILE: Premium Dropdown Selector (visible only below lg breakpoint) */}
        <div className="lg:hidden w-full relative mb-1">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full flex items-center justify-between px-5 py-4 rounded-2xl bg-[#0D1B2A] border border-slate-800 text-left text-white shadow-lg transition-all duration-300 hover:border-slate-700"
          >
            <div className="flex flex-col">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#B8643E] block">
                {t[activeSector].tag}
              </span>
              <span className="text-[16px] font-bold text-white mt-0.5 block">
                {t[activeSector].title}
              </span>
            </div>
            <svg 
              className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {isDropdownOpen && (
            <>
              {/* Invisible clickaway backdrop overlay */}
              <div 
                className="fixed inset-0 z-40 bg-black/10 backdrop-blur-[1px]" 
                onClick={() => setIsDropdownOpen(false)} 
              />
              
              <div className="absolute top-[calc(100%+8px)] left-0 right-0 z-50 rounded-2xl bg-[#0D1B2A]/95 border border-slate-800/90 shadow-2xl backdrop-blur-xl overflow-hidden py-2 transition-all duration-200">
                {SECTOR_KEYS.map((key) => {
                  const isSelected = activeSector === key;
                  const sector = t[key];
                  return (
                    <button
                      key={key}
                      onClick={() => {
                        setActiveSector(key);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full flex flex-col px-5 py-3 text-left transition-colors duration-200 relative z-50 ${
                        isSelected
                          ? 'bg-[#B8643E] text-white'
                          : 'text-slate-300 hover:bg-white/5 hover:text-white'
                      } ${isRtl ? 'text-right' : 'text-left'}`}
                    >
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${isSelected ? 'text-white/80' : 'text-[#B8643E]'}`}>
                        {sector.tag}
                      </span>
                      <span className="text-[15px] font-bold mt-0.5">
                        {sector.title}
                      </span>
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* DESKTOP: Sector Selector Tabs (visible on lg and above) */}
        <div className="hidden lg:flex lg:col-span-4 flex-col gap-2 xl:gap-3 min-h-0 h-full">
          {SECTOR_KEYS.map((key) => {
            const isActive = activeSector === key;
            const sector = t[key];
            return (
              <button
                key={key}
                onClick={() => setActiveSector(key)}
                className={`w-full flex flex-col justify-center px-6 rounded-2xl border transition-all duration-300 text-left overflow-hidden ${
                  isActive
                    ? 'shrink-0 py-[18px] bg-[#B8643E] text-white border-[#B8643E] shadow-md shadow-[#B8643E]/20 scale-[1.02]'
                    : 'flex-1 min-h-0 py-2 bg-[#F8FAFC] text-[#0D1B2A] border-[#E2E8F0] hover:bg-[#FFF4EC] hover:border-[#B8643E]/30'
                } ${isRtl ? 'text-right' : 'text-left'}`}
              >
                <h4 className={`text-[16px] font-bold leading-tight ${isActive ? '' : 'line-clamp-2'}`}>
                  {sector.title}
                </h4>
                <span className={`text-[12px] mt-1.5 ${isActive ? 'text-white/80' : 'hidden xl:block text-[#4A5568] truncate'}`}>
                  {sector.tag}
                </span>
              </button>
            );
          })}
        </div>

        <div className={`lg:col-span-8 bg-[#0D1B2A] rounded-3xl border border-slate-800 shadow-[0_20px_50px_rgba(13,27,42,0.3)] text-slate-100 flex flex-col justify-between relative overflow-hidden ${
          activeData.hotspots ? 'p-5 lg:p-6 min-h-0' : 'p-8 lg:p-10 min-h-[580px]'
        }`}>
          
          {/* Ambient light glow spheres in corners */}
          <div className="absolute -top-12 -right-12 w-64 h-64 bg-[#B8643E]/10 rounded-full blur-[80px] pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-sky-500/10 rounded-full blur-[80px] pointer-events-none" />
          
          <div className={`relative z-10 flex flex-col ${activeData.hotspots ? 'gap-4' : 'gap-8'}`}>
            {/* Header info */}
            <div className={activeData.hotspots ? 'mb-1' : ''}>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 backdrop-blur-md">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#B8643E]">
                  {activeData.tag}
                </span>
              </div>
              {!activeData.hotspots && (
                <>
                  <h3 className="text-[28px] font-extrabold text-white leading-tight mt-2">
                    {activeData.title}
                  </h3>
                  <p className="mt-4 text-[15px] leading-relaxed text-slate-300">
                    {activeData.description}
                  </p>
                </>
              )}
            </div>

            {/* CONDITIONAL RENDERING: Option B (Visual-First Hotspots) for restaurants, old split for others */}
            {activeData.hotspots ? (
              renderInteractivePhotoShowcase()
            ) : (
              <>
                {/* Split layout: Graphic Facade mockup on one side, Lists on the other */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                  
                  {/* Storefront graphic simulation */}
                  <div className="md:col-span-5 flex justify-center bg-[#070E17]/60 rounded-2xl border border-slate-800 p-6 relative overflow-hidden h-[180px] items-center">
                    {/* Micro tech grid lines backdrop */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#33415508_1px,transparent_1px),linear-gradient(to_bottom,#33415508_1px,transparent_1px)] bg-[size:16px_16px]" />
                    
                    {renderStorefrontGraphic(activeSector)}
                  </div>

                  {/* Lists column */}
                  <div className="md:col-span-7 space-y-5 text-[14px]">
                    {/* Werbe-Assets */}
                    <div>
                      <h5 className="font-bold text-slate-400 uppercase text-[11px] tracking-wider mb-2">
                        {activeData.assetsTitle}
                      </h5>
                      <div className="flex flex-wrap gap-2">
                        {activeData.assets.map((asset, i) => (
                          <span key={i} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-slate-300 text-[12px]">
                            {asset}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Typische Probleme */}
                    <div>
                      <h5 className="font-bold text-red-400/80 uppercase text-[11px] tracking-wider mb-2">
                        {activeData.problemsTitle}
                      </h5>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-300 text-[13px]">
                        {activeData.problems.map((problem, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                            <span>{problem}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Solution Alert Section */}
                <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 text-emerald-400 font-bold">
                    ✓
                  </div>
                  <div>
                    <span className="font-extrabold text-[11px] uppercase tracking-wider text-emerald-400 block mb-1">
                      {activeData.solutionTitle}
                    </span>
                    <p className="text-[13px] leading-relaxed text-slate-200">
                      {activeData.solution}
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Action button at bottom */}
          {!activeData.hotspots && (
            <div className="mt-8 pt-6 border-t border-slate-800/80 flex justify-end relative z-10">
              <LeistungenRequestButton
                label={activeData.ctaText}
                serviceIntent={`business-sector-${activeSector}`}
                className="w-full sm:w-auto !min-h-[52px] !px-8 text-[15px]"
              />
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
