import { Decoder } from "./DecoderClass";

export class TemperatureDecoder extends Decoder {

    //TODO: decode T###### strings

    Decode(raw: string) {
        const matchedTempDew = raw.match(/^\d{2}\/\d{2}/);
        if (matchedTempDew) {
            return [true, this.decodedText + `Temperature ${raw.slice(0,2)}\u00B0C, dew point ${raw.slice(3)}\u00B0C. `];
        }
        return [false];
    }
}