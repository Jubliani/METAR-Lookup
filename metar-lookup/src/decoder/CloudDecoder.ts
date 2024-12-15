import { Decoder } from "./DecoderClass";

export class CloudDecoder extends Decoder{

    Decode(raw: string) {
        const matchedCloudStandard = raw.match(/^(?!SLP)[A-Z]{3}\d{3}((TCU)|(CB))?$/);
        if (matchedCloudStandard) {
            console.log("STRING IS: ", raw);
            this.DecodeCloudsHelper(raw.slice(0,3), raw.slice(6), raw.slice(3, 6));
            return true
        }
        console.log("SWITCHING");
        switch(raw) {
            case "NSC":
                Decoder.decodedText += "No significant clouds. "
                return true
            case "CAVOK":
                Decoder.decodedText += "Ceiling and visibility OK. "
                return true
            case "NCD":
                Decoder.decodedText += "No cloud detected. "
                return true
            case "SKC":
                Decoder.decodedText += "Sky clear. "
                return true
            case "CLR":
                Decoder.decodedText += "Sky clear at or below 12,000ft. "
                return true 
            case "TCU":
                Decoder.decodedText += "Towering cumulus clouds "
                return true
            case "CB":
                Decoder.decodedText += "Cumulonimbus clouds "
                return true
            default:
                return false;
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
                Decoder.decodedText += "Few ";
                break;
            case "SCT":
                Decoder.decodedText += "Scattered ";
                break;
            case "BKN":
                Decoder.decodedText += "Broken ";
                break;
            case "OVC":
                Decoder.decodedText += "Overcast ";
                break;
            
            default:
                Decoder.decodedText += "CLOUD TYPE NOT DECODED ";
        }
    }

    DecodeSpecialCloud(specialCloud: string) {
        switch (specialCloud) {
            case "TCU":
                Decoder.decodedText += "towering cumulus clouds ";
                break;
            case "CB":
                Decoder.decodedText += "cumulonimbus clouds ";
                break;
            case "":
                Decoder.decodedText += "clouds ";
                break;
            default:
                Decoder.decodedText += "SPECIAL CLOUD TYPE NOT DECODED ";
        }
    }

    DecodeCloudAlt(cloudAlt: string) {
        Decoder.decodedText += `at ${String(parseInt(cloudAlt) * 100)} feet AGL. `;
    }
}