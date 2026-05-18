import { useState } from 'react'

export default function AppV2() {
  // Screens: 1=Demographics, 2=Service Selection, 3=Deep Questions, 4=Your Safe Options
  const [screen, setScreen] = useState(1)

  // User details
  const [age, setAge] = useState('')
  const [stateLocation, setStateLocation] = useState('')
  const [selectedService, setSelectedService] = useState('')

  // Sub-questions
  const [weeksPregnant, setWeeksPregnant] = useState('')
  const [hasStiSymptoms, setHasStiSymptoms] = useState('')
  const [contraceptiveUrgency, setContraceptiveUrgency] = useState('')
  const [pregnancyTestStatus, setPregnancyTestStatus] = useState('')

  // --- NEW FILTER STATES FOR SCREEN 4 ---
  const [deliveryFilter, setDeliveryFilter] = useState('all') // 'all', 'mail', 'in-person'
  const [insuranceFilter, setInsuranceFilter] = useState('all') // 'all', 'insurance', 'free-cash'

  const usStates = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 
  'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 
  'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 
  'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 
  'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 
  'Montana', 'Nebraska', 'Nevative', 'New Hampshire', 'New Jersey', 
  'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 
  'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 
  'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 
  'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
]
  
  const services = [
    { id: 'abortion', name: 'I want an abortion', icon: '💊', subtitle: 'Explore safe, private medical and legal pathways.' },
    { id: 'testing', name: 'I want STI testing', icon: '📈', subtitle: 'Find discreet, rapid check-up resources.' },
    { id: 'contraceptive', name: 'I want a contraceptive', icon: '📅', subtitle: 'Access birth control, patches, or emergency options.' },
    { id: 'pregnancy', name: 'I want to test for pregnancy', icon: '🩺', subtitle: 'Get confidential, highly accurate test options.' }
  ]

  const handleGoBack = () => {
    if (screen === 4) {
      setScreen(3)
    } else if (screen === 3) {
      setScreen(2)
    } else if (screen === 2) {
      setScreen(1)
      setSelectedService('') 
    }
  }

  // Updated Recommendation Database with metadata tags for real-time filtering
  const getRecommendations = () => {
    let list = []
    
    // 1. ABORTION PATH
    if (selectedService === 'abortion') {
      list.push({
        name: '🔑 I Need an A (ineedana.com)',
        desc: `The simplest way to find real, active abortion clinics near you. Completely personalized for a ${age}-year-old in ${stateLocation}.`,
        link: 'https://www.ineedana.com',
        type: 'in-person',
        cost: 'insurance'
      })
      list.push({
        name: '📦 Plan C (plancpills.org)',
        desc: 'A directory showing you exactly how people buy abortion pills online and get them mailed securely to their house, even in restricted states.',
        link: 'https://www.plancpills.org',
        type: 'mail',
        cost: 'free-cash'
      })

      const minorStates = ['Texas', 'Florida', 'Ohio']
      if (Number(age) < 18 && minorStates.includes(stateLocation)) {
        list.push({
          name: '⚖️ Judicial Bypass Support (reprolegalhelpline.org)',
          desc: `In ${stateLocation}, minors usually need parent permission. If you can't tell your parents, this free legal line helps you get a confidential judge's note instead.`,
          link: 'https://www.reprolegalhelpline.org',
          type: 'mail',
          cost: 'free-cash'
        })
      }
    }

    // 2. STI TESTING PATH
    if (selectedService === 'testing') {
      if (hasStiSymptoms === 'yes') {
        list.push({
          name: '🏥 Planned Parenthood Care Finder',
          desc: 'Since you have symptoms, a quick physical clinic visit is best. Planned Parenthood treats everyone regardless of age or money, completely confidentially.',
          link: 'https://www.plannedparenthood.org',
          type: 'in-person',
          cost: 'insurance'
        })
      } else {
        list.push({
          name: '🔬 TakeMeHome (takemehome.org)',
          desc: 'Get an anonymous, free STI test kit mailed right to your door. You do a quick finger prick or swab, mail it back for free, and check your results online.',
          link: 'https://takemehome.org',
          type: 'mail',
          cost: 'free-cash'
        })
      }
    }

    // 3. CONTRACEPTIVE PATH
    if (selectedService === 'contraceptive') {
      if (contraceptiveUrgency === 'emergency') {
        list.push({
          name: '🚨 Emergency Pill Locator (ec.princeton.edu)',
          desc: 'Find out exactly which over-the-counter emergency pills (like Plan B or Ella) are sitting on store shelves near you right now.',
          link: 'https://ec.princeton.edu',
          type: 'in-person',
          cost: 'free-cash'
        })
      }
      list.push({
        name: '💊 Twentyeight Health or Wisp',
        desc: 'Super youth-friendly telehealth platforms where doctors prescribe ongoing birth control online and ship it discretely to your room.',
        link: 'https://www.twentyeighthealth.com',
        type: 'mail',
        cost: 'insurance'
      })
    }

    // 4. PREGNANCY TESTING PATH
    if (selectedService === 'pregnancy') {
      if (pregnancyTestStatus === 'need-test') {
        list.push({
          name: '🏥 Local Community Health Hubs',
          desc: `Find free, completely confidential urine and blood pregnancy testing near you in ${stateLocation} without needing insurance or parent signatures.`,
          link: 'https://www.plannedparenthood.org',
          type: 'in-person',
          cost: 'free-cash'
        })
      } else {
        list.push({
          name: '❤️ All-Options Talkline (all-options.org)',
          desc: 'A beautiful, zero-judgment peer hotline where you can talk through your feelings and options after a positive test with someone who truly cares.',
          link: 'https://www.all-options.org',
          type: 'mail',
          cost: 'free-cash'
        })
      }
    }

    // GENERAL RESOURCE (Always shown, fits all categories)
    list.push({
      name: '💬 Scarleteen (scarleteen.com)',
      desc: 'The ultimate, non-judgmental guide to sex, bodies, and relationships built entirely for teenagers and young adults.',
      link: 'https://www.scarleteen.com',
      type: 'all', 
      cost: 'all'
    })

    // --- APPLY FILTERS LIVE ---
    return list.filter(item => {
      const matchesDelivery = deliveryFilter === 'all' || item.type === 'all' || item.type === deliveryFilter;
      const matchesCost = insuranceFilter === 'all' || item.cost === 'all' || item.cost === insuranceFilter;
      return matchesDelivery && matchesCost;
    })
  }

  const handleReset = () => {
    setScreen(1)
    setSelectedService('')
    setWeeksPregnant('')
    setHasStiSymptoms('')
    setContraceptiveUrgency('')
    setPregnancyTestStatus('')
    setDeliveryFilter('all')
    setInsuranceFilter('all')
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-6 py-4 font-sans text-slate-800 antialiased">
      
      {/* --- BRAND HEADER --- */}
      <div className="flex justify-between items-center border-b border-slate-100 pb-6 mb-8">
        <div>
          <h1 className="text-2xl font-black text-purple-700 tracking-wide m-0 p-0 uppercase">
            Asking For A Friend
          </h1>
          <p className="text-xs uppercase tracking-widest text-slate-400 font-bold mt-0.5">
            Service Finder <span className="text-purple-400 font-medium">(Option 2)</span>
          </p>
        </div>
        
        {/* Progress Tracker */}
        <div className="flex items-center gap-1.5">
          <span className={`h-1.5 rounded-full transition-all ${screen === 1 ? 'w-8 bg-purple-600' : 'w-3 bg-slate-200'}`}></span>
          <span className={`h-1.5 rounded-full transition-all ${screen === 2 ? 'w-8 bg-purple-600' : 'w-3 bg-slate-200'}`}></span>
          <span className={`h-1.5 rounded-full transition-all ${screen === 3 ? 'w-8 bg-purple-600' : 'w-3 bg-slate-200'}`}></span>
          <span className={`h-1.5 rounded-full transition-all ${screen === 4 ? 'w-8 bg-purple-600' : 'w-3 bg-slate-200'}`}></span>
        </div>
      </div>

      {/* --- CONFIDENTIAL SAFETY NOTICE --- */}
      <div className="bg-purple-50/70 border border-purple-100 p-4 rounded-2xl flex items-start gap-3 text-xs text-purple-900 mb-6 max-w-3xl mx-auto leading-relaxed">
        <span className="text-lg mt-0.5">🔒</span>
        <div>
          <span className="font-bold">You are totally safe here.</span> We do not save your name, your age, your location, or anything you type. Once you close this window, your answers disappear forever.
        </div>
      </div>

      {/* --- SCREEN 1: DEMOGRAPHICS --- */}
      {screen === 1 && (
        <div className="max-w-md mx-auto bg-white p-8 rounded-2xl border border-slate-100 shadow-sm text-center">
          <div className="text-4xl mb-4">👋</div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Let's find what is legal & close to you</h2>
          <p className="text-sm text-slate-500 mt-2 leading-relaxed">
            Healthcare access laws and rules change a lot depending on how old you are and what state you are standing in. Let's make sure we show you the right options.
          </p>

          <form onSubmit={(e) => { e.preventDefault(); setScreen(2); }} className="w-full flex flex-col gap-5 mt-6 text-left">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="v2-age" className="text-xs font-bold uppercase tracking-wider text-slate-400">Your Age</label>
              <input 
                id="v2-age" type="number" min="12" max="110" placeholder="e.g., 17" value={age} 
                onChange={(e) => setAge(e.target.value)} 
                className="w-full p-3.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 font-medium"
                required 
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="v2-state" className="text-xs font-bold uppercase tracking-wider text-slate-400">Your State</label>
              <select 
                id="v2-state" value={stateLocation} 
                onChange={(e) => setStateLocation(e.target.value)} 
                className="w-full p-3.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 font-medium"
                required
              >
                <option value="">Select your location...</option>
                {usStates.map(st => <option key={st} value={st}>{st}</option>)}
              </select>
            </div>

            <button type="submit" className="w-full bg-slate-900 hover:bg-purple-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-sm transition-all text-sm mt-2 flex items-center justify-center gap-2 cursor-pointer">
              Next Step ➔
            </button>
          </form>
        </div>
      )}

      {/* --- SCREEN 2: SERVICE MATRIX --- */}
      {screen === 2 && (
        <div className="max-w-3xl mx-auto">
          <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl flex items-center justify-between text-xs font-semibold text-slate-600 mb-8">
            <div className="flex gap-3">
              <span>📍 {stateLocation}</span>
              <span>⏳ Age: {age}</span>
            </div>
          </div>

          <h2 className="text-3xl font-black text-slate-900 tracking-tight text-center mb-10">
            What do you need help with today?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {services.map(srv => {
              const isSelected = selectedService === srv.id;
              return (
                <button 
                  key={srv.id} type="button" onClick={() => setSelectedService(srv.id)} 
                  className={`p-6 rounded-2xl text-left border transition-all flex items-center gap-4 cursor-pointer min-h-[106px] ${
                    isSelected 
                      ? 'border-purple-600 bg-purple-50/40 ring-1 ring-purple-600' 
                      : 'border-slate-200 hover:border-slate-300 bg-white shadow-sm'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0 ${isSelected ? 'bg-purple-600 text-white' : 'bg-slate-50 text-slate-700'}`}>
                    {srv.icon}
                  </div>
                  <div>
                    <span className={`block font-bold text-base tracking-tight ${isSelected ? 'text-purple-700' : 'text-slate-800'}`}>{srv.name}</span>
                    <span className="block text-xs text-slate-400 mt-0.5 font-normal leading-tight">{srv.subtitle}</span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
            <button 
              type="button" onClick={handleGoBack}
              className="w-full sm:w-auto px-8 py-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-white text-sm font-bold text-slate-500 hover:text-slate-800 transition-all cursor-pointer"
            >
              ← Go Back
            </button>
            {selectedService && (
              <button 
                type="button" onClick={() => setScreen(3)}
                className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-12 rounded-xl shadow-md transition-all text-sm cursor-pointer" 
              >
                Let's Customize Options ➔
              </button>
            )}
          </div>
        </div>
      )}

      {/* --- SCREEN 3: INTERACTIVE QUESTIONS --- */}
      {screen === 3 && (
        <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            ✨ Help us customize your list
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Just one quick detail so we can recommend the best choices for your situation.
          </p>

          <div className="mt-8 space-y-6">
            {selectedService === 'abortion' && (
              <div className="space-y-4">
                <label className="block text-sm font-bold text-slate-700">How many weeks has it been since your last period?</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  {[
                    { value: 'under10', label: 'Under 10 Weeks (Pills option)' },
                    { value: '10to15', label: '10 to 15 Weeks' },
                    { value: 'over15', label: 'Over 15 Weeks' }
                  ].map(opt => (
                    <button
                      key={opt.value} type="button" onClick={() => setWeeksPregnant(opt.value)}
                      className={`p-3 text-xs font-bold rounded-xl border text-center transition-all cursor-pointer ${weeksPregnant === opt.value ? 'border-purple-600 bg-purple-50 text-purple-700' : 'border-slate-200 bg-slate-50 text-slate-600'}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {selectedService === 'testing' && (
              <div className="space-y-4">
                <label className="block text-sm font-bold text-slate-700">Are you currently hurting, itching, or feeling weird symptoms?</label>
                <div className="flex gap-4 pt-2">
                  {[
                    { value: 'yes', label: '⚠️ Yes, I feel symptoms' },
                    { value: 'no', label: '🔬 No, just a regular routine checkup' }
                  ].map(opt => (
                    <button
                      key={opt.value} type="button" onClick={() => setHasStiSymptoms(opt.value)}
                      className={`flex-1 p-4 text-xs font-bold rounded-xl border text-center transition-all cursor-pointer ${hasStiSymptoms === opt.value ? 'border-purple-600 bg-purple-50 text-purple-700' : 'border-slate-200 bg-slate-50 text-slate-600'}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {selectedService === 'contraceptive' && (
              <div className="space-y-4">
                <label className="block text-sm font-bold text-slate-700">Do you need something because of an accident that just happened?</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {[
                    { value: 'emergency', label: '🚨 Yes, emergency care needed (Plan B window)' },
                    { value: 'routine', label: '💊 No, just looking for regular birth control options' }
                  ].map(opt => (
                    <button
                      key={opt.value} type="button" onClick={() => setContraceptiveUrgency(opt.value)}
                      className={`p-4 text-xs font-bold rounded-xl border text-left transition-all cursor-pointer ${contraceptiveUrgency === opt.value ? 'border-purple-600 bg-purple-50 text-purple-700' : 'border-slate-200 bg-slate-50 text-slate-600'}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {selectedService === 'pregnancy' && (
              <div className="space-y-4">
                <label className="block text-sm font-bold text-slate-700">Where are you at with your testing process?</label>
                <p className="text-xs text-slate-400 -mt-2 leading-relaxed">
                  Tip: At-home urine tests from the store are most accurate if it's been at least 14 days since you had sex.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {[
                    { value: 'need-test', label: '🔬 I need to take a test (Looking for free/private local testing)' },
                    { value: 'already-positive', label: '❤️ I already tested positive (Looking for advice on next steps)' }
                  ].map(opt => (
                    <button
                      key={opt.value} type="button" onClick={() => setPregnancyTestStatus(opt.value)}
                      className={`p-4 text-xs font-bold rounded-xl border text-left transition-all cursor-pointer ${pregnancyTestStatus === opt.value ? 'border-purple-600 bg-purple-50 text-purple-700' : 'border-slate-200 bg-slate-50 text-slate-600'}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8 pt-6 border-t border-slate-100">
            <button 
              type="button" onClick={handleGoBack}
              className="w-full sm:w-auto px-8 py-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-white text-sm font-bold text-slate-500 hover:text-slate-800 transition-all cursor-pointer"
            >
              ← Go Back
            </button>
            <button
              type="button" onClick={() => setScreen(4)}
              className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-8 rounded-xl shadow-md transition-all text-sm cursor-pointer"
            >
              Show My Safe Options ➔
            </button>
          </div>
        </div>
      )}

      {/* --- SCREEN 4: LIVE FILTERABLE ECOSYSTEM (UX UPGRADE) --- */}
      {screen === 4 && (
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <span className="text-3xl">🎉</span>
            <h2 className="text-2xl font-black text-slate-900 mt-2">Your Verified Safe Safe-Spaces</h2>
            <p className="text-sm text-slate-500 mt-1">Based safely on a {age}-year-old profile inside {stateLocation}.</p>
          </div>

          {/* --- LIVE INTERACTIVE FILTER HUB ROW --- */}
          <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            
            {/* Filter Group A: How you get care */}
            <div className="space-y-1.5 w-full sm:w-auto">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">How to get care:</span>
              <div className="flex gap-1 bg-slate-200/60 p-1 rounded-xl">
                {[
                  { id: 'all', label: 'All types' },
                  { id: 'mail', label: '📦 By Mail' },
                  { id: 'in-person', label: '🏥 In Person' }
                ].map(b => (
                  <button
                    key={b.id} type="button" onClick={() => setDeliveryFilter(b.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${deliveryFilter === b.id ? 'bg-white text-purple-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter Group B: Costs & Insurance */}
            <div className="space-y-1.5 w-full sm:w-auto">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Payment setup:</span>
              <div className="flex gap-1 bg-slate-200/60 p-1 rounded-xl">
                {[
                  { id: 'all', label: 'All costs' },
                  { id: 'insurance', label: '💳 Takes Insurance' },
                  { id: 'free-cash', label: '🪙 Free / Cash' }
                ].map(b => (
                  <button
                    key={b.id} type="button" onClick={() => setInsuranceFilter(b.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${insuranceFilter === b.id ? 'bg-white text-purple-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Render Active Cards List */}
          <div className="space-y-4">
            {getRecommendations().length > 0 ? (
              getRecommendations().map((rec, index) => (
                <div key={index} className="p-6 bg-white border border-slate-100 rounded-2xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in">
                  <div className="max-w-md">
                    <div className="flex items-center gap-2 mb-1.5">
                      <h3 className="font-bold text-lg text-slate-900 m-0">{rec.name}</h3>
                      {/* Meta pills to show the active tags directly */}
                      <span className="text-[10px] bg-slate-100 border border-slate-200/60 font-semibold px-2 py-0.5 rounded-full text-slate-500 uppercase tracking-wide">
                        {rec.type === 'mail' ? '📦 Mail' : rec.type === 'in-person' ? '🏥 Clinic' : '🌐 Info'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">{rec.desc}</p>
                  </div>
                  <a 
                    href={rec.link} target="_blank" rel="noopener noreferrer"
                    className="bg-slate-900 hover:bg-purple-700 text-white text-xs font-bold py-3 px-5 rounded-xl shadow-sm inline-flex items-center justify-center shrink-0 tracking-wider uppercase transition-all"
                  >
                    Visit Site ➔
                  </a>
                </div>
              ))
            ) : (
              // Empty State Handling if they filter everything out
              <div className="text-center p-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <span className="text-2xl">🔍</span>
                <h4 className="font-bold text-slate-700 mt-2">No matching resources found</h4>
                <p className="text-xs text-slate-400 mt-1">Try resetting your payment or care type filters above to explore all open paths.</p>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
            <button 
              type="button" onClick={handleGoBack}
              className="w-full sm:w-auto px-8 py-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-white text-sm font-bold text-slate-500 hover:text-slate-800 transition-all cursor-pointer"
            >
              ← Adjust Questions
            </button>
            <button 
              type="button" onClick={handleReset}
              className="w-full sm:w-auto text-xs font-bold text-slate-400 hover:text-purple-600 uppercase tracking-widest transition-all cursor-pointer py-4 px-6"
            >
              🔄 Start Completely Over
            </button>
          </div>
        </div>
      )}

    </div>
  )
}