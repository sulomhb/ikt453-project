import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1>IKT453 - Project</h1>
      <ul>
	<li>MongoDB</li>
	<li>Redis</li>
	<li>PostgreSQL</li>      
      </ul>
    </>
  )
}

export default App
