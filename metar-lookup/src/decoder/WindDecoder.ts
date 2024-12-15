import { Decoder } from "./DecoderClass";

export class WindDecoder extends Decoder {

    Decode(raw: string) {
        const matchedWinds = raw.match(/^\d{5}(\d+)?[a-zA-Z]+/);
        if (matchedWinds) { 
            this.DecodeWindStandardNotation(raw);
            return true;
        }
        const matchedWindVary = raw.match(/\d{3}V\d{3}/); 
        if (matchedWindVary) { 
            Decoder.decodedText += `Wind direction variable between ${matchedWindVary[0].slice(0, 3)} and ${matchedWindVary[0].slice(4)} degrees. `;
            return true;
        }
        if (raw.startsWith("VRB")) {
            this.DecodeWindVRB(raw.slice(3));
            return true
        }
        return false;
    }

    IsolateWindSpeed(speedAndMore: string) {
        const match = speedAndMore.match(/(\d+)(.*)$/);
        if (!match) {
            return { speed:'', rest:'' };
        }
        const speed = match[1];
        const rest = match[2];
        return { speed, rest };
    }
    
    DecodeWindStandardNotation(raw: string): void {
        if (raw.startsWith("00000")) {
            Decoder.decodedText += "Calm winds. ";
            return;
        }
        const {speed, rest} = this.IsolateWindSpeed(raw.slice(3));
        Decoder.decodedText += `Wind ${raw.slice(0,3)} at ${speed.replace(/^0+/, '')} `
        this.CheckForGust(rest);
    }
    
    CheckForGust(raw: string): void {
        const [matched, matched1, matched2, matched3] = [raw.match(/G\d+KT/), raw.match(/G\d+MPS/), raw.match(/KT/), raw.match(/MPS/)]
        if (matched) {
            Decoder.decodedText += `gusting to ${matched[0].substring(1, matched[0].length - 2)} knots. `;
        } else if (matched1) {
            Decoder.decodedText += `gusting to ${matched1[0].substring(1, matched1[0].length - 3)} meters/sec. `;
        } else if (matched2){ 
            Decoder.decodedText += "knots. "; 
        } else if (matched3) {
            Decoder.decodedText += "meters/sec. ";
        }
    }
    
    DecodeWindVRB(raw: string) {
        const {speed, rest} = this.IsolateWindSpeed(raw);
        Decoder.decodedText += `Wind variable at ${speed.replace(/^0+/, '')} `;
        this.CheckForGust(rest);
    }
}