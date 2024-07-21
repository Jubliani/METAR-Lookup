import { Decoder } from "./DecoderUtils";

export class SingleWordDecoder extends Decoder {

    Decode(raw: string) {
        return [this.DecodeAUTO, this.DecodeRemarks].some(function(func) {
            return func(raw);
        });
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