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
        if (decodeReports.checked && whichLink == metarLink) {
            DecodeMETAR(data[0].rawOb.split(' '), data[0].name);
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
    console.log(outputText)
    output.innerHTML = outputText + decodedText;
});

const parseFunctions = [
    DecodeWind, 
    DecodeVisibility, 
    DecodeClouds,
    DecodeAUTO
];


function DecodeMETAR(rawArray, airportName) {
    decodedText = `<br><br>METAR report for ${rawArray[0]} ${airportName} created at ${rawArray[1]}.<br>`;
    rawArray = rawArray.slice(2);
    console.log(Array.isArray(rawArray));
    console.log(rawArray);
    rawArray.forEach((element) => 
        parseFunctions.some(function(func) {
            return func(element);
        }));
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
    decodedText += `Wind variable at ${speed.replace(/^0+/, '')} `
    CheckForGust(rest);
}

function DecodeVisibility(raw) {
    [DecodeVisibilityNoMeters, DecodeVisibilityMeters].some(function(func) {
        return func(raw);
    });
    return false;
}

function DecodeVisibilityNoMeters(raw) {
    if (raw.endsWith("SM")) { 
        greaterThan = raw[0] == "P" ? "greater than " : ""
        decodedText += `Visibility is ${greaterThan}${raw.slice(0, -2)} statute miles. `
        return true
    }
    return false
}
function DecodeVisibilityMeters(raw) {
    const matchedVisM = raw.match(/^\d{4}$/);
    if (matchedVisM) { 
        if (matchedVisM[0] == 9999) {
            decodedText += "Visibility is 10KM or greater. "
        } else {
            decodedText += `Visibility is ${matchedVisM[0]} meters. `
        }
        return true
    }
    return false
}

function DecodeClouds(raw) {
    if (raw == "NSC") {
        decodedText += "No significant cloud. "
        return true
    }
    if (raw == "CAVOK") {
        decodedText += "Ceiling and visibility OK. "
        return true
    }
    return false
}