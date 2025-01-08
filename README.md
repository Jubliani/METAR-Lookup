# METAR Lookup
A simple chrome extension that allows you to look up the weather at any airport.<br>
Weather data is pulled from the Aviation Weather Center data API.

## How to use
Simply enter in the 4 letter ICAO code of any airport to look up its METAR report.<br>
The extension gives the option to include a TAF report and to decode reports into plain English.
<b><p>
NOTE: decodings may not fully translate reports. METAR/TAF reports can include a huge variety of info and edge cases. Right now around 90-95% of content is correctly decoded.
</p></b>

## Installation
`cd` into metar-lookup, build the extension (I used `npm run build`) and load it unpacked into Chrome. <br>

## Disclaimer
The information provided by this extension is intended for general reference purposes only. Moreover, decodings may be inaccurate/incomplete. As such, do NOT rely upon this extension as your sole source of aviation weather information. As pilot in command, you are directly responsible for assuring correct information and ensuring the safety of your flight.
