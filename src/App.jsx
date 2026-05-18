import { useState } from 'react'
import AppV1 from './AppV1.jsx'
import AppV2 from './AppV2.jsx'
import './App.css'

function App() {
  // Sets 'v1' as the initial default landing view
  const [activeVersion, setActiveVersion] = useState('v1')

  return (
    <div className="w-full min-h-screen flex flex-col font-sans">
      
      {/* --- PERSISTENT INTERACTIVE TESTING MENU --- */}
      <header className="w-full bg-slate-900 border-b border-slate-800 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 sticky top-0 z-50 shadow-md">
        
        {/* Left Side: Prototype Environment Tag */}
        <div className="text-white font-black text-xs tracking-widest uppercase flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-pulse shadow-[0_0_10px_#a855f7]"></span>
          AFA Friendly Lab Environment
        </div>
        
        {/* Right Side: High-Contrast Dynamic Toggle Buttons */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setActiveVersion('v1')}
            className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer border ${
              activeVersion === 'v1' 
                ? 'bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-600/20 scale-[1.02]' 
                : 'bg-slate-800 text-slate-400 border-slate-700/60 hover:text-white hover:bg-slate-750'
            }`}
          >
            📋 Option 1: Services First (V1)
          </button>
          
          <button
            type="button"
            onClick={() => setActiveVersion('v2')}
            className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer border ${
              activeVersion === 'v2' 
                ? 'bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-600/20 scale-[1.02]' 
                : 'bg-slate-800 text-slate-400 border-slate-700/60 hover:text-white hover:bg-slate-750'
            }`}
          >
            🔒 Option 2: Demographics First (V2)
          </button>
        </div>
      </header>

      {/* --- ACTIVE WORKSPACE COMPONENT PREVIEW VIEWPORT --- */}
      <div className="w-full flex-1 flex flex-col items-center justify-center p-4 sm:p-8 bg-slate-50">
        {activeVersion === 'v1' ? <AppV1 /> : <AppV2 />}
      </div>

    </div>
  )
}

export default App