
import './App.css'

import { Canvas } from "@react-three/fiber"

import { Leva } from 'leva';
import Environment from './components/Environment';
import ChatScreen from './pages/ChatScreen';
import { Suspense } from 'react';
import ATMAgent from './pages/ATMAgentScreen';
import VendAgent from './pages/VendAgentScreen';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';


export default function App() {

  return (
    <section className='app'>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/atm" element={<ATMAgent />} />
        <Route path="/vend" element={<VendAgent />} />
      </Routes>
      <Leva hidden={true} />
    </section>
  )
}
