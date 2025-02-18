

import { Canvas } from "@react-three/fiber"

import { Leva } from 'leva';
import Environment from "../components/Environment";
import ChatScreen from "./ChatScreen";

export default function ATMAgent() {

  return (
    <section  className='app'>
      <Leva hidden={true} />
      <ChatScreen/>
      <Canvas
        shadows
        camera={{
          position: [0, 0, 1],
          fov: 100,
        }}
      >
        <Environment agentType="atm"/>
      </Canvas>
    </section>

  )
}

