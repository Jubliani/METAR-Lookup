import { WindDecoder } from "./WindDecoder.ts";
import { VisibilityDecoder } from "./VisibilityDecoder.ts";
import { CloudDecoder } from "./CloudDecoder.ts";
import { TemperatureDecoder } from "./TemperatureDecoder.ts";
import { PressureDecoder } from "./PressureDecoder.ts";
import { SingleWordDecoder } from "./SingleWordDecoder.ts";
import { PrevisionDecoder } from "./PrevisionDecoder.ts";
import { DirectionsDecoder } from "./DirectionsDecoder.ts";



export function Decode(rawArray: Array<string>, text: string) {
    let decodedText = text;
    const parseClasses = [
        SingleWordDecoder,
        WindDecoder,
        CloudDecoder, 
        VisibilityDecoder, 
        TemperatureDecoder,
        PressureDecoder,
        PrevisionDecoder,
        DirectionsDecoder,
    ];
    rawArray.forEach((element) => {
        console.log("ELEMENT IS: ", element);
        console.log("DECODED WAS: ", decodedText);
        decodedText += ClassLooper(element, parseClasses);
    });
    return decodedText;
}

function ClassLooper(element: string, parseClasses: Array<any>) {
    for (const decoderClass of parseClasses) {
        console.log("RUNNING THROUGH: ", decoderClass);
        const decoded = new decoderClass().Decode(element);
        if (decoded[0]) {
            return decoded[1];
        }
    }
    return `${element} NOT DECODED. `;
}

export function LoopThroughFunctions(functions: Array<Function>, raw: string) {
    for (let func of functions) {
        const res = func(raw);
        console.log("RES IS: ", res, func);
        if (res[0]) {
            return res;
        }
    }
    return [false];
}

export function GetMonthAsString() {
    const months = ["January","February","March","April","May","June",
        "July","August","September","October","November","December"];
    return months[new Date().getMonth()];
    
}

export function GetTimeRange(timeRange: string, month: string) {
    return `${month} ${timeRange.slice(0, 2)} ${timeRange.slice(2, 4)}00Z to ${month} ${timeRange.slice(5, 7)} ${timeRange.slice(7)}00Z`;
}

export function DecodeSixDigitsToDate(raw: string) {
    return `${GetMonthAsString()} ${raw.slice(0, 2)} at ${raw.slice(2)}Z`
}