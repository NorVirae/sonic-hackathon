import { extend, useFrame } from "@react-three/fiber"
import PortalMaterial from "./PortalMaterial"
import { useRef } from "react"
import { useGLTF, useTexture } from "@react-three/drei"
import { AdditiveBlending } from "three"

function Portal(props) {
    const portalMaterial = useRef()
    const bakedTexture = useTexture('/baked-02.jpeg')
    const { nodes } = useGLTF('/models/portal-2.glb')
    useFrame((state, delta) => (portalMaterial.current.uTime += delta))
    return (
        <group {...props} dispose={null}>
            <mesh geometry={nodes.portalCircle.geometry} position={[0, 0.78, 1.6]} rotation={[-Math.PI / 2, 0, 0]}>
                <portalMaterial ref={portalMaterial} blending={AdditiveBlending} uColorStart="hotpink" uColorEnd="white" />
            </mesh>
            <mesh geometry={nodes.lampLightL.geometry} material-color="#f0bf94" position={[0.89, 1.07, -0.14]} scale={[0.07, 0.11, 0.07]} />
            <mesh geometry={nodes.lampLightR.geometry} material-color="#f0bf94" position={[-0.98, 1.07, -0.14]} scale={[-0.07, 0.11, 0.07]} />
            <mesh geometry={nodes.baked.geometry} position={[0.9, 0.34, -1.47]} rotation={[0, 0.14, 0]}>
                <meshBasicMaterial map={bakedTexture} map-flipY={false} />
            </mesh>
        </group>
    )
}

extend({ PortalMaterial })
export default Portal
