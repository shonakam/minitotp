import * as readline from 'readline'
import * as crypto from 'crypto'
import { QRCLI } from "./lib/qrcode-cli"
import { MiniTOTP } from './lib/minitotp'

/*
 * prompt> add <name>           // 秘密鍵の登録 + qr表示
 * prompt> verify <name> <code> // 検証
 * prompt> code <name>          // コードを表示
 */
async function main() {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
    const db: Record<string, string> = {}
    const minitotp = new MiniTOTP()
    const iss = 'minitotp_serv'

    rl.setPrompt('prompt> ')
    rl.on('line', async (input) => {
        const command: string[] = input.trim().split(" ")
        if (command.length === 0 || command[1] === undefined) {
            rl.prompt()
            return
        }

        switch (command[0]) {
            case "add": { 
                const secret = crypto.randomBytes(20).toString()
                db[command[1]] = secret
                await QRCLI.write(minitotp.URI(secret, command[1]!, iss))
                break 
            }
            case "verify": {
                if (command[2] === undefined) return
                if (db[command[1]] === undefined) {
                    console.log("response: unregistered 🫵 😾")
                    break
                }
                const K = Buffer.from(db[command[1]]!, 'utf8')
                const flag = minitotp.verify(K, command[2])
                
                if (flag)
                    console.log("response: verification success 😸👌")
                else
                    console.log("response: verification failed ✋😿🤚")
            }
            case "code": {
                if (db[command[1]] === undefined) {
                    console.log("response: unregistered 🫵 😾")
                    break
                }
                console.log(minitotp.generateTOTP(Buffer.from(db[command[1]!]!, 'utf8')))
            }
            default: break
        }
        rl.prompt()
    })
    rl.on('close', () => { process.exit(0) })
    rl.prompt()
}

main()
