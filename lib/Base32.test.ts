import { Base32 } from "./base32"

function main() {
    const t = Base32.encode(new TextEncoder().encode("Hello world!"))
    console.log("encode: ", t)
    const a = Base32.decode(t)
    console.log("decode: ", a)
    console.log("str: ", Base32.decodeToString(t))
}

main()
