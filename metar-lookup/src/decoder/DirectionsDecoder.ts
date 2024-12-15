import { Decoder } from "./DecoderClass.ts";
import { directions } from "./DirectionsUtils.ts";

export class DirectionsDecoder extends Decoder {

    Decode(raw: string) {
        const matchedDirections = raw.match(/^([NS]?[EW]?)(-[NS]?[EW]?)*$/);
        if (!matchedDirections) {
            return false;
        }
        return this.LoopThroughStringAndDecode(raw.split("-"));
    }

    LoopThroughStringAndDecode(directionsArray: Array<string>): boolean {
        Decoder.decodedText += "in the ";
        for (const direction of directionsArray) {
            Decoder.decodedText += directions[direction] + "-";
        }
        Decoder.decodedText = Decoder.decodedText.slice(0, -1) + ". "
        return true
    }
}