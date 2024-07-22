import { LoopThroughFunctions } from "./DecoderUtils";
import { Decoder } from "./DecoderClass";

export class SingleWordDecoder extends Decoder {

    Decode(raw: string) {
        return LoopThroughFunctions([this.DecodeAUTO, this.DecodeRemarks], raw);
    }
    DecodeAUTO(raw: string) {
        if (raw == "AUTO") {
            return [true, this.decodedText + "Fully automated report. "];
        }
        return [false];
    }

    DecodeRemarks(raw: string) {
        if (raw == "RMK") {
            return [true, this.decodedText + '\n\nRemarks: \n'];
        }
        return [false];
    }
}