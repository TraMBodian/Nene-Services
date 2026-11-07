import { RESTAURANT_INFO } from '../data/initialData';
export { RESTAURANT_INFO };

/**
 * Format a number into FCFA currency display
 * e.g. 3500 -> "3 500 FCFA"
 */
export function formatFCFA(amount: number): string {
  if (isNaN(amount)) return '0 FCFA';
  return `${amount.toLocaleString('fr-FR')} FCFA`;
}

/**
 * Check if the restaurant is currently open based on current UTC time (Dakar is in UTC+0)
 */
export function getStoreStatus(): {
  isOpen: boolean;
  statusText: string;
  nextOpenText: string;
} {
  const now = new Date();
  // Dakar is UTC+0 year-round
  const dakarHour = now.getUTCHours();
  const dakarMin = now.getUTCMinutes();
  const currentTimeMinutes = dakarHour * 60 + dakarMin;

  const openTimeMinutes = RESTAURANT_INFO.openingHour * 60; // 11:00 = 660 min
  const closeTimeMinutes = RESTAURANT_INFO.closingHour * 60 + RESTAURANT_INFO.closingMinute; // 23:30 = 1410 min

  const isOpen = currentTimeMinutes >= openTimeMinutes && currentTimeMinutes <= closeTimeMinutes;

  if (isOpen) {
    return {
      isOpen: true,
      statusText: 'Ouvert actuellement',
      nextOpenText: `Ferme ce soir à ${RESTAURANT_INFO.closingHour}h${RESTAURANT_INFO.closingMinute}`,
    };
  } else {
    return {
      isOpen: false,
      statusText: 'Fermé actuellement',
      nextOpenText: `Ouvre à ${RESTAURANT_INFO.openingHour}h00`,
    };
  }
}

/**
 * Clean and normalize a Senegalese phone number to +221 ...
 */
export function formatSenegalPhone(phone: string): string {
  let cleaned = phone.replace(/[^0-9+]/g, '');
  if (cleaned.startsWith('00221')) {
    cleaned = '+' + cleaned.slice(2);
  } else if (!cleaned.startsWith('+221') && !cleaned.startsWith('221') && cleaned.length >= 9) {
    cleaned = '+221 ' + cleaned;
  }
  return cleaned;
}

/**
 * Generate a direct WhatsApp chat URL with prefilled encoded message
 */
export function createWhatsAppUrl(phoneNumber: string, message: string): string {
  const cleanNumber = phoneNumber.replace(/[^0-9]/g, '');
  const encodedText = encodeURIComponent(message);
  return `https://wa.me/${cleanNumber}?text=${encodedText}`;
}

/**
 * Date formatter for French Senegal display
 */
export function formatDateFR(isoDate: string): string {
  try {
    const d = new Date(isoDate);
    return d.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return isoDate;
  }
}
