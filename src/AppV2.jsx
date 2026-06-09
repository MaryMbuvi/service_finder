import { useState } from 'react'
import { masterResources } from './data/resources.js' // Reads our updated data file

export default function AppV2() {
  // Screens: 1=Demographics, 2=Service Selection, 3=Deep Questions, 4=Your Safe Options
  const [screen, setScreen] = useState(1)

  // User Core Context
  const [age, setAge] = useState('')
  const [stateLocation, setStateLocation] = useState('')
  const [selectedService, setSelectedService] = useState('')

  // Sub-questions
  const [weeksPregnant, setWeeksPregnant] = useState('')
  const [hasStiSymptoms, setHasStiSymptoms] = useState('')
  const [contraceptiveUrgency, setContraceptiveUrgency] = useState('')
  const [pregnancyTestStatus, setPregnancyTestStatus] = useState('')
  
  // Expanded Sub-questions for Mental Health and GBV
  const [mentalHealthType, setMentalHealthType] = useState('') // 'distress', 'routine'
  const [gbvSupportPreference, setGbvSupportPreference] = useState('') // 'digital', 'physical'

  // Interactive UI Filter Controls
  const [deliveryFilter, setDeliveryFilter] = useState('all') 
  const [insuranceFilter, setInsuranceFilter] = useState('all') 

  // States with total abortion bans or severe minor/consent restrictions
  const highRestrictionStates = ['Texas', 'Florida', 'Ohio', 'Alabama', 'Arkansas', 'Mississippi', 'Kentucky', 'Louisiana']

  const usStates = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 
    'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 
    'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 
    'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 
    'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 
    'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 
    'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 
    'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 
    'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 
    'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
  ]
  
  const services = [
    { id: 'abortion', name: 'I want an abortion', icon: '💊', subtitle: 'Explore safe, private medical and legal pathways.' },
    { id: 'testing', name: 'I want STI testing', icon: '🔬', subtitle: 'Find discreet, rapid check-up resources.' },
    { id: 'contraceptive', name: 'I want a contraceptive', icon: '📅', subtitle: 'Access birth control, patches, or emergency options.' },
    { id: 'pregnancy', name: 'I want to test for pregnancy', icon: '🤰', subtitle: 'Get confidential, highly accurate test options.' },
    { id: 'lgbtq', name: 'I want LGBTQ+ affirming care', icon: '🌈', subtitle: 'Find confidential support spaces and remote networks.' },
    { id: 'mental', name: 'I want mental health support', icon: '🧠', subtitle: 'Access crisis text lines and off-the-record counseling.' },
    { id: 'gbv', name: 'I want safety from violence (GBV)', icon: '❤️‍🩹', subtitle: 'Anonymous crisis lines and emergency local protection.' }
  ]

  // --- INTERACTIVE PIPELINE ROUTER ---
  const handleServiceSelection = (serviceId) => {
    setSelectedService(serviceId);
    
    if (serviceId === 'lgbtq') {
      logToGoogleAnalytics(age, stateLocation, serviceId);
      setDeliveryFilter('all');
      setScreen(4);
    } else {
      setScreen(3); 
    }
  }

  const handleGoBack = () => {
    if (screen === 4) {
      if (selectedService === 'lgbtq') {
        setScreen(2);
      } else {
        setScreen(3);
      }
    }
    else if (screen === 3) setScreen(2)
    else if (screen === 2) { setScreen(1); setSelectedService(''); }
  }

  const triggerQuickEscape = () => {
    window.location.replace("https://www.google.com"); 
  }

  // Privacy-Safe GA Logger
  const logToGoogleAnalytics = (finalAge, finalState, finalService) => {
    let ageRange = 'Under 15'
    const numericAge = Number(finalAge)
    if (numericAge >= 15 && numericAge <= 17) ageRange = '15-17'
    else if (numericAge >= 18 && numericAge <= 21) ageRange = '18-21'
    else if (numericAge > 21) ageRange = '22+'

    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', 'resource_search', {
        'user_state': finalState,
        'user_age_group': ageRange,
        'service_type': finalService,
      });
    }
  }

  // --- THE COMPREHENSIVE FILTER PIPELINE ENGINE ---
  const getRecommendations = () => {
    let pipelineList = [...masterResources]

    const isMinor = Number(age) < 18
    const isRestrictedZone = highRestrictionStates.includes(stateLocation)

    // STAGE 1: Category Match
    pipelineList = pipelineList.filter(item => item.category === 'all' || item.category === selectedService)

    // STAGE 2: Safety Audit & Situational Directives
    if (isMinor && isRestrictedZone) {
      pipelineList = pipelineList.filter(item => !item.requiresParentalConsent)

      if (selectedService === 'abortion') {
        pipelineList = pipelineList.filter(item => item.deliveryType !== 'in-person')
        pipelineList.unshift({
          name: 'Repro Legal Helpline (reprolegalhelpline.org)',
          desc: `Because you are under 18 in ${stateLocation}, physical care paths have deep legal hurdles. This private legal group helps you look safely into a confidential judge's note (Judicial Bypass) or safe travel paths.`,
          link: 'https://www.reprolegalhelpline.org',
          deliveryType: 'all',
          costType: 'all',
          requiresParentalConsent: false
        })
      }

      if (selectedService === 'lgbtq') {
        pipelineList = pipelineList.filter(item => item.deliveryType !== 'in-person')
      }
    }

    // STAGE 3: Handle Situational Question Selections
    if (selectedService === 'mental' && mentalHealthType) {
      pipelineList = pipelineList.filter(item => item.subType === 'all' || item.subType === mentalHealthType)
    }
    if (selectedService === 'gbv' && gbvSupportPreference) {
      pipelineList = pipelineList.filter(item => item.subType === 'all' || item.subType === gbvSupportPreference)
    }

    // STAGE 4: Build Secure Deep-Links
    pipelineList = pipelineList.map(item => {
      let finalUrl = item.link
      if (item.link.includes('ineedana.com') || item.link.includes('abortionfinder.org')) {
        finalUrl = `${item.link}/search?age=${age}&state=${stateLocation}`
      }
      return { ...item, link: finalUrl }
    })

    // STAGE 5: Interactive User View UI Filters
    return pipelineList.filter(item => {
      const matchesDelivery = deliveryFilter === 'all' || item.deliveryType === 'all' || item.deliveryType === deliveryFilter;
      const matchesCost = insuranceFilter === 'all' || item.costType === 'all' || item.costType === insuranceFilter;
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
    setMentalHealthType('')
    setGbvSupportPreference('')
    setDeliveryFilter('all')
    setInsuranceFilter('all')
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-6 py-4 font-sans text-slate-800 antialiased relative">
      
      {/* GLOBAL HEADBOARD */}
      <div className="flex justify-between items-center border-b border-slate-100 pb-6 mb-8 sticky top-0 bg-white/95 backdrop-blur z-50 py-2">
        <div>
          <h1 className="text-2xl font-black text-purple-700 tracking-wide m-0 p-0 uppercase">
            Asking For A Friend
          </h1>
          <p className="text-xs uppercase tracking-widest text-slate-400 font-bold mt-0.5">
            Service Finder <span className="text-purple-400 font-medium">(Option 2)</span>
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            type="button" 
            onClick={triggerQuickEscape}
            className="bg-red-400 hover:bg-red-500 text-white text-xs font-black px-4 py-2 rounded-xl uppercase tracking-wider transition-all shadow-sm cursor-pointer"
          >
            ⚡ Quick Escape
          </button>
          <div className="flex items-center gap-1.5 hidden sm:flex">
            <span className={`h-1.5 rounded-full transition-all ${screen === 1 ? 'w-8 bg-purple-600' : 'w-3 bg-slate-200'}`}></span>
            <span className={`h-1.5 rounded-full transition-all ${screen === 2 ? 'w-8 bg-purple-600' : 'w-3 bg-slate-200'}`}></span>
            <span className={`h-1.5 rounded-full transition-all ${screen === 3 ? 'w-8 bg-purple-600' : 'w-3 bg-slate-200'}`}></span>
            <span className={`h-1.5 rounded-full transition-all ${screen === 4 ? 'w-8 bg-purple-600' : 'w-3 bg-slate-200'}`}></span>
          </div>
        </div>
      </div>

      {/* CONFIDENTIAL SAFETY NOTICE */}
      <div className="bg-purple-50/70 border border-purple-100 p-4 rounded-2xl flex items-start gap-3 text-xs text-purple-900 mb-6 max-w-3xl mx-auto leading-relaxed">
        <span className="text-sm mt-0.5">🔒</span>
        <div>
          <span className="font-bold">You are totally safe here.</span> We do not save your name, your age, your location, or anything you type. Once you close this window, your answers disappear forever.
        </div>
      </div>

      {/* --- SCREEN 1: DEMOGRAPHICS --- */}
      {screen === 1 && (
        <div className="max-w-md mx-auto bg-white p-8 rounded-2xl border border-slate-100 shadow-sm text-center">
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Let's find what is legal & close to you</h2>
          <p className="text-sm text-slate-500 mt-2 leading-relaxed">
            Healthcare access laws change depending on how old you are and your current state location. Let's make sure we show you the right options.
          </p>

          <form onSubmit={(e) => { e.preventDefault(); setScreen(2); }} className="w-full flex flex-col gap-5 mt-6 text-left">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="v2-age" className="text-xs font-bold uppercase tracking-wider text-slate-400">Your Age</label>
              <input 
                id="v2-age" type="number" min="12" max="110" placeholder="e.g., 16" value={age} 
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

      {/* --- SCREEN 2: SERVICE SELECTION --- */}
      {screen === 2 && (
        <div className="max-w-3xl mx-auto">
          <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl flex items-center justify-between text-xs font-semibold text-slate-600 mb-8">
            <div className="flex gap-3">
              <span>📍 {stateLocation}</span>
              <span>⏳ Age: {age}</span>
            </div>
            <button type="button" onClick={() => setScreen(1)} className="text-purple-700 hover:underline font-bold cursor-pointer">Change details</button>
          </div>

          <h2 className="text-3xl font-black text-slate-900 tracking-tight text-center mb-10">
            What do you need help with today?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {services.map(srv => {
              return (
                <button 
                  key={srv.id} type="button" onClick={() => handleServiceSelection(srv.id)} 
                  className={`p-6 rounded-2xl text-left border transition-all flex items-center gap-4 cursor-pointer min-h-[106px] ${
                    selectedService === srv.id 
                      ? 'border-purple-600 bg-purple-50/40 ring-1 ring-purple-600' 
                      : 'border-slate-200 hover:border-slate-300 bg-white shadow-sm'
                  }`}
                >
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0 bg-slate-50 text-slate-700">
                    {srv.icon}
                  </div>
                  <div>
                    <span className="block font-bold text-base tracking-tight text-slate-800">{srv.name}</span>
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
          </div>
        </div>
      )}

      {/* --- SCREEN 3: TIMELINE AND SYMPTOM DEEP QUESTIONS --- */}
      {screen === 3 && (
        <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            Help us customize your list
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Select the statement that matches your current situation to view your recommendations.
          </p>

          <div className="mt-8 space-y-6">
            {/* Abortion Custom Descriptions */}
            {selectedService === 'abortion' && (
              <div className="space-y-4">
                <label className="block text-sm font-bold text-slate-700">How many weeks has it been since your last period?</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  {[
                    { value: 'under10', label: 'Under 10 Weeks' },
                    { value: '10to15', label: '10 to 15 Weeks' },
                    { value: 'over15', label: 'Over 15 Weeks' }
                  ].map(opt => (
                    <button
                      key={opt.value} type="button" 
                      onClick={() => {
                        setWeeksPregnant(opt.value);
                        setDeliveryFilter(opt.value === 'under10' ? 'mail' : 'in-person'); 
                      }}
                      className={`p-3 text-xs font-bold rounded-xl border text-center transition-all cursor-pointer ${weeksPregnant === opt.value ? 'border-purple-600 bg-purple-50 text-purple-700 ring-1 ring-purple-600' : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
                
                {weeksPregnant === 'under10' && (
                  <div className="p-4 bg-purple-50/60 border border-purple-100 rounded-xl text-xs text-purple-950 animate-fade-in leading-relaxed">
                    <span className="font-bold block mb-0.5">Recommended Route: Pills By Mail</span>
                    At under 10 weeks, you are medically eligible for telehealth abortion medication options. We have updated your dashboard filter layout to By Mail to highlight discrete remote shipping services.
                  </div>
                )}
                {(weeksPregnant === '10to15' || weeksPregnant === 'over15') && (
                  <div className="p-4 bg-amber-50/60 border border-amber-100 rounded-xl text-xs text-amber-950 animate-fade-in leading-relaxed">
                    <span className="font-bold block mb-0.5">Recommended Route: In-Person Care Only</span>
                    At this gestational stage, care can only be safely provided inside physical clinics. We have updated your dashboard layout to In Person options to lock out out-of-date mail listings and ensure safe clinical access.
                  </div>
                )}
              </div>
            )}

            {/* STI Custom Descriptions */}
            {selectedService === 'testing' && (
              <div className="space-y-4">
                <label className="block text-sm font-bold text-slate-700">Are you currently experiencing physical discomfort or visible symptoms?</label>
                <div className="flex gap-4 pt-2">
                  {[
                    { value: 'yes', label: 'Yes, I feel active symptoms' },
                    { value: 'no', label: 'No, just a regular routine checkup' }
                  ].map(opt => (
                    <button
                      key={opt.value} type="button" 
                      onClick={() => {
                        setHasStiSymptoms(opt.value);
                        setDeliveryFilter(opt.value === 'no' ? 'mail' : 'in-person');
                      }}
                      className={`flex-1 p-4 text-xs font-bold rounded-xl border text-center transition-all cursor-pointer ${hasStiSymptoms === opt.value ? 'border-purple-600 bg-purple-50 text-purple-700 ring-1 ring-purple-600' : 'border-slate-200 bg-slate-50 text-slate-600'}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>

                {hasStiSymptoms === 'yes' && (
                  <div className="p-4 bg-purple-50/60 border border-purple-100 rounded-xl text-xs text-purple-950 animate-fade-in leading-relaxed">
                    <span className="font-bold block mb-0.5">Recommended Route: In-Person Testing</span>
                    If you have active symptoms, we recommend in-clinic testing for faster laboratory results and immediate treatment options. Your filters have been set to In Person clinics.
                  </div>
                )}
                {hasStiSymptoms === 'no' && (
                  <div className="p-4 bg-purple-50/60 border border-purple-100 rounded-xl text-xs text-purple-950 animate-fade-in leading-relaxed">
                    <span className="font-bold block mb-0.5">Recommended Route: Home Test Kits</span>
                    For routine wellness checkups without symptoms, at-home self-swab kits are a highly private and convenient option. Your filters have been pre-set to By Mail.
                  </div>
                )}
              </div>
            )}

            {/* Contraceptive Custom Descriptions */}
            {selectedService === 'contraceptive' && (
              <div className="space-y-4">
                <label className="block text-sm font-bold text-slate-700">Do you need something because of an accident that just happened?</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {[
                    { value: 'emergency', label: 'Yes, emergency care needed (Plan B window)' },
                    { value: 'routine', label: 'No, looking for regular birth control options' }
                  ].map(opt => (
                    <button
                      key={opt.value} type="button" 
                      onClick={() => {
                        setContraceptiveUrgency(opt.value);
                        setDeliveryFilter(opt.value === 'emergency' ? 'mail' : 'in-person');
                      }}
                      className={`p-4 text-xs font-bold rounded-xl border text-left transition-all cursor-pointer ${contraceptiveUrgency === opt.value ? 'border-purple-600 bg-purple-50 text-purple-700 ring-1 ring-purple-600' : 'border-slate-200 bg-slate-50 text-slate-600'}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>

                {contraceptiveUrgency === 'emergency' && (
                  <div className="p-4 bg-purple-50/60 border border-purple-100 rounded-xl text-xs text-purple-950 animate-fade-in leading-relaxed">
                    <span className="font-bold block mb-0.5">Recommended Route: Fast Emergency Access</span>
                    For recent accidents, time is critical. We are prioritizing immediate over-the-counter morning-after emergency pills or discrete overnight delivery networks.
                  </div>
                )}
                {contraceptiveUrgency === 'routine' && (
                  <div className="p-4 bg-purple-50/60 border border-purple-100 rounded-xl text-xs text-purple-950 animate-fade-in leading-relaxed">
                    <span className="font-bold block mb-0.5">Recommended Route: Ongoing Management</span>
                    For continuous pregnancy prevention, we emphasize confidential family planning clinics or low-cost online prescriptions for standard birth control options.
                  </div>
                )}
              </div>
            )}

            {/* Pregnancy Testing Custom Descriptions */}
            {selectedService === 'pregnancy' && (
              <div className="space-y-4">
                <label className="block text-sm font-bold text-slate-700">Where are you at with your testing process?</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {[
                    { value: 'need-test', label: 'I need to take a test (Looking for private options)' },
                    { value: 'already-positive', label: 'I already tested positive (Looking for guidance)' }
                  ].map(opt => (
                    <button
                      key={opt.value} type="button" 
                      onClick={() => {
                        setPregnancyTestStatus(opt.value);
                        setDeliveryFilter(opt.value === 'need-test' ? 'mail' : 'in-person');
                      }}
                      className={`p-4 text-xs font-bold rounded-xl border text-left transition-all cursor-pointer ${pregnancyTestStatus === opt.value ? 'border-purple-600 bg-purple-50 text-purple-700 ring-1 ring-purple-600' : 'border-slate-200 bg-slate-50 text-slate-600'}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>

                {pregnancyTestStatus === 'need-test' && (
                  <div className="p-4 bg-purple-50/60 border border-purple-100 rounded-xl text-xs text-purple-950 animate-fade-in leading-relaxed">
                    <span className="font-bold block mb-0.5">Recommended Route: Free & Private Tests</span>
                    If you need to check your status, we highlight private networks that can ship free, unbranded test strips or point you to off-the-record testing resources.
                  </div>
                )}
                {pregnancyTestStatus === 'already-positive' && (
                  <div className="p-4 bg-purple-50/60 border border-purple-100 rounded-xl text-xs text-purple-950 animate-fade-in leading-relaxed">
                    <span className="font-bold block mb-0.5">Recommended Route: Medical Verification & Advice</span>
                    If you have already seen a positive result, we prioritize confidential support talklines and independent community clinics to discuss safe legal options and confirmation.
                  </div>
                )}
              </div>
            )}

            {/* Mental Health Custom Descriptions */}
            {selectedService === 'mental' && (
              <div className="space-y-4">
                <label className="block text-sm font-bold text-slate-700">What level of mental health support are you looking for right now?</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {[
                    { value: 'distress', label: 'Immediate support (Crisis, distress, or urgent talk lines)' },
                    { value: 'routine', label: 'Routine support (Long-term counseling and regular therapy)' }
                  ].map(opt => (
                    <button
                      key={opt.value} type="button" 
                      onClick={() => {
                        setMentalHealthType(opt.value);
                        setDeliveryFilter('all');
                      }}
                      className={`p-4 text-xs font-bold rounded-xl border text-left transition-all cursor-pointer ${mentalHealthType === opt.value ? 'border-purple-600 bg-purple-50 text-purple-700 ring-1 ring-purple-600' : 'border-slate-200 bg-slate-50 text-slate-600'}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>

                {mentalHealthType === 'distress' && (
                  <div className="p-4 bg-purple-50/60 border border-purple-100 rounded-xl text-xs text-purple-950 animate-fade-in leading-relaxed">
                    <span className="font-bold block mb-0.5">Recommended Route: Immediate Crisis Response</span>
                    If you are experiencing acute distress, we recommend zero-trace, encrypted crisis lines for rapid emotional support from trained professionals.
                  </div>
                )}
                {mentalHealthType === 'routine' && (
                  <div className="p-4 bg-purple-50/60 border border-purple-100 rounded-xl text-xs text-purple-950 animate-fade-in leading-relaxed">
                    <span className="font-bold block mb-0.5">Recommended Route: Off-The-Record Counseling</span>
                    For continuous therapeutic care, we prioritize cash-only sliding scale directories. This keeps your records invisible to parent insurance statements and paper trails.
                  </div>
                )}
              </div>
            )}

            {/* GBV Custom Descriptions */}
            {selectedService === 'gbv' && (
              <div className="space-y-4">
                <label className="block text-sm font-bold text-slate-700">What type of security or care option feels safest right now?</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {[
                    { value: 'digital', label: 'Digital/Text Support (Secure online chat networks and text lines)' },
                    { value: 'physical', label: 'Physical Protection (Domestic violence shelters and emergency housing)' }
                  ].map(opt => (
                    <button
                      key={opt.value} type="button" 
                      onClick={() => {
                        setGbvSupportPreference(opt.value);
                        setDeliveryFilter('all');
                      }}
                      className={`p-4 text-xs font-bold rounded-xl border text-left transition-all cursor-pointer ${gbvSupportPreference === opt.value ? 'border-purple-600 bg-purple-50 text-purple-700 ring-1 ring-purple-600' : 'border-slate-200 bg-slate-50 text-slate-600'}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>

                {gbvSupportPreference === 'digital' && (
                  <div className="p-4 bg-purple-50/60 border border-purple-100 rounded-xl text-xs text-purple-950 animate-fade-in leading-relaxed">
                    <span className="font-bold block mb-0.5">Recommended Route: Secure Remote Guidance</span>
                    If you prefer private communication from a distance, we recommend encrypted, un-logged safety text lines to talk through options safely from your device.
                  </div>
                )}
                {gbvSupportPreference === 'physical' && (
                  <div className="p-4 bg-purple-50/60 border border-purple-100 rounded-xl text-xs text-purple-950 animate-fade-in leading-relaxed">
                    <span className="font-bold block mb-0.5">Recommended Route: Shelter & Emergency Housing</span>
                    If you are facing danger at home, we recommend verified local unlisted youth domestic violence shelters that can provide safe, free housing without parent signature mandates.
                  </div>
                )}
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
              type="button" 
              disabled={
                (selectedService === 'abortion' && !weeksPregnant) || 
                (selectedService === 'testing' && !hasStiSymptoms) || 
                (selectedService === 'contraceptive' && !contraceptiveUrgency) || 
                (selectedService === 'pregnancy' && !pregnancyTestStatus) ||
                (selectedService === 'mental' && !mentalHealthType) ||
                (selectedService === 'gbv' && !gbvSupportPreference)
              }
              onClick={() => {
                logToGoogleAnalytics(age, stateLocation, selectedService);
                setScreen(4);
              }}
              className="w-full sm:w-auto bg-purple-600 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold py-4 px-8 rounded-xl shadow-md transition-all text-sm cursor-pointer"
            >
              Show My Safe Options ➔
            </button>
          </div>
        </div>
      )}

      {/* --- SCREEN 4: FILTERABLE RESULTS INTERFACE --- */}
      {screen === 4 && (
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-black text-slate-900 mt-2">Your Verified Safe Safe-Spaces</h2>
            <p className="text-sm text-slate-500 mt-1">Based on a {age}-year-old profile inside {stateLocation}.</p>
          </div>

          {/* --- HIGH VISIBILITY CO-LOCATED INSURANCE INTERCEPT BANNER --- */}
          {insuranceFilter === 'insurance' && (
            <div className="bg-indigo-50 border-2 border-indigo-500/80 p-4 rounded-2xl text-xs text-indigo-950 mb-4 font-medium leading-relaxed animate-fade-in shadow-sm shadow-indigo-100">
              <span className="font-extrabold block text-sm text-indigo-700 mb-1">
                ⚠️ Insurance Statement Warning:
              </span>
              Using parent or guardian insurance generates a physical paper statement—called an Explanation of Benefits (EOB)—sent to the primary policyholder’s home address detailing this visit. Consider selecting the **Free / Cash** filter below for completely off-the-record options.
            </div>
          )}

          {/* --- STATE OVERRIDE LEGAL RESTRICTION BANNER NOTIFICATIONS --- */}
          {Number(age) < 18 && highRestrictionStates.includes(stateLocation) && (
            <>
              {selectedService === 'abortion' && (
                <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl text-xs text-amber-900 mb-4 leading-relaxed animate-fade-in">
                  <span className="font-bold block mb-0.5">Youth Access Notice:</span>
                  Because you are under 18 in {stateLocation}, local health clinics have strict parental consent or notification requirements. To keep you safe, we have hidden standard services that require parent signatures and highlighted alternative confidential pathways below.
                </div>
              )}
              {selectedService === 'lgbtq' && (
                <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl text-xs text-amber-900 mb-4 leading-relaxed animate-fade-in">
                  <span className="font-bold block mb-0.5">Youth Identity Care Notice:</span>
                  Because you are under 18 in {stateLocation}, local laws restrict certain physical youth identity services. To keep you safe, we have highlighted completely confidential, private digital communities and support networks below.
                </div>
              )}
            </>
          )}

          {/* Interactive Filter Hub Row */}
          <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1.5 w-full sm:w-auto">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">How to get care:</span>
              <div className="flex gap-1 bg-slate-200/60 p-1 rounded-xl">
                {[
                  { id: 'all', label: 'All types' },
                  { id: 'mail', label: 'By Mail' },
                  { id: 'in-person', label: 'In Person' }
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

            <div className="space-y-1.5 w-full sm:w-auto">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Payment setup:</span>
              <div className="flex gap-1 bg-slate-200/60 p-1 rounded-xl">
                {[
                  { id: 'all', label: 'All costs' },
                  { id: 'insurance', label: 'Takes Insurance' },
                  { id: 'free-cash', label: 'Free / Cash' }
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

          {/* Cards Stack Rendering Output */}
          <div className="space-y-4">
            {getRecommendations().length > 0 ? (
              getRecommendations().map((rec, index) => (
                <div key={index} className="p-6 bg-white border border-slate-100 rounded-2xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in">
                  <div className="max-w-md">
                    <div className="flex items-center gap-2 mb-1.5">
                      <h3 className="font-bold text-base text-slate-900 m-0">{rec.name}</h3>
                      <span className="text-[10px] bg-slate-100 border border-slate-200/60 font-semibold px-2 py-0.5 rounded-full text-slate-500 uppercase tracking-wide">
                        {rec.deliveryType === 'mail' ? 'Mail' : rec.deliveryType === 'in-person' ? 'Clinic' : 'Info'}
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
              <div className="text-center p-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <h4 className="font-bold text-slate-700 mt-2">No matching resources found</h4>
                <p className="text-xs text-slate-400 mt-1">Try resetting your filters above to explore open configurations.</p>
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
              Start Completely Over
            </button>
          </div>
        </div>
      )}

    </div>
  )
}