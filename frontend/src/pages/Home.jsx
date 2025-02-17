import { useState } from "react";
import QrReader from "../components/qr/QReader"
import { FaQrcode } from "react-icons/fa";


const Home = () => {
    const [openQr, setOpenQr] = useState(false);
    return (
        <div className="home">
            {/* {openQr ? "Close" : "Open"}  */}
            <span className="agent-text">
                Scan For AI Agents
            </span>
            {openQr && <QrReader />}
            <div
                onClick={() => setOpenQr(!openQr)}
                className="btn-scan px-3 py-3 font-bold justify-center align-items-center text-white bg-white/20 backdrop-blur-lg rounded-lg transition-all duration-300 ease-in-out hover:bg-white/30 hover:border-white/50 hover:scale-105 active:scale-95"
            >
                <button
                    onClick={() => setOpenQr(!openQr)}>
                    <FaQrcode fontSize={50} />
                </button>
            </div>
        </div>
    )
}

export default Home