import { useState } from 'react'
import './App.css'

export type Acomodation = {
  name: string;
  address: string;
  type: 'apartment' | 'house' | 'villa';
  description?: string;
  photos?: File[];
}

export type Owner = {
  name: string;
  email: string;
  phone: string;
}

function App() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<{
    acomodation?: Acomodation,
    owner?: Owner
  }>({});

  const handleStepChange = (e: CustomEvent<{
    direction: string;
    acomodation?: Acomodation,
    owner?: Owner
  }>) => {
    const acomodation = e.detail.acomodation
    const owner = e.detail.owner
    if (e.detail.direction === 'next') {
      setStep(step + 1);
    } else {
      setStep(step - 1);
    }
    if (acomodation !== undefined) {
      setFormData({ ...formData, acomodation });
    } else if (owner !== undefined) {
      setFormData({ ...formData, owner });
    }
  };

  const renderBySteps = () => {
    switch (step) {
      case 1:
        return <wc-owner
          data={JSON.stringify(formData.owner)}
          onChange={(e: any) => handleStepChange(e.nativeEvent as CustomEvent)}
        />
      case 2: {
        return <wc-overview
          data={JSON.stringify(formData)}
        />
      }
      default:
        return <wc-acomodation
          data={JSON.stringify(formData.acomodation)}
          onChange={(e: any) => handleStepChange(e.nativeEvent as CustomEvent)}
        />
    }
  }
  return (
    <div className='bg-amber-100 rounded-2xl'>
      Form & Web Components
      {renderBySteps()}
    </div>
  )
}

export default App
