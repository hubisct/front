export function isValidEmail(email: string) {
  if (!email) return false;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export function isValidPassword(pw: string) {
  return typeof pw === "string" && pw.length >= 10;
}

export function isValidBrazilPhone(phone: string) {
  if (!phone) return false;
  const digits = phone.replace(/\D/g, "");
  const len = digits.length;
  // Accept DDD+number (10 or 11) optionally prefixed with country code 55 (12 or 13)
  if (![10, 11, 12, 13].includes(len)) return false;
  if ((len === 12 || len === 13) && !digits.startsWith("55")) return false;
  const ddd = len > 11 ? digits.slice(2, 4) : digits.slice(0, 2);
  if (!ddd || ddd[0] === "0") return false;
  return true;
}
