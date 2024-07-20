import SearchComponent from "./components/SearchComponent.tsx";

function App() {

  return (
    <>
      <h1>METAR lookup</h1>
      <div><SearchComponent /></div>
      <p id="report" />
    </>
  )
}

export default App
