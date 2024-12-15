import { Decoder } from "./DecoderClass";

export class PressureDecoder extends Decoder{

    Decode(raw: string) {
        const matchedAltimeter = raw.match(/^((Q|A)\d{4})|SLP\d{3}/);
        if (matchedAltimeter) {
            this.DecodeTypeOfPressure(raw);
            return true;
        }
        return false;
    }
    
    DecodeTypeOfPressure(raw: string): void {
        if (raw.startsWith("Q")) {
            Decoder.decodedText += `QNH ${raw.slice(1)} hPa. `;
        } else if (raw.startsWith("A")) {
            Decoder.decodedText += `Altimeter ${raw.slice(1, 3)}.${raw.slice(3)}. `;
        } else if (raw.startsWith("SLP")) {
            Decoder.decodedText += `Sea level pressure is ${parseInt(raw.slice(3)) / 10 + 1000} hPa. `;
        }
    }
}