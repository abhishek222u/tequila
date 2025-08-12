'use client'

import Button from '@/component/Button'

export default function TestButton() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="space-y-8">
        <h1 className="text-white text-4xl text-center mb-8">Button Test Page</h1>
        
        <div className="flex flex-col items-center space-y-4">
          <Button 
            text="GET TO KNOW US" 
            onClick={() => console.log('Button clicked!')} 
          />
          
          <Button 
            text="CASE STUDIES" 
            onClick={() => console.log('Case studies clicked!')} 
          />
          
          <Button 
            text="CONTACT US" 
            onClick={() => console.log('Contact clicked!')} 
          />
        </div>
        
        <div className="text-white text-center mt-8">
          <p>Hover over the buttons to see the animation effect</p>
        </div>
      </div>
    </div>
  )
}
