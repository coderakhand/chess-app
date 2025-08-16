const otpStore: Map<string, { otp: number; expiresAt: number }> = new Map();

export function generateOtp(email: string) {
  const otp = Math.floor(100000 + Math.random() * 900000);
  const expiresAt =
    Date.now() + Number(process.env.OTP_EXPIRY_MINUTES) * 60 * 1000;
  otpStore.set(email, { otp, expiresAt });
  return otp;
}

export function verifyOtp(email: string, otp: number) {
  const record = otpStore.get(email);
  if (!record) return false;
  if (Date.now() > record.expiresAt) {
    otpStore.delete(email);
    return false;
  }
  const isValid = record.otp === Number(otp);
  if (isValid) otpStore.delete(email);
  return isValid;
}
