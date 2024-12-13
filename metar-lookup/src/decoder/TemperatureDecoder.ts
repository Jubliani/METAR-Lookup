import { Decoder } from "./DecoderClass";

export class TemperatureDecoder extends Decoder {

    //TODO: decode M##/M## format

    Decode(raw: string) {
        const normalAttempt = this.TryDecodeNormalFormat(raw) 
        if (normalAttempt[0]) {
            return normalAttempt
        }
        return this.TryDecodeSpecialFormat(raw)
    }

    TryDecodeNormalFormat(raw: string) {
        const matchedTempDew = raw.match(/^\d{2}\/\d{2}/);
        if (matchedTempDew) {
            return [true, this.decodedText + `Temperature ${raw.slice(0,2)}\u00B0C, dew point ${raw.slice(3)}\u00B0C. `];
        }
        return [false]
    } 

    TryDecodeSpecialFormat(raw: string) {
        const matchedTempDew = raw.match(/^T\d{8}$/);
        const negativeTempSign = raw[1] == "1" ? "-" : ""
        const negativeDewpointSign = raw[5] == "1" ? "-" : ""
        if (matchedTempDew) {
            return [true, this.decodedText + `Temperature ${negativeTempSign}${this.GetTemperatureFromNumbers(raw.slice(2, 5))}\u00B0C, dew point ${negativeDewpointSign}${this.GetTemperatureFromNumbers(raw.slice(6))}\u00B0C. `];
        }
        return [false]
    }

    GetTemperatureFromNumbers(numbers: string) {
        return `${Number(numbers.slice(0, 2))}.${Number(numbers[2])}`
    }


}