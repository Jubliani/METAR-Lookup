import SearchComponent from "./components/SearchComponent.tsx";
import OutputComponent from "./components/OutputComponent.tsx";
import './App.css';
import { useState } from "react";
import * as index from './index.ts';

function App() {
    const [reportText, setText] = useState("");
  
    const handleButtonClick = async (fieldCode: string, includeTAF: boolean, decode: boolean) => {
      const report = await index.SendRequest(fieldCode, includeTAF, decode);
      setText(report || "");
    };

  return (
    <>
      <h1>METAR lookup</h1>
      <SearchComponent handleClick={handleButtonClick}/>
      <OutputComponent report={reportText} />
    </>
  )
}

export default App
