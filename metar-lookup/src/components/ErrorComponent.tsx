interface ErrorComponentProp {
    error: string;
}

const ErrorComponent: React.FC<ErrorComponentProp> = ({ error }) => {
    return (
        <>
        <div id="error">
            <p>{error}</p>
        </div>
        </>
    );
}

export default ErrorComponent;