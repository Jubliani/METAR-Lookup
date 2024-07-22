export abstract class Decoder {
    decodedText: string

    constructor(decodedText: string) {
        this.decodedText = decodedText;
    }

    abstract Decode(raw: string): Array<string|boolean>;
}