/**
 * Generate a 6-digit OTP code
 */
export function generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Check if OTP has expired
 * @param expiresAt - Expiration timestamp
 */
export function isOTPExpired(expiresAt: Date): boolean {
    return new Date() > new Date(expiresAt);
}
