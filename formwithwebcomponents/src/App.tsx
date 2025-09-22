import { useState } from 'react'
import './App.css'

function App() {
  const [step, setStep] = useState(0);

  const renderBySteps = () => {
    switch (step) {
      case 1: <wc-owner/>
        return
      case 2: <wc-overview/>
        return
      default:
        return <wc-acomodation/>
    }
  }
  return (
    <div>
      {renderBySteps()}
    </div>
  )
}

export default App
