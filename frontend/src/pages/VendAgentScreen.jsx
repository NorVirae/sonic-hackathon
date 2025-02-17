

import { Canvas } from "@react-three/fiber"

import { Leva } from 'leva';
import ChatScreen from "./ChatScreen";
import Environment from "../components/Environment";

export default function ATMAgent() {

  return (
    <section  className='app'>
      <Leva hidden={true} />
      {/* <ChatScreen/> */}
      <Canvas
        shadows
        camera={{
          position: [0, 0, 1],
          fov: 100,
        }}
      >
        <Environment agentType="vend"/>
      </Canvas>
    </section>

  )
}

