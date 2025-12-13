import { SHA1 } from './sha1'
import * as crypto from 'crypto'
import * as assert from 'assert'

function main() {
    const msg = "Hello world!"
    const rebuild_digest = SHA1.hash(msg).toString('hex')
    const builtin_digest = crypto.createHash('sha1').update(msg, 'utf8').digest('hex');

    console.log(`input message: "${msg}"`);
    console.log(`rebuild_digest: ${rebuild_digest}`);
    console.log(`builtin_digest: ${builtin_digest}`);
    try {
        assert.strictEqual(rebuild_digest, builtin_digest)
        console.log("------------------------------------------")
        console.log("✅SUCCESS");
    } catch (e) {
        console.error("❌FAILED");
    }
}

main()
