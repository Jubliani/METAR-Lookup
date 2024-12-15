import * as DecoderUtils from "./DecoderUtils";
import { Decoder } from "./DecoderClass";

export class PrevisionDecoder extends Decoder{

    Decode(raw: string) {
        if (raw == "NOSIG") {
            Decoder.decodedText += "No significant weather change expected in the next 2 hours. "
            return true;
        } else if (raw == "BECMG") {
            Decoder.decodedText += "Conditions will gradually change to the following: "
            return true
        } else if (raw == "TEMPO") {
            Decoder.decodedText += "The following conditions will occur temporarily: "
            return true
        } else if (raw.startsWith("FM")) {
            Decoder.decodedText += `From ${DecoderUtils.DecodeSixDigitsToDate(raw.slice(2))} `
            return true
        } else if (raw.startsWith("AT")) {
            Decoder.decodedText += `At ${DecoderUtils.DecodeSixDigitsToDate(raw.slice(2))}: `
            return true
        } else if (raw.startsWith("TL")) {
            Decoder.decodedText += `Until ${DecoderUtils.DecodeSixDigitsToDate(raw.slice(2))}: `
            return true
        } else if (raw.startsWith("PROB")) {
            Decoder.decodedText += `With a probability of ${raw.slice(4)}% `
            return true
        }
        const matchedTimeRange = raw.match(/^\d{4}\/\d{4}/);
        if (matchedTimeRange) {
            console.log("CURRENT TEXT IS WE MATCHED TIME RANGE: ", Decoder.decodedText)
            DecoderUtils.RemovePossiblePreviousColon()
            Decoder.decodedText += `From ${DecoderUtils.GetTimeRange(raw, DecoderUtils.GetMonthAsString())}: `
            return true
        }
        return false;
    }
}