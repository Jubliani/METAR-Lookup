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
        {/*skeleton code provided by https://getcssscan.com/css-checkboxes-examples */}
        <div className="checkbox-container">
            <div className="checkbox-wrapper-4">
                <input className="inp-cbx" id="TAFreq" type="checkbox"
                    checked={includeTAF}
                    onChange={e => setIncludeTAF(e.target.checked)} />
                <label className="cbx" htmlFor="TAFreq">
                    <span>
                        <svg width="12px" height="10px">
                            <use xlinkHref="#check-4"></use>
                        </svg>
                    </span>
                    <span>Include TAF</span>
                </label>
                <svg className="inline-svg">
                    <symbol id="check-4" viewBox="0 0 12 10">
                    <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
                    </symbol>
                </svg>
            </div>
            <div className="checkbox-wrapper-4">
                <input className="inp-cbx" id="DecodeReq" type="checkbox"
                    checked={decode}
                    onChange={e => setDecode(e.target.checked)} />
                <label className="cbx" htmlFor="DecodeReq">
                    <span>
                        <svg width="12px" height="10px">
                            <use xlinkHref="#check-4"></use>
                        </svg>
                    </span>
                    <span>Decode reports</span>
                </label>
                <svg className="inline-svg">
                    <symbol id="check-4" viewBox="0 0 12 10">
                    <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
                    </symbol>
                </svg>
            </div>
        </div>
        </>
    );
}

export default SearchComponent;