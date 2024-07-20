import { useState } from 'react';

function OutputComponent() {
    const [reportText, setText] = useState("");
    return (
        <>
        <p>{reportText}</p>
        </>
    );
}

export default OutputComponent;