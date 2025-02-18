import QRCode from "react-qr-code";

const CreateQRCode = () => {


    return (
        // Can be anything instead of `maxWidth` that limits the width.
        <div className="qr-creator" style={{ height: "auto", margin: "0 auto", maxWidth: "50", width: "100%" }}>
            <QRCode
                size={256}
                style={{ height: "100%", maxWidth: "100%", width: "100%" }}
                value={"/atm"}
                viewBox={`0 0 1256 1256`}
            />
        </div>
    )
}

export default CreateQRCode