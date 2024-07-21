import { Decoder } from "./DecoderUtils";

export class VisibilityDecoder extends Decoder {

    Decode(raw: string) {
        return [this.DecodeVisibilityNoMeters, this.DecodeVisibilityMeters].some(function(func) {
            return func(raw);
        });
    }
    
    DecodeVisibilityNoMeters(raw: string) {
        if (raw.endsWith("SM")) { 
            const greaterThan = (raw[0] == "P" || raw[0] == "+") ? "greater than " : "";
            if (greaterThan.length > 0) { raw = raw.slice(1); }
            this.decodedText += `Visibility is ${greaterThan}${raw.slice(0, -2)} statute miles. `;
            return [true, this.decodedText];
        }
        return [false];
    }
    DecodeVisibilityMeters(raw: string) {
        const matchedVisM = raw.match(/^\d{4}$/);
        if (!matchedVisM) {
            return [false]
        } 
        if (matchedVisM[0] == "9999") {
            this.decodedText += "Visibility is 10KM or greater. ";
        } else {
            this.decodedText += `Visibility is ${matchedVisM[0]} meters. `;
        }
        return [true, this.decodedText];
    }

    // function DecodeSingleChars(raw: string) {
    //     return [DecodeSingleNumber, DecodeVIS].some(function(func) {
    //         return func(raw);
    //     });
    // }
    
    // //because of this METAR report: 'VIS W 2'
    // function DecodeSingleNumber(raw: string) {
    //     if (raw.match(/^\d{1}$/)) {
    //         decodedText += `is ${raw} statute miles. `;
    //         return true;
    //     }
    //     return false;
    // }
    
    // function DecodeVIS(raw: string) {
    //     if (raw == "VIS") {
    //         decodedText += `Visibility in the `
    //         return true;
    //     }
    //     return false;
    // }
}