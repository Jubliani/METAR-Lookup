export abstract class Decoder {
    static decodedText = "";

    abstract Decode(raw: string): boolean;
}