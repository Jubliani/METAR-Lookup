interface OutputComponentProps {
    report: string;
}

const OutputComponent: React.FC<OutputComponentProps> = ({ report }) => {
    return (
        <>
        <div id="report">
            <p>{report}</p>
        </div>
        </>
    );
}

export default OutputComponent;