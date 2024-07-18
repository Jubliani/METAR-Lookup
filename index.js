import { GetMonthAsString, GetTimeRange } from "./decoderUtils.js";

const airportCode = document.getElementById("inputText")
const TAFReq = document.getElementById("TAFReq")
const reqButton = document.getElementById("reqButton")
const decodeReports = document.getElementById("decodeReports")
const output = document.getElementById("report")

const metarLink = 'https://aviationweather.gov/api/data/metar?'
const tafLink = 'https://aviationweather.gov/api/data/taf?'

var decodedText = "";
async function GetReport(whichLink) {
    try {
        const response = await fetch(`${whichLink}ids=${airportCode.value}&format=json`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        if (Object.keys(data).length == 0) {
            throw new Error('Invalid code');
        }
        if (decodeReports.checked && whichLink == metarLink) {
            console.log("WKLDFJLSKDJF");
            DecodeMETAR(data[0].rawOb.split(' '), data[0].name);
        } else if (decodeReports.checked && whichLink == tafLink) {
            DecodeTAF(data[0].rawTAF.split(' '), data[0].name);
        }
        return whichLink == metarLink ? data[0].rawOb : data[0].rawTAF;
    } catch (error) {
        console.error('Error:', error);
    }
}

reqButton.addEventListener('click', async function() {
    if (!airportCode.value) {
        return
    }
    let outputText = await GetReport(metarLink)
    if (TAFReq.checked) {
        outputText += '<br><br>' + await GetReport(tafLink);
    }
    output.innerHTML = outputText + decodedText;
});

const parseFunctions = [
    DecodeAUTO,
    DecodeWind, 
    DecodeVisibility, 
    DecodeClouds,
    DecodeTempDewPoint,
    DecodeAltimeter,
    DecodeRemarks,
    DecodePrevisions
];


function DecodeMETAR(rawArray, airportName) {
    decodedText = `<br><br>METAR report for ${rawArray[0]} ${airportName} created at ${rawArray[1]}.<br><br>`;
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

function DecodeTAF(rawArray, airportName) {
    if (rawArray[0] == "TAF") { rawArray = rawArray.slice(1); }
    decodedText += `<br><br>TAF report for ${rawArray[0]} ${airportName} created at ${rawArray[1]}, valid from ${GetTimeRange(rawArray[2], GetMonthAsString())}.<br><br>`;
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

function DecodeAUTO(raw) {
    if (raw == "AUTO") {
        decodedText += "Fully automated report. ";
    }
}


function DecodeWind(raw) {
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

function IsolateWindSpeed(speedAndMore) {
    const match = speedAndMore.match(/(\d+)(.*)$/);
    const speed = match[1];
    const rest = match[2];
    return { speed, rest };
}

function DecodeWindStandardNotation(raw) {
    if (raw.startsWith("00000")) {
        decodedText += "Calm winds. ";
        return;
    }
    const {speed, rest} = IsolateWindSpeed(raw.slice(3));
    decodedText += `Wind ${raw.slice(0,3)} at ${speed.replace(/^0+/, '')} `
    CheckForGust(rest);
}

function CheckForGust(raw) {
    if (raw.match(/G\d+KT/)) {
        matched = raw.match(/G\d+KT/)[0];
        decodedText += `gusting to ${matched.substring(1, matched.length - 2)} knots. `;
    } else if (raw.match(/G\d+MPS/)) {
        matched = raw.match(/G\d+MPS/);
        decodedText += `gusting to ${matched.substring(1, matched.length - 3)} meters/sec. `;
    } else if (raw.match(/KT/)){ 
        decodedText += "knots. "; 
    } else if (raw.match(/MPS/)) {
        decodedText += "meters/sec. ";
    }
}

function DecodeWindVRB(raw) {
    const {speed, rest} = IsolateWindSpeed(raw);
    decodedText += `Wind variable at ${speed.replace(/^0+/, '')} `;
    CheckForGust(rest);
}

function DecodeVisibility(raw) {
    return [DecodeVisibilityNoMeters, DecodeVisibilityMeters].some(function(func) {
        return func(raw);
    });
}

function DecodeVisibilityNoMeters(raw) {
    if (raw.endsWith("SM")) { 
        const greaterThan = (raw[0] == "P" || raw[0] == "+") ? "greater than " : "";
        decodedText += `Visibility is ${greaterThan}${raw.slice(1, -2)} statute miles. `;
        return true;
    }
    return false;
}
function DecodeVisibilityMeters(raw) {
    const matchedVisM = raw.match(/^\d{4}$/);
    if (matchedVisM) { 
        if (matchedVisM[0] == 9999) {
            decodedText += "Visibility is 10KM or greater. ";
        } else {
            decodedText += `Visibility is ${matchedVisM[0]} meters. `;
        }
        return true;
    }
    return false;
}

function DecodeClouds(raw) {
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

function DetermineIfCloudOrSLP(raw) {
    if (raw.startsWith("SLP")) {
        DecodeSLP(raw.slice(3));
    } else {
        DecodeCloudsStandard(raw.slice(0,3), raw.slice(6), raw.slice(3, 6));
    }
}

function DecodeSLP(pressure) {
    decodedText += `Sea level pressure is ${parseInt(pressure) / 10 + 1000} hPa. `;
}

function DecodeCloudsStandard(cloudType, specialCloud, cloudAlt) {
    DecodeCloudType(cloudType);
    DecodeSpecialCloud(specialCloud);
    DecodeCloudAlt(cloudAlt);
}

function DecodeCloudType(cloudType) {
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

function DecodeSpecialCloud(specialCloud) {
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

function DecodeCloudAlt(cloudAlt) {
    decodedText += `at ${String(parseInt(cloudAlt) * 100)} feet AGL. `;
}

function DecodeTempDewPoint(raw) {
    const matchedTempDew = raw.match(/^\d{2}\/\d{2}/);
    if (matchedTempDew) {
        decodedText += `Temperature ${raw.slice(0,2)}\u00B0C, dew point ${raw.slice(3)}\u00B0C. `;
        return true;
    }
    return false;
}

function DecodeAltimeter(raw) {
    const matchedAltimeter = raw.match(/^(Q|A)\d{4}/);
    if (matchedAltimeter) {
        DecodeTypeOfPressure(raw);
        return true;
    }
    return false;
}

function DecodeTypeOfPressure(raw) {
    if (raw.startsWith("Q")) {
        decodedText += `QNH ${raw.slice(1)} hPa. `;
    } else if (raw.startsWith("A")) {
        decodedText += `Altimeter ${raw.slice(1, 3)}.${raw.slice(3)}. `;
    } else {
        decodedText += "PRESSURE TYPE NOT DECODED. ";
    }
}

function DecodeRemarks(raw) {
    if (raw == "RMK") {
        decodedText += '<br><br>Remarks: <br>';
        return true;
    }
    return false;
}

function DecodePrevisions(raw) {
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
        decodedText += `From ${GetMonthAsString()} ${raw.slice(2,4)} at ${raw.slice(4)}Z `;
        return true;
    } else if (raw.startsWith("AT")) {
        decodedText += `At ${GetMonthAsString()} ${raw.slice(2,4)} at ${raw.slice(4)}Z: `;
        return true;
    } else if (raw.startsWith("TL")) {
        decodedText += `Until ${GetMonthAsString()} ${raw.slice(2,4)} at ${raw.slice(4)}Z: `;
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