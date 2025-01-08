import { Decoder } from "./DecoderClass.ts";
import { words } from "./SingleWordUtils.ts"

export class SingleWordDecoder extends Decoder {

    Decode(raw: string) {
        for (let key in words) {
            if (raw == key) {
                if (key == "PLUMES") {
                    Decoder.decodedText = Decoder.decodedText.slice(0, -2) + " "
                }
                Decoder.decodedText += words[key]
                return true;
            }
        }
        return false
    }
}