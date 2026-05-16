const DEFAULT_CONTACT_PHONE_DISPLAY = '407-000-0000';
const DEFAULT_CONTACT_PHONE_TEL = '4070000000';

function formatUsPhone(digits: string): string {
  const d = digits.replace(/\D/g, '').slice(-10);
  if (d.length !== 10) return DEFAULT_CONTACT_PHONE_DISPLAY;
  return `${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6)}`;
}

/** Phone for omega contact buttons from slide `content` (replaced {{storeLink}}). */
export function resolvePresentationContactPhone(raw?: string): { display: string; tel: string } {
  if (!raw || raw.includes('{{') || /^https?:\/\//i.test(raw)) {
    return {
      display: DEFAULT_CONTACT_PHONE_DISPLAY,
      tel: DEFAULT_CONTACT_PHONE_TEL,
    };
  }
  const digits = raw.replace(/\D/g, '');
  if (digits.length >= 10) {
    return { display: formatUsPhone(digits), tel: digits.slice(-10) };
  }
  return {
    display: DEFAULT_CONTACT_PHONE_DISPLAY,
    tel: DEFAULT_CONTACT_PHONE_TEL,
  };
}
