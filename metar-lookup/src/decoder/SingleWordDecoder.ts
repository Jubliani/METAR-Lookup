import { Decoder } from "./DecoderClass.ts";
import { words } from "./SingleWordUtils.ts"

export class SingleWordDecoder extends Decoder {

    Decode(raw: string) {
        for (let key in words) {
            if (raw == key) {
                return [true, this.decodedText + words[key]];
            }
        }
        return [false]
    }
}