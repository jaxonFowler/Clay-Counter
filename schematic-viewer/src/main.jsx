import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Schematic from './Schematic.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Schematic />
  </StrictMode>,
)
