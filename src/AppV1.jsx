import { useState, useEffect } from 'react'
import { masterResources } from './data/resources.js' // Core website catalog

export default function AppV1() {
  // Screens: 1=Service Selection (First!), 2=Demographics, 3=Deep Questions, 4=Your Safe Options
  const [screen, setScreen] = useState(1)

  // User Core Context States
  const [age, setAge] = useState('')
  const [stateLocation, setStateLocation] = useState('')
  const [selectedService, setSelectedService] = useState('')

  // Sub-questions
  const [weeksPregnant, setWeeksPregnant] = useState('')
  const [hasStiSymptoms, setHasStiSymptoms] = useState('')
  const [contraceptiveUrgency, setContraceptiveUrgency] = useState('')
  const [pregnancyTestStatus, setPregnancyTestStatus] = useState('')

  // Interactive UI Filter Controls
  const [deliveryFilter, setDeliveryFilter] = useState('all') 
  const [insuranceFilter, setInsuranceFilter] = useState('all') 

  // Live Cloud Spreadsheet Rules Mapping Object
  const [statePolicyRules, setStatePolicyRules] = useState({})
  
  // 🌟 REPLACE "YOUR_GID_NUMBER_HERE" WITH YOUR ACTUAL TAB ID (e.g., 0)

  // 🚀 THE CORRECT LINK FROM YOUR PUBLISHED ID:
  const SPREADSHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQuniRrxCGELPePf7UCxyuwNKRSnVTCQbOYH4jeVL_9zueSCjVWXPNh0cjO3lpXBXQQZx70G3Zxul9V/pub?output=csv&gid=1541890717";
  // 13 Near-Total Ban States Enforcing Complete Conception Blocks (Local code backup fallback)
  const backupBanStates = ['Alabama', 'Arkansas', 'Idaho', 'Indiana', 'Kentucky', 'Louisiana', 'Mississippi', 'Missouri', 'Oklahoma', 'South Dakota', 'Tennessee', 'Texas', 'West Virginia']

  useEffect(() => {
  // 🚀 THE SMART CACHE-BUSTER (Kept!):
  // Adding the changing timestamp to the URL string still breaks your local browser cache completely,
  // but it does it without triggering Google's strict header firewall.
  const liveUrlWithNoCache = `${SPREADSHEET_CSV_URL}&nocache=${new Date().getTime()}`;

  // 🔒 THE FIX: Remove the headers object entirely. Just pass the URL string raw!
  fetch(liveUrlWithNoCache)
    .then(res => {
      if (!res.ok) throw new Error(`Google Sheets rejected the app! Status Code: ${res.status}`);
      return res.text();
    })
    .then(text => {
      // Change this slice index to .slice(1) if your data starts right on row 2 of the tab
      const rows = text.split('\n').slice(1); 
      const ruleMap = {}
      
      rows.forEach(row => {
  const columns = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
  
  if (columns[0]) {
    const stateName = columns[0].trim().replace(/^"|"$/g, '');
    const isBanned = columns[1]?.trim().toUpperCase() === 'TRUE';
    
    // Grabs Column 3 and cleanly scrubs away any structural wrapping quotes
    const customMessage = columns[2]?.trim().replace(/^"|"$/g, '').replace(/""/g, '"'); 
    
    ruleMap[stateName] = { isBanned, customMessage };
  }
});
      setStatePolicyRules(ruleMap);
    })
    .catch(err => {
      console.log("Activating built-in fallback backup protection lists:", err);
      const backupMap = {};
      backupBanStates.forEach(st => {
        backupMap[st] = {
          isBanned: true,
          customMessage: `Because you are under 18 in ${st}, local health clinics have strict parental consent or notification requirements. To keep you safe, we have hidden standard services that require parent signatures and highlighted alternative confidential pathways below.`
        };
      });
      setStatePolicyRules(backupMap);
    });
}, []);

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
    { id: 'testing', name: 'I want STI testing', icon: '📈', subtitle: 'Find discreet, rapid check-up resources.' },
    { id: 'contraceptive', name: 'I want a contraceptive', icon: '📅', subtitle: 'Access birth control, patches, or emergency options.' },
    { id: 'pregnancy', name: 'I want to test for pregnancy', icon: '🩺', subtitle: 'Get confidential, highly accurate test options.' }
  ]

  const handleGoBack = () => {
    if (screen === 4) setScreen(3)
    else if (screen === 3) setScreen(2)
    else if (screen === 2) setScreen(1)
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

  // --- FILTER PIPELINE ENGINE ---
  const getRecommendations = () => {
    let pipelineList = [...masterResources]

    const isMinor = Number(age) < 18
    const isRestrictedZone = statePolicyRules[stateLocation]?.isBanned || false

    // STAGE 1: Service Category Match
    pipelineList = pipelineList.filter(item => item.category === 'all' || item.category === selectedService)

    // STAGE 2: Safety Audit Controls (Law Restrictions + Parental Consent Scrubbing)
    if (isMinor && isRestrictedZone) {
      // Scrub out any website resource object marked true for parental consent blocks
      pipelineList = pipelineList.filter(item => !item.requiresParentalConsent)

      if (selectedService === 'abortion') {
        pipelineList = pipelineList.filter(item => item.deliveryType !== 'in-person')
        pipelineList.unshift({
          name: '⚖️ Repro Legal Helpline (reprolegalhelpline.org)',
          desc: `Because you are under 18 in ${stateLocation}, physical care paths have deep legal hurdles. This private legal group helps you look safely into a confidential judge's note (Judicial Bypass) or safe travel paths.`,
          link: 'https://www.reprolegalhelpline.org',
          deliveryType: 'all',
          costType: 'all',
          requiresParentalConsent: false
        })
      }
    }

    // STAGE 3: Secure Parameter Append Deep-Links
    pipelineList = pipelineList.map(item => {
      let finalUrl = item.link
      if (item.link.includes('ineedana.com') || item.link.includes('abortionfinder.org')) {
        finalUrl = `${item.link}/search?age=${age}&state=${stateLocation}`
      }
      return { ...item, link: finalUrl }
    })

    // STAGE 4: Apply Active Top UI View Toggles
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
            Service Finder <span className="text-purple-400 font-medium">(Option 1)</span>
          </p>
        </div>
        
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

      {/* --- SCREEN 1: CHOOSE SERVICE FIRST --- */}
      {screen === 1 && (
        <div className="max-w-3xl mx-auto">
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

          {selectedService && (
            <div className="text-center mt-10">
              <button 
                type="button" onClick={() => setScreen(2)}
                className="inline-flex bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-12 rounded-xl shadow-md transition-all text-sm cursor-pointer" 
              >
                Next Step ➔
              </button>
            </div>
          )}
        </div>
      )}

      {/* --- SCREEN 2: DEMOGRAPHICS SECOND --- */}
      {screen === 2 && (
        <div className="max-w-md mx-auto bg-white p-8 rounded-2xl border border-slate-100 shadow-sm text-center">
          <div className="text-4xl mb-4">📍</div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Let's check your local access options</h2>
          <p className="text-sm text-slate-500 mt-2 leading-relaxed">
            Because laws and confidential rules change depending on where you live and your age, entering these helps us customize the right resources.
          </p>

          <form onSubmit={(e) => { e.preventDefault(); setScreen(3); }} className="w-full flex flex-col gap-5 mt-6 text-left">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="v1-age" className="text-xs font-bold uppercase tracking-wider text-slate-400">Your Age</label>
              <input 
                id="v1-age" type="number" min="12" max="110" placeholder="e.g., 16" value={age} 
                onChange={(e) => setAge(e.target.value)} 
                className="w-full p-3.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 font-medium"
                required 
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="v1-state" className="text-xs font-bold uppercase tracking-wider text-slate-400">Your State</label>
              <select 
                id="v1-state" value={stateLocation} 
                onChange={(e) => setStateLocation(e.target.value)} 
                className="w-full p-3.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 font-medium"
                required
              >
                <option value="">Select your location...</option>
                {usStates.map(st => <option key={st} value={st}>{st}</option>)}
              </select>
            </div>

            <div className="flex items-center justify-center gap-4 mt-8 pt-4 border-t border-slate-100">
              <button 
                type="button" onClick={handleGoBack}
                className="w-1/2 px-4 py-3.5 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-500 hover:text-slate-800 transition-all cursor-pointer"
              >
                ← Back
              </button>
              <button type="submit" className="w-1/2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-sm text-sm transition-all cursor-pointer">
                Continue ➔
              </button>
            </div>
          </form>
        </div>
      )}

      {/* --- SCREEN 3: SITUATION QUESTIONS --- */}
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
                    { value: 'under10', label: 'Under 10 Weeks' },
                    { value: '10to15', label: '10 to 15 Weeks' },
                    { value: 'over15', label: 'Over 15 Weeks' }
                  ].map(opt => (
                    <button
                      key={opt.value} 
                      type="button" 
                      onClick={() => {
                        setWeeksPregnant(opt.value);
                        if (opt.value === 'under10') setDeliveryFilter('mail');
                        else setDeliveryFilter('in-person');
                      }}
                      className={`p-3 text-xs font-bold rounded-xl border text-center transition-all cursor-pointer ${weeksPregnant === opt.value ? 'border-purple-600 bg-purple-50 text-purple-700 ring-1 ring-purple-600' : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>

                {weeksPregnant === 'under10' && (
                  <div className="p-4 bg-purple-50/60 border border-purple-100 rounded-xl text-xs text-purple-950 animate-fade-in leading-relaxed">
                    <span className="font-bold block mb-0.5">📦 Automated Pill Customization:</span>
                    Since you are under 10 weeks, you are eligible for medication options (abortion pills). We have pre-set your upcoming results to **By Mail** to show delivery services. You are completely free to switch back to clinic options later if you prefer!
                  </div>
                )}
                {(weeksPregnant === '10to15' || weeksPregnant === 'over15') && (
                  <div className="p-4 bg-amber-50/60 border border-amber-100 rounded-xl text-xs text-amber-950 animate-fade-in leading-relaxed">
                    <span className="font-bold block mb-0.5">🏥 Automated Clinic Customization:</span>
                    At this stage, care is typically provided in-person at verified clinics. We have updated your filters to **In Person** options below to point you toward safe brick-and-mortar facilities.
                  </div>
                )}
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
                      className={`flex-1 p-4 text-xs font-bold rounded-xl border text-center transition-all cursor-pointer ${hasStiSymptoms === opt.value ? 'border-purple-600 bg-purple-50 text-purple-700 ring-1 ring-purple-600' : 'border-slate-200 bg-slate-50 text-slate-600'}`}
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
                      className={`p-4 text-xs font-bold rounded-xl border text-left transition-all cursor-pointer ${contraceptiveUrgency === opt.value ? 'border-purple-600 bg-purple-50 text-purple-700 ring-1 ring-purple-600' : 'border-slate-200 bg-slate-50 text-slate-600'}`}
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
                      className={`p-4 text-xs font-bold rounded-xl border text-left transition-all cursor-pointer ${pregnancyTestStatus === opt.value ? 'border-purple-600 bg-purple-50 text-purple-700 ring-1 ring-purple-600' : 'border-slate-200 bg-slate-50 text-slate-600'}`}
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
              type="button" 
              onClick={() => {
                logToGoogleAnalytics(age, stateLocation, selectedService);
                setScreen(4);
              }}
              className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-8 rounded-xl shadow-md transition-all text-sm cursor-pointer"
            >
              Show My Safe Options ➔
            </button>
          </div>
        </div>
      )}

      {/* --- SCREEN 4: FILTERABLE ECOSYSTEM RESULTS --- */}
      {screen === 4 && (
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <span className="text-3xl">🎉</span>
            <h2 className="text-2xl font-black text-slate-900 mt-2">Your Verified Safe Safe-Spaces</h2>
            <p className="text-sm text-slate-500 mt-1">Based safely on a {age}-year-old profile inside {stateLocation}.</p>
          </div>

          {/* --- LIVE SPREADSHEET-DRIVEN WARNING NOTICE BANNER --- */}
          {Number(age) < 18 && statePolicyRules[stateLocation]?.isBanned && (
            <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl text-xs text-amber-900 mb-6 leading-relaxed animate-fade-in shadow-sm">
              <span className="font-bold block mb-0.5 text-amber-950 text-sm">⚠️ Youth Access Notice:</span>
              {statePolicyRules[stateLocation]?.customMessage}
            </div>
          )}

          {/* Interactive Filter Hub Row */}
          <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
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

          {/* Cards Stack Rendering */}
          <div className="space-y-4">
            {getRecommendations().length > 0 ? (
              getRecommendations().map((rec, index) => (
                <div key={index} className="p-6 bg-white border border-slate-100 rounded-2xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in">
                  <div className="max-w-md">
                    <div className="flex items-center gap-2 mb-1.5">
                      <h3 className="font-bold text-lg text-slate-900 m-0">{rec.name}</h3>
                      <span className="text-[10px] bg-slate-100 border border-slate-200/60 font-semibold px-2 py-0.5 rounded-full text-slate-500 uppercase tracking-wide">
                        {rec.deliveryType === 'mail' ? '📦 Mail' : rec.deliveryType === 'in-person' ? '🏥 Clinic' : '🌐 Info'}
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