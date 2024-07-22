import { LoopThroughFunctions } from "./DecoderUtils";
import { Decoder } from "./DecoderClass";
import { modifiers } from "./VisibilityUtils.ts"

export class VisibilityDecoder extends Decoder {

    Decode(raw: string) {
        console.log("DECODEDTEXT IS: ", this.decodedText);
        const res = LoopThroughFunctions([this.DecodeVisibilityNoMeters.bind(this), this.DecodeVisibilityMeters.bind(this), this.DecodeSpecialVis.bind(this)], raw);
        console.log("RETURNING: ", res);
        return res;
    }
    
    DecodeVisibilityNoMeters(raw: string) {
        console.log("RAW IS: ", raw, raw.slice(0, -2));
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
            return [false];
        } 
        if (matchedVisM[0] == "9999") {
            this.decodedText += "Visibility is 10KM or greater. ";
        } else {
            this.decodedText += `Visibility is ${matchedVisM[0]} meters. `;
        }
        return [true, this.decodedText];
    }

    //because of this METAR report: 'VIS W 2'
    DecodeSpecialVis(raw: string) {
        return LoopThroughFunctions([this.DecodeSingleNumber.bind(this), this.DecodeVIS.bind(this), this.DecodeVisModifiers.bind(this)], raw);
    }
    
    DecodeSingleNumber(raw: string) {
        if (raw.match(/^\d{1}$/)) {
            return [true, this.decodedText + `is ${raw} statute miles. `];
        }
        return [false];
    }
    
    DecodeVIS(raw: string) {
        if (raw == "VIS") {
            return [true, this.decodedText + 'Visibility in the '];
        }
        return [false];
    }

    DecodeVisModifiers(raw: string) {
        const matchedVisMod = raw.match(/^(\+|\-)?([A-Z]{2})*$/);
        if (!matchedVisMod) {
            return [false];
        }
        if (raw.startsWith("-")) {
            this.decodedText += "Light ";
            return this.RecVisModifiers(raw.slice(1), '');
        } else if (raw.startsWith("+")) {
            this.decodedText += "Heavy ";
            return this.RecVisModifiers(raw.slice(1), '');
        } else {
            return this.RecVisModifiers(raw, '');
        }
    }

    //TODO: Change logic to do something like SHRA = rain showers, rather than SHRA = Showers Rain
    RecVisModifiers(raw: string, inVicinity: string): Array<boolean|string> {
        if (raw.length == 0) {
            console.log(inVicinity);
            return [true, this.decodedText.slice(0, -1) + inVicinity + ". "];
        }
        switch (raw.slice(0, 2)) {
            case "VC":
                console.log("WE GOT VC");
                return this.RecVisModifiers(raw.slice(2), " in the vicinity of the area");
            case "RE":
                this.decodedText += "Recent ";
                return this.RecVisModifiers(raw.slice(2), inVicinity);
            default:
                this.decodedText += modifiers[raw.slice(0, 2)] + " ";
                return this.RecVisModifiers(raw.slice(2), inVicinity);
        }
    }
}