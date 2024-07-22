export abstract class Decoder {
    decodedText = '';

    abstract Decode(raw: string): Array<string|boolean>;
}