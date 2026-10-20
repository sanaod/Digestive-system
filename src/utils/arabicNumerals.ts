/**
 * Utility functions for Eastern Arabic Numerals (الأرقام العربية المشرقية: ٠١٢٣٤٥٦٧٨٩)
 * Enforces requirement #9: No western digits (0-9) in the educational UI.
 */

const WESTERN_TO_EASTERN: Record<string, string> = {
  '0': '٠',
  '1': '١',
  '2': '٢',
  '3': '٣',
  '4': '٤',
  '5': '٥',
  '6': '٦',
  '7': '٧',
  '8': '٨',
  '9': '٩',
};

/**
 * Converts any string or number containing western digits (0-9) to Eastern Arabic digits (٠-٩).
 */
export function toEasternArabic(val: string | number | undefined | null): string {
  if (val === undefined || val === null) return '';
  const str = String(val);
  return str.replace(/[0-9]/g, (digit) => WESTERN_TO_EASTERN[digit] || digit);
}

/**
 * Formats a score fraction, e.g. "٨ من ١٠" or "٥٠ / ١٠٠"
 */
export function formatScoreEastern(score: number, total: number): string {
  return `${toEasternArabic(score)} من ${toEasternArabic(total)}`;
}

/**
 * Formats a percentage string, e.g. "١٠٠٪"
 */
export function formatPercentEastern(percent: number): string {
  return `${toEasternArabic(Math.round(percent))}٪`;
}

/**
 * Returns Arabic ordinal for numbers 1 to 12 (or fallback to رقم X)
 */
export function getArabicOrdinal(num: number): string {
  const ordinals: Record<number, string> = {
    1: 'الأول',
    2: 'الثاني',
    3: 'الثالث',
    4: 'الرابع',
    5: 'الخامس',
    6: 'السادس',
    7: 'السابع',
    8: 'الثامن',
    9: 'التاسع',
    10: 'العاشر',
    11: 'الحادي عشر',
    12: 'الثاني عشر',
  };
  return ordinals[num] || `رقم ${toEasternArabic(num)}`;
}
