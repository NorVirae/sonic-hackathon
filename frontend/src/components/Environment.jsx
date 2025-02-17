import { ContactShadows, Sparkles } from "@react-three/drei";
import { useEffect } from "react";

import { useRef, useState } from "react"
import { CameraControls } from "@react-three/drei"

import Portal from "./Portal";
import { ATMAvatar } from "./avatars/ATMAvatar";
import { VendAvatar } from "./avatars/VendAvatar";
import { ATM } from "./props/ATM";
import { VendingMachine } from "./props/VendingMachine";






const Environment = ({ scale = Array.from({ length: 50 }, () => 0.5 + Math.random() * 4), agentType = "atm" }) => {
    const [cameraZoomed, setCameraZoomed] = useState(false)
    const cameraControls = useRef();

    useEffect(() => {
        if (cameraControls.current) {
            cameraControls.current.setLookAt(-0.2, 0.7, 0.7, 0, 0.5, 0, true);
        }
        let timeout = setTimeout(() => {
            setCameraZoomed(true)
        }, 300);
        return () => clearTimeout(timeout)
    }, [cameraZoomed]);

    return (
        <>
            {/* Camera controls */}
            <CameraControls ref={cameraControls} />
            {/* Lighting */}
            <ambientLight intensity={0.4} />

            {/* character */}
            {agentType == "atm" ? <ATMAvatar scale={1} position={[0, -0.9, 0]} rotation={[0, 0, 0]} /> :
                <VendAvatar scale={1} position={[0, -0.9, 0.1]} rotation={[0, 0, 0]} />}

            {agentType == "atm" ? <ATM scale={1} position={[-0.1, 0, -0.5]} rotation={[0, 0, 0]} /> :
                <VendingMachine scale={1} position={[-0.1, -1, -0.5]} rotation={[0, 0, 0]} />}

            <ContactShadows position={[0, -0.85, 0]} scale={2} opacity={0.3} />

            <Sparkles count={scale.length} position={[0, 0.9, 0]} scale={[4, 1.5, 4]} speed={0.3} />
            <Portal position={[0, -0.85, 0]} scale={2} rotation={[0, 2, 0]} />
        </>
    )
}

export default Environment