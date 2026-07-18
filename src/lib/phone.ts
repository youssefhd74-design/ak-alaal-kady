/**
 * Normalize an Egyptian phone number to WhatsApp international format.
 * 01123000325  -> 201123000325
 * 1123000325   -> 201123000325
 * +201123000325 -> 201123000325
 * 00201123000325 -> 201123000325
 * Returns digits only, no + prefix (wa.me format).
 */
export function toWhatsAppNumber(raw: string): string {
  if (!raw) return '';
  // Strip everything except digits
  let digits = raw.replace(/\D/g, '');

  // Handle 00 international prefix
  if (digits.startsWith('00')) digits = digits.slice(2);

  // Already has country code 20
  if (digits.startsWith('20')) return digits;

  // Local format starting with 0 (e.g. 01123000325) -> drop 0, add 20
  if (digits.startsWith('0')) return '20' + digits.slice(1);

  // Bare 10-digit mobile without leading 0 (e.g. 1123000325) -> add 20
  return '20' + digits;
}

/** For display: +201123000325 */
export function toDisplayPhone(raw: string): string {
  const wa = toWhatsAppNumber(raw);
  return wa ? `+${wa}` : '';
}
