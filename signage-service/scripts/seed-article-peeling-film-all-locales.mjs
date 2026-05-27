/**
 * Seed: multilingual article for "Folie loest sich" (peeling-film).
 *
 * Reads the owner-review markdown drafts from docs/07_content_ai_seo and publishes
 * the public full article section into cms_articles for all MVP locales.
 *
 * Run: node scripts/seed-article-peeling-film-all-locales.mjs
 */

import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import dotenv from 'dotenv';
import { Client } from 'pg';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const appDir = path.resolve(__dirname, '..');
const repoDir = path.resolve(appDir, '..');

dotenv.config({ path: path.join(appDir, '.env.local') });
dotenv.config({ path: path.join(appDir, '.env') });

const connectionString =
  process.env.POSTGRES_PRISMA_URL ??
  process.env.DATABASE_URL ??
  process.env.DIRECT_URL ??
  process.env.POSTGRES_URL_NON_POOLING;

if (!connectionString) {
  throw new Error('Missing DB connection string.');
}

const now = new Date();

const ARTICLE_FOLDER = path.join(
  repoDir,
  'docs',
  '07_content_ai_seo',
  'problem_articles',
  'пленка на витрине отклеивается – 06'
);

const SHARED = {
  slug: 'peeling-film',
  publicSlug: 'folie-loest-sich',
  relatedSlugs: ['faded-film', 'uneven-light', 'urgent-repair'],
  sortOrder: 5,
};

const SELF_REPAIR_TIPS = {
  de: {
    intro:
      'Wenn sich Folie am Schaufenster, Glas oder Leuchtkasten löst, sollte zuerst der Umfang dokumentiert werden, ohne die Kante weiter zu beschädigen.',
    withoutOpening: [
      'Machen Sie ein Foto der Gesamtansicht, ein Nahfoto der Kante und ein Foto aus seitlichem Winkel.',
      'Notieren Sie, ob sich nur eine Ecke, eine Kante, eine Grafiksektion oder eine große Fläche löst.',
      'Halten Sie fest, ob das Problem nach Regen, Frost, Hitze, Reinigung, neuer Verklebung oder mechanischem Kontakt sichtbar wurde.',
      'Beschreiben Sie Untergrund und Zugang: Glas, Tür, Schaufenster, Leuchtkasten, Acrylglas, Polycarbonat, vom Boden erreichbar oder in der Höhe.',
    ],
    technicalSpecialist: [
      'Bei passender Erfahrung kann eine technische Fachperson beurteilen, ob eine kleine saubere Kante lokal nachgearbeitet werden kann.',
      'Vor einer Neuverklebung müssen Untergrund, Klebereste, Feuchtigkeit, Reinigungsmittelrückstände, Materialtyp, Kantenabstand und Leuchtkastenfront geprüft werden.',
    ],
    doNotDo: [
      'Die gelöste Kante nicht weiter abziehen und verschmutzten Kleber nicht mit Gewalt zurückdrücken.',
      'Keine Heißluft, Klingen, harten Schaber, Lösungsmittel oder Haushaltskleber ohne Erfahrung verwenden.',
      'Große Folien, Leuchtkastenfronten, Acrylglas oder Polycarbonat nicht ohne sicheren Zugang und Materialkenntnis demontieren.',
    ],
    qualificationNote:
      'Diese Hinweise sind keine Reparaturanleitung. Arbeiten an großen Glasflächen, Leuchtkästen, Acrylglas, Polycarbonat, Foliengrafik und in der Höhe sollten nur mit passender Erfahrung und sicherem Zugang erfolgen.',
  },
  en: {
    intro:
      'If film on a storefront window, glass panel or lightbox is lifting, first document the scale without making the edge worse.',
    withoutOpening: [
      'Take an overall photo, a close-up of the edge and a side-angle photo.',
      'Note whether only one corner, one edge, one graphic section or a large area is lifting.',
      'Record whether the issue appeared after rain, frost, heat, cleaning, recent installation or mechanical contact.',
      'Describe the substrate and access: glass, door, storefront, lightbox, acrylic, polycarbonate, reachable from the floor or at height.',
    ],
    technicalSpecialist: [
      'With suitable experience, a technical specialist can judge whether a small clean edge can be reworked locally.',
      'Before reapplication, the substrate, old adhesive, moisture, cleaning residue, film type, edge clearance and lightbox face need to be checked.',
    ],
    doNotDo: [
      'Do not pull the lifted edge further or force contaminated adhesive back onto the surface.',
      'Do not use heat guns, blades, hard scrapers, solvents or household glue without experience.',
      'Do not remove large films, lightbox faces, acrylic or polycarbonate without safe access and material knowledge.',
    ],
    qualificationNote:
      'These tips are not a repair instruction. Work on large glass areas, lightboxes, acrylic, polycarbonate, film graphics and height access should only be done with suitable experience and safe access.',
  },
  ru: {
    intro:
      'Если плёнка на витрине, стекле или лайтбоксе отклеивается, сначала важно зафиксировать масштаб проблемы и не повредить край ещё сильнее.',
    withoutOpening: [
      'Сделайте фото общего вида, крупное фото края и фото под углом.',
      'Отметьте, отходит один угол, край, отдельная секция графики или большая площадь.',
      'Запишите, появилась ли проблема после дождя, мороза, жары, мойки, новой оклейки или механического контакта.',
      'Укажите поверхность и доступ: стекло, дверь, витрина, лайтбокс, акрил, поликарбонат, доступ с пола или высота.',
    ],
    technicalSpecialist: [
      'При подходящем опыте технический специалист может оценить, можно ли локально восстановить маленький чистый край.',
      'Перед новой оклейкой нужно проверить основание, старый клей, влагу, остатки чистящих средств, тип плёнки, отступ от края и лицевую панель лайтбокса.',
    ],
    doNotDo: [
      'Не тянуть отслоившийся край дальше и не прижимать загрязнённый клей силой обратно.',
      'Не использовать строительный фен, лезвия, жёсткие скребки, растворители или бытовой клей без опыта.',
      'Не снимать большие плёнки, лицевые панели лайтбоксов, акрил или поликарбонат без безопасного доступа и понимания материала.',
    ],
    qualificationNote:
      'Это не инструкция по самостоятельному ремонту. Работы с большими стеклянными поверхностями, лайтбоксами, акрилом, поликарбонатом, рекламной плёнкой и высотой лучше выполнять только при подходящем опыте и безопасном доступе.',
  },
  tr: {
    intro:
      'Vitrin, cam veya lightbox üzerindeki folyo kalkıyorsa önce kenarı daha fazla bozmadan sorunun ölçeğini belgelemek gerekir.',
    withoutOpening: [
      'Genel fotoğraf, kenarın yakın fotoğrafı ve açılı fotoğraf çekin.',
      'Sadece bir köşe mi, bir kenar mı, grafik bölümü mü yoksa büyük alan mı kalkıyor not edin.',
      'Sorunun yağmur, don, sıcak, temizlik, yeni uygulama veya mekanik temas sonrası çıkıp çıkmadığını yazın.',
      'Yüzeyi ve erişimi belirtin: cam, kapı, vitrin, lightbox, akrilik, polikarbonat, zeminden erişim veya yükseklik.',
    ],
    technicalSpecialist: [
      'Uygun deneyim varsa teknik uzman küçük ve temiz bir kenarın lokal olarak düzeltilip düzeltilemeyeceğini değerlendirebilir.',
      'Yeni uygulamadan önce yüzey, eski yapışkan, nem, temizlik kalıntıları, folyo türü, kenar mesafesi ve lightbox ön paneli kontrol edilmelidir.',
    ],
    doNotDo: [
      'Kalkmış kenarı çekmeyin ve kirlenmiş yapışkanı zorla geri bastırmayın.',
      'Deneyim olmadan sıcak hava tabancası, bıçak, sert kazıyıcı, solvent veya ev tipi yapıştırıcı kullanmayın.',
      'Güvenli erişim ve malzeme bilgisi olmadan büyük folyoları, lightbox ön panelini, akrilik veya polikarbonatı sökmeyin.',
    ],
    qualificationNote:
      'Bu bilgiler kendi kendine onarım talimatı değildir. Büyük cam yüzeyler, lightbox, akrilik, polikarbonat, reklam folyosu ve yüksekte çalışma uygun deneyim ve güvenli erişimle yapılmalıdır.',
  },
  pl: {
    intro:
      'Jeśli folia na witrynie, szybie lub kasetonie odkleja się, najpierw trzeba udokumentować skalę problemu bez dalszego uszkadzania krawędzi.',
    withoutOpening: [
      'Zrób zdjęcie ogólne, zbliżenie krawędzi i zdjęcie pod kątem.',
      'Zanotuj, czy odchodzi jeden narożnik, krawędź, sekcja grafiki czy duża powierzchnia.',
      'Zapisz, czy problem pojawił się po deszczu, mrozie, upale, myciu, nowym oklejeniu albo kontakcie mechanicznym.',
      'Podaj podłoże i dostęp: szkło, drzwi, witryna, kaseton, akryl, poliwęglan, dostęp z podłogi albo wysokość.',
    ],
    technicalSpecialist: [
      'Przy odpowiednim doświadczeniu osoba techniczna może ocenić, czy małą czystą krawędź da się poprawić lokalnie.',
      'Przed ponownym oklejeniem trzeba sprawdzić podłoże, stary klej, wilgoć, resztki środków czyszczących, typ folii, odstęp od krawędzi i panel kasetonu.',
    ],
    doNotDo: [
      'Nie ciągnij odklejonej krawędzi i nie dociskaj siłą zabrudzonego kleju.',
      'Nie używaj opalarki, ostrzy, twardych skrobaków, rozpuszczalników ani domowego kleju bez doświadczenia.',
      'Nie demontuj dużych folii, paneli kasetonu, akrylu ani poliwęglanu bez bezpiecznego dostępu i znajomości materiału.',
    ],
    qualificationNote:
      'To nie jest instrukcja samodzielnej naprawy. Prace przy dużych szybach, kasetonach, akrylu, poliwęglanie, folii reklamowej i na wysokości powinny być wykonywane tylko z odpowiednim doświadczeniem i bezpiecznym dostępem.',
  },
  ar: {
    intro:
      'إذا بدأ الفيلم على الواجهة الزجاجية أو الزجاج أو صندوق الإضاءة بالانفصال، فالخطوة الأولى هي توثيق حجم المشكلة من دون زيادة تلف الحافة.',
    withoutOpening: [
      'التقط صورة عامة، وصورة قريبة للحافة، وصورة من زاوية جانبية.',
      'سجل هل المشكلة في زاوية واحدة أو حافة واحدة أو قسم من التصميم أو مساحة كبيرة.',
      'اكتب هل ظهرت المشكلة بعد المطر أو الصقيع أو الحر أو التنظيف أو تركيب جديد أو احتكاك ميكانيكي.',
      'اذكر نوع السطح والوصول: زجاج، باب، واجهة، صندوق إضاءة، أكريليك، بولي كربونات، وصول من الأرض أو مكان مرتفع.',
    ],
    technicalSpecialist: [
      'مع الخبرة المناسبة يمكن للمختص تقييم ما إذا كانت الحافة الصغيرة والنظيفة قابلة للمعالجة المحلية.',
      'قبل إعادة التركيب يجب فحص السطح، اللاصق القديم، الرطوبة، بقايا مواد التنظيف، نوع الفيلم، مسافة الحافة ولوح صندوق الإضاءة.',
    ],
    doNotDo: [
      'لا تسحب الحافة المنفصلة أكثر، ولا تضغط اللاصق المتسخ بقوة إلى مكانه.',
      'لا تستخدم مسدس حرارة أو شفرات أو كاشطات صلبة أو مذيبات أو غراء منزلي من دون خبرة.',
      'لا تزل أفلاما كبيرة أو ألواح صناديق الإضاءة أو الأكريليك أو البولي كربونات من دون وصول آمن ومعرفة بالمادة.',
    ],
    qualificationNote:
      'هذه النصائح ليست تعليمات للإصلاح الذاتي. العمل على الزجاج الكبير وصناديق الإضاءة والأكريليك والبولي كربونات وفيلم الإعلان والأماكن المرتفعة يجب أن يتم فقط مع خبرة مناسبة ووصول آمن.',
  },
};

const LOCALE_CONFIG = {
  de: {
    file: 'problem_article_folie-loest-sich_de.md',
    title: 'Folie am Schaufenster löst sich',
    symptomLabel: 'Folie am Schaufenster löst sich',
    shortAnswer:
      'Wenn Folie am Schaufenster, Glas oder Leuchtkasten absteht, kommen häufig Temperatur, Feuchtigkeit, Oberflächenvorbereitung, Kleberzustand, Materialwahl oder Reinigung als Ursache infrage.',
    seoTitle: 'Folie am Schaufenster löst sich: Ursachen, Prüfung und nächste Schritte | PixelRing',
    seoDescription:
      'Folie am Schaufenster oder Leuchtkasten löst sich, wirft Blasen oder hängt herunter? PixelRing erklärt mögliche Ursachen: Temperatur, Feuchtigkeit, Schmutz, Klebstoff, Glas, Leuchtkasten und Montagefehler.',
    causes: [
      'Verklebung bei zu niedriger oder ungünstiger Temperatur',
      'Feuchtigkeit, Kondensat oder verbliebene Montageflüssigkeit',
      'Staub, Fett, Silikon, alter Kleber oder Reinigungsmittelrückstände auf der Oberfläche',
      'Verunreinigte Klebekante, zu geringer Rakeldruck oder gedehnte Folie',
      'Ungeeigneter Folientyp für Schaufenster, Leuchtkasten, Acrylglas oder Polycarbonat',
    ],
    safeChecks: [
      'Fotos der Gesamtansicht, der Kante und eines seitlichen Winkels machen',
      'Notieren, ob Ecke, Kante, Stoß, Mitte oder große Fläche betroffen ist',
      'Alter der Folie und Zusammenhang mit Regen, Frost, Hitze, Reinigung oder neuer Verklebung festhalten',
      'Untergrund, Montagehöhe und sicheren Zugang beschreiben',
    ],
    urgentWarnings: [
      'Zeitnah prüfen lassen, wenn Folie großflächig hängt, in der Höhe montiert ist, Tür oder Sicht behindert, nahe Glasrissen liegt oder auf einem Leuchtkasten mit beschädigter Front sitzt.',
    ],
    serviceProcess: [
      'PixelRing prüft Startpunkt der Ablösung, Untergrund, Kleberzustand, Feuchtigkeit, Verschmutzung, Kantenabstand, Folientyp, Leuchtkastenfront, Zugang und ob lokale Nacharbeit oder Neuverklebung sinnvoll ist.',
    ],
    workScopeFactors: [
      'Größe und Lage der betroffenen Folienfläche',
      'Untergrund: Glas, Tür, Schaufenster, Leuchtkasten, Acrylglas oder Polycarbonat',
      'Alter und Zustand von Folie, Kleber, Kanten und alter Grafik',
      'Montagehöhe, Zugang und möglicher Demontagebedarf',
      'Notwendigkeit von Reinigung, Teilersatz, Materialwechsel oder kompletter Neuverklebung',
    ],
    ctaLabel: 'Problem übergeben',
  },
  en: {
    file: 'problem_article_folie-loest-sich_en.md',
    title: 'Film on a storefront window is peeling off',
    symptomLabel: 'Window or lightbox film is peeling',
    shortAnswer:
      'If film on a storefront window, glass panel or lightbox is lifting, common causes include temperature, moisture, surface preparation, adhesive condition, material choice or cleaning damage.',
    seoTitle: 'Film on a storefront window is peeling off: causes, checks, and next steps | PixelRing',
    seoDescription:
      'Is film on your storefront window or lightbox peeling, bubbling, or sagging? PixelRing explains likely causes: temperature, moisture, dirt, adhesive, glass, lightboxes, and installation errors.',
    causes: [
      'Application at too low or unsuitable a temperature',
      'Moisture, condensation or trapped application fluid',
      'Dust, grease, silicone, old adhesive or cleaner residue on the surface',
      'Contaminated adhesive edge, insufficient squeegee pressure or stretched film',
      'Wrong film type for storefront glass, lightboxes, acrylic or polycarbonate',
    ],
    safeChecks: [
      'Take overview, close-up edge and side-angle photos',
      'Note whether a corner, edge, seam, center area or large section is affected',
      'Record film age and whether rain, frost, heat, cleaning or recent installation was involved',
      'Describe substrate, installation height and safe access',
    ],
    urgentWarnings: [
      'Act quickly if film is sagging across a large area, installed at height, blocking a door or visibility, near cracked glass, or on a lightbox with a damaged face panel.',
    ],
    serviceProcess: [
      'PixelRing checks the starting point, substrate, adhesive condition, moisture, contamination, edge clearance, film type, lightbox face, access and whether local rework or reapplication is sensible.',
    ],
    workScopeFactors: [
      'Size and position of the affected film area',
      'Substrate: glass, door, storefront, lightbox, acrylic or polycarbonate',
      'Age and condition of film, adhesive, edges and old graphics',
      'Installation height, access and possible removal needs',
      'Need for cleaning, section replacement, material change or full reapplication',
    ],
    ctaLabel: 'Send the issue',
  },
  ru: {
    file: 'problem_article_folie-loest-sich_ru.md',
    title: 'Плёнка на витрине отклеивается',
    symptomLabel: 'Плёнка на витрине отклеивается',
    shortAnswer:
      'Если плёнка на витрине, стекле или лайтбоксе отходит по краям, часто причина связана с температурой, влагой, подготовкой поверхности, клеем, материалом или мойкой.',
    seoTitle: 'Плёнка на витрине отклеивается: причины, диагностика и что делать | PixelRing',
    seoDescription:
      'Плёнка на витрине или лайтбоксе отклеивается по краям, пузырится или провисает? PixelRing объясняет причины: температура, влага, грязь, клей, стекло, лайтбокс и ошибки монтажа.',
    causes: [
      'Оклейка выполнялась при неподходящей температуре',
      'На поверхности была влага, конденсат или остаточная монтажная жидкость',
      'Стекло или панель были плохо очищены от грязи, жира, силикона или старого клея',
      'Клеевой край загрязнился, плёнка растянулась или была плохо прижата',
      'Материал не подходит для стекла, улицы, лайтбокса, акрила или поликарбоната',
    ],
    safeChecks: [
      'Сделать фото общего вида, крупный план края и фото под углом',
      'Отметить, отходит угол, край, стык, центр или большая площадь',
      'Записать возраст плёнки и связь с дождём, морозом, жарой, мойкой или новой оклейкой',
      'Указать поверхность, высоту и доступ к месту',
    ],
    urgentWarnings: [
      'Быстро обратиться к специалисту, если плёнка провисает большой частью, находится на высоте, мешает двери или обзору, рядом есть трещина стекла либо повреждён лайтбокс.',
    ],
    serviceProcess: [
      'PixelRing проверяет точку начала отслоения, поверхность, состояние клея, влагу, грязь, отступ от рам, тип плёнки, лицевую панель лайтбокса, доступ и возможность локальной обработки или переклейки.',
    ],
    workScopeFactors: [
      'Площадь и расположение отслоившейся плёнки',
      'Тип поверхности: стекло, дверь, витрина, лайтбокс, акрил или поликарбонат',
      'Возраст и состояние плёнки, клея, краёв и старой графики',
      'Высота монтажа, доступ и необходимость демонтажа',
      'Нужна ли чистка, частичная замена, смена материала или полная переклейка',
    ],
    ctaLabel: 'Передать задачу',
  },
  tr: {
    file: 'problem_article_folie-loest-sich_tr.md',
    title: 'Vitrin folyosu kalkıyor',
    symptomLabel: 'Vitrin folyosu kalkıyor',
    shortAnswer:
      'Vitrin, cam veya lightbox üzerindeki folyo kenardan kalkıyorsa neden çoğu zaman sıcaklık, nem, yüzey hazırlığı, yapışkan durumu, malzeme seçimi veya temizlik hasarıdır.',
    seoTitle: 'Vitrin folyosu kalkıyor: neden olur ve ne yapmak gerekir | PixelRing',
    seoDescription:
      'Vitrin, cam kapı veya ışıklı kutu üzerindeki reklam folyosu kenardan kalkıyor, kabarıyor ya da sarkıyor mu? PixelRing olası nedenleri ve güvenli kontrolü açıklar.',
    causes: [
      'Uygulama çok düşük veya uygun olmayan sıcaklıkta yapıldı',
      'Yüzeyde nem, yoğuşma veya kalan montaj sıvısı vardı',
      'Cam ya da panel kir, yağ, silikon veya eski yapışkandan yeterince temizlenmedi',
      'Yapışkan kenar kirlendi, folyo gerildi veya yeterince bastırılmadı',
      'Malzeme vitrin, lightbox, akrilik veya polikarbonat için uygun değil',
    ],
    safeChecks: [
      'Genel fotoğraf, kenar yakın planı ve açılı fotoğraf çekin',
      'Köşe, kenar, birleşim, orta bölge veya büyük alanın etkilenip etkilenmediğini not edin',
      'Folyo yaşını ve yağmur, don, sıcak, temizlik veya yeni uygulama bağlantısını yazın',
      'Yüzey, yükseklik ve erişim bilgisini belirtin',
    ],
    urgentWarnings: [
      'Folyo büyük alanda sarkıyorsa, yüksekteyse, kapı veya görüşü engelliyorsa, cam çatlağına yakınsa ya da lightbox paneli hasarlıysa hızlıca uzmanla görüşün.',
    ],
    serviceProcess: [
      'PixelRing ayrılmanın başlangıç noktasını, yüzeyi, yapışkanı, nemi, kiri, kenar mesafesini, folyo türünü, lightbox panelini, erişimi ve lokal işlem ya da yeniden uygulama gereğini kontrol eder.',
    ],
    workScopeFactors: [
      'Etkilenen folyo alanının boyutu ve konumu',
      'Yüzey: cam, kapı, vitrin, lightbox, akrilik veya polikarbonat',
      'Folyo, yapışkan, kenar ve eski grafik durumu',
      'Montaj yüksekliği, erişim ve söküm ihtiyacı',
      'Temizlik, kısmi değişim, malzeme değişimi veya tam yeniden uygulama gereği',
    ],
    ctaLabel: 'Sorunu ilet',
  },
  pl: {
    file: 'problem_article_folie-loest-sich_pl.md',
    title: 'Folia na witrynie odkleja się',
    symptomLabel: 'Folia na witrynie odkleja się',
    shortAnswer:
      'Jeśli folia na witrynie, szybie lub kasetonie odchodzi od krawędzi, przyczyną bywa temperatura, wilgoć, przygotowanie powierzchni, stan kleju, dobór materiału albo czyszczenie.',
    seoTitle: 'Folia na witrynie odkleja się: przyczyny i co zrobić | PixelRing',
    seoDescription:
      'Folia na witrynie, szybie, drzwiach lub kasetonie odkleja się, robi pęcherze albo podnosi na krawędziach? PixelRing wyjaśnia możliwe przyczyny i bezpieczne kroki.',
    causes: [
      'Aplikacja w zbyt niskiej lub nieodpowiedniej temperaturze',
      'Wilgoć, kondensat albo resztka płynu montażowego',
      'Szkło lub panel nie zostały dobrze oczyszczone z brudu, tłuszczu, silikonu albo starego kleju',
      'Krawędź kleju zabrudziła się, folia była rozciągnięta albo za słabo dociśnięta',
      'Materiał nie pasuje do witryny, kasetonu, akrylu lub poliwęglanu',
    ],
    safeChecks: [
      'Zrobić zdjęcie ogólne, zbliżenie krawędzi i zdjęcie pod kątem',
      'Zanotować, czy odchodzi narożnik, krawędź, łączenie, środek czy duża powierzchnia',
      'Podać wiek folii i związek z deszczem, mrozem, upałem, myciem albo nowym montażem',
      'Opisać powierzchnię, wysokość i dostęp do miejsca',
    ],
    urgentWarnings: [
      'Szybko skontaktować się ze specjalistą, jeśli folia zwisa dużą częścią, jest na wysokości, blokuje drzwi lub widok, znajduje się przy pęknięciu szkła albo na uszkodzonym kasetonie.',
    ],
    serviceProcess: [
      'PixelRing sprawdza punkt początku odklejenia, podłoże, klej, wilgoć, zabrudzenia, odstęp od krawędzi, typ folii, panel kasetonu, dostęp i sens lokalnej poprawki lub ponownego oklejenia.',
    ],
    workScopeFactors: [
      'Powierzchnia i położenie odklejonej folii',
      'Typ podłoża: szkło, drzwi, witryna, kaseton, akryl lub poliwęglan',
      'Wiek i stan folii, kleju, krawędzi oraz starej grafiki',
      'Wysokość montażu, dostęp i potrzeba demontażu',
      'Potrzeba czyszczenia, wymiany fragmentu, zmiany materiału albo pełnego oklejenia',
    ],
    ctaLabel: 'Przekaż zgłoszenie',
  },
  ar: {
    file: 'problem_article_folie-loest-sich_ar.md',
    title: 'فيلم الإعلان على الواجهة الزجاجية ينفصل',
    symptomLabel: 'فيلم الإعلان على الواجهة الزجاجية ينفصل',
    shortAnswer:
      'إذا بدأ الفيلم على الواجهة أو الزجاج أو صندوق الإضاءة بالانفصال من الأطراف، فقد يكون السبب الحرارة أو الرطوبة أو تجهيز السطح أو حالة اللاصق أو نوع المادة أو التنظيف.',
    seoTitle: 'فيلم الإعلان على الواجهة الزجاجية ينفصل: الأسباب والخطوة التالية | PixelRing',
    seoDescription:
      'هل بدأ فيلم الإعلان على الواجهة الزجاجية أو الباب الزجاجي أو صندوق الإضاءة بالانفصال أو تكوين فقاعات أو الارتفاع من الأطراف؟ توضح PixelRing الأسباب والخطوات الآمنة.',
    causes: [
      'تم التركيب في درجة حرارة منخفضة أو غير مناسبة',
      'رطوبة أو تكاثف أو سائل تركيب متبق تحت الفيلم',
      'الزجاج أو اللوح لم ينظف جيدا من الأوساخ أو الدهون أو السيليكون أو اللاصق القديم',
      'تلوثت حافة اللاصق أو تمدد الفيلم أو لم يتم ضغطه جيدا',
      'المادة غير مناسبة للواجهة أو صندوق الإضاءة أو الأكريليك أو البولي كربونات',
    ],
    safeChecks: [
      'التقاط صورة عامة وصورة قريبة للحافة وصورة من زاوية',
      'تسجيل هل المشكلة في زاوية أو حافة أو نقطة التقاء أو وسط الفيلم أو مساحة كبيرة',
      'ذكر عمر الفيلم وهل ظهرت المشكلة بعد المطر أو الصقيع أو الحر أو التنظيف أو تركيب جديد',
      'توضيح نوع السطح والارتفاع وإمكانية الوصول',
    ],
    urgentWarnings: [
      'يجب التواصل بسرعة مع مختص إذا كان الفيلم يترهل على مساحة كبيرة، أو في مكان مرتفع، أو يعيق الباب أو الرؤية، أو قرب شرخ في الزجاج، أو على صندوق إضاءة متضرر.',
    ],
    serviceProcess: [
      'تفحص PixelRing نقطة بداية الانفصال، السطح، حالة اللاصق، الرطوبة، الأوساخ، مسافة الحافة، نوع الفيلم، لوح صندوق الإضاءة، الوصول، وهل تكفي معالجة محلية أو يلزم تركيب جديد.',
    ],
    workScopeFactors: [
      'حجم وموقع مساحة الفيلم المتضررة',
      'نوع السطح: زجاج، باب، واجهة، صندوق إضاءة، أكريليك أو بولي كربونات',
      'عمر وحالة الفيلم واللاصق والحواف والتصميم القديم',
      'ارتفاع التركيب والوصول والحاجة إلى إزالة',
      'الحاجة إلى تنظيف أو استبدال جزئي أو تغيير المادة أو إعادة تركيب كاملة',
    ],
    ctaLabel: 'أرسل المشكلة',
  },
};

function extractPublicArticle(markdown) {
  const match = markdown.match(/## 3\.[^\n]*\n\n([\s\S]*?)\n\n---\n\n## 4\./);
  if (!match) {
    throw new Error('Could not extract public full article section from markdown.');
  }

  const content = match[1].trim();
  if (!content.startsWith('# ')) {
    throw new Error('Extracted article does not start with H1.');
  }
  if (content.length < 5000) {
    throw new Error(`Extracted article is unexpectedly short: ${content.length} characters.`);
  }

  return content;
}

function readArticle(locale, config) {
  const filePath = path.join(ARTICLE_FOLDER, config.file);
  const markdown = fs.readFileSync(filePath, 'utf8');

  return {
    locale,
    type: 'SYMPTOM',
    status: 'PUBLISHED',
    slug: SHARED.slug,
    title: config.title,
    symptomLabel: config.symptomLabel,
    shortAnswer: config.shortAnswer,
    content: extractPublicArticle(markdown),
    seoTitle: config.seoTitle,
    seoDescription: config.seoDescription,
    canonicalUrl: `/${locale}/probleme-loesungen/${SHARED.publicSlug}`,
    relatedSlugs: SHARED.relatedSlugs,
    causes: config.causes,
    safeChecks: config.safeChecks,
    selfRepairTips: SELF_REPAIR_TIPS[locale] ?? null,
    urgentWarnings: config.urgentWarnings,
    serviceProcess: config.serviceProcess,
    workScopeFactors: config.workScopeFactors,
    ctaLabel: config.ctaLabel,
    ctaHref: `/${locale}#contact`,
    sortOrder: SHARED.sortOrder,
    publishedAt: now,
    lastReviewedAt: now,
    deletedAt: null,
    createdAt: now,
    updatedAt: now,
  };
}

const upsertSql = `
  INSERT INTO "cms_articles" (
    "id","locale","type","status","slug","title","symptomLabel","shortAnswer",
    "content","seoTitle","seoDescription","canonicalUrl","relatedSlugs",
    "causes","safeChecks","selfRepairTips","urgentWarnings","serviceProcess","workScopeFactors",
    "ctaLabel","ctaHref","sortOrder","publishedAt","lastReviewedAt",
    "deletedAt","createdAt","updatedAt"
  ) VALUES (
    $1,$2,$3::"CmsArticleType",$4::"CmsArticleStatus",$5,$6,$7,$8,
    $9,$10,$11,$12,$13::text[],$14::text[],$15::text[],$16::jsonb,$17::text[],
    $18::text[],$19::text[],$20,$21,$22,$23,$24,$25,$26,$27
  )
  ON CONFLICT ("locale", "slug")
  DO UPDATE SET
    "type" = EXCLUDED."type",
    "status" = EXCLUDED."status",
    "title" = EXCLUDED."title",
    "symptomLabel" = EXCLUDED."symptomLabel",
    "shortAnswer" = EXCLUDED."shortAnswer",
    "content" = EXCLUDED."content",
    "seoTitle" = EXCLUDED."seoTitle",
    "seoDescription" = EXCLUDED."seoDescription",
    "canonicalUrl" = EXCLUDED."canonicalUrl",
    "relatedSlugs" = EXCLUDED."relatedSlugs",
    "causes" = EXCLUDED."causes",
    "safeChecks" = EXCLUDED."safeChecks",
    "selfRepairTips" = EXCLUDED."selfRepairTips",
    "urgentWarnings" = EXCLUDED."urgentWarnings",
    "serviceProcess" = EXCLUDED."serviceProcess",
    "workScopeFactors" = EXCLUDED."workScopeFactors",
    "ctaLabel" = EXCLUDED."ctaLabel",
    "ctaHref" = EXCLUDED."ctaHref",
    "sortOrder" = EXCLUDED."sortOrder",
    "publishedAt" = EXCLUDED."publishedAt",
    "lastReviewedAt" = EXCLUDED."lastReviewedAt",
    "deletedAt" = EXCLUDED."deletedAt",
    "updatedAt" = EXCLUDED."updatedAt"
  RETURNING "id", "locale", "slug", "status", "canonicalUrl", char_length("content") AS "contentChars"
`;

async function upsertArticle(client, article) {
  const values = [
    crypto.randomUUID(),
    article.locale,
    article.type,
    article.status,
    article.slug,
    article.title,
    article.symptomLabel,
    article.shortAnswer,
    article.content,
    article.seoTitle,
    article.seoDescription,
    article.canonicalUrl,
    article.relatedSlugs,
    article.causes,
    article.safeChecks,
    article.selfRepairTips ? JSON.stringify(article.selfRepairTips) : null,
    article.urgentWarnings,
    article.serviceProcess,
    article.workScopeFactors,
    article.ctaLabel,
    article.ctaHref,
    article.sortOrder,
    article.publishedAt,
    article.lastReviewedAt,
    article.deletedAt,
    article.createdAt,
    article.updatedAt,
  ];

  const result = await client.query(upsertSql, values);
  return result.rows[0];
}

async function main() {
  const client = new Client({ connectionString });
  await client.connect();

  try {
    const results = [];
    for (const [locale, config] of Object.entries(LOCALE_CONFIG)) {
      const article = readArticle(locale, config);
      results.push(await upsertArticle(client, article));
    }

    console.log(
      JSON.stringify(
        {
          seed: 'article-peeling-film-all-locales',
          slug: SHARED.slug,
          publicSlug: SHARED.publicSlug,
          status: 'OK',
          results,
        },
        null,
        2
      )
    );
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
