import { useState } from 'react';

interface SearchComponentProps {
    handleClick: (param1: string, param2: boolean, param3: boolean) => void;
  }

function SearchComponent( { handleClick }: SearchComponentProps ) {
    
    const [fieldCode, setFieldCode] = useState('');
    const [includeTAF, setIncludeTAF] = useState(false);
    const [decode, setDecode] = useState(false);

    const onClick = () => {
        handleClick(fieldCode, includeTAF, decode);
    }
    return (
        <>
            <div className="input-container">
                <input type="text" 
                    id="inputText" placeholder="Enter ICAO code" aria-label="Enter ICAO code" maxLength={4}
                    value={fieldCode}
                    onChange={e => setFieldCode(e.target.value)} />
                <div>
                    <button id="reqButton" type="button" onClick={onClick}>Search</button>
                </div>
            </div>
            <div className="checkbox-container">
                <div id="checkboxInput">
                    <input type="checkbox" id="TAFReq" 
                        checked={includeTAF}
                        onChange={e => setIncludeTAF(e.target.checked)} />
                    <label htmlFor="TAFReq">Include TAF</label>
                </div>
                <div id="checkboxInput">
                    <input type="checkbox" id="DecodeReq"
                        checked={decode}
                        onChange={e => setDecode(e.target.checked)} />
                    <label htmlFor="DecodeReq">Decode Reports</label>
                </div>
            </div>
        </>
    );
}

export default SearchComponent;