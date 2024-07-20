import SearchComponent from "./components/SearchComponent.tsx";

function App() {

  return (
    <>
      <div><SearchComponent /></div>
      <h1>METAR lookup</h1>
      <input type="text" id="inputText" placeholder="Enter ICAO code" maxLength={4}/>
      <input type="button" id="reqButton" value="Search" />
      <br />
      <input type="checkbox" id="TAFReq" />
      <label htmlFor="TAFReq">Include TAF</label>
      <input type="checkbox" id="decodeReports" />
      <label htmlFor="decodeReports">Decode Reports</label>
      <p id="report" />
    </>
  )
}

export default App
