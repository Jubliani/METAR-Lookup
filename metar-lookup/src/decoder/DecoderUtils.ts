import { WindDecoder } from "./WindDecoder.ts";
import { VisibilityDecoder } from "./VisibilityDecoder.ts";
import { CloudDecoder } from "./CloudDecoder.ts";
import { TemperatureDecoder } from "./TemperatureDecoder.ts";
import { PressureDecoder } from "./PressureDecoder.ts";
import { SingleWordDecoder } from "./SingleWordDecoder.ts";
import { PrevisionDecoder } from "./PrevisionDecoder.ts";
import { DirectionsDecoder } from "./DirectionsDecoder.ts";
import { Decoder } from "./DecoderClass";


export function Decode(rawArray: Array<string>, currentDecodedText: string) {
    Decoder.decodedText = "";
    const parseClasses = [
        new SingleWordDecoder(),
        new WindDecoder(),
        new CloudDecoder(), 
        new VisibilityDecoder(), 
        new TemperatureDecoder(),
        new PressureDecoder(),
        new PrevisionDecoder(),
        new DirectionsDecoder(),
    ];
    rawArray.forEach((element) => {
        console.log("ELEMENT IS: ", element);
        console.log("DECODED WAS: ", currentDecodedText);
        console.log("DECODER TEXT WAS: ", Decoder.decodedText);
        ClassLooper(element, parseClasses);
    });
    return currentDecodedText + Decoder.decodedText;
}

function ClassLooper(element: string, parseClasses: Array<Decoder>) {
    for (const decoderClassInstance of parseClasses) {
        console.log("RUNNING THROUGH: ", decoderClassInstance.constructor.name);
        const decoded = decoderClassInstance.Decode(element);
        if (decoded) {
            return
        }
    }
    Decoder.decodedText += `${element} NOT DECODED. `;
}

export function LoopThroughFunctions(functions: Array<Function>, raw: string) {
    for (let func of functions) {
        const res = func(raw);
        console.log("RES IS: ", res, func);
        if (res) {
            return true;
        }
    }
    return false;
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

export function RemovePossiblePreviousColon() {
    if (Decoder.decodedText.endsWith(": ")) {
        Decoder.decodedText = Decoder.decodedText.slice(0, -2) + " ";
    }
}