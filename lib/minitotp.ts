/*
 * TOTP: https://datatracker.ietf.org/doc/html/rfc6238
 * HOTP: https://datatracker.ietf.org/doc/html/rfc4226
 * HMAC: https://datatracker.ietf.org/doc/html/rfc2104
 * SHA1: https://datatracker.ietf.org/doc/html/rfc3174
 */

/*
 * HMAC = Hashed Message Authentication Code
 * K = secret, C = counter 
 * HOTP(K,C) = Truncate(HMAC-SHA-1(K,C))
 *
 */
export class MiniTOTP {
    private static readonly TIME_STEP = 30
    private static readonly CODE_DIGITS = 6
    private static readonly ALGORITHM = 'sha1'

    private static HMAC_SHA1(K: Buffer, C: Buffer) {

    }

    private static GenerateHOTP(K: Buffer, C: Buffer) {
        let HS = HMAC_SHA1(K, C)// HS is a 20-byte string
    }
    
    public static generateURI() {

    }

    public static verify(): boolean {
        return false
    }

}
