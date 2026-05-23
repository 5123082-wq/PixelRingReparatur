import { randomUUID } from 'crypto';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });
dotenv.config({ path: path.join(process.cwd(), '.env') });

const IMAGE_SET = {
  led: 'https://images.unsplash.com/photo-1563207153-f404bf5e566d?auto=format&fit=crop&q=80',
  neon: 'https://images.unsplash.com/photo-1554260570-e9689a3418b8?auto=format&fit=crop&q=80',
  lightbox: 'https://images.unsplash.com/photo-1565620731358-e8c038ecbfda?auto=format&fit=crop&q=80',
  film: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80',
  mounting: 'https://images.unsplash.com/photo-1541888087525-24b52c0f9948?auto=format&fit=crop&q=80',
  business: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80',
  repair: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80',
  maintenance: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&q=80',
  ledNatural: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80',
  process: 'https://images.unsplash.com/photo-1534073828943-f801091bb18c?auto=format&fit=crop&q=80',
  design: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80',
  dismantling: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80',
  beforeGeneral: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&q=80',
  generatedLedDetail: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&q=80',
  generatedLightboxLift: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80',
  generatedNeonBench: 'https://images.unsplash.com/photo-1572949645841-094f3a9c4c94?auto=format&fit=crop&q=80',
  generatedWindowFilm: 'https://images.unsplash.com/photo-1541888087525-24b52c0f9948?auto=format&fit=crop&q=80',
  generatedFacadeLine: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80',
  generatedBranchEvening: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80',
  generatedStorefrontRow: 'https://images.unsplash.com/photo-1565620731358-e8c038ecbfda?auto=format&fit=crop&q=80',
  generatedCircuitRepair: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80',
};

type Locale = 'de' | 'en' | 'ru' | 'tr' | 'pl' | 'ar';

type BaseReferenceCase = {
  id: string;
  beforeImage: string;
  afterImage: string;
  gallery: string[];
};

type ReferenceCaseCopy = {
  id: string;
  title: string;
  category: string;
  problem: string;
  work: string;
  result: string;
  defaultText: string;
  beforeText: string;
};

type ReferenceCase = BaseReferenceCase & ReferenceCaseCopy;

const BASE_CASES: BaseReferenceCase[] = [
  {
    id: 'lightbox-facade',
    beforeImage: IMAGE_SET.beforeGeneral,
    afterImage: IMAGE_SET.lightbox,
    gallery: [IMAGE_SET.beforeGeneral, IMAGE_SET.lightbox, IMAGE_SET.repair],
  },
  {
    id: 'led-letters',
    beforeImage: IMAGE_SET.dismantling,
    afterImage: IMAGE_SET.led,
    gallery: [IMAGE_SET.dismantling, IMAGE_SET.led, IMAGE_SET.ledNatural],
  },
  {
    id: 'neon-contour',
    beforeImage: IMAGE_SET.process,
    afterImage: IMAGE_SET.neon,
    gallery: [IMAGE_SET.process, IMAGE_SET.neon, IMAGE_SET.maintenance],
  },
  {
    id: 'window-film',
    beforeImage: IMAGE_SET.design,
    afterImage: IMAGE_SET.film,
    gallery: [IMAGE_SET.design, IMAGE_SET.film, IMAGE_SET.mounting],
  },
  {
    id: 'branch-service',
    beforeImage: IMAGE_SET.maintenance,
    afterImage: IMAGE_SET.business,
    gallery: [IMAGE_SET.maintenance, IMAGE_SET.business, IMAGE_SET.repair],
  },
  {
    id: 'mounting-review',
    beforeImage: IMAGE_SET.maintenance,
    afterImage: IMAGE_SET.mounting,
    gallery: [IMAGE_SET.maintenance, IMAGE_SET.mounting, IMAGE_SET.ledNatural],
  },
];

const CASE_COPY: Record<Locale, ReferenceCaseCopy[]> = {
  de: [
    { id: 'lightbox-facade', title: 'LED-Lightbox an der Fassade', category: 'Leuchtkasten', problem: 'Ein Teil des Lichtfelds blieb dunkel, der Eingang wirkte abends vernachlässigt.', work: 'Stromversorgung geprüft, beschädigte LED-Elemente ersetzt, Innenfläche gereinigt und Helligkeit angeglichen.', result: 'Die Fassade wirkt abends wieder aktiv und gut sichtbar.', defaultText: 'Gleichmäßige Ausleuchtung für bessere Abendwirkung.', beforeText: 'Vorher: dunkle Bereiche und ein sichtbar gealterter Kasten.' },
    { id: 'led-letters', title: 'LED-Buchstaben eines Shops', category: 'LED-Buchstaben', problem: 'Mehrere Buchstaben waren ausgefallen, die Beschriftung wurde falsch gelesen.', work: 'Verbindungen geprüft, defekte Module ersetzt und die Helligkeit mit den Nachbarelementen abgestimmt.', result: 'Der Name ist wieder vollständig lesbar.', defaultText: 'Buchstaben lesen sich wieder als saubere Wortmarke.', beforeText: 'Vorher: einzelne Buchstaben fehlten im Lichtbild.' },
    { id: 'neon-contour', title: 'Neon-Kontur an Bar-Fassade', category: 'Neon', problem: 'Ein Riss im Glas führte zum Ausfall eines gesamten Segments der Kontur.', work: 'Das defekte Rohrstück vermessen, in gleicher Farbe neu geblasen und vor Ort mit neuem Trafo installiert.', result: 'Die durchgehende Linie der Bar ist wiederhergestellt.', defaultText: 'Leuchtende Farben und fließende Linien ohne Unterbrechung.', beforeText: 'Vorher: defektes Rohrstück unterbrach die Kontur.' },
    { id: 'window-film', title: 'Schaufenster-Folierung', category: 'Folierung', problem: 'Die alte Folie blätterte ab, das Logo war verblasst und unansehnlich.', work: 'Alte Folie rückstandslos entfernt, Scheiben gereinigt und neue UV-beständige Folie blasenfrei appliziert.', result: 'Das Schaufenster wirkt wieder einladend und repräsentativ.', defaultText: 'Scharfe Konturen und frische Farben an der Scheibe.', beforeText: 'Vorher: abgelöste und verblichene Folienteile.' },
    { id: 'branch-service', title: 'Filial-Wartung', category: 'Service', problem: 'Mehrere Filialen meldeten Ausfälle bei der Außenbeleuchtung nach einem Unwetter.', work: 'Priorisierte Routenplanung, Fehlerdiagnose vor Ort, Austausch von Netzteilen und Leuchtmitteln.', result: 'Alle Filialen sind wieder CI-konform beleuchtet.', defaultText: 'Einheitlicher Markenauftritt an allen Standorten.', beforeText: 'Vorher: unterschiedliche Lichtbilder durch defekte Anlagen.' },
    { id: 'mounting-review', title: 'Fassaden-Montage', category: 'Montage', problem: 'Ein Sturm hatte Teile der Unterkonstruktion einer großen Anlage gelockert.', work: 'Mit Hebebühne gesichert, Verschraubungen erneuert und Anlage sturmfest nach DIN-Norm neu verankert.', result: 'Die Anlage ist sicher und entspricht den aktuellen Vorgaben.', defaultText: 'Sicherer Halt und normgerechte Befestigung.', beforeText: 'Vorher: lockere Elemente nach starkem Wind.' },
  ],
  en: [
    { id: 'lightbox-facade', title: 'Facade LED Lightbox', category: 'Lightbox', problem: 'Part of the light field was dark, making the entrance look neglected at night.', work: 'Checked power supply, replaced damaged LED elements, cleaned interior, and balanced brightness.', result: 'The facade looks active and highly visible again.', defaultText: 'Even illumination for better evening impact.', beforeText: 'Before: dark areas and a visibly aged box.' },
    { id: 'led-letters', title: 'Shop LED Letters', category: 'LED Letters', problem: 'Several letters had failed, causing the sign to be misread.', work: 'Checked connections, replaced defective modules, and matched brightness with adjacent elements.', result: 'The name is fully readable again.', defaultText: 'Letters read as a clean wordmark once more.', beforeText: 'Before: individual letters were missing in the light pattern.' },
    { id: 'neon-contour', title: 'Bar Facade Neon Contour', category: 'Neon', problem: 'A crack in the glass caused an entire segment of the contour to fail.', work: 'Measured the defective tube, blew a new one in the same color, and installed it on-site with a new transformer.', result: 'The continuous line of the bar is restored.', defaultText: 'Bright colors and flowing lines without interruption.', beforeText: 'Before: defective tube piece interrupted the contour.' },
    { id: 'window-film', title: 'Storefront Window Film', category: 'Window Film', problem: 'The old film was peeling, and the logo was faded and unsightly.', work: 'Removed old film without residue, cleaned windows, and applied new UV-resistant film without bubbles.', result: 'The storefront looks inviting and representative again.', defaultText: 'Sharp contours and fresh colors on the window.', beforeText: 'Before: peeling and faded film sections.' },
    { id: 'branch-service', title: 'Branch Service & Maintenance', category: 'Service', problem: 'Several branches reported exterior lighting failures after a storm.', work: 'Prioritized route planning, on-site diagnostics, replacement of power supplies and lamps.', result: 'All branches are illuminated in compliance with CI again.', defaultText: 'Consistent brand image across all locations.', beforeText: 'Before: inconsistent lighting due to defective systems.' },
    { id: 'mounting-review', title: 'Facade Sign Mounting', category: 'Mounting', problem: 'A storm had loosened parts of the substructure of a large sign.', work: 'Secured with a lift, renewed screwed connections, and re-anchored the sign to be stormproof according to DIN standards.', result: 'The sign is safe and complies with current regulations.', defaultText: 'Secure hold and standard-compliant mounting.', beforeText: 'Before: loose elements after strong wind.' },
  ],
  ru: [
    { id: 'lightbox-facade', title: 'Световой короб на фасаде', category: 'Лайтбокс', problem: 'Часть светового поля не горела, из-за чего вход вечером выглядел заброшенным.', work: 'Проверили питание, заменили поврежденные LED-модули, очистили внутреннюю часть и выровняли яркость.', result: 'Фасад снова выглядит активным и хорошо заметным вечером.', defaultText: 'Равномерное освещение для лучшего эффекта в темное время суток.', beforeText: 'До: темные участки и заметно постаревший короб.' },
    { id: 'led-letters', title: 'LED-буквы для магазина', category: 'Объемные буквы', problem: 'Несколько букв погасли, вывеска читалась неправильно.', work: 'Проверили контакты, заменили неисправные модули и настроили яркость под соседние элементы.', result: 'Название снова полностью читается.', defaultText: 'Буквы снова складываются в аккуратный логотип.', beforeText: 'До: в вывеске не хватало отдельных букв.' },
    { id: 'neon-contour', title: 'Неоновый контур на фасаде бара', category: 'Неон', problem: 'Трещина в стекле привела к выходу из строя целого сегмента контура.', work: 'Сделали замеры поврежденной трубки, изготовили новую того же цвета и установили на месте с новым трансформатором.', result: 'Непрерывная линия бара восстановлена.', defaultText: 'Яркие цвета и плавные линии без прерываний.', beforeText: 'До: разбитая трубка разрывала контур.' },
    { id: 'window-film', title: 'Оклейка витрин пленкой', category: 'Оклейка', problem: 'Старая пленка начала отслаиваться, логотип выцвел и потерял вид.', work: 'Удалили старую пленку без следов, очистили стекла и наклеили новую УФ-стойкую пленку без пузырей.', result: 'Витрина снова выглядит привлекательно и представительно.', defaultText: 'Четкие контуры и свежие цвета на стекле.', beforeText: 'До: отслоившиеся и выцветшие участки пленки.' },
    { id: 'branch-service', title: 'Обслуживание сети филиалов', category: 'Сервис', problem: 'Несколько филиалов сообщили о проблемах с наружным освещением после грозы.', work: 'Спланировали приоритетные маршруты, провели диагностику на местах, заменили блоки питания и лампы.', result: 'Все филиалы снова освещены в соответствии с фирменным стилем.', defaultText: 'Единый имидж бренда на всех локациях.', beforeText: 'До: разное освещение из-за неисправных систем.' },
    { id: 'mounting-review', title: 'Монтаж фасадной вывески', category: 'Монтаж', problem: 'Из-за шторма расшатались элементы крепления крупногабаритной вывески.', work: 'С помощью автовышки зафиксировали конструкцию, обновили крепления и закрепили по стандартам DIN для защиты от ветра.', result: 'Вывеска надежно закреплена и соответствует актуальным нормам безопасности.', defaultText: 'Надежная фиксация и монтаж по стандартам.', beforeText: 'До: расшатанные элементы после сильного ветра.' },
  ],
  tr: [
    { id: 'lightbox-facade', title: 'Cephe LED Işıklı Kutu', category: 'Işıklı Kutu', problem: 'Işık alanının bir kısmı karanlıktı, bu da girişin akşamları bakımsız görünmesine neden oluyordu.', work: 'Güç kaynağı kontrol edildi, hasarlı LED elemanları değiştirildi, iç kısım temizlendi ve parlaklık dengelendi.', result: 'Cephe akşamları tekrar canlı ve iyi görünür durumda.', defaultText: 'Daha iyi akşam etkisi için eşit aydınlatma.', beforeText: 'Öncesi: karanlık alanlar ve gözle görülür şekilde eskimiş bir kutu.' },
    { id: 'led-letters', title: 'Mağaza LED Harfleri', category: 'LED Harfler', problem: 'Birkaç harf sönmüştü, bu da yazının yanlış okunmasına neden oluyordu.', work: 'Bağlantılar kontrol edildi, arızalı modüller değiştirildi ve parlaklık komşu elemanlarla uyumlu hale getirildi.', result: 'İsim tekrar tamamen okunabilir durumda.', defaultText: 'Harfler tekrar temiz bir kelime markası olarak okunuyor.', beforeText: 'Öncesi: ışık deseninde eksik harfler vardı.' },
    { id: 'neon-contour', title: 'Bar Cephesi Neon Kontur', category: 'Neon', problem: 'Camdaki bir çatlak, konturun bir segmentinin tamamen bozulmasına neden oldu.', work: 'Arızalı tüp ölçüldü, aynı renkte yenisi üretildi ve yeni bir transformatörle yerinde monte edildi.', result: 'Barın kesintisiz çizgisi geri getirildi.', defaultText: 'Kesintisiz parlak renkler ve akıcı çizgiler.', beforeText: 'Öncesi: arızalı tüp parçası konturu kesintiye uğratmıştı.' },
    { id: 'window-film', title: 'Vitrin Folyo Kaplama', category: 'Folyo Kaplama', problem: 'Eski folyo dökülüyordu, logo solmuş ve çirkin görünüyordu.', work: 'Eski folyo kalıntı bırakmadan söküldü, camlar temizlendi ve yeni UV ışınlarına dayanıklı folyo kabarcıksız olarak uygulandı.', result: 'Vitrin tekrar davetkar ve kurumsal görünüyor.', defaultText: 'Camda keskin hatlar ve taze renkler.', beforeText: 'Öncesi: dökülen ve solmuş folyo parçaları.' },
    { id: 'branch-service', title: 'Şube Bakım ve Servis', category: 'Servis', problem: 'Bir fırtınadan sonra birkaç şube dış aydınlatma arızası bildirdi.', work: 'Öncelikli rota planlaması yapıldı, yerinde arıza tespiti gerçekleştirildi, güç kaynakları ve ampuller değiştirildi.', result: 'Tüm şubeler kurumsal kimliğe uygun olarak tekrar aydınlatıldı.', defaultText: 'Tüm konumlarda tutarlı marka imajı.', beforeText: 'Öncesi: arızalı sistemler nedeniyle farklı aydınlatma görüntüleri.' },
    { id: 'mounting-review', title: 'Cephe Tabela Montajı', category: 'Montaj', problem: 'Bir fırtına, büyük bir tabelanın altyapı parçalarını gevşetmişti.', work: 'Sepetli vinç ile emniyete alındı, vida bağlantıları yenilendi ve tabela fırtınaya dayanıklı DIN standartlarına göre yeniden sabitlendi.', result: 'Tabela güvenli ve mevcut yönetmeliklere uygun hale getirildi.', defaultText: 'Güvenli tutuş ve standartlara uygun montaj.', beforeText: 'Öncesi: şiddetli rüzgardan sonra gevşemiş elemanlar.' },
  ],
  pl: [
    { id: 'lightbox-facade', title: 'Kaseton LED na elewacji', category: 'Kaseton', problem: 'Część pola świetlnego była ciemna, przez co wejście wieczorem wyglądało na zaniedbane.', work: 'Sprawdzono zasilanie, wymieniono uszkodzone elementy LED, wyczyszczono wnętrze i wyrównano jasność.', result: 'Elewacja znów wygląda aktywnie i jest dobrze widoczna wieczorem.', defaultText: 'Równomierne oświetlenie dla lepszego efektu wieczornego.', beforeText: 'Przed: ciemne obszary i widocznie zestarzały kaseton.' },
    { id: 'led-letters', title: 'Litery LED dla sklepu', category: 'Litery LED', problem: 'Kilka liter zgasło, co powodowało błędne odczytywanie napisu.', work: 'Sprawdzono połączenia, wymieniono uszkodzone moduły i dostosowano jasność do sąsiednich elementów.', result: 'Nazwa jest znów w pełni czytelna.', defaultText: 'Litery znów układają się w czysty logotyp.', beforeText: 'Przed: brakowało pojedynczych liter w oświetleniu.' },
    { id: 'neon-contour', title: 'Kontur neonowy na elewacji baru', category: 'Neon', problem: 'Pęknięcie szkła spowodowało awarię całego segmentu konturu.', work: 'Zmierzono uszkodzoną rurkę, wydmuchano nową w tym samym kolorze i zamontowano na miejscu z nowym transformatorem.', result: 'Ciągła linia baru została przywrócona.', defaultText: 'Jasne kolory i płynne linie bez przerw.', beforeText: 'Przed: uszkodzona rurka przerywała kontur.' },
    { id: 'window-film', title: 'Oklejanie witryn folią', category: 'Oklejanie', problem: 'Stara folia łuszczyła się, a logo wyblakło i wyglądało nieestetycznie.', work: 'Usunięto starą folię bez śladów, wyczyszczono szyby i nałożono nową folię odporną na promieniowanie UV bez pęcherzyków powietrza.', result: 'Witryna znów wygląda zachęcająco i reprezentacyjnie.', defaultText: 'Ostre kontury i świeże kolory na szybie.', beforeText: 'Przed: łuszczące się i wyblakłe fragmenty folii.' },
    { id: 'branch-service', title: 'Obsługa serwisowa oddziałów', category: 'Serwis', problem: 'Kilka oddziałów zgłosiło awarie oświetlenia zewnętrznego po burzy.', work: 'Zaplanowano priorytetowe trasy, przeprowadzono diagnostykę na miejscu, wymieniono zasilacze i źródła światła.', result: 'Wszystkie oddziały są znów oświetlone zgodnie z identyfikacją wizualną.', defaultText: 'Spójny wizerunek marki we wszystkich lokalizacjach.', beforeText: 'Przed: różne oświetlenie z powodu niesprawnych systemów.' },
    { id: 'mounting-review', title: 'Montaż szyldu na elewacji', category: 'Montaż', problem: 'Wichura poluzowała części konstrukcji nośnej dużego szyldu.', work: 'Zabezpieczono z podnośnika koszowego, odnowiono połączenia śrubowe i zakotwiczono szyld zgodnie z normami DIN, aby był odporny na burze.', result: 'Szyld jest bezpieczny i spełnia aktualne przepisy.', defaultText: 'Pewne mocowanie i montaż zgodny z normami.', beforeText: 'Przed: luźne elementy po silnym wietrze.' },
  ],
  ar: [
    { id: 'lightbox-facade', title: 'صندوق إضاءة LED للواجهة', category: 'صندوق إضاءة', problem: 'كان جزء من مساحة الإضاءة معتماً، مما جعل المدخل يبدو مهملاً في المساء.', work: 'تم فحص مصدر الطاقة، واستبدال عناصر LED التالفة، وتنظيف الجزء الداخلي وموازنة السطوع.', result: 'عادت الواجهة لتبدو نشطة ومرئية بوضوح في المساء.', defaultText: 'إضاءة متساوية لتأثير مسائي أفضل.', beforeText: 'قبل: مناطق مظلمة وصندوق يبدو عليه القدم بوضوح.' },
    { id: 'led-letters', title: 'حروف LED للمتجر', category: 'حروف LED', problem: 'تعطلت عدة حروف، مما أدى إلى قراءة اللافتة بشكل خاطئ.', work: 'تم فحص التوصيلات، واستبدال الوحدات المعيبة، وضبط السطوع ليتناسب مع العناصر المجاورة.', result: 'عاد الاسم مقروءاً بالكامل.', defaultText: 'تُقرأ الحروف كعلامة نصية نظيفة مرة أخرى.', beforeText: 'قبل: كانت هناك حروف مفقودة في نمط الإضاءة.' },
    { id: 'neon-contour', title: 'محيط نيون لواجهة حانة', category: 'نيون', problem: 'أدى صدع في الزجاج إلى تعطل جزء كامل من المحيط.', work: 'تم قياس الأنبوب المعيب، وتشكيل أنبوب جديد بنفس اللون، وتركيبه في الموقع مع محول جديد.', result: 'تمت استعادة الخط المستمر للحانة.', defaultText: 'ألوان زاهية وخطوط انسيابية بدون انقطاع.', beforeText: 'قبل: قطعة أنبوب معيبة قطعت المحيط.' },
    { id: 'window-film', title: 'تغليف واجهات العرض', category: 'تغليف بالفويل', problem: 'كان الفويل القديم يتقشر، وكان الشعار باهتاً وغير جذاب.', work: 'تمت إزالة الفويل القديم دون ترك أثر، وتنظيف الزجاج، ووضع فويل جديد مقاوم للأشعة فوق البنفسجية بدون فقاعات.', result: 'عادت واجهة العرض لتبدو جذابة وتمثيلية مرة أخرى.', defaultText: 'حواف حادة وألوان منعشة على الزجاج.', beforeText: 'قبل: أجزاء فويل متقشرة وباهتة.' },
    { id: 'branch-service', title: 'صيانة الفروع', category: 'خدمة', problem: 'أبلغت عدة فروع عن أعطال في الإضاءة الخارجية بعد عاصفة.', work: 'تم تخطيط مسارات ذات أولوية، وإجراء تشخيص للأعطال في الموقع، واستبدال مصادر الطاقة والمصابيح.', result: 'عادت الإضاءة لجميع الفروع بما يتوافق مع الهوية المؤسسية.', defaultText: 'صورة موحدة للعلامة التجارية في جميع المواقع.', beforeText: 'قبل: إضاءة غير متناسقة بسبب الأنظمة المعيبة.' },
    { id: 'mounting-review', title: 'تركيب لافتات الواجهة', category: 'تركيب', problem: 'أدت عاصفة إلى ارتخاء أجزاء من البنية التحتية للافتة كبيرة.', work: 'تم التأمين باستخدام رافعة، وتجديد الوصلات اللولبية، وإعادة تثبيت اللافتة لتكون مقاومة للعواصف وفقاً لمعايير DIN.', result: 'اللافتة آمنة وتتوافق مع اللوائح الحالية.', defaultText: 'تثبيت آمن وتركيب متوافق مع المعايير.', beforeText: 'قبل: عناصر مرتخية بعد رياح قوية.' },
  ],
};

const CONTENT = {
  de: {
    metaTitle: 'Referenzen für Schilder-Reparatur & Werbetechnik | PixelRing',
    metaDescription:
      'Ausgewaehlte Referenzen von PixelRing: Leuchtkästen, LED-Buchstaben, Neon, Folien, Fassadenmontage und Filialservice ohne private Kundendaten.',
    badge: 'Referenzen',
    heroTitle: 'Sichtbare Ergebnisse nach Reparatur und Service',
    heroIntro:
      'Diese Beispiele zeigen, was defekt war, was PixelRing geprüft und umgesetzt hat und wie die Werbeanlage danach wieder wirkt. Ohne Kundennamen, genaue Adressen oder interne CRM-Daten.',
    heroPrimaryCta: 'Arbeiten ansehen',
    heroSecondaryCta: 'Aehnliche Anfrage starten',
    heroTags: ['LED-Service', 'Leuchtkästen', 'Neon', 'Folien', 'Fassaden', 'Filialservice'],
    heroNoteTitle: 'Proof statt Galerie',
    heroNoteText:
      'Jede Referenz ist als kurzer Reparaturbericht gedacht: Ausgangszustand, Arbeitsschritt, Ergebnis. Der Fokus bleibt auf Ausfuehrung und Vertrauen.',
    recentEyebrow: 'Ausgewaehlte Arbeiten',
    recentTitle: 'Visuelles Ergebnis und Arbeitsumfang',
    recentIntro:
      'Jede Karte zeigt den Standort vor und nach der Arbeit. Im Bericht stehen Problem, ausgefuehrte Arbeiten und Ergebnis.',
    reportTitle: 'Ein Schild darf nicht müde aussehen',
    reportIntro:
      'Dunkle Buchstaben, Flackern, ein verschmutzter Leuchtkasten oder lose Folie sind nicht nur ein Defekt. Für Menschen auf der Straße wirkt der Standort schnell geschlossen, vernachlässigt oder unsicher.',
    reportHooks: [
      { id: 'seconds', title: 'Passanten entscheiden in Sekunden.', text: 'Laut FedEx Office betraten 76% der Befragten ein unbekanntes Geschäft wegen seiner Beschilderung; 68% kauften etwas, weil ein Schild ihre Aufmerksamkeit gewann. Wenn das Licht ausfällt, verliert der Standort diesen ersten Moment.' },
      { id: 'trust', title: 'Schlechtes Licht kostet Vertrauen.', text: '52% der Menschen gehen weniger gern in ein Geschäft mit schlecht gemachten Schildern. Die Sign Research Foundation nennt Fälle, in denen gezielte Updates der Außenbeschilderung bis zu 16% mehr Wochenumsatz brachten.' },
    ],
    reports: [
      { id: 'r1', type: 'LED-Buchstaben', issue: 'Einzelne Elemente waren dunkel, die Wortmarke wirkte unvollstaendig.', outcome: 'Module ersetzt, Helligkeit angeglichen, Lesbarkeit wiederhergestellt.' },
      { id: 'r2', type: 'Leuchtkasten', issue: 'Unregelmaessige Ausleuchtung und verschmutzte Innenflächen.', outcome: 'Innen gereinigt, LED-Strecke geprüft, Lichtfeld stabilisiert.' },
      { id: 'r3', type: 'Folierung', issue: 'Kanten lösten sich, Farben wirkten nicht mehr markengerecht.', outcome: 'Untergrund vorbereitet und Sichtfläche neu foliert.' },
      { id: 'r4', type: 'Filialservice', issue: 'Mehrere kleine Mängel lagen verteilt ueber Standorte vor.', outcome: 'Ein Servicebericht mit priorisierten nächsten Schritten erstellt.' },
    ],
    galleryEyebrow: 'Gesamte Bildauswahl',
    galleryTitle: 'Ein kompakter Viewer für Details',
    galleryIntro:
      'Die Galerie ist bewusst kleiner als der Hauptcarousel. Ein Klick oeffnet alle Fotos in einem Viewer mit Kategorien und Thumbnails.',
    galleryPromoEyebrow: 'Video / Seite',
    galleryPromoTitle: 'Reparaturprozess ansehen',
    galleryPromoText:
      'Dieser Bereich kann zu einem Video, einer Detailseite oder einem erklaerenden Servicebereich fuehren.',
    galleryPromoCta: 'Oeffnen',
    galleryPromoHref: '/leistungen',
    categoriesTitle: 'Produktbereiche, in denen Referenzen entstehen',
    categoriesIntro:
      'PixelRing bleibt ein verantwortlicher Servicepartner: Reparatur, Montage, Branding und Standortservice laufen ueber einen Einstiegspunkt.',
    typeBandLines: ['Repair evidence', 'LED · Neon · Folie · Montage', 'Ein Partner. Ein Auftrag. Ein Ergebnis.'],
    finalTitle: 'Zeigen Sie uns Ihr Schild, Ihre Fassade oder Ihr Werbeelement.',
    finalText:
      'Ein Foto reicht oft für die erste Einschätzung. PixelRing prüft den sichtbaren Zustand und klaert den nächsten sinnvollen Schritt.',
    finalCta: 'Foto senden',
    modalProblemLabel: 'Ausgangslage',
    modalWorkLabel: 'Umsetzung',
    modalResultLabel: 'Ergebnis',
    modalBeforeLabel: 'Vorher ansehen',
    modalCta: 'Aehnliche Anfrage',
    viewerAllLabel: 'Alle',
    viewerCloseLabel: 'Schliessen',
  },
  en: {
    metaTitle: 'References for Sign Repair & Visual Service | PixelRing',
    metaDescription:
      'Selected PixelRing references: lightboxes, LED letters, neon, window film, facade mounting, and branch service without private customer data.',
    badge: 'References',
    heroTitle: 'Visible results after repair and service',
    heroIntro:
      'These examples show what was wrong, what PixelRing checked and repaired, and how the advertising element looked after service. No customer names, exact addresses, or internal CRM data.',
    heroPrimaryCta: 'View work',
    heroSecondaryCta: 'Start a similar request',
    heroTags: ['LED service', 'Lightboxes', 'Neon', 'Films', 'Facades', 'Branch service'],
    heroNoteTitle: 'Proof, not a vanity gallery',
    heroNoteText:
      'Every reference is shaped like a short repair report: initial state, work performed, outcome. The focus stays on execution and trust.',
    recentEyebrow: 'Selected work',
    recentTitle: 'Visual result and work summary',
    recentIntro:
      'Each card shows the site before and after. The report lists the issue, completed work, and result.',
    reportTitle: 'A sign should not look tired',
    reportIntro:
      'Dark letters, flickering light, a dirty lightbox, or peeling window film are not just defects. To someone passing by, they can make a location feel closed, neglected, or unreliable.',
    reportHooks: [
      { id: 'seconds', title: 'People decide in seconds.', text: 'FedEx Office found that 76% of consumers entered a store they had never visited because of its signs, and 68% bought a product or service because a sign caught their eye. If the light fails, the business loses that first chance.' },
      { id: 'trust', title: 'Bad light weakens trust.', text: '52% of people are less willing to enter a store with poorly made signage. Sign Research Foundation cites cases where targeted exterior sign updates produced up to 16% higher weekly sales.' },
    ],
    reports: [
      { id: 'r1', type: 'LED letters', issue: 'Several elements were dark and the wordmark looked incomplete.', outcome: 'Modules replaced, brightness matched, readability restored.' },
      { id: 'r2', type: 'Lightbox', issue: 'Uneven lighting and dirty internal surfaces.', outcome: 'Interior cleaned, LED path checked, light field stabilized.' },
      { id: 'r3', type: 'Window film', issue: 'Edges lifted and colors no longer matched the brand.', outcome: 'Surface prepared and the visible area wrapped again.' },
      { id: 'r4', type: 'Branch service', issue: 'Several small defects were spread across locations.', outcome: 'One service report created with prioritized next steps.' },
    ],
    galleryEyebrow: 'Full image set',
    galleryTitle: 'A compact viewer for details',
    galleryIntro:
      'The gallery is intentionally smaller than the main carousel. Click opens all photos in one viewer with categories and thumbnails.',
    galleryPromoEyebrow: 'Video / page',
    galleryPromoTitle: 'Watch the repair process',
    galleryPromoText:
      'This area can link to a video, a detail page, or a service explanation elsewhere on the site.',
    galleryPromoCta: 'Open',
    galleryPromoHref: '/leistungen',
    categoriesTitle: 'Product areas where references are created',
    categoriesIntro:
      'PixelRing stays one accountable service partner: repair, mounting, branding, and location service run through one entry point.',
    typeBandLines: ['Repair evidence', 'LED · Neon · Film · Mounting', 'One partner. One request. One result.'],
    finalTitle: 'Show us your sign, facade, or advertising element.',
    finalText:
      'A photo is often enough for the first assessment. PixelRing checks the visible condition and clarifies the next useful step.',
    finalCta: 'Send photo',
    modalProblemLabel: 'Initial state',
    modalWorkLabel: 'Work done',
    modalResultLabel: 'Outcome',
    modalBeforeLabel: 'View before',
    modalCta: 'Similar request',
    viewerAllLabel: 'All',
    viewerCloseLabel: 'Close',
  },
  ru: {
    metaTitle: 'Примеры работ по ремонту вывесок | PixelRing',
    metaDescription:
      'Выбранные примеры PixelRing: световые короба, LED-буквы, неон, пленка, фасадный монтаж и сервис филиалов без раскрытия частных данных клиентов.',
    badge: 'Примеры работ',
    heroTitle: 'Видимый результат после ремонта и сервиса',
    heroIntro:
      'На этой странице показано, что было неисправно, что PixelRing проверил и восстановил, и как рекламный элемент стал выглядеть после работы. Без имен клиентов, точных адресов и CRM-данных.',
    heroPrimaryCta: 'Смотреть работы',
    heroSecondaryCta: 'Оставить похожую заявку',
    heroTags: ['LED-сервис', 'Световые короба', 'Неон', 'Пленки', 'Фасады', 'Сервис сетей'],
    heroNoteTitle: 'Доказательство, а не витрина',
    heroNoteText:
      'Каждый пример оформлен как короткий ремонтный отчет: исходное состояние, выполненная работа, результат. Фокус на исполнении и доверии.',
    recentEyebrow: 'Выбранные работы',
    recentTitle: 'Визуальный результат и список работ',
    recentIntro:
      'Каждая карточка показывает объект до и после. Внутри указан краткий отчет: проблема, выполненные работы и результат.',
    reportTitle: 'Вывеска не должна выглядеть уставшей',
    reportIntro:
      'Потухшие буквы, мерцание, грязный световой короб или отклеенная пленка — это не просто дефект. Для человека с улицы это быстрый сигнал: место выглядит закрытым, заброшенным или неаккуратным.',
    reportHooks: [
      { id: 'seconds', title: 'Прохожий решает за секунды.', text: 'В исследовании FedEx Office 76% людей заходили в незнакомый магазин из-за вывески, а 68% покупали товар или услугу, потому что знак привлек внимание. Если свет не работает, бизнес теряет этот первый шанс.' },
      { id: 'trust', title: 'Плохой свет бьет по доверию.', text: '52% людей менее охотно заходят в место с плохо сделанной вывеской. По данным Sign Research Foundation, обновление наружной вывески в отдельных кейсах давало до 16% роста недельных продаж.' },
    ],
    reports: [
      { id: 'r1', type: 'LED-буквы', issue: 'Отдельные элементы не горели, название выглядело неполным.', outcome: 'Модули заменены, яркость выровнена, читаемость восстановлена.' },
      { id: 'r2', type: 'Световой короб', issue: 'Подсветка была неравномерной, внутри заметны загрязнения.', outcome: 'Внутренняя часть очищена, LED-линия проверена, свет стабилизирован.' },
      { id: 'r3', type: 'Витринная пленка', issue: 'Края отходили, цвет больше не соответствовал бренду.', outcome: 'Поверхность подготовлена и видимая зона оклеена заново.' },
      { id: 'r4', type: 'Сервис филиалов', issue: 'Мелкие дефекты копились на нескольких объектах.', outcome: 'Собран единый отчет с приоритетом следующих работ.' },
    ],
    galleryEyebrow: 'Общая подборка',
    galleryTitle: 'Компактный просмотр деталей',
    galleryIntro:
      'Галерея отделена от выбранных работ. По клику открывается общий просмотр со всеми фотографиями, категориями и миниатюрами.',
    galleryPromoEyebrow: 'Видео / страница',
    galleryPromoTitle: 'Посмотреть процесс ремонта',
    galleryPromoText:
      'Этот широкий блок может вести на видео, отдельную страницу кейса или сервисный раздел сайта.',
    galleryPromoCta: 'Открыть',
    galleryPromoHref: '/leistungen',
    categoriesTitle: 'Направления, где появляются такие работы',
    categoriesIntro:
      'PixelRing остается одним ответственным сервисом: ремонт, монтаж, брендинг и обслуживание объектов идут через одну точку входа.',
    typeBandLines: ['Repair evidence', 'LED · Neon · Folie · Montage', 'Один партнер. Одна заявка. Один результат.'],
    finalTitle: 'Покажите нам вывеску, фасад или рекламный элемент.',
    finalText:
      'Для первичной оценки часто достаточно фотографии. PixelRing проверит видимое состояние и предложит следующий разумный шаг.',
    finalCta: 'Отправить фото',
    modalProblemLabel: 'Исходное состояние',
    modalWorkLabel: 'Что сделано',
    modalResultLabel: 'Результат',
    modalBeforeLabel: 'Показать before',
    modalCta: 'Похожая заявка',
    viewerAllLabel: 'Все',
    viewerCloseLabel: 'Закрыть',
  },
  tr: {
    metaTitle: 'Tabela Onarımı Referansları | PixelRing',
    metaDescription:
      'PixelRing seçili referansları: ışıklı kutular, LED harfler, neon, vitrin filmi, cephe montajı ve şube servisi. Özel müşteri verisi paylaşılmaz.',
    badge: 'Referanslar',
    heroTitle: 'Onarım ve servisten sonra görünen sonuçlar',
    heroIntro:
      'Bu örnekler neyin bozuk olduğunu, PixelRing’in neyi kontrol edip onardığını ve reklam unsurunun servis sonrası nasıl göründüğünü gösterir. Müşteri adı, tam adres veya CRM verisi yoktur.',
    heroPrimaryCta: 'İşleri görüntüle',
    heroSecondaryCta: 'Benzer talep başlat',
    heroTags: ['LED servis', 'Işıklı kutular', 'Neon', 'Filmler', 'Cepheler', 'Şube servisi'],
    heroNoteTitle: 'Galeri değil, kanıt',
    heroNoteText:
      'Her referans kısa bir onarım raporu gibi kurulur: başlangıç durumu, yapılan iş, sonuç. Odak uygulama ve güven üzerindedir.',
    recentEyebrow: 'Seçili işler',
    recentTitle: 'Görsel sonuç ve iş özeti',
    recentIntro:
      'Her kart lokasyonu önce ve sonra gösterir. Raporda sorun, yapılan işler ve sonuç yer alır.',
    reportTitle: 'Tabela yorgun görünmemeli',
    reportIntro:
      'Sönmüş harfler, titreyen ışık, kirli bir ışıklı kutu veya kalkmış film sadece teknik arıza değildir. Sokaktan bakan biri için işletme kapalı, bakımsız veya güvensiz görünebilir.',
    reportHooks: [
      { id: 'seconds', title: 'İnsanlar saniyeler içinde karar verir.', text: 'FedEx Office araştırmasına göre tüketicilerin %76’sı tabelası sayesinde daha önce gitmediği bir mağazaya girdi; %68’i de dikkatini çeken bir tabela nedeniyle ürün veya hizmet satın aldı. Işık çalışmıyorsa işletme bu ilk şansı kaybeder.' },
      { id: 'trust', title: 'Kötü ışık güveni zayıflatır.', text: 'İnsanların %52’si kötü yapılmış tabelası olan bir yere girmeye daha az isteklidir. Sign Research Foundation, dış tabela güncellemelerinin bazı örneklerde haftalık satışları %16’ya kadar artırdığını bildirir.' },
    ],
    reports: [
      { id: 'r1', type: 'LED harfler', issue: 'Bazı elemanlar karanlıktı ve marka yazısı eksik görünüyordu.', outcome: 'Modüller değiştirildi, parlaklık eşitlendi, okunabilirlik geri geldi.' },
      { id: 'r2', type: 'Işıklı kutu', issue: 'Işık dağılımı düzensizdi ve iç yüzey kirliydi.', outcome: 'İç bölüm temizlendi, LED hattı kontrol edildi, ışık alanı stabilize edildi.' },
      { id: 'r3', type: 'Vitrin filmi', issue: 'Kenarlar kalkmıştı ve renkler markaya uygun değildi.', outcome: 'Yüzey hazırlandı ve görünür alan yeniden kaplandı.' },
      { id: 'r4', type: 'Şube servisi', issue: 'Küçük arızalar farklı lokasyonlara dağılmıştı.', outcome: 'Öncelikli adımları olan tek servis raporu oluşturuldu.' },
    ],
    galleryEyebrow: 'Tüm görsel seçki',
    galleryTitle: 'Detaylar için kompakt görüntüleyici',
    galleryIntro:
      'Galeri ana carousel’den daha küçüktür. Tıklama tüm fotoğrafları kategori ve küçük resimlerle tek viewer içinde açar.',
    galleryPromoEyebrow: 'Video / sayfa',
    galleryPromoTitle: 'Onarım sürecini izle',
    galleryPromoText:
      'Bu geniş alan bir videoya, detay sayfasına veya sitedeki servis açıklamasına bağlanabilir.',
    galleryPromoCta: 'Aç',
    galleryPromoHref: '/leistungen',
    categoriesTitle: 'Referansların oluştuğu ürün alanları',
    categoriesIntro:
      'PixelRing tek sorumlu servis ortağı olarak kalır: onarım, montaj, branding ve lokasyon servisi tek giriş noktasından yürür.',
    typeBandLines: ['Repair evidence', 'LED · Neon · Film · Montaj', 'Tek ortak. Tek talep. Tek sonuç.'],
    finalTitle: 'Tabelanızı, cephenizi veya reklam unsurunuzu gösterin.',
    finalText:
      'İlk değerlendirme için çoğu zaman bir fotoğraf yeterlidir. PixelRing görünen durumu kontrol eder ve sonraki mantıklı adımı netleştirir.',
    finalCta: 'Fotoğraf gönder',
    modalProblemLabel: 'Başlangıç durumu',
    modalWorkLabel: 'Yapılan iş',
    modalResultLabel: 'Sonuç',
    modalBeforeLabel: 'Öncesini gör',
    modalCta: 'Benzer talep',
    viewerAllLabel: 'Tümü',
    viewerCloseLabel: 'Kapat',
  },
  pl: {
    metaTitle: 'Realizacje napraw szyldów i reklam | PixelRing',
    metaDescription:
      'Wybrane realizacje PixelRing: kasetony, litery LED, neon, folie, montaż elewacyjny i obsługa sieci bez ujawniania prywatnych danych klientów.',
    badge: 'Realizacje',
    heroTitle: 'Widoczne efekty po naprawie i serwisie',
    heroIntro:
      'Te przykłady pokazują, co było uszkodzone, co PixelRing sprawdził i naprawił oraz jak element reklamowy wyglądał po usłudze. Bez nazw klientów, dokładnych adresów i danych CRM.',
    heroPrimaryCta: 'Zobacz prace',
    heroSecondaryCta: 'Zgłoś podobny problem',
    heroTags: ['Serwis LED', 'Kasetony', 'Neon', 'Folie', 'Elewacje', 'Serwis sieci'],
    heroNoteTitle: 'Dowód, nie galeria',
    heroNoteText:
      'Każda realizacja ma formę krótkiego raportu: stan wyjściowy, wykonana praca, efekt. Liczy się wykonanie i zaufanie.',
    recentEyebrow: 'Wybrane prace',
    recentTitle: 'Efekt wizualny i zakres prac',
    recentIntro:
      'Każda karta pokazuje obiekt przed i po pracy. W raporcie są problem, wykonane prace i efekt.',
    reportTitle: 'Szyld nie powinien wyglądać na zmęczony',
    reportIntro:
      'Zgaszone litery, migające światło, brudny kaseton albo odklejająca się folia to nie tylko usterka. Dla osoby z ulicy lokal może wyglądać na zamknięty, zaniedbany albo mało wiarygodny.',
    reportHooks: [
      { id: 'seconds', title: 'Ludzie decydują w kilka sekund.', text: 'Według FedEx Office 76% konsumentów weszło do nieznanego sklepu dzięki jego oznakowaniu, a 68% kupiło produkt lub usługę, bo szyld przyciągnął uwagę. Jeśli światło nie działa, firma traci tę pierwszą szansę.' },
      { id: 'trust', title: 'Złe światło osłabia zaufanie.', text: '52% osób mniej chętnie wchodzi do miejsca ze źle wykonaną reklamą. Sign Research Foundation podaje przypadki, w których celowa aktualizacja zewnętrznego szyldu dawała do 16% wzrostu tygodniowej sprzedaży.' },
    ],
    reports: [
      { id: 'r1', type: 'Litery LED', issue: 'Część elementów była ciemna, a znak wyglądał na niepełny.', outcome: 'Wymieniono moduły, wyrównano jasność, przywrócono czytelność.' },
      { id: 'r2', type: 'Kaseton', issue: 'Nierówne światło i zabrudzone powierzchnie wewnętrzne.', outcome: 'Wnętrze oczyszczono, tor LED sprawdzono, pole świetlne ustabilizowano.' },
      { id: 'r3', type: 'Folia witrynowa', issue: 'Krawędzie odchodziły, kolory nie pasowały już do marki.', outcome: 'Przygotowano podłoże i ponownie oklejono widoczną powierzchnię.' },
      { id: 'r4', type: 'Serwis sieci', issue: 'Kilka małych usterek było rozproszonych po lokalizacjach.', outcome: 'Utworzono jeden raport z priorytetami kolejnych działań.' },
    ],
    galleryEyebrow: 'Pełny zestaw zdjęć',
    galleryTitle: 'Kompaktowy viewer do szczegółów',
    galleryIntro:
      'Galeria jest celowo mniejsza niż główny carousel. Kliknięcie otwiera wszystkie zdjęcia z kategoriami i miniaturami.',
    galleryPromoEyebrow: 'Wideo / strona',
    galleryPromoTitle: 'Zobacz proces naprawy',
    galleryPromoText:
      'Ten szeroki blok może prowadzić do wideo, strony szczegółowej albo opisu usługi w serwisie.',
    galleryPromoCta: 'Otwórz',
    galleryPromoHref: '/leistungen',
    categoriesTitle: 'Obszary produktowe, z których powstają realizacje',
    categoriesIntro:
      'PixelRing pozostaje jednym odpowiedzialnym partnerem: naprawa, montaż, branding i serwis lokalizacji mają jeden punkt wejścia.',
    typeBandLines: ['Repair evidence', 'LED · Neon · Folia · Montaż', 'Jeden partner. Jedno zgłoszenie. Jeden wynik.'],
    finalTitle: 'Pokaż nam swój szyld, fasadę lub element reklamowy.',
    finalText:
      'Do pierwszej oceny często wystarczy zdjęcie. PixelRing sprawdzi widoczny stan i ustali kolejny rozsądny krok.',
    finalCta: 'Wyślij zdjęcie',
    modalProblemLabel: 'Stan wyjściowy',
    modalWorkLabel: 'Wykonano',
    modalResultLabel: 'Efekt',
    modalBeforeLabel: 'Zobacz przed',
    modalCta: 'Podobne zgłoszenie',
    viewerAllLabel: 'Wszystkie',
    viewerCloseLabel: 'Zamknij',
  },
  ar: {
    metaTitle: 'مراجع إصلاح اللوحات والإعلانات | PixelRing',
    metaDescription:
      'نماذج مختارة من أعمال PixelRing: صناديق مضيئة، حروف LED، نيون، أفلام واجهات، تثبيت واجهات وخدمة فروع بدون كشف بيانات العملاء الخاصة.',
    badge: 'الأعمال المنجزة',
    heroTitle: 'نتائج واضحة بعد الإصلاح والخدمة',
    heroIntro:
      'تعرض هذه الأمثلة ما كان معطلاً، وما فحصته PixelRing ونفذته، وكيف أصبح العنصر الإعلاني بعد الخدمة. لا أسماء عملاء، لا عناوين دقيقة، ولا بيانات CRM داخلية.',
    heroPrimaryCta: 'عرض الأعمال',
    heroSecondaryCta: 'ابدأ طلباً مشابهاً',
    heroTags: ['خدمة LED', 'صناديق مضيئة', 'نيون', 'أفلام', 'واجهات', 'خدمة الفروع'],
    heroNoteTitle: 'إثبات عمل لا معرض فقط',
    heroNoteText:
      'كل مرجع مكتوب كتقرير إصلاح قصير: الحالة الأولية، العمل المنفذ، والنتيجة. التركيز على التنفيذ والثقة.',
    recentEyebrow: 'أعمال مختارة',
    recentTitle: 'النتيجة المرئية وملخص العمل',
    recentIntro:
      'تعرض كل بطاقة الموقع قبل العمل وبعده. يوضح التقرير المشكلة والعمل المنفذ والنتيجة.',
    reportTitle: 'يجب ألا تبدو اللافتة متعبة',
    reportIntro:
      'الحروف المطفأة، الوميض، الصندوق المضيء المتسخ أو الفيلم المتقشر ليست مجرد أعطال. بالنسبة لمن يمر في الشارع قد يبدو المكان مغلقاً أو مهملاً أو غير موثوق.',
    reportHooks: [
      { id: 'seconds', title: 'الناس يقررون خلال ثوانٍ.', text: 'وجدت دراسة FedEx Office أن 76% من المستهلكين دخلوا متجراً لم يزوروه من قبل بسبب لافتته، وأن 68% اشتروا منتجاً أو خدمة لأن اللافتة جذبت انتباههم. إذا تعطل الضوء، يخسر الموقع هذه الفرصة الأولى.' },
      { id: 'trust', title: 'الإضاءة السيئة تضعف الثقة.', text: '52% من الناس أقل استعداداً لدخول مكان ذي لافتة رديئة التنفيذ. وتشير Sign Research Foundation إلى حالات رفعت فيها تحديثات الواجهة الخارجية المبيعات الأسبوعية حتى 16%.' },
    ],
    reports: [
      { id: 'r1', type: 'حروف LED', issue: 'بعض العناصر كانت مطفأة وكان اسم العلامة غير مكتمل.', outcome: 'تم تبديل الوحدات، توحيد السطوع، واستعادة الوضوح.' },
      { id: 'r2', type: 'صندوق مضيء', issue: 'إضاءة غير متساوية وأسطح داخلية متسخة.', outcome: 'تم تنظيف الداخل، فحص مسار LED، وتثبيت مجال الإضاءة.' },
      { id: 'r3', type: 'فيلم واجهة', issue: 'الحواف بدأت تنفصل والألوان لم تعد مناسبة للعلامة.', outcome: 'تم تحضير السطح وتغليف المنطقة المرئية من جديد.' },
      { id: 'r4', type: 'خدمة فروع', issue: 'عدة أعطال صغيرة موزعة على مواقع مختلفة.', outcome: 'تم إعداد تقرير خدمة واحد مع خطوات ذات أولوية.' },
    ],
    galleryEyebrow: 'مجموعة الصور',
    galleryTitle: 'عارض مدمج للتفاصيل',
    galleryIntro:
      'المعرض أصغر عمداً من carousel الرئيسي. النقر يفتح كل الصور في عارض واحد مع الفئات والصور المصغرة.',
    galleryPromoEyebrow: 'فيديو / صفحة',
    galleryPromoTitle: 'شاهد مسار الإصلاح',
    galleryPromoText:
      'يمكن لهذا الشريط أن يفتح فيديو أو صفحة تفاصيل أو شرح خدمة داخل الموقع.',
    galleryPromoCta: 'فتح',
    galleryPromoHref: '/leistungen',
    categoriesTitle: 'مجالات المنتج التي تظهر فيها المراجع',
    categoriesIntro:
      'تبقى PixelRing شريك خدمة واحداً مسؤولاً: الإصلاح، التثبيت، الهوية البصرية وخدمة المواقع عبر نقطة دخول واحدة.',
    typeBandLines: ['Repair evidence', 'LED · Neon · Film · Mounting', 'شريك واحد. طلب واحد. نتيجة واحدة.'],
    finalTitle: 'أرنا لوحتك أو واجهتك أو العنصر الإعلاني لديك.',
    finalText:
      'غالباً تكفي صورة واحدة للتقييم الأولي. تفحص PixelRing الحالة الظاهرة وتوضح الخطوة العملية التالية.',
    finalCta: 'إرسال صورة',
    modalProblemLabel: 'الحالة الأولية',
    modalWorkLabel: 'العمل المنفذ',
    modalResultLabel: 'النتيجة',
    modalBeforeLabel: 'عرض قبل الإصلاح',
    modalCta: 'طلب مشابه',
    viewerAllLabel: 'الكل',
    viewerCloseLabel: 'إغلاق',
  },
};

const PAGE_KEY = 'referenzen';
const LOCALES: Locale[] = ['de', 'en', 'ru', 'tr', 'pl', 'ar'];

async function seed() {
  console.log(`Starting to seed ${PAGE_KEY}...`);

  const { prisma } = await import('../src/lib/prisma');

  for (const locale of LOCALES) {
    const data = CONTENT[locale];
    const caseCopy = CASE_COPY[locale as Locale];
    const cases: ReferenceCase[] = BASE_CASES.map((base) => ({
      ...base,
      ...caseCopy.find((item) => item.id === base.id)!,
    }));
    
    const casesWithStructuredGallery = cases.map(c => {
      const { gallery, ...rest } = c;
      return {
        ...rest,
        galleryImage1: gallery[0] || '',
        galleryImage2: gallery[1] || '',
        galleryImage3: gallery[2] || '',
      };
    });

    // We update the page or create it
    const blocks = [
      {
        type: 'hero',
        key: 'heroBlock',
        enabled: true,
        sortOrder: 0,
        badge: data.badge,
        title: data.heroTitle,
        intro: data.heroIntro,
        ctaPrimary: data.heroPrimaryCta,
        ctaSecondary: data.heroSecondaryCta,
        tags: data.heroTags.join('|||'),
        subtitle: data.heroNoteTitle,
        description: data.heroNoteText,
        heroImage1: cases[0]?.afterImage || '',
        heroImage2: cases[1]?.afterImage || '',
        heroImage3: cases[2]?.afterImage || '',
        heroImage4: cases[3]?.afterImage || '',
        heroImage5: cases[4]?.afterImage || '',
      },
      {
        type: 'textSection',
        key: 'recentIntroBlock',
        enabled: true,
        sortOrder: 1,
        pretitle: data.recentEyebrow,
        title: data.recentTitle,
        description: data.recentIntro,
      },
      {
        type: 'cardList',
        key: 'casesBlock',
        enabled: true,
        sortOrder: 2,
        items: casesWithStructuredGallery,
      },
      {
        type: 'textSection',
        key: 'reportIntroBlock',
        enabled: true,
        sortOrder: 3,
        title: data.reportTitle,
        description: data.reportIntro,
      },
      {
        type: 'cardList',
        key: 'reportHooksBlock',
        enabled: true,
        sortOrder: 4,
        items: data.reportHooks,
      },
      {
        type: 'cardList',
        key: 'reportsBlock',
        enabled: true,
        sortOrder: 5,
        items: data.reports,
      },
      {
        type: 'textSection',
        key: 'galleryIntroBlock',
        enabled: true,
        sortOrder: 6,
        pretitle: data.galleryEyebrow,
        title: data.galleryTitle,
        description: data.galleryIntro,
      },
      {
        type: 'cardList',
        key: 'galleryItemsBlock',
        enabled: true,
        sortOrder: 7,
        items: cases.slice(0, 9).map(c => ({
          title: c.title,
          category: c.category,
          image: c.gallery[0],
          description: c.result
        })),
      },
      {
        type: 'cta',
        key: 'promoBlock',
        enabled: true,
        sortOrder: 8,
        badge: data.galleryPromoEyebrow,
        title: data.galleryPromoTitle,
        description: data.galleryPromoText,
        primaryLabel: data.galleryPromoCta,
        requestHref: data.galleryPromoHref,
      },
      {
        type: 'textSection',
        key: 'categoriesIntroBlock',
        enabled: true,
        sortOrder: 9,
        title: data.categoriesTitle,
        description: data.categoriesIntro,
      },
      {
        type: 'cardList',
        key: 'productCategoriesBlock',
        enabled: true,
        sortOrder: 10,
        items: [
          { title: cases[0].title, text: cases[0].problem, image: cases[0].afterImage, filter: 'filter-lightbox' },
          { title: cases[1].title, text: cases[1].problem, image: cases[1].afterImage, filter: 'filter-led' },
          { title: cases[2].title, text: cases[2].problem, image: cases[2].afterImage, filter: 'filter-neon' },
        ],
      },
      {
        type: 'cardList',
        key: 'typeBandLinesBlock',
        enabled: true,
        sortOrder: 11,
        items: data.typeBandLines.map(line => ({ text: line })),
      },
      {
        type: 'cta',
        key: 'finalCtaBlock',
        enabled: true,
        sortOrder: 12,
        title: data.finalTitle,
        description: data.finalText,
        primaryLabel: data.finalCta,
      },
      {
        type: 'labels',
        key: 'labelsBlock',
        enabled: true,
        sortOrder: 12,
        modalProblemLabel: data.modalProblemLabel,
        modalWorkLabel: data.modalWorkLabel,
        modalResultLabel: data.modalResultLabel,
        modalBeforeLabel: data.modalBeforeLabel,
        modalCta: data.modalCta,
        viewerAllLabel: data.viewerAllLabel,
        viewerCloseLabel: data.viewerCloseLabel,
      }
    ];

    let page = await prisma.cmsPage.findUnique({
      where: {
        pageKey_locale: {
          pageKey: PAGE_KEY,
          locale: locale,
        },
      },
    });

    if (!page) {
      page = await prisma.cmsPage.create({
        data: {
          id: randomUUID(),
          pageKey: PAGE_KEY,
          locale: locale,
          status: 'PUBLISHED',
          title: data.metaTitle,
          blocks: blocks,
          seoTitle: data.metaTitle,
          seoDescription: data.metaDescription,
        },
      });
      console.log(`Created page for ${locale}`);
    } else {
      await prisma.cmsPage.update({
        where: { id: page.id },
        data: {
          status: 'PUBLISHED',
          title: data.metaTitle,
          blocks: blocks,
          seoTitle: data.metaTitle,
          seoDescription: data.metaDescription,
        },
      });
      console.log(`Updated page for ${locale}`);
    }
  }

  await prisma.$disconnect();
  console.log('Seeding finished successfully.');
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
