'use client';

import { usePortalSession } from './usePortalSession';

const COPY = {
  de: { signedIn: 'Angemeldet als', linked: 'Ihre Anfrage erscheint in Ihrem Kundenkonto.', changed: 'Ihr Anmeldestatus hat sich geändert. Prüfen Sie Ihre E-Mail-Adresse und senden Sie die Anfrage erneut.', unavailable: 'Ihr Anmeldestatus konnte nicht geprüft werden. Ihre Eingaben bleiben erhalten. Bitte versuchen Sie es erneut.' },
  en: { signedIn: 'Signed in as', linked: 'Your request will appear in your account.', changed: 'Your sign-in status has changed. Check your email address and submit your request again.', unavailable: 'We could not check your sign-in status. Your form is preserved. Please try again.' },
  ru: { signedIn: 'Вы вошли как', linked: 'Заявка появится в вашем кабинете.', changed: 'Состояние входа изменилось. Проверьте почту в форме и отправьте заявку ещё раз.', unavailable: 'Не удалось проверить состояние входа. Данные формы сохранены. Попробуйте ещё раз.' },
  tr: { signedIn: 'Giriş yapılan hesap:', linked: 'Talebiniz müşteri hesabınızda görünecek.', changed: 'Oturum durumunuz değişti. E-posta adresinizi kontrol edip talebinizi yeniden gönderin.', unavailable: 'Oturum durumunuz kontrol edilemedi. Formunuz korunuyor. Lütfen tekrar deneyin.' },
  pl: { signedIn: 'Zalogowano jako', linked: 'Zgłoszenie pojawi się na Twoim koncie.', changed: 'Stan logowania uległ zmianie. Sprawdź adres e-mail i ponownie wyślij zgłoszenie.', unavailable: 'Nie udało się sprawdzić stanu logowania. Dane formularza zostały zachowane. Spróbuj ponownie.' },
  ar: { signedIn: 'تم تسجيل الدخول باسم', linked: 'سيظهر طلبك في حسابك.', changed: 'تغيرت حالة تسجيل الدخول. تحقق من بريدك الإلكتروني وأرسل الطلب مرة أخرى.', unavailable: 'تعذر التحقق من حالة تسجيل الدخول. تم الاحتفاظ ببيانات النموذج. يرجى المحاولة مرة أخرى.' },
};

export function useRequestAccount(guestEmail: string, locale: string) {
  const session = usePortalSession();
  const copy = COPY[locale as keyof typeof COPY] ?? COPY.de;
  const accountEmail = session.isProduction ? session.email : null;

  return {
    email: accountEmail ?? guestEmail,
    accountEmail,
    async ensureCurrent() {
      const current = await session.refresh();
      if (current.status === 'error') throw new Error(copy.unavailable);
      const currentEmail = current.isProduction ? current.email : null;
      if (currentEmail !== accountEmail) throw new Error(copy.changed);
    },
  };
}

export default function RequestAccountNotice({ email, locale, dark = false }: { email: string | null; locale: string; dark?: boolean }) {
  if (!email) return null;
  const copy = COPY[locale as keyof typeof COPY] ?? COPY.de;
  return (
    <p role="status" dir={locale === 'ar' ? 'rtl' : 'ltr'} className={`text-start text-sm leading-relaxed ${dark ? 'text-white/80' : 'text-[#596273]'}`}>
      {copy.signedIn} <bdi className="break-all font-medium">{email}</bdi>. {copy.linked}
    </p>
  );
}
