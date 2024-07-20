import SearchComponent from "./components/SearchComponent.tsx";
import OutputComponent from "./components/OutputComponent.tsx";

function App() {

  return (
    <>
      <h1>METAR lookup</h1>
      <SearchComponent />
      <OutputComponent />
      <p id="report" />
    </>
  )
}

export default App
