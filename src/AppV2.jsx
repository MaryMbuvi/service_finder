import React, { useState, useMemo, useRef, useEffect } from 'react';
import { masterResources } from './data/resources.js';

// --- GLOBAL STATIC CONFIGURATIONS ---
const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
];

const HIGH_RESTRICTION_STATES = ['Texas', 'Florida', 'Ohio', 'Alabama', 'Arkansas', 'Mississippi', 'Kentucky', 'Louisiana'];

const MASTER_HELPLINES = [
  { name: "Mhealth & Reproductive Rights Helpline", contact: "reprolegalhelpline.org", desc: "Secure online legal portal for guidance on age rules and judicial bypass laws." },
  { name: "Love is Respect (Teen Safety)", contact: "Text 'LOVEIS' to 22522", desc: "100% confidential space to text or talk if a partner is threatening or hurting you." },
  { name: "Planned Parenthood Direct", contact: "1-800-230-PLAN", desc: "Connects your call directly to the nearest youth-vetted clinical health office." },
  { name: "988 Suicide & Crisis Lifeline", contact: "Text or Call 988", desc: "Free, confidential, 24/7 support if you are feeling completely overwhelmed." }
];

const SERVICES = [
  { id: 'abortion', name: 'Abortion' },
  { id: 'testing', name: 'STI Testing' },
  { id: 'contraceptive', name: 'Birth Control' },
  { id: 'pregnancy', name: 'Pregnancy' },
  { id: 'lgbtq', name: 'LGBTQ+ Resources' },
  { id: 'mental', name: 'Mental Health' },
  { id: 'gbv', name: 'Safety & Abuse Support' }
];

export default function AppV2() {
  // Core Profile
  const [age, setAge] = useState('');
  const [stateLocation, setStateLocation] = useState('');
  
  // Service Navigation
  const [selectedService, setSelectedService] = useState(null);

  // Sub-question Filters
  const [weeksPregnant, setWeeksPregnant] = useState('');
  const [hasStiSymptoms, setHasStiSymptoms] = useState('');
  const [contraceptiveUrgency, setContraceptiveUrgency] = useState('');
  const [pregnancyTestStatus, setPregnancyTestStatus] = useState('');
  const [mentalHealthType, setMentalHealthType] = useState('');
  const [gbvSupportPreference, setGbvSupportPreference] = useState('');

  // UI Interactive Toggles
  const [deliveryFilter, setDeliveryFilter] = useState('all');
  const [insuranceFilter, setInsuranceFilter] = useState('all');

  const resultsRef = useRef(null);

  // Privacy-Safe GA Logger
  const logToGoogleAnalytics = (finalAge, finalState, finalService) => {
    let ageRange = 'Under 15';
    const numericAge = Number(finalAge);
    if (numericAge >= 15 && numericAge <= 17) ageRange = '15-17';
    else if (numericAge >= 18 && numericAge <= 21) ageRange = '18-21';
    else if (numericAge > 21) ageRange = '22+';

    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', 'resource_search', {
        'user_state': finalState || 'unspecified',
        'user_age_group': finalAge ? ageRange : 'unspecified',
        'service_type': finalService,
      });
    }
  };

  const handleServiceClick = (serviceId) => {
    if (selectedService === serviceId) {
      setSelectedService(null); 
    } else {
      setSelectedService(serviceId);
      
      // Reset sub-questions when changing categories so old filters don't pollute the new search
      setWeeksPregnant('');
      setHasStiSymptoms('');
      setContraceptiveUrgency('');
      setPregnancyTestStatus('');
      setMentalHealthType('');
      setGbvSupportPreference('');
      setDeliveryFilter('all');
      setInsuranceFilter('all');

      logToGoogleAnalytics(age, stateLocation, serviceId);
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    }
  };

  const triggerQuickEscape = () => {
    window.location.replace("https://www.google.com"); 
  };

  // --- 🚀 INSTANT MEMOIZED PIPELINE ENGINE ---
  const activeResources = useMemo(() => {
    if (!selectedService) return [];
    
    const rawData = Array.isArray(masterResources) ? masterResources : [];
    let list = [...rawData];

    const isMinor = age !== '' && Number(age) < 18;
    const isRestrictedZone = stateLocation !== '' && HIGH_RESTRICTION_STATES.includes(stateLocation);

    list = list.filter(item => item?.category === 'all' || item?.category === selectedService);

    if (isMinor && isRestrictedZone) {
      list = list.filter(item => !item?.requiresParentalConsent);

      if (selectedService === 'abortion') {
        list = list.filter(item => item?.deliveryType !== 'in-person');
        list.unshift({
          name: 'Repro Legal Helpline (reprolegalhelpline.org)',
          desc: `Because you are under 18 in ${stateLocation}, physical care paths have deep legal hurdles. This private legal group helps you safely explore a confidential judge's note (Judicial Bypass) or safe travel paths.`,
          link: 'https://www.reprolegalhelpline.org',
          deliveryType: 'all',
          costType: 'all',
          requiresParentalConsent: false
        });
      }
      if (selectedService === 'lgbtq') {
        list = list.filter(item => item?.deliveryType !== 'in-person');
      }
    }

    if (selectedService === 'abortion' && weeksPregnant) {
        list = list.filter(item => item?.subType === 'all' || item?.subType === weeksPregnant);
    }
    if (selectedService === 'mental' && mentalHealthType) {
      list = list.filter(item => item?.subType === 'all' || item?.subType === mentalHealthType);
    }
    if (selectedService === 'gbv' && gbvSupportPreference) {
      list = list.filter(item => item?.subType === 'all' || item?.subType === gbvSupportPreference);
    }

    list = list.map(item => {
      let finalUrl = item?.link || '#';
      if ((item?.link?.includes('ineedana.com') || item?.link?.includes('abortionfinder.org')) && age && stateLocation) {
        finalUrl = `${item.link}/search?age=${age}&state=${stateLocation}`;
      }
      return { ...item, link: finalUrl };
    });

    return list.filter(item => {
      const matchesDelivery = deliveryFilter === 'all' || item?.deliveryType === 'all' || item?.deliveryType === deliveryFilter;
      const matchesCost = insuranceFilter === 'all' || item?.costType === 'all' || item?.costType === insuranceFilter;
      return matchesDelivery && matchesCost;
    });

  }, [selectedService, age, stateLocation, weeksPregnant, hasStiSymptoms, contraceptiveUrgency, pregnancyTestStatus, mentalHealthType, gbvSupportPreference, deliveryFilter, insuranceFilter]);

  // A composite string to trigger a visual re-render animation in the results box when core info changes
  const refreshTriggerKey = `${age}-${stateLocation}-${deliveryFilter}-${insuranceFilter}`;

  return (
    <div className="bg-[#FDF8F8] min-h-screen font-sans text-slate-800 antialiased relative pb-20">
      
      {/* ⚡ STICKY GLOBAL HEADBOARD & ESCAPE */}
      <div className="sticky top-0 bg-white/95 backdrop-blur-md z-50 shadow-sm border-b border-purple-100 px-4 py-3 sm:px-6 sm:py-4 flex justify-between items-center w-full">
        <div>
          <h1 className="text-lg sm:text-2xl font-black text-[#163D46] tracking-tight leading-none">
            Service Finder
          </h1>
        </div>
        <button 
          onClick={triggerQuickEscape}
          className="bg-red-400 hover:bg-red-500 text-white text-[10px] sm:text-xs font-black px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl uppercase tracking-wider transition-all shadow-sm active:scale-95 flex items-center gap-1.5 cursor-pointer"
        >
          <span className="text-sm">⚡</span> Quick Escape
        </button>
      </div>

      <div className="w-full max-w-5xl mx-auto px-4 mt-8 space-y-8 flex flex-col items-center">

        {/* 📋 INLINE CONTEXT BAR */}
        <div className="w-full max-w-4xl bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-sm font-black text-[#163D46] uppercase tracking-wider">Your Details</h3>
            <p className="text-[11px] text-[#5F737B] mt-0.5 leading-snug">Entering this auto-filters clinics to match local laws.</p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <input 
              type="number" placeholder="Age" min="12" max="110" 
              value={age} onChange={(e) => setAge(e.target.value)} 
              className="w-20 p-3 text-sm font-bold bg-[#FDF8F8] border border-gray-200 rounded-xl text-[#163D46] focus:outline-none focus:border-[#C8B4FA] focus:bg-white transition-all text-center" 
            />
            <select 
              value={stateLocation} onChange={(e) => setStateLocation(e.target.value)}
              className="flex-1 sm:w-48 p-3 text-sm font-bold bg-[#FDF8F8] border border-gray-200 rounded-xl text-[#163D46] focus:outline-none focus:border-[#C8B4FA] focus:bg-white transition-all cursor-pointer"
            >
              <option value="">Select State...</option>
              {US_STATES.map(st => <option key={st} value={st}>{st}</option>)}
            </select>
          </div>
        </div>

        {/* 🏥 WHAT KIND OF SERVICES ARE YOU LOOKING FOR? */}
        <div className="w-full max-w-4xl space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-[#163D46] tracking-tight">What kind of services you are looking for?</h2>
          <div className="flex flex-wrap gap-3">
            {SERVICES.map((srv) => (
              <button
                key={srv.id} 
                onClick={() => handleServiceClick(srv.id)}
                className={`px-5 py-3 rounded-xl text-sm font-bold transition-all border-2 active:scale-95 cursor-pointer ${
                  selectedService === srv.id
                    ? 'bg-[#E0D4FD] text-[#163D46] border-[#C8B4FA] shadow-sm'
                    : 'bg-white text-slate-600 border-gray-200 hover:border-[#D1D5DB]'
                }`}
              >
                {srv.name}
              </button>
            ))}
          </div>
        </div>

        {/* 🎯 DYNAMIC RESULTS & SUB-QUESTIONS PANEL */}
        {selectedService && (
          <div ref={resultsRef} className="w-full bg-white rounded-3xl shadow-md border border-slate-100 overflow-hidden animate-fade-in scroll-mt-24 flex flex-col md:flex-row">
            
            {/* ========================================================= */}
            {/* LEFT COLUMN: FILTERS & CONTEXT BLOCKS                     */}
            {/* ========================================================= */}
            <div className="bg-[#F8F9FA] border-r border-slate-100 p-6 md:w-5/12 space-y-8">
              
              {/* Abortion Custom Descriptions */}
              {selectedService === 'abortion' && (
                <div>
                  <h3 className="text-xl font-black text-[#163D46] mb-4">How many weeks pregnant?</h3>
                  <div className="flex flex-col gap-3">
                    {[{ value: 'under10', label: 'Under 10 Weeks' }, { value: '10to15', label: '10 to 15 Weeks' }, { value: 'over15', label: 'Over 15 Weeks' }].map(opt => (
                      <button
                        key={opt.value} onClick={() => { setWeeksPregnant(opt.value); setDeliveryFilter(opt.value === 'under10' ? 'mail' : 'in-person'); }}
                        className={`p-4 text-sm font-bold rounded-xl border-2 transition-all text-left cursor-pointer ${weeksPregnant === opt.value ? 'border-[#C8B4FA] bg-[#E0D4FD] text-[#163D46]' : 'border-gray-200 bg-white text-slate-600 hover:bg-slate-50'}`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>

                  {/* RESTORED: Crucial Context Blocks */}
                  {weeksPregnant === 'under10' && (
                    <div className="mt-4 p-4 bg-purple-50 border border-purple-100 rounded-xl text-xs text-purple-900 leading-relaxed font-medium animate-fade-in">
                      <span className="font-extrabold block text-sm mb-1 text-[#163D46]">✨ Recommended: Pills By Mail</span>
                      At under 10 weeks, you are medically eligible for telehealth abortion medication options. We have automatically updated your filters to highlight discrete remote shipping services.
                    </div>
                  )}
                  {(weeksPregnant === '10to15' || weeksPregnant === 'over15') && (
                    <div className="mt-4 p-4 bg-amber-50 border border-amber-100 rounded-xl text-xs text-amber-900 leading-relaxed font-medium animate-fade-in">
                      <span className="font-extrabold block text-sm mb-1 text-[#163D46]">🏥 Recommended: In-Person Care</span>
                      At this gestational stage, care must be safely provided inside physical clinics. We have updated your filters to "In-Person" to hide out-of-date mail listings and ensure safe clinical access.
                    </div>
                  )}
                </div>
              )}

              {/* STI Custom Descriptions */}
              {selectedService === 'testing' && (
                <div>
                  <h3 className="text-xl font-black text-[#163D46] mb-4">Active physical symptoms?</h3>
                  <div className="flex flex-col gap-3">
                    {[{ value: 'yes', label: 'Yes, I feel symptoms' }, { value: 'no', label: 'No, routine checkup' }].map(opt => (
                      <button
                        key={opt.value} onClick={() => { setHasStiSymptoms(opt.value); setDeliveryFilter(opt.value === 'no' ? 'mail' : 'in-person'); }}
                        className={`p-4 text-sm font-bold rounded-xl border-2 transition-all text-left cursor-pointer ${hasStiSymptoms === opt.value ? 'border-[#C8B4FA] bg-[#E0D4FD] text-[#163D46]' : 'border-gray-200 bg-white text-slate-600 hover:bg-slate-50'}`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                  
                  {/* RESTORED: Crucial Context Blocks */}
                  {hasStiSymptoms === 'yes' && (
                    <div className="mt-4 p-4 bg-purple-50 border border-purple-100 rounded-xl text-xs text-purple-900 leading-relaxed font-medium animate-fade-in">
                      <span className="font-extrabold block text-sm mb-1 text-[#163D46]">🏥 Recommended: In-Person Testing</span>
                      If you have active symptoms, we strongly recommend in-clinic testing for faster laboratory results and immediate treatment options. Your filters have been set to In-Person clinics.
                    </div>
                  )}
                  {hasStiSymptoms === 'no' && (
                    <div className="mt-4 p-4 bg-purple-50 border border-purple-100 rounded-xl text-xs text-purple-900 leading-relaxed font-medium animate-fade-in">
                      <span className="font-extrabold block text-sm mb-1 text-[#163D46]">✨ Recommended: Home Test Kits</span>
                      For routine wellness checkups without symptoms, at-home self-swab kits are a highly private and convenient option. Your filters have been pre-set to At Home.
                    </div>
                  )}
                </div>
              )}

              {/* Contraceptive Custom Descriptions */}
              {selectedService === 'contraceptive' && (
                <div>
                  <h3 className="text-xl font-black text-[#163D46] mb-4">Need emergency Plan B?</h3>
                  <div className="flex flex-col gap-3">
                    {[{ value: 'emergency', label: 'Yes, emergency care needed' }, { value: 'routine', label: 'No, looking for routine control' }].map(opt => (
                      <button
                        key={opt.value} onClick={() => { setContraceptiveUrgency(opt.value); setDeliveryFilter(opt.value === 'emergency' ? 'mail' : 'in-person'); }}
                        className={`p-4 text-sm font-bold rounded-xl border-2 transition-all text-left cursor-pointer ${contraceptiveUrgency === opt.value ? 'border-[#C8B4FA] bg-[#E0D4FD] text-[#163D46]' : 'border-gray-200 bg-white text-slate-600 hover:bg-slate-50'}`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                  
                  {/* RESTORED: Crucial Context Blocks */}
                  {contraceptiveUrgency === 'emergency' && (
                    <div className="mt-4 p-4 bg-purple-50 border border-purple-100 rounded-xl text-xs text-purple-900 leading-relaxed font-medium animate-fade-in">
                      <span className="font-extrabold block text-sm mb-1 text-[#163D46]">⚡ Prioritizing: Fast Emergency Access</span>
                      For recent accidents, time is critical. We are prioritizing immediate over-the-counter morning-after emergency pills or discrete overnight delivery networks.
                    </div>
                  )}
                  {contraceptiveUrgency === 'routine' && (
                    <div className="mt-4 p-4 bg-purple-50 border border-purple-100 rounded-xl text-xs text-purple-900 leading-relaxed font-medium animate-fade-in">
                      <span className="font-extrabold block text-sm mb-1 text-[#163D46]">🩺 Prioritizing: Ongoing Management</span>
                      For continuous pregnancy prevention, we emphasize confidential family planning clinics or low-cost online prescriptions for standard birth control options.
                    </div>
                  )}
                </div>
              )}

              {/* UN-SQUEEZED FILTER CARDS */}
              <div className="pt-4 border-t border-slate-200">
                <h3 className="text-sm font-black uppercase text-[#163D46] tracking-wider mb-4">How to get care</h3>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => setDeliveryFilter('in-person')} 
                    className={`p-4 rounded-xl border-2 flex flex-col items-start gap-2 transition-all cursor-pointer ${deliveryFilter === 'in-person' ? 'border-[#C8B4FA] bg-[#E0D4FD] text-[#163D46]' : 'border-gray-200 bg-white text-slate-600'}`}
                  >
                    <span className="text-xl">🚑</span>
                    <span className="text-sm font-bold mt-1">In-Person</span>
                  </button>
                  <button 
                    onClick={() => setDeliveryFilter('mail')} 
                    className={`p-4 rounded-xl border-2 flex flex-col items-start gap-2 transition-all cursor-pointer ${deliveryFilter === 'mail' ? 'border-[#C8B4FA] bg-[#E0D4FD] text-[#163D46]' : 'border-gray-200 bg-white text-slate-600'}`}
                  >
                    <span className="text-xl">🏠</span>
                    <span className="text-sm font-bold mt-1">At Home</span>
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button 
                  onClick={() => setInsuranceFilter(insuranceFilter === 'free-cash' ? 'all' : 'free-cash')} 
                  className={`w-full p-4 rounded-xl border-2 flex items-center gap-3 transition-all cursor-pointer ${insuranceFilter === 'free-cash' ? 'border-[#C8B4FA] bg-[#E0D4FD]' : 'border-gray-200 bg-white'}`}
                >
                  <div className={`w-5 h-5 border-2 rounded flex items-center justify-center ${insuranceFilter === 'free-cash' ? 'border-[#163D46] bg-[#163D46]' : 'border-slate-300 bg-white'}`}>
                    {insuranceFilter === 'free-cash' && <span className="text-white text-xs">✓</span>}
                  </div>
                  <span className={`text-sm font-bold ${insuranceFilter === 'free-cash' ? 'text-[#163D46]' : 'text-slate-600'}`}>Free / Cash services only</span>
                </button>
              </div>

              {/* HIGH VISIBILITY INSURANCE EOB BANNER */}
              {insuranceFilter !== 'free-cash' && (
                <div className="mt-4 bg-indigo-50 border border-indigo-200 p-4 rounded-xl text-xs text-indigo-950 font-medium leading-relaxed shadow-sm">
                  <span className="font-extrabold block text-indigo-800 mb-0.5 text-sm">⚠️ Insurance Warning:</span>
                  Using parent insurance generates a physical paper statement (EOB) sent home. Select "Free / Cash services only" above for completely off-the-record options.
                </div>
              )}
            </div>

            {/* ========================================================= */}
            {/* RIGHT COLUMN: RESULTS FEED DIRECTORY                      */}
            {/* ========================================================= */}
            <div className="p-6 bg-white md:w-7/12 flex flex-col relative">
              
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                <h3 className="text-sm font-black uppercase text-[#163D46] tracking-wider">Matching Providers</h3>
                <span className="text-[10px] font-bold bg-[#E0D4FD] text-[#163D46] px-3 py-1 rounded-full uppercase">{activeResources.length} Found</span>
              </div>

              {/* State Override Legal Restriction Banner */}
              {Number(age) < 18 && HIGH_RESTRICTION_STATES.includes(stateLocation) && (
                <>
                  {selectedService === 'abortion' && (
                    <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-xs text-amber-900 leading-relaxed font-medium mb-4">
                      <span className="font-bold block mb-1 text-sm">Youth Access Notice:</span>
                      Because you are under 18 in {stateLocation}, local health clinics have strict parental notification laws. To protect you, we have hidden standard services that require parent signatures and highlighted alternative confidential pathways below.
                    </div>
                  )}
                  {selectedService === 'lgbtq' && (
                    <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-xs text-amber-900 leading-relaxed font-medium mb-4">
                      <span className="font-bold block mb-1 text-sm">Identity Care Notice:</span>
                      Because you are under 18 in {stateLocation}, local laws restrict physical identity services. We have highlighted completely confidential, private digital networks below.
                    </div>
                  )}
                </>
              )}

              {/* 🔄 Render Cards with an animation key so users visually see the list refresh when they type a new age/state */}
              <div key={refreshTriggerKey} className="flex flex-col gap-3 overflow-y-auto max-h-[600px] pr-2 animate-fade-in">
                {activeResources.length > 0 ? (
                  activeResources.map((fac, idx) => (
                    <div key={idx} className="p-5 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col gap-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h4 className="font-extrabold text-base text-[#163D46]">{fac?.name || 'Vetted Care Network'}</h4>
                        </div>
                        <p className="text-sm text-slate-500 leading-relaxed">{fac?.desc || ''}</p>
                      </div>
                      <div className="flex items-center justify-between mt-2 pt-3 border-t border-gray-50">
                        <span className="text-[10px] bg-[#FDF8F8] border border-gray-100 text-slate-600 font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
                          {fac?.deliveryType === 'mail' ? 'At Home (Mail)' : fac?.deliveryType === 'in-person' ? 'In-Person' : 'Information'}
                        </span>
                        <a 
                          href={fac?.link || '#'} target="_blank" rel="noopener noreferrer" 
                          className="bg-[#E0D4FD] hover:bg-[#C8B4FA] text-[#163D46] text-xs font-black py-2.5 px-6 rounded-xl transition-all text-center cursor-pointer"
                        >
                          Visit
                        </a>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center p-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200 mt-4">
                    <p className="text-base font-bold text-[#163D46]">No exact matches found</p>
                    <p className="text-sm text-[#5F737B] mt-1">Try adjusting your "How to get care" filters on the left.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 🆘 MASTER EMERGENCY HELPLINES (Always highly visible, matching "In case of crisis:" from reference) */}
        <div className="w-full max-w-4xl pt-8 mt-4 border-t border-slate-200">
          <div className="px-1 text-left mb-4">
            <h3 className="text-lg font-black text-[#163D46] flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
              In case of crisis:
            </h3>
            <p className="text-sm text-[#5F737B] mt-1">If you are in an urgent crisis, we have compiled a list of immediate, confidential helplines that do not require parental permission.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {MASTER_HELPLINES.map((line, lIdx) => (
              <div key={lIdx} className="p-5 bg-white border border-red-100 rounded-2xl flex flex-col justify-between gap-4 shadow-sm hover:shadow-md transition-all">
                <div className="space-y-1">
                  <h4 className="font-extrabold text-base text-[#163D46]">{line.name}</h4>
                  <p className="text-sm text-[#5F737B] leading-relaxed">{line.desc}</p>
                </div>
                <div className="bg-red-50/70 border border-red-100 rounded-xl p-3 text-center">
                  <span className="text-sm font-black text-red-600 select-all tracking-wide">{line.contact}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}