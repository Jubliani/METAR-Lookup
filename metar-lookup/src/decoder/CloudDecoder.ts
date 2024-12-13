import { Decoder } from "./DecoderClass";

export class CloudDecoder extends Decoder{

    Decode(raw: string) {
        const matchedCloudStandard = raw.match(/^(?!SLP)[A-Z]{3}\d{3}((TCU)|(CB))?$/);
        if (matchedCloudStandard) {
            console.log("STRING IS: ", raw);
            this.DecodeCloudsHelper(raw.slice(0,3), raw.slice(6), raw.slice(3, 6));
            return [true, this.decodedText];
        }
        console.log("SWITCHING");
        switch(raw) {
            case "NSC":
                return [true, this.decodedText + "No significant clouds. "]
            case "CAVOK":
                return [true, this.decodedText + "Ceiling and visibility OK. "]
            case "NCD":
                return [true, this.decodedText + "No cloud detected. "];
            case "SKC":
                return [true, this.decodedText + "Sky clear. "]
            case "CLR":
                return [true, this.decodedText + "Sky clear at or below 12,000ft. "]   
            case "TCU":
                return [true, this.decodedText + "Towering cumulus clouds "]
            case "CB":
                return [true, this.decodedText + "Cumulonimbus clouds "]
            default:
                return [false];
        }
    }

    DecodeCloudsHelper(cloudType: string, specialCloud: string, cloudAlt: string) {
        this.DecodeCloudType(cloudType);
        this.DecodeSpecialCloud(specialCloud);
        this.DecodeCloudAlt(cloudAlt);
    }

    DecodeCloudType(cloudType: string) {
        switch (cloudType) {
            case "FEW":
                this.decodedText += "Few ";
                break;
            case "SCT":
                this.decodedText += "Scattered ";
                break;
            case "BKN":
                this.decodedText += "Broken ";
                break;
            case "OVC":
                this.decodedText += "Overcast ";
                break;
            
            default:
                this.decodedText += "CLOUD TYPE NOT DECODED ";
        }
    }

    DecodeSpecialCloud(specialCloud: string) {
        switch (specialCloud) {
            case "TCU":
                this.decodedText += "towering cumulus clouds ";
                break;
            case "CB":
                this.decodedText += "cumulonimbus clouds ";
                break;
            case "":
                this.decodedText += "clouds ";
                break;
            default:
                this.decodedText += "SPECIAL CLOUD TYPE NOT DECODED ";
        }
    }

    DecodeCloudAlt(cloudAlt: string) {
        this.decodedText += `at ${String(parseInt(cloudAlt) * 100)} feet AGL. `;
    }
}