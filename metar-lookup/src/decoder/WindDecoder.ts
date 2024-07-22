import { Decoder } from "./DecoderClass";

export class WindDecoder extends Decoder {

    Decode(raw: string) {
        const matchedWinds = raw.match(/^\d{5}(\d+)?[a-zA-Z]+/);
        if (matchedWinds) { 
            this.DecodeWindStandardNotation(raw);
            return [true, this.decodedText];
        }
        const matchedWindVary = raw.match(/\d{3}V\d{3}/); 
        if (matchedWindVary) { 
            this.decodedText += `Wind direction variable between ${matchedWindVary[0].slice(0, 3)} and ${matchedWindVary[0].slice(4)} degrees. `;
            return [true, this.decodedText];
        }
        if (raw.startsWith("VRB")) {
            this.DecodeWindVRB(raw.slice(3));
            return [true, this.decodedText];
        }
        return [false];
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
    
    DecodeWindStandardNotation(raw: string) {
        if (raw.startsWith("00000")) {
            this.decodedText += "Calm winds. ";
            return;
        }
        const {speed, rest} = this.IsolateWindSpeed(raw.slice(3));
        this.decodedText += `Wind ${raw.slice(0,3)} at ${speed.replace(/^0+/, '')} `
        this.CheckForGust(rest);
    }
    
    CheckForGust(raw: string) {
        const [matched, matched1, matched2, matched3] = [raw.match(/G\d+KT/), raw.match(/G\d+MPS/), raw.match(/KT/), raw.match(/MPS/)]
        if (matched) {
            this.decodedText += `gusting to ${matched[0].substring(1, matched.length - 2)} knots. `;
        } else if (matched1) {
            this.decodedText += `gusting to ${matched1[0].substring(1, matched1[0].length - 3)} meters/sec. `;
        } else if (matched2){ 
            this.decodedText += "knots. "; 
        } else if (matched3) {
            this.decodedText += "meters/sec. ";
        }
    }
    
    DecodeWindVRB(raw: string) {
        const {speed, rest} = this.IsolateWindSpeed(raw);
        this.decodedText += `Wind variable at ${speed.replace(/^0+/, '')} `;
        this.CheckForGust(rest);
    }
}