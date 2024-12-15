import * as DecoderUtils from "./DecoderUtils";
import { Decoder } from "./DecoderClass";

export class PrevisionDecoder extends Decoder{

    Decode(raw: string) {
        console.log("SJDFIODJFDOSIJFSDFK: ", this.decodedText)
        if (raw == "NOSIG") {
            return [true, this.decodedText + "No significant weather change expected in the next 2 hours. "];
        } else if (raw == "BECMG") {
            return [true, this.decodedText + "Conditions will gradually change to the following: "];
        } else if (raw == "TEMPO") {
            return [true, this.decodedText + "The following conditions will occur temporarily: "];
        } else if (raw.startsWith("FM")) {
            return [true, this.decodedText + `From ${DecoderUtils.DecodeSixDigitsToDate(raw.slice(2))} `];
        } else if (raw.startsWith("AT")) {
            return [true, this.decodedText + `At ${DecoderUtils.DecodeSixDigitsToDate(raw.slice(2))}: `];
        } else if (raw.startsWith("TL")) {
            return [true, this.decodedText + `Until ${DecoderUtils.DecodeSixDigitsToDate(raw.slice(2))}: `];
        } else if (raw.startsWith("PROB")) {
            return [true, this.decodedText + `With a probability of ${raw.slice(4)}% `];
        }
        const matchedTimeRange = raw.match(/^\d{4}\/\d{4}/);
        if (matchedTimeRange) {
            console.log("CURRENT TEXT IS WE MATCHED TIME RANGE: ", this.decodedText)
            this.decodedText = DecoderUtils.RemovePossiblePreviousColon(this.decodedText)
            return [true, this.decodedText + `From ${DecoderUtils.GetTimeRange(raw, DecoderUtils.GetMonthAsString())}: `];
        }
        return [false];
    }
}