import { BaseN } from "./BaseN"

function main() {
    const base16 = new BaseN("0123456789abcdef")
    console.log("test: ", base16.getChars())
}

main()
