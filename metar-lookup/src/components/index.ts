import { DecodeSixDigitsToDate, GetMonthAsString, GetTimeRange } from "./decoderUtils.ts";

const airportCode = document.getElementById("inputText")
const TAFReq = document.getElementById("TAFReq")
const reqButton = document.getElementById("reqButton")
const decodeReports = document.getElementById("DecodeReq")
const output = document.getElementById("report")

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
        outputText += '<br><br>' + await GetReport(airportCode, tafLink, decodeReports);
    }
    return outputText + decodedText;
}

// reqButton.addEventListener('click', async function() {
//     if (!airportCode.value) {
//         return
//     }
//     let outputText = await GetReport(metarLink)
//     if (TAFReq.checked) {
//         outputText += '<br><br>' + await GetReport(tafLink);
//     }
//     output.innerHTML = outputText + decodedText;
// });

const parseFunctions = [
    DecodeAUTO,
    DecodeWind, 
    DecodeVisibility, 
    DecodeClouds,
    DecodeTempDewPoint,
    DecodeAltimeter,
    DecodeRemarks,
    DecodePrevisions,
    DecodeSingleChars
];


function DecodeMETAR(rawArray: Array<string>, airportName: string) {
    decodedText = `<br><br>METAR report for ${rawArray[0]} ${airportName} created on ${DecodeSixDigitsToDate(rawArray[1].slice(0, 6))}.<br><br>`;
    rawArray = rawArray.slice(2);
    rawArray.forEach((element) => {
        const foundMatch = parseFunctions.some(function(func) {
            return func(element);
        });
        if (!foundMatch) {
            decodedText += `${element} NOT DECODED. `;
        }
    });
}

function DecodeTAF(rawArray: Array<string>, airportName: string) {
    if (rawArray[0] == "TAF") { rawArray = rawArray.slice(1); }
    decodedText += `<br><br>TAF report for ${rawArray[0]} ${airportName} created on ${DecodeSixDigitsToDate(rawArray[1].slice(0, 6))}, valid from ${GetTimeRange(rawArray[2], GetMonthAsString())}.<br><br>`;
    rawArray = rawArray.slice(2);
    rawArray.forEach((element) => {
        const foundMatch = parseFunctions.some(function(func) {
            return func(element);
        });
        if (!foundMatch) {
            decodedText += `${element} NOT DECODED. `;
        }
    });
}

function DecodeAUTO(raw: string) {
    if (raw == "AUTO") {
        decodedText += "Fully automated report. ";
        return true;
    }
    return false;
}


function DecodeWind(raw: string) {
    const matchedWinds = raw.match(/^\d{5}(\d+)?[a-zA-Z]+/);
    if (matchedWinds) { 
        DecodeWindStandardNotation(raw);
        return true;
    }
    const matchedWindVary = raw.match(/\d{3}V\d{3}/); 
    if (matchedWindVary) { 
        decodedText += `Wind direction variable between ${matchedWindVary[0].slice(0, 3)} and ${matchedWindVary[0].slice(4)} degrees. `;
        return true;
    }
    if (raw.startsWith("VRB")) {
        DecodeWindVRB(raw.slice(3));
        return true;
    }
    return false;
}

function IsolateWindSpeed(speedAndMore: string) {
    const match = speedAndMore.match(/(\d+)(.*)$/);
    if (!match) {
        return { speed:'', rest:'' };
    }
    const speed = match[1];
    const rest = match[2];
    return { speed, rest };
}

function DecodeWindStandardNotation(raw: string) {
    if (raw.startsWith("00000")) {
        decodedText += "Calm winds. ";
        return;
    }
    const {speed, rest} = IsolateWindSpeed(raw.slice(3));
    decodedText += `Wind ${raw.slice(0,3)} at ${speed.replace(/^0+/, '')} `
    CheckForGust(rest);
}

function CheckForGust(raw: string) {
    const [matched, matched1, matched2, matched3] = [raw.match(/G\d+KT/), raw.match(/G\d+MPS/), raw.match(/KT/), raw.match(/MPS/)]
    if (matched) {
        decodedText += `gusting to ${matched[0].substring(1, matched.length - 2)} knots. `;
    } else if (matched1) {
        decodedText += `gusting to ${matched1[0].substring(1, matched1[0].length - 3)} meters/sec. `;
    } else if (matched2){ 
        decodedText += "knots. "; 
    } else if (matched3) {
        decodedText += "meters/sec. ";
    }
}

function DecodeWindVRB(raw: string) {
    const {speed, rest} = IsolateWindSpeed(raw);
    decodedText += `Wind variable at ${speed.replace(/^0+/, '')} `;
    CheckForGust(rest);
}

function DecodeVisibility(raw: string) {
    return [DecodeVisibilityNoMeters, DecodeVisibilityMeters].some(function(func) {
        return func(raw);
    });
}

function DecodeVisibilityNoMeters(raw: string) {
    if (raw.endsWith("SM")) { 
        const greaterThan = (raw[0] == "P" || raw[0] == "+") ? "greater than " : "";
        if (greaterThan.length > 0) { raw = raw.slice(1); }
        decodedText += `Visibility is ${greaterThan}${raw.slice(0, -2)} statute miles. `;
        return true;
    }
    return false;
}
function DecodeVisibilityMeters(raw: string) {
    const matchedVisM = raw.match(/^\d{4}$/);
    if (!matchedVisM) {
        return false
    } 
    if (matchedVisM[0] == "9999") {
        decodedText += "Visibility is 10KM or greater. ";
    } else {
        decodedText += `Visibility is ${matchedVisM[0]} meters. `;
    }
    return true;
}

function DecodeClouds(raw: string) {
    const matchedCloudStandard = raw.match(/^[A-Z]{3}\d{3}/);
    if (matchedCloudStandard) {
        DetermineIfCloudOrSLP(raw);
        return true;
    }
    switch(raw) {
        case "NSC":
            decodedText += "No significant clouds. ";
            return true;
        case "CAVOK":
            decodedText += "Ceiling and visibility OK. ";
            return true;
        case "NCD":
            decodedText += "No cloud detected. ";
            return true;
        case "SKC":
            decodedText += "Sky clear. ";
            return true;
        default:
            return false;
    }
}

function DetermineIfCloudOrSLP(raw: string) {
    if (raw.startsWith("SLP")) {
        DecodeSLP(raw.slice(3));
    } else {
        DecodeCloudsStandard(raw.slice(0,3), raw.slice(6), raw.slice(3, 6));
    }
}

function DecodeSLP(pressure: string) {
    decodedText += `Sea level pressure is ${parseInt(pressure) / 10 + 1000} hPa. `;
}

function DecodeCloudsStandard(cloudType: string, specialCloud: string, cloudAlt: string) {
    DecodeCloudType(cloudType);
    DecodeSpecialCloud(specialCloud);
    DecodeCloudAlt(cloudAlt);
}

function DecodeCloudType(cloudType: string) {
    switch (cloudType) {
        case "FEW":
            decodedText += "Few ";
            break;
        case "SCT":
            decodedText += "Scattered ";
            break;
        case "BKN":
            decodedText += "Broken ";
            break;
        case "OVC":
            decodedText += "Overcast ";
            break;
        
        default:
            decodedText += "CLOUD TYPE NOT DECODED ";
    }
}

function DecodeSpecialCloud(specialCloud: string) {
    switch (specialCloud) {
        case "TCU":
            decodedText += "towering cumulus clouds ";
            break;
        case "CB":
            decodedText += "cumulonimbus clouds ";
            break;
        case "":
            decodedText += "clouds ";
            break;
        default:
            decodedText += "SPECIAL CLOUD TYPE NOT DECODED ";
    }
}

function DecodeCloudAlt(cloudAlt: string) {
    decodedText += `at ${String(parseInt(cloudAlt) * 100)} feet AGL. `;
}

function DecodeTempDewPoint(raw: string) {
    const matchedTempDew = raw.match(/^\d{2}\/\d{2}/);
    if (matchedTempDew) {
        decodedText += `Temperature ${raw.slice(0,2)}\u00B0C, dew point ${raw.slice(3)}\u00B0C. `;
        return true;
    }
    return false;
}

function DecodeAltimeter(raw: string) {
    const matchedAltimeter = raw.match(/^(Q|A)\d{4}/);
    if (matchedAltimeter) {
        DecodeTypeOfPressure(raw);
        return true;
    }
    return false;
}

function DecodeTypeOfPressure(raw: string) {
    if (raw.startsWith("Q")) {
        decodedText += `QNH ${raw.slice(1)} hPa. `;
    } else if (raw.startsWith("A")) {
        decodedText += `Altimeter ${raw.slice(1, 3)}.${raw.slice(3)}. `;
    } else {
        decodedText += "PRESSURE TYPE NOT DECODED. ";
    }
}

function DecodeRemarks(raw: string) {
    if (raw == "RMK") {
        decodedText += '<br><br>Remarks: <br>';
        return true;
    }
    return false;
}

function DecodePrevisions(raw: string) {
    if (raw == "NOSIG") {
        decodedText += "No significant weather change expected in the next 2 hours. ";
        return true;
    } else if (raw == "BECMG") {
        decodedText += "Becoming ";
        return true;
    } else if (raw == "TEMPO") {
        decodedText += "Temporarily ";
        return true;
    } else if (raw.startsWith("FM")) {
        decodedText += `From ${DecodeSixDigitsToDate(raw.slice(2))} `;
        return true;
    } else if (raw.startsWith("AT")) {
        decodedText += `At ${DecodeSixDigitsToDate(raw.slice(2))}: `;
        return true;
    } else if (raw.startsWith("TL")) {
        decodedText += `Until ${DecodeSixDigitsToDate(raw.slice(2))}: `;
        return true;
    } else if (raw.startsWith("PROB")) {
        decodedText += `With a probability of ${raw.slice(4)}% `;
        return true;
    }
    const matchedTimeRange = raw.match(/^\d{4}\/\d{4}/);
    if (matchedTimeRange) {
        decodedText += `From ${GetTimeRange(raw, GetMonthAsString())}: `;
        return true;
    }
    return false;
}

function DecodeDirections(raw: string) {

}

function DecodeSingleChars(raw: string) {
    return [DecodeSingleNumber, DecodeVIS].some(function(func) {
        return func(raw);
    });
}

//because of this METAR report: 'VIS W 2'
function DecodeSingleNumber(raw: string) {
    if (raw.match(/^\d{1}$/)) {
        decodedText += `is ${raw} statute miles. `;
        return true;
    }
    return false;
}

function DecodeVIS(raw: string) {
    if (raw == "VIS") {
        decodedText += `Visibility in the `
        return true;
    }
    return false;
}