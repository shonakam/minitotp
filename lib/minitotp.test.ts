import { MiniTOTP } from "./minitotp"
import { Base32 } from "./base32"
import * as crypto from 'crypto'
import * as assert from 'assert'

interface TestVectorsSHA1 {
    timeSec: number
    totp: string
}

function main() {
    const user = "shonakam"
    const issuer = "minitotp_server"
    const K = Buffer.from("12345678901234567890", 'utf8')

    const tests: TestVectorsSHA1[] = [
        { timeSec: 59, totp: '94287082' },
        { timeSec: 1111111109, totp: '07081804' },
        { timeSec: 1111111111, totp: '14050471' },
        { timeSec: 1234567890, totp: '89005924' },
        { timeSec: 2000000000, totp: '69279037' },
    ]

    for (let i = 0; i < tests.length; i++) {
        const t = tests[i]!
        const mini = new MiniTOTP(() => t.timeSec*1000, 8)
        const code = mini.generateTOTP(K)
        try {
            console.log("------------------------")
            console.log(`actual: ${code}`)
            console.log(`expect: ${t.totp}`)
            assert.strictEqual(code, t.totp)
            console.log(`case[${i}]: ✅`)
        } catch (e) {
            console.log(`case[${i}]: ❌`)
        }
    }
}

main()
