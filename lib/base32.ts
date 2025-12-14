// A TypeScript library for base32 encoding and decoding.
// https://datatracker.ietf.org/doc/html/rfc4648

export class Base32 {
    private static table: string[] = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567".split("")
    private static rev: Record<string, number> = {}
    private static PADDING_CHAR = '='
    private static BITS_PER_CHAR = 5; // 32=2^5

    static {
        for (let i = 0; i < this.table.length; ++i) {
            this.rev[this.table[i]!] = i;
        }
    }

    private static *bitStream(bytes: Uint8Array) {
        for (const b of bytes) {
            for (let i = 7; i >= 0; --i) {
                yield (b >> i) & 0x00000001
            }
        }
    }

    private static *takeBits(stream: Generator<number>): Generator<number> {
        let buff = 0, bits = 0

        for (const bit of stream) {
            buff = (buff << 0x00000001) | bit;
            bits++
            if (bits === this.BITS_PER_CHAR) {
                yield buff
                buff = 0
                bits = 0
            }
        }

        if (bits > 0) {
            buff = buff << (this.BITS_PER_CHAR - bits);
            yield buff
        }
    }

    public static encode(bytes: Uint8Array): string {
        const bitStream = this.bitStream(bytes)
        const groups = this.takeBits(bitStream);

        let out = "";    
        for (const v of groups) out += this.table[v]

        const outputLength = out.length
        const targetLength = Math.ceil(outputLength / 8) * 8

        return out += this.PADDING_CHAR.repeat(targetLength - outputLength)
    }

    public static decode(arg: string): Uint8Array {
        const out: number[] = [];
        const chars = arg.toUpperCase();
        let buffer = 0;
        let bufferBits = 0;

        for (const c of chars) {
            if (c === this.PADDING_CHAR) break
            const v = this.rev[c]
            if (v === undefined) throw new Error("Fatal error.")

            buffer = (buffer << this.BITS_PER_CHAR) | v
            bufferBits += this.BITS_PER_CHAR
            while (bufferBits >= 8) {
                const byte = (buffer >> (bufferBits - 8)) & 0xFF;
                out.push(byte);
                bufferBits -= 8; 
            }
        }
        return new Uint8Array(out);
    }

    public static decodeToString(arg: string): string {
        const bytes = this.decode(arg);
        try {
            return new TextDecoder().decode(bytes);
        } catch (e) {
            console.error("TextDecoder failed:", e);
            throw new Error("Failed to decode byte array to string.");
        }
    }
}
