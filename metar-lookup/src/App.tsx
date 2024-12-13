import SearchComponent from "./components/SearchComponent.tsx";
import OutputComponent from "./components/OutputComponent.tsx";
import ErrorComponent from "./components/ErrorComponent.tsx";
import './App.css';
import { useState } from "react";
import * as index from './index.ts';

function App() {
  const [reportText, setText] = useState<[boolean, string]>([false, ""]);
  
    const handleButtonClick = async (fieldCode: string, includeTAF: boolean, decode: boolean) => {
      if (fieldCode.length != 4) {
        setText([false, "Please enter a valid ICAO code!"])
        return
      }
      const report = await index.SendRequest(fieldCode, includeTAF, decode);
      console.log("REPORT IS: ", report);
      setText(report);
      console.log("REPORT TEXT IS: ", reportText);
    };

  return (
    <>
      <h1 id="title">METAR Lookup</h1>
      <SearchComponent handleClick={handleButtonClick} />
      {reportText[0] ? (
        <OutputComponent report={reportText[1]} />
      ) : (
        <ErrorComponent error={reportText[1]} />
      )}
    </>
  )
}

export default App
