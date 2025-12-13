import * as qrcode from "qrcode";

export class QRCLI {
    public static async write(arg: string) {
        const options: qrcode.QRCodeToStringOptionsTerminal = {
            type: 'terminal',
            errorCorrectionLevel: 'M',
            version: 4,
            small: true
        }
        try {
            const qrCodeString = await qrcode.toString(arg, options)
            console.log(qrCodeString);
        } catch (e) {
            console.error(e)
        }
    }
}
