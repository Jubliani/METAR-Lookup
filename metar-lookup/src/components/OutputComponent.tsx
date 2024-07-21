interface OutputComponentProps {
    report: string;
}

const OutputComponent: React.FC<OutputComponentProps> = ({ report }) => {
    return (
        <>
        <p id="report">{report}</p>
        </>
    );
}

export default OutputComponent;