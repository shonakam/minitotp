import { Base32 } from "./base32"
import { SHA1 } from "./sha1"
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
    public static readonly TIME_STEP = 30
    private static readonly ALGORITHM = SHA1
    
    constructor(
        private readonly _getTimestamp: () => number = () => Date.now(),
        public readonly CODE_DIGITS: number = 6
    ) {}

    private static get ipad(): Buffer { return Buffer.alloc(this.ALGORITHM.BLOCK_SIZE / 8, 0x36) }
    private static get opad(): Buffer { return Buffer.alloc(this.ALGORITHM.BLOCK_SIZE / 8, 0x5C) }

    private static xorKey(K: Buffer, pad: Buffer) {
        const size = this.ALGORITHM.BLOCK_SIZE / 8
        const res = Buffer.alloc(size)
        for (let i = 0; i < size; i++) {
            const b = K[i] !== undefined ? K[i] : 0x00
            res[i] = b! ^ pad[i]!
        }
        return res
    }

    // HMAC = H(K ⊕ opad, H(K ⊕ ipad, text))
    private static HMAC_SHA1(K: Buffer, C: Buffer): Buffer {    
        const inner_padding = this.xorKey(K, this.ipad)
        const imessage = Buffer.concat([inner_padding, C])
        const idigest = this.ALGORITHM.hash(imessage)
        const outer_padding = this.xorKey(K, this.opad)
        const omessage = Buffer.concat([outer_padding, idigest])
        return this.ALGORITHM.hash(omessage)
    }

    private static DT(HS: Buffer): number {
        let offset = HS[19]! & 0x0f
        let P = (HS[offset]! & 0x7f) << 24 | HS[offset + 1]! << 16 | HS[offset + 2]! << 8 | HS[offset+3]!
        return P >>> 0
    }

    private generateHOTP(K: Buffer, C: Buffer) {
        // Step 1: Generate an HMAC-SHA-1 value
        // HS is a 20-byte string
        let HS = MiniTOTP.HMAC_SHA1(K, C)

        // Step 2: Generate a 4-byte string (Dynamic Truncation)
        // DT returns a 31-bit string
        let Sbits = MiniTOTP.DT(HS)

        // Step 3: Compute an HOTP value
        // Convert S to a number in 0...2^{31}-1
        // let num = StToNum(Sbits) 
        
        // D is a number in the range 0...10^{Digit}-1
        // D = Snum mod 10^Digit
        return Sbits % (10 ** this.CODE_DIGITS)
    }

    private counter() {
        return BigInt(Math.floor(this._getTimestamp() / 1000)) / BigInt(MiniTOTP.TIME_STEP)
    }
    
    public generateTOTP(K: Buffer): string {
        let T = this.counter()
        let C = Buffer.alloc(8)
        C.writeBigInt64BE(T, 0)
        return this.generateHOTP(K, C).toString().padStart(this.CODE_DIGITS, '0')
    }

    public URI(secret: string, user: string, issuer: string): string {
        const encodedIssuer = encodeURIComponent(issuer)
        const encodedUser = encodeURIComponent(user)
        const label = `${encodedIssuer}:${encodedUser}`
        const params = new URLSearchParams()
        params.append('secret', Base32.encode(Buffer.from(secret, 'utf8')))
        params.append('issuer', encodedIssuer)
        params.append('digits', this.CODE_DIGITS.toString())
        params.append('period', MiniTOTP.TIME_STEP.toString())
        // params.append('algorithm', 'sha1')
        return `otpauth://totp/${label}?${params.toString()}`
    }

    public verify(K: Buffer, code: number | string, window: number = 1): boolean {
        const T = this.counter()
        const input = Number(code).toString().padStart(this.CODE_DIGITS, '0')
        for (let i = -window; i <= window; i++) {
            const T_check = T + BigInt(i)
            const C = Buffer.alloc(8)
            C.writeBigInt64BE(T_check, 0)
            const recalc = this.generateHOTP(K, C).toString().padStart(this.CODE_DIGITS, '0')
            if (recalc === input) return true
        }
        return false
    }
}
