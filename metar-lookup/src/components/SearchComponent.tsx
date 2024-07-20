function SearchComponent() {
    return (
        <>
            <div className="input-group mb-3" style={{width: "50%"}}>
                <input type="text" className="form-control" id="inputText" placeholder="Enter ICAO code" aria-label="Enter ICAO code" maxLength={4} aria-describedby="basic-addon2"/>
                <div className="input-group-append">
                    <button className="btn btn-outline-secondary btn-light" id="reqButton" type="button">Search</button>
                </div>
            </div>
            <div className="form-check form-check-inline">
                <input className="form-check-input" type="checkbox" value="" id="TAFReq" />
                <label className="form-check-label" htmlFor="TAFReq">Include TAF</label>
            </div>
            <div className="form-check form-check-inline">
                <input className="form-check-input" type="checkbox" value="" id="DecodeReq" />
                <label className="form-check-label" htmlFor="DecodeReq">Decode Reports</label>
            </div>
        </>
    );
}

export default SearchComponent;