import { Decoder } from "./DecoderClass";

export class TemperatureDecoder extends Decoder {

    Decode(raw: string) {
        const attempt = this.TryDecodeNormalFormat(raw) 
        if (attempt[0]) {
            return attempt
        }
        return this.TryDecodeSpecialFormat(raw)
    }

    TryDecodeNormalFormat(raw: string) {
        const matchedTempDew = raw.match(/^(M?\d{2})\/(M?\d{2})$/);
        if (matchedTempDew) {
            return this.DecodeNormalFormat(matchedTempDew)
        }
        return [false]
    } 

    DecodeNormalFormat(match: RegExpMatchArray) {
        const [, firstPart, secondPart] = match;
        return [true, this.decodedText + `Temperature ${this.DecodeTemperature(firstPart)}, dew point ${this.DecodeTemperature(secondPart)}. `];
    }

    DecodeTemperature(tempString: string) {
        if (tempString[0] == "M") {
            return `-${Number(tempString.slice(1))}\u00B0C`
        }
        return `${Number(tempString)}\u00B0C`
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