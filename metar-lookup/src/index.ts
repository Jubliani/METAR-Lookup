import { DecodeSixDigitsToDate, GetMonthAsString, GetTimeRange, Decode } from "./decoder/DecoderUtils.ts";

const metarLink = 'https://aviationweather.gov/api/data/metar?';
const tafLink = 'https://aviationweather.gov/api/data/taf?';
const ERROR_CODE = 'Error: Airfield code not found.';
const NEWTORK_ERROR = 'Error: Network response was not ok.';

var decodedText = "";
async function GetReport(airportCode: string, whichLink: string, decodeReports: boolean) {
    try {
        const response = await fetch(`${whichLink}ids=${airportCode}&format=json`);
        if (!response.ok) {
            throw new Error(NEWTORK_ERROR);
        }
        const data = await response.json();
        if (Object.keys(data).length == 0) {
            decodedText = '';
            throw new Error(ERROR_CODE);
        }
        if (decodeReports && whichLink == metarLink) {
            DecodeMETAR(data[0].rawOb.split(' '), data[0].name);
        } else if (decodeReports && whichLink == tafLink) {
            DecodeTAF(data[0].rawTAF.split(' '), data[0].name);
        } else {
            decodedText = '';
        }
        return whichLink == metarLink ? data[0].rawOb : data[0].rawTAF;
    } catch (error:any) {
        console.log("ERROR TYPE: ", typeof(error))
        return [false, error.message];
    }
}

export async function SendRequest(airportCode: string, TAFReq: boolean, decodeReports: boolean) {
    if (!airportCode) {
        return
    }
    let outputText = await GetReport(airportCode, metarLink, decodeReports);
    console.log("OUTPUT TEXT IS ", outputText);
    if (!outputText[0]) { return outputText; }
    if (TAFReq) {
        outputText += '\n\n' + await GetReport(airportCode, tafLink, decodeReports);
    }
    return [true, outputText + decodedText];
}

function DecodeMETAR(rawArray: Array<string>, airportName: string) {
    decodedText = `\n\nMETAR report for ${rawArray[0]} ${airportName} created on ${DecodeSixDigitsToDate(rawArray[1].slice(0, 6))}.\n\n`;
    decodedText = Decode(rawArray.slice(2), decodedText)
}

function DecodeTAF(rawArray: Array<string>, airportName: string) {
    if (rawArray[0] == "TAF") { rawArray = rawArray.slice(1); }
    decodedText += `\n\nTAF report for ${rawArray[0]} ${airportName} created on ${DecodeSixDigitsToDate(rawArray[1].slice(0, 6))}, valid from ${GetTimeRange(rawArray[2], GetMonthAsString())}.\n\n`;
    decodedText = Decode(rawArray.slice(3), decodedText)
}