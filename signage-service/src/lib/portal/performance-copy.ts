const copy = {
  de: { previous: 'Zurück', next: 'Weiter', earlier: 'Ältere Nachrichten laden', uncertain: 'Verbindung unterbrochen. Die Korrespondenz wird geprüft. Bitte senden Sie die Nachricht nicht erneut.', saved: 'Nachricht gespeichert. Die Antwort wird geladen.' },
  en: { previous: 'Previous', next: 'Next', earlier: 'Load earlier messages', uncertain: 'Connection interrupted. Checking the conversation. Please do not send the message again.', saved: 'Message saved. Loading the reply.' },
  ru: { previous: 'Назад', next: 'Далее', earlier: 'Загрузить предыдущие сообщения', uncertain: 'Связь прервалась. Проверяем переписку. Пожалуйста, не отправляйте сообщение повторно.', saved: 'Сообщение сохранено. Ожидаем ответ.' },
  tr: { previous: 'Önceki', next: 'Sonraki', earlier: 'Önceki mesajları yükle', uncertain: 'Bağlantı kesildi. Yazışma kontrol ediliyor. Lütfen mesajı tekrar göndermeyin.', saved: 'Mesaj kaydedildi. Yanıt yükleniyor.' },
  pl: { previous: 'Wstecz', next: 'Dalej', earlier: 'Wczytaj wcześniejsze wiadomości', uncertain: 'Połączenie przerwane. Sprawdzamy rozmowę. Prosimy nie wysyłać wiadomości ponownie.', saved: 'Wiadomość zapisana. Oczekiwanie na odpowiedź.' },
  ar: { previous: 'السابق', next: 'التالي', earlier: 'تحميل الرسائل السابقة', uncertain: 'انقطع الاتصال. جارٍ التحقق من المحادثة. يرجى عدم إرسال الرسالة مرة أخرى.', saved: 'تم حفظ الرسالة. جارٍ تحميل الرد.' },
};
export function getPerformanceCopy(locale: string) { return copy[locale as keyof typeof copy] || copy.de; }
