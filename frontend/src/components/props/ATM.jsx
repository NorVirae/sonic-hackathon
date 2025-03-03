/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import React from 'react'
import { useGLTF } from '@react-three/drei'

export function ATM(props) {
    const { nodes, materials } = useGLTF('/models/atm.glb')
    return (
        <group {...props} dispose={null}>
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Object04.geometry}
                material={materials['_3___Default.001']}
                rotation={[Math.PI / 2, 0, 0]}
                scale={0.001}
            />
        </group>
    )
}

useGLTF.preload('/models/atm.glb')