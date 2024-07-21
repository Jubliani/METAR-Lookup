import { DecodeSixDigitsToDate, GetMonthAsString, GetTimeRange, Decode } from "./decoder/DecoderUtils.ts";

const metarLink = 'https://aviationweather.gov/api/data/metar?'
const tafLink = 'https://aviationweather.gov/api/data/taf?'

var decodedText = "";
async function GetReport(airportCode: string, whichLink: string, decodeReports: boolean) {
    try {
        const response = await fetch(`${whichLink}ids=${airportCode}&format=json`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        if (Object.keys(data).length == 0) {
            decodedText = '';
            return 'Error: code not found.';
        }
        if (decodeReports && whichLink == metarLink) {
            console.log("WKLDFJLSKDJF");
            DecodeMETAR(data[0].rawOb.split(' '), data[0].name);
        } else if (decodeReports && whichLink == tafLink) {
            DecodeTAF(data[0].rawTAF.split(' '), data[0].name);
        } else {
            decodedText = '';
        }
        return whichLink == metarLink ? data[0].rawOb : data[0].rawTAF;
    } catch (error) {
        console.error('Error:', error);
    }
}

export async function SendRequest(airportCode: string, TAFReq: boolean, decodeReports: boolean) {
    if (!airportCode) {
        return
    }
    let outputText = await GetReport(airportCode, metarLink, decodeReports)
    if (TAFReq) {
        outputText += '\n\n' + await GetReport(airportCode, tafLink, decodeReports);
    }
    console.log(outputText);
    return outputText + decodedText;
}


function DecodeMETAR(rawArray: Array<string>, airportName: string) {
    decodedText = `\n\nMETAR report for ${rawArray[0]} ${airportName} created on ${DecodeSixDigitsToDate(rawArray[1].slice(0, 6))}.\n\n`;
    decodedText += Decode(rawArray.slice(2), decodedText)
}

function DecodeTAF(rawArray: Array<string>, airportName: string) {
    if (rawArray[0] == "TAF") { rawArray = rawArray.slice(1); }
    decodedText += `\n\nTAF report for ${rawArray[0]} ${airportName} created on ${DecodeSixDigitsToDate(rawArray[1].slice(0, 6))}, valid from ${GetTimeRange(rawArray[2], GetMonthAsString())}.\n\n`;
    decodedText += Decode(rawArray.slice(2), decodedText)
}