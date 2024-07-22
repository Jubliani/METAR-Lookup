import { Decoder } from "./DecoderClass.ts";
import { words } from "./SingleWordUtils.ts"

export class SingleWordDecoder extends Decoder {

    Decode(raw: string) {
        for (let key in words) {
            const res = this.SingleDecoder(raw, key);
            if (res[0]) { return res }
        }
        return [false]
    }

    SingleDecoder(raw: string, key: string) {
        if (raw == key) {
            return [true, this.decodedText + words[key]];
        }
        return [false];
    }
}