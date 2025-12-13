/*
 * TOTP: https://datatracker.ietf.org/doc/html/rfc6238
 * HOTP: https://datatracker.ietf.org/doc/html/rfc4226
 * HMAC: https://datatracker.ietf.org/doc/html/rfc2104
 */

/*
 * HMAC = Hashed Message Authentication Code
 * HMAC = H(K ⊕ opad, H(K ⊕ ipad, text))
 * K = secret, C = counter 
 * HOTP(K,C) = Truncate(HMAC-SHA-1(K,C))
 * memo:
 *   - Dynamic Truncation
 *     - HMAC_SHA1で 20byte の文字列を生成
 *     - 下位 4bit を offset として利用 (0 <= offset <= 15byte)
 *     - 開始位置から 4byte 取得 (符号を外す)
 *   - SHA-1
 *     - 返却値は 20byte
 * 
 */
export class MiniTOTP {
    private static readonly TIME_STEP = 30
    private static readonly CODE_DIGITS = 6
    private static readonly ALGORITHM = 'sha1'

    private static HMAC_SHA1(K: Buffer, C: Buffer): Buffer {    
        return b
    }

    private static DT(HS: Buffer): number {
        let offset = HS[19]! & 0x0f
        let P = this._offsetHS(HS, offset)
        return P
    }

    private static _offsetHS(HS: Buffer, offset: number) {
        return (HS[offset]! & 0x7f) << 24 | HS[offset + 1]! << 16 | HS[offset + 2]! << 8 | HS[offset+3]!
    }

    private static generateHOTP(K: Buffer, C: Buffer) {
        // Step 1: Generate an HMAC-SHA-1 value
        // HS is a 20-byte string
        let HS = this.HMAC_SHA1(K, C)

        // Step 2: Generate a 4-byte string (Dynamic Truncation)
        // DT returns a 31-bit string
        let Sbits = this.DT(HS)

        // Step 3: Compute an HOTP value
        // Convert S to a number in 0...2^{31}-1
        // let num = StToNum(Sbits) 
        
        // D is a number in the range 0...10^{Digit}-1
        // D = Snum mod 10^Digit
        return Sbits % (10 ** this.CODE_DIGITS)
    }
    
    public static generateURI() {

    }

    public static verify(): boolean {
        return false
    }

}
