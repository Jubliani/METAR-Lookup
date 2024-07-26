import { Decoder } from "./DecoderClass.ts";
import { directions } from "./DirectionsUtils.ts";

export class DirectionsDecoder extends Decoder {

    Decode(raw: string) {
        const matchedDirections = raw.match(/^([NS]?[EW]?)(-[NS]?[EW]?)*$/);
        if (!matchedDirections) {
            return [false];
        }
        console.log("MATCHED DIRECTIONS");
        return this.LoopThroughStringAndDecode(raw.split("-"));
    }

    LoopThroughStringAndDecode(directionsArray: Array<string>) {
        this.decodedText += "in the ";
        for (const direction of directionsArray) {
            this.decodedText += directions[direction] + "-";
        }
        return [true, this.decodedText.slice(0, -1) + ". "];
    }
}