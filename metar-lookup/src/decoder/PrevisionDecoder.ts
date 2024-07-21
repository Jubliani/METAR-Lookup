import * as DecoderUtils from "./DecoderUtils";

export class PrevisionDecoder extends DecoderUtils.Decoder{

    Decode(raw: string) {
        if (raw == "NOSIG") {
            return [true, this.decodedText + "No significant weather change expected in the next 2 hours. "];
        } else if (raw == "BECMG") {
            return [true, this.decodedText + "Becoming "];
        } else if (raw == "TEMPO") {
            return [true, this.decodedText + "Temporarily "];
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
            return [true, this.decodedText + `From ${DecoderUtils.GetTimeRange(raw, DecoderUtils.GetMonthAsString())}: `];
        }
        return [false];
    }
}