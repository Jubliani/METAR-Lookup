export abstract class Decoder {
    decodedText: string;

    constructor() {
        this.decodedText = '';
    }

    abstract Decode(raw: string): Array<string|boolean>;
}