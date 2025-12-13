import * as readline from 'readline';
import { Base32 } from "./lib/base32"
import { QRCLI } from "./lib/qrcode-cli"


function prompt(rl: readline.Interface) {
    rl.prompt()
}

/*
 * prompt> add <name> // qr表示
 * prompt> <name> <secret> 検証
 */
function main() {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
    const db: Record<string, string> = {}

    rl.setPrompt('prompt> ');
    rl.on('line', async (input) => {
        const command: string[] = input.trim().split(" ")
        switch (command[0]) {
            case "": { console.log("HELLO"); break }
            default: console.log("WORLD")
        }
        prompt(rl)
    })
    rl.on('close', () => { process.exit(0) })
    prompt(rl)
}

main()
