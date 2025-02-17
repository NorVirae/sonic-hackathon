import {  ScaleLoader } from "react-spinners"
import { useState } from "react";

const override = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
};


const TalkLoader = () => {
    let [color, setColor] = useState("#ffffff");
    // if (!loading) return null
    return (
        <>
            <h1 style={{ color: "white" }} className="text-xl font-extrabold text-gray-800 mb-2">Talking</h1>
            <ScaleLoader
                color={color}
                loading={true}
                cssOverride={override}
                size={30}
                aria-label="Loading Spinner"
                data-testid="loader"
            />
        </>
    )
}

export default TalkLoader