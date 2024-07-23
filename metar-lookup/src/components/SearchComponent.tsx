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
            <div className="input-group mb-3" style={{width: "75%"}}>
                <input type="text" 
                    className="form-control" id="inputText" placeholder="Enter ICAO code" aria-label="Enter ICAO code" maxLength={4} aria-describedby="basic-addon2" 
                    value={fieldCode}
                    onChange={e => setFieldCode(e.target.value)} />
                <div className="input-group-append">
                    <button className="btn btn-outline-secondary btn-light" id="reqButton" type="button" onClick={onClick}>Search</button>
                </div>
            </div>
            <div className="form-check form-check-inline fw-bold">
                <input className="form-check-input" type="checkbox" id="TAFReq" 
                    checked={includeTAF}
                    onChange={e => setIncludeTAF(e.target.checked)} />
                <label className="form-check-label" htmlFor="TAFReq">Include TAF</label>
            </div>
            <div className="form-check form-check-inline fw-bold">
                <input className="form-check-input" type="checkbox" id="DecodeReq"
                    checked={decode}
                    onChange={e => setDecode(e.target.checked)} />
                <label className="form-check-label" htmlFor="DecodeReq">Decode Reports</label>
            </div>
        </>
    );
}

export default SearchComponent;