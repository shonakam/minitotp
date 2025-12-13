import { Base32 } from "./base32"

function main() {
    const b = new Base32()
    const t = b.encode(new TextEncoder().encode("Hello world!"))
    console.log("encode: ", t)
    const a = b.decode(t)
    console.log("decode: ", a)
    console.log("str: ", b.decodeToString(t))
}

main()
