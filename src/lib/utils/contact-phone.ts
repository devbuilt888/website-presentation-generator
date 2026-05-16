/** Template that shows the account owner's phone on the final slide */
export const OMEGA_SPACE_TEMPLATE_ID = 'omega-balance-space';

export function usesOwnerPhoneOnFinalSlide(templateId: string): boolean {
  return templateId === OMEGA_SPACE_TEMPLATE_ID;
}

export function normalizePhoneDigits(value: string): string {
  return value.replace(/\D/g, '');
}

export function isHttpUrl(value: string): boolean {
  return /^https?:\/\//i.test(value.trim());
}

/**
 * When sending omega-balance-space, store the owner's phone on the instance
 * so public viewers can call without reading the users table.
 */
export function resolveInstanceContactStoreLink(
  templateId: string,
  storeLinkInput: string | null | undefined,
  ownerPhone: string | null | undefined
): string | null {
  if (!usesOwnerPhoneOnFinalSlide(templateId)) {
    const link = storeLinkInput?.trim();
    return link || null;
  }

  const input = storeLinkInput?.trim();
  if (input && !isHttpUrl(input)) {
    return input;
  }

  const phone = ownerPhone?.trim();
  return phone || null;
}

/**
 * Phone shown on slide 10: instance store_link (phone) or owner profile phone.
 */
export function resolveViewerContactPhone(
  templateId: string,
  storeLink: string | null | undefined,
  ownerPhone: string | null | undefined
): string {
  const fromStore = storeLink?.trim();
  if (fromStore && !isHttpUrl(fromStore)) {
    return fromStore;
  }

  if (usesOwnerPhoneOnFinalSlide(templateId)) {
    const owner = ownerPhone?.trim();
    if (owner) return owner;
  }

  return '';
}
