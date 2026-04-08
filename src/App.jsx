import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import StatusBadge from './components/business-web-side/StatusBadge'

function App() {

  return (
    <>
      <StatusBadge status="andamento" />
      <StatusBadge status="avaliacao" />
      <StatusBadge status="nao-iniciado" />
      <StatusBadge status="concluido" />
    </>
  )
}

export default App
