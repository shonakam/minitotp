// SHA1: https://datatracker.ietf.org/doc/html/rfc3174

export class SHA1 {
    private static readonly WORD_BIT_SIZE = 32
    private static readonly BLOCK_SIZE = this.WORD_BIT_SIZE * 16
    private static readonly ROUND_MAX = 80
    private static readonly CONSTANT_WORDS_K = {sq1: 0x5A827999, sq2: 0x6ED9EBA1, sq3: 0x8F1BBCDC, sq4: 0xCA62C1D6}
    private static readonly INITIAL_HASH_BUFFER = [0x67452301, 0xEFCDAB89, 0x98BADCFE, 0x10325476, 0xC3D2E1F0]

    public static get ipad(): Buffer {
        return Buffer.alloc(this.BLOCK_SIZE, 0x36); 
    }

    public static get opad(): Buffer {
        return Buffer.alloc(this.BLOCK_SIZE, 0x5C);
    }

    private static choose(B: number, C: number, D: number): number { return (B & C) | (~B & D) }
    private static parity(B: number, C: number, D: number): number { return B ^ C ^ D }
    private static majority(B: number, C: number, D: number): number { return (B & C) | (B & D) | (C & D) }

    private static f(t: number, B: number, C: number, D: number): number {
        if (t <= 19) return this.choose(B, C, D)
        if (t <= 39) return this.parity(B, C, D)
        if (t <= 59) return this.majority(B, C, D)
        return this.parity(B, C, D)
    }

    private static K(t: number): number {
        if (t <= 19) return this.CONSTANT_WORDS_K.sq1
        if (t <= 39) return this.CONSTANT_WORDS_K.sq2
        if (t <= 59) return this.CONSTANT_WORDS_K.sq3
        return this.CONSTANT_WORDS_K.sq4
    }

    private static padding(message: string): Buffer {
        const messageBuffer = Buffer.from(message, 'utf8')
        const originalBitLength = BigInt(messageBuffer.length) * 8n

        const currentBits = originalBitLength + 1n

        let kBits = (BigInt(this.BLOCK_SIZE) * 7n / 8n) - (currentBits % BigInt(this.BLOCK_SIZE))

        if (kBits <= 0n) kBits += BigInt(this.BLOCK_SIZE)
        
        const paddingLengthBytes = Number((1n + kBits) / 8n)
        const finalLengthBytes = messageBuffer.length + paddingLengthBytes + 8
        
        const paddedBuffer = Buffer.alloc(finalLengthBytes)
        messageBuffer.copy(paddedBuffer, 0);
        paddedBuffer[messageBuffer.length] = 0x80

        paddedBuffer.writeBigUInt64BE(originalBitLength, finalLengthBytes - 8)
        return paddedBuffer
    }

    private static leftRotate(x: number, n: number): number { return (x << n) | (x >>> (32 - n)) }

    /** 
     * @param message 2^64-1bit 未満のメッセージ
     * @returns 160bit メッセージダイジェスト
    */
    public static hash(message: string) {
        const processed = this.padding(message)
        let H = [...this.INITIAL_HASH_BUFFER]
        const blocks = processed.length / (this.BLOCK_SIZE / 8)

        for (let i = 0; i < blocks; i++) {
            const offset = i * (this.BLOCK_SIZE / 8)

            let W: number[] = new Array(this.ROUND_MAX)
            for (let t = 0; t < 16; t++) {
                W[t] = processed.readUInt32BE(offset + t * 4)
            }

            for (let t = 16; t < this.ROUND_MAX; t++) {
                const xorResult = W[t-3]! ^ W[t-8]! ^ W[t-14]! ^ W[t-16]!
                W[t] = this.leftRotate(xorResult, 1)
            }

            let [A, B, C, D, E] = H
            for (let t = 0; t < this.ROUND_MAX; t++) {
                const T = (this.leftRotate(A!, 5) + this.f(t, B!, C!, D!) + E! + W[t]! + this.K(t)) | 0
                E = D
                D = C
                C = this.leftRotate(B!, 30)
                B = A
                A = T
            }
            H[0] = (H[0]! + A!) >>> 0
            H[1] = (H[1]! + B!) >>> 0
            H[2] = (H[2]! + C!) >>> 0
            H[3] = (H[3]! + D!) >>> 0
            H[4] = (H[4]! + E!) >>> 0
        }
        
        const digest = Buffer.alloc(20)
        for (let j = 0; j < 5; j++) { digest.writeUInt32BE(H[j]!, j * 4)}
        return digest
    }
}
