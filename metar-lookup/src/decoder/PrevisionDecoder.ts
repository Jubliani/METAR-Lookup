import * as DecoderUtils from "./DecoderUtils";
import { Decoder } from "./DecoderClass";

export class PrevisionDecoder extends Decoder{

    Decode(raw: string) {
        if (raw == "NOSIG") {
            Decoder.decodedText += "No significant weather change expected in the next 2 hours. "
            return true;
        } else if (raw == "BECMG") {
            this.CheckForPercentage("c", "C", "onditions will gradually change to the following: ")
            return true
        } else if (raw == "TEMPO") {
            this.CheckForPercentage("t", "T", "he following conditions will occur temporarily: ")
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
            DecoderUtils.RemovePossiblePreviousColon()
            Decoder.decodedText += `from ${DecoderUtils.GetTimeRange(raw, DecoderUtils.GetMonthAsString())}: `
            return true
        }
        return false;
    }

    CheckForPercentage(lowercaseFirstLetter: string, uppercaseFirstLetter: string, textToAppend: string): void {
        if (Decoder.decodedText.endsWith("% ")) {
            Decoder.decodedText += lowercaseFirstLetter + textToAppend;
            return;
        }
        Decoder.decodedText += uppercaseFirstLetter + textToAppend;
    }
}