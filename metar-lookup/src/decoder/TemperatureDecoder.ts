import { Decoder } from "./DecoderClass";

export class TemperatureDecoder extends Decoder {

    Decode(raw: string) {
        const attempt = this.TryDecodeNormalFormat(raw) 
        if (attempt) {
            return attempt
        }
        return this.TryDecodeSpecialFormat(raw)
    }

    TryDecodeNormalFormat(raw: string): boolean {
        const matchedTempDew = raw.match(/^(M?\d{2})\/(M?\d{2})$/);
        if (matchedTempDew) {
            return this.DecodeNormalFormat(matchedTempDew)
        }
        return false
    } 

    DecodeNormalFormat(match: RegExpMatchArray): boolean {
        const [, firstPart, secondPart] = match;
        Decoder.decodedText += `Temperature ${this.DecodeTemperature(firstPart)}, dew point ${this.DecodeTemperature(secondPart)}. `
        return true
    }

    DecodeTemperature(tempString: string): string {
        if (tempString[0] == "M") {
            return `-${Number(tempString.slice(1))}\u00B0C`
        }
        return `${Number(tempString)}\u00B0C`
    }


    TryDecodeSpecialFormat(raw: string): boolean {
        const matchedTempDew = raw.match(/^T\d{8}$/);
        const negativeTempSign = raw[1] == "1" ? "-" : ""
        const negativeDewpointSign = raw[5] == "1" ? "-" : ""
        if (matchedTempDew) {
            Decoder.decodedText += `Temperature ${negativeTempSign}${this.GetTemperatureFromNumbers(raw.slice(2, 5))}\u00B0C, dew point ${negativeDewpointSign}${this.GetTemperatureFromNumbers(raw.slice(6))}\u00B0C. `
            return true
        }
        return false
    }

    GetTemperatureFromNumbers(numbers: string): string {
        return `${Number(numbers.slice(0, 2))}.${Number(numbers[2])}`
    }


}