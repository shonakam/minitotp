// A TypeScript library for arbitrary base (BaseN) encoding and decoding.
// https://datatracker.ietf.org/doc/html/rfc4648

export class BaseN {
    private table: string[]
    readonly base: number;

    constructor(private readonly chars: string) {
        this.table = chars.split("")
        this.base = this.table.length
    }

    private getBinary() {

    }
    
    public getChars() { return this.chars }

    public encode(arg: string) {

    }

    public decode(arg: string) {

    }

}
