function SearchBar() {
    return (
        <>
            <input className="form-control form-control-lg" type="text" maxLength={4} placeholder="Enter ICAO code" />
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

export default SearchBar;