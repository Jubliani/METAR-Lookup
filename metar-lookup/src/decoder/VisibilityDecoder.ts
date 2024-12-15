import { LoopThroughFunctions } from "./DecoderUtils";
import { Decoder } from "./DecoderClass";
import { modifiers } from "./VisibilityUtils.ts"

export class VisibilityDecoder extends Decoder {

    Decode(raw: string) {
        console.log("DECODEDTEXT IS: ", Decoder.decodedText);
        const res = LoopThroughFunctions([this.DecodeVisibilityNoMeters.bind(this), this.DecodeVisibilityMeters.bind(this), this.DecodeSpecialVis.bind(this)], raw);
        console.log("RETURNING: ", res);
        return res;
    }
    
    DecodeVisibilityNoMeters(raw: string): boolean {
        if (raw.endsWith("SM")) { 
            const greaterThan = (raw[0] == "P" || raw[0] == "+") ? "greater than " : "";
            if (greaterThan.length > 0) { raw = raw.slice(1); }
            Decoder.decodedText += `Visibility is ${greaterThan}${raw.slice(0, -2)} statute miles. `;
            return true;
        }
        return false;
    }
    
    DecodeVisibilityMeters(raw: string): boolean {
        const matchedVisM = raw.match(/^\d{4}$/);
        if (!matchedVisM) {
            return false;
        } 
        if (matchedVisM[0] == "9999") {
            Decoder.decodedText += "Visibility is 10KM or greater. ";
        } else {
            Decoder.decodedText += `Visibility is ${matchedVisM[0]} meters. `;
        }
        return true;
    }

    //because of this METAR report: 'VIS W 2'
    DecodeSpecialVis(raw: string): boolean {
        return LoopThroughFunctions([this.DecodeSingleNumber.bind(this), this.DecodeVIS.bind(this), this.DecodeVisModifiers.bind(this)], raw);
    }
    
    DecodeSingleNumber(raw: string): boolean {
        if (raw.match(/^\d{1}$/)) {
            Decoder.decodedText += `is ${raw} statute miles. `;
            return true;
        }
        return false;
    }
    
    DecodeVIS(raw: string): boolean {
        if (raw == "VIS") {
            Decoder.decodedText += "Visibility in the ";
            return true;
        }
        return false;
    }

    DecodeVisModifiers(raw: string): boolean {
        const matchedVisMod = raw.match(/^(\+|\-)?([A-Z]{2})*$/);
        if (!matchedVisMod) {
            return false;
        }
        if (raw.startsWith("-")) {
            Decoder.decodedText += "Light ";
            return this.RecVisModifiers(raw.slice(1), '');
        } else if (raw.startsWith("+")) {
            Decoder.decodedText += "Heavy ";
            return this.RecVisModifiers(raw.slice(1), '');
        } else {
            return this.RecVisModifiers(raw, '');
        }
    }

    //TODO: Change logic to do something like SHRA = rain showers, rather than SHRA = Showers Rain
    RecVisModifiers(raw: string, inVicinity: string): boolean {
        if (raw.length == 0) {
            this.ChangeShowersIfNeeded();
            Decoder.decodedText = Decoder.decodedText.slice(0, -1) + inVicinity + ". ";
            return true
        }
        switch (raw.slice(0, 2)) {
            case "VC":
                return this.RecVisModifiers(raw.slice(2), " in the vicinity of the area");
            case "RE":
                Decoder.decodedText += "Recent ";
                return this.RecVisModifiers(raw.slice(2), inVicinity);
            default:
                if (!this.CheckStringMatchesModifier(raw.slice(0, 2))[0]) {
                    return false;
                }
                Decoder.decodedText += modifiers[raw.slice(0, 2)] + " ";
                return this.RecVisModifiers(raw.slice(2), inVicinity);
        }
    }

    CheckStringMatchesModifier(toCheck: string) {
        return [modifiers[toCheck] != undefined, modifiers[toCheck]];
    }

    ChangeShowersIfNeeded(): void {
        if (Decoder.decodedText.endsWith("of ")) {
            Decoder.decodedText = Decoder.decodedText.slice(0, -3);
        }
    }
}