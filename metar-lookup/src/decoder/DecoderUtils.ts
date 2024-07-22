import { WindDecoder } from "./WindDecoder.ts";
import { VisibilityDecoder } from "./VisibilityDecoder.ts";
import { CloudDecoder } from "./CloudDecoder.ts";
import { TemperatureDecoder } from "./TemperatureDecoder.ts";
import { PressureDecoder } from "./PressureDecoder.ts";
import { SingleWordDecoder } from "./SingleWordDecoder.ts";
import { PrevisionDecoder } from "./PrevisionDecoder.ts";



export function Decode(rawArray: Array<string>, text: string) {
    let decodedText = text;
    const parseClasses = [
        WindDecoder,
        VisibilityDecoder, 
        CloudDecoder, 
        TemperatureDecoder,
        PressureDecoder,
        SingleWordDecoder,
        PrevisionDecoder,
    ];
    rawArray.forEach((element) => {
        for (const decoderClass of parseClasses) {
            const decoded = new decoderClass(decodedText).Decode(element);
            if (decoded[0]) {
                decodedText += decoded[1];
                break;
            }
            decodedText += `${element} NOT DECODED. `;
        }
    });
}

export function LoopThroughFunctions(functions: Array<Function>, raw:string) {
    let result = functions.find(func => {
        const res = func(raw);
        return res[0];
    });
    return result ? result(raw) : [false];
}

export function GetMonthAsString() {
    const months = ["January","February","March","April","May","June",
        "July","August","September","October","November","December"];
    return months[new Date().getMonth()];
    
}

export function GetTimeRange(timeRange: string, month: string) {
    return `${month} ${timeRange.slice(0, 2)} ${timeRange.slice(2, 4)}00Z to 
        ${month} ${timeRange.slice(5, 7)} ${timeRange.slice(7)}00Z`;
}

export function DecodeSixDigitsToDate(raw: string) {
    return `${GetMonthAsString()} ${raw.slice(0, 2)} at ${raw.slice(2)}Z`
}