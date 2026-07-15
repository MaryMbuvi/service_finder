import React, { useState, useMemo, useRef, useEffect } from 'react';
import { masterResources } from './data/resources.js';
import serviceHeroImg from './assets/servicePage_transparent.png';

// --- GLOBAL STATIC CONFIGURATIONS ---
const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
];

const HIGH_RESTRICTION_STATES = ['Texas', 'Florida', 'Ohio', 'Alabama', 'Arkansas', 'Mississippi', 'Kentucky', 'Louisiana'];

// CONDENSED CRISIS REGISTRY
const CONDENSED_HELPLINES = [
  { group: "Safety & Abuse", name: "LoveIsRespect (Teen Safety)", contact: "Text 'LOVEIS' to 22522 / Call 1-866-331-9474", desc: "100% confidential space to text or talk if a partner is threatening, controlling, or hurting you." },
  { group: "Mental Health", name: "988 Suicide & Crisis Lifeline", contact: "Call or Text 988", desc: "Free, confidential, 24/7 support via call or text if you are feeling completely overwhelmed." },
  { group: "LGBTQ+ Support", name: "The Trevor Project", contact: "Text 'START' to 678-678 / Call 1-866-488-7386", desc: "24/7 suicide prevention and mental health support built purely for LGBTQ+ young people." },
  { group: "Sexual Health", name: "Planned Parenthood Direct", contact: "Call 1-800-230-7526 (PLAN)", desc: "24/7 direct connection to talk with vetted counselors about birth control, tests, or missing periods." }
];

const SERVICES = [
  { id: 'abortion', name: 'Abortion Options' },
  { id: 'testing', name: 'STI Testing' },
  { id: 'contraceptive', name: 'Birth Control' },
  { id: 'pregnancy', name: 'Pregnancy Testing' },
  { id: 'lgbtq', name: 'LGBTQ+ Resources' },
  { id: 'mental', name: 'Mental Health' },
  { id: 'gbv', name: 'Safety & Abuse Support' }
];

export default function AppV2() {
  // Core Profile
  const [ageGroup, setAgeGroup] = useState(''); 
  const [stateLocation, setStateLocation] = useState('');
  const [missingDetails, setMissingDetails] = useState(false); 
  
  // Navigation & Keyword Search
  const [selectedService, setSelectedService] = useState(null);
  const [providerSearch, setProviderSearch] = useState('');

  // Sub-question Filters
  const [weeksPregnant, setWeeksPregnant] = useState('');
  const [hasStiSymptoms, setHasStiSymptoms] = useState('');
  const [contraceptiveUrgency, setContraceptiveUrgency] = useState('');
  const [lgbtqSupportType, setLgbtqSupportType] = useState('');
  const [mentalHealthType, setMentalHealthType] = useState('');
  const [gbvSupportPreference, setGbvSupportPreference] = useState('');

  // UI Interactive Toggles
  const [deliveryFilter, setDeliveryFilter] = useState('all');
  const [insuranceFilter, setInsuranceFilter] = useState('all');

  const resultsRef = useRef(null);
  const detailsRef = useRef(null);

  // 🚀 THE URL LISTENER
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const passedService = params.get('service');
    const passedAge = params.get('age');
    const passedState = params.get('state');

    if (passedAge) {
      if (passedAge === 'under_18' || passedAge === '18_plus') {
        setAgeGroup(passedAge);
      } else if (!isNaN(passedAge)) {
        setAgeGroup(Number(passedAge) < 18 ? 'under_18' : '18_plus');
      }
    }
    
    if (passedState) setStateLocation(passedState);
    
    if (passedService) {
      setSelectedService(passedService);
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 300);
    }
  }, []);

  const handleServiceClick = (serviceId) => {
    if (!ageGroup || !stateLocation) {
      setMissingDetails(true);
      detailsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setMissingDetails(false);

    if (selectedService === serviceId) {
      setSelectedService(null); 
    } else {
      setSelectedService(serviceId);
      
      // Complete sub-filter resets
      setWeeksPregnant('');
      setHasStiSymptoms('');
      setContraceptiveUrgency('');
      setLgbtqSupportType('');
      setMentalHealthType('');
      setGbvSupportPreference('');
      setDeliveryFilter('all');
      setInsuranceFilter('all');

      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    }
  };

  // --- 🚀 INSTANT MEMOIZED PIPELINE ENGINE ---
  const activeResources = useMemo(() => {
    if (!selectedService) return [];
    
    const rawData = Array.isArray(masterResources) ? masterResources : [];
    let list = [...rawData];

    const isMinor = ageGroup === 'under_18';
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

    // Comprehensive Contextual Filter Triggers
    if (selectedService === 'abortion' && weeksPregnant) {
      list = list.filter(item => item?.subType === 'all' || item?.subType === weeksPregnant);
    }
    if (selectedService === 'testing' && hasStiSymptoms) {
      list = list.filter(item => item?.subType === 'all' || item?.subType === hasStiSymptoms);
    }
    if (selectedService === 'contraceptive' && contraceptiveUrgency) {
      list = list.filter(item => item?.subType === 'all' || item?.subType === contraceptiveUrgency);
      
      {/* 🔧 ENGINE FIX: If emergency contraception is active, filter out loose informational resource pages that lack specific clinic/delivery routing data */}
      if (contraceptiveUrgency === 'emergency') {
        list = list.filter(item => item?.deliveryType === 'in-person' || item?.deliveryType === 'mail');
      }
    }
    if (selectedService === 'lgbtq' && lgbtqSupportType) {
      list = list.filter(item => item?.subType === 'all' || item?.subType === lgbtqSupportType);
    }
    if (selectedService === 'mental' && mentalHealthType) {
      list = list.filter(item => item?.subType === 'all' || item?.subType === mentalHealthType);
    }
    if (selectedService === 'gbv' && gbvSupportPreference) {
      list = list.filter(item => item?.subType === 'all' || item?.subType === gbvSupportPreference);
    }

    if (providerSearch.trim() !== '') {
      const query = providerSearch.toLowerCase();
      list = list.filter(item => 
        item?.name?.toLowerCase().includes(query) || 
        item?.desc?.toLowerCase().includes(query)
      );
    }

    list = list.map(item => {
      let finalUrl = item?.link || '#';
      if ((item?.link?.includes('ineedana.com') || item?.link?.includes('abortionfinder.org')) && ageGroup && stateLocation) {
        const proxyAge = ageGroup === 'under_18' ? 16 : 22;
        finalUrl = `${item.link}/search?age=${proxyAge}&state=${stateLocation}`;
      }
      return { ...item, link: finalUrl };
    });

    return list.filter(item => {
      const matchesDelivery = deliveryFilter === 'all' || item?.deliveryType === 'all' || item?.deliveryType === deliveryFilter;
      const matchesCost = insuranceFilter === 'all' || item?.costType === 'all' || item?.costType === insuranceFilter;
      return matchesDelivery && matchesCost;
    });

  }, [selectedService, ageGroup, stateLocation, weeksPregnant, hasStiSymptoms, contraceptiveUrgency, lgbtqSupportType, mentalHealthType, gbvSupportPreference, deliveryFilter, insuranceFilter, providerSearch]);

  const refreshTriggerKey = `${ageGroup}-${stateLocation}-${deliveryFilter}-${insuranceFilter}-${providerSearch}`;

  const isPhysicalItemTrack = selectedService === 'abortion' || selectedService === 'testing' || selectedService === 'contraceptive' || selectedService === 'pregnancy';

  return (
    <div 
      style={{ fontFamily: 'Gelica, gelica, sans-serif' }}
      className="w-full bg-[#FDFAF9] antialiased flex items-center justify-center p-1"
    >
      
      {/* GLOBAL BRAND BORDER WRAPPER */}
      <div className="w-full max-w-[1240px] bg-gradient-to-b from-[#F4FFFB] to-white rounded-[2rem] border-[6px] border-[#FCE8ED] shadow-sm overflow-hidden pt-6 pb-16">

        <div id="center" className="w-full mx-auto px-4 sm:px-8 space-y-8 flex flex-col items-center flex-grow">

          {/* 🔒 PRIVACY BANNER */}
          <div className="w-full bg-white/80 backdrop-blur-sm border border-purple-100 p-5 rounded-2xl flex items-start gap-4 shadow-sm mt-2 text-sm sm:text-base">
            <span className="text-xl sm:text-2xl">🔒</span>
            <div>
              <span className="font-extrabold text-base sm:text-lg block mb-0.5 text-[#263f43]">You are safe and anonymous here.</span>
              <span className="text-[#382a49] block">
                We never ask for your name, phone number, or who you are. We only use your age and state to show you the right legal options and to understand which regions need the most help. Your personal identity is completely hidden.
              </span>
            </div>
          </div>

          {/* ============================================================ */}
          {/* 📋 UNIFIED SEARCH CONFIGURATION FEED                         */}
          {/* ============================================================ */}
          <div className="w-full flex flex-col lg:flex-row gap-6 lg:items-start items-center">
            
            {/* LEFT FILTERING BLOCK */}
            <div 
              ref={detailsRef}
              className={`w-full lg:flex-1 bg-white p-5 sm:p-6 rounded-3xl shadow-sm border transition-all duration-300 flex flex-col gap-6 ${
                missingDetails ? 'border-red-400 ring-4 ring-red-50' : 'border-[#E0D6FA]'
              }`}
            >
              {/* Profile Config Controls */}
              <div className="space-y-4">
                <div>
                  <h3 className="font-extrabold text-base sm:text-lg text-[#034B41]">
                    Your details <span className="text-red-500 font-bold ml-0.5">*</span>
                  </h3>
                  {missingDetails ? (
                    <p className="text-xs sm:text-sm mt-1 text-red-500 font-bold animate-fade-in">
                      ⚠️ {!ageGroup && !stateLocation ? "Please select your age bracket and state destination below." : !ageGroup ? "Please complete your age selection." : "Please choose your state."}
                    </p>
                  ) : (
                    <p className="text-xs sm:text-sm mt-1.5 mb-2.5 text-[#6C768E] font-semibold leading-relaxed">
                      Entering this accurately auto-filters clinics to match the healthcare laws in your state.
                    </p>
                  )}
                </div>
                
                <div className="flex flex-col sm:flex-row gap-5 w-full items-end">
                  <div className="w-full sm:w-1/2 flex flex-col gap-2">
                    <span className="text-sm sm:text-base font-bold tracking-normal pl-1 text-slate-700">
                      Select your age group: <span className="text-red-500 font-bold ml-0.5">*</span>
                    </span>
                    <div className={`grid grid-cols-2 p-1 gap-1.5 bg-[#FDFAF9] border shadow-inner rounded-xl w-full h-[54px] items-center ${missingDetails && !ageGroup ? 'border-red-400' : 'border-slate-300'}`}>
                      <button 
                        type="button"
                        onClick={() => { setAgeGroup('under_18'); setMissingDetails(false); }}
                        className={`h-full text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer border ${ageGroup === 'under_18' ? 'bg-[#034B41] text-white shadow-sm border-[#034B41]' : 'text-[#3A4A60] bg-white border-slate-200 shadow-sm hover:text-[#034B41] hover:bg-slate-100'}`}
                      >
                        Under 18
                      </button>
                      <button 
                        type="button"
                        onClick={() => { setAgeGroup('18_plus'); setMissingDetails(false); }}
                        className={`h-full text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer border ${ageGroup === '18_plus' ? 'bg-[#034B41] text-white shadow-sm border-[#034B41]' : 'text-[#3A4A60] bg-white border-slate-200 shadow-sm hover:text-[#034B41] hover:bg-slate-100'}`}
                      >
                        18 or older
                      </button>
                    </div>
                  </div>

                  <div className="w-full sm:w-1/2 flex flex-col gap-2">
                    <span className="text-sm sm:text-base font-bold tracking-normal pl-1 text-slate-700">
                      Select your state: <span className="text-red-500 font-bold ml-0.5">*</span>
                    </span>
                    <div className="relative w-full">
                      <select 
                        value={stateLocation} 
                        onChange={(e) => { setStateLocation(e.target.value); setMissingDetails(false); }}
                        className={`w-full h-[54px] py-3.5 pl-4 pr-10 text-sm sm:text-sm font-bold bg-[#FDFAF9] border rounded-xl text-[#034B41] appearance-none focus:outline-none focus:border-[#CEC1F0] transition-all cursor-pointer ${missingDetails && !stateLocation ? 'border-red-400' : 'border-gray-200'}`}
                      >
                        <option value="">Choose State...</option>
                        {US_STATES.map(st => <option key={st} value={st}>{st}</option>)}
                      </select>
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-slate-400">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="6 9 12 15 18 9"></polyline></svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Category Nav Track */}
              <div className="space-y-2.5 mt-4">
                <h2 className="font-extrabold text-base sm:text-lg text-[#034B41]">Which services you are looking for?</h2>
                <div className="flex flex-wrap gap-3 w-full">
                  {SERVICES.map((srv) => (
                    <button
                      key={srv.id} 
                      onClick={() => handleServiceClick(srv.id)}
                      className={`px-5 py-3.5 rounded-xl text-xs sm:text-sm font-bold transition-all border border-slate-200 active:scale-95 cursor-pointer shadow-sm ${
                        selectedService === srv.id
                          ? 'bg-[#E0D6FA] text-[#034B41] border-[#CEC1F0]'
                          : 'bg-white text-[#3A4A60] hover:bg-[#d7efe7] hover:border-slate-200'
                      }`}
                    >
                      {srv.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT COMPONENT: BRAND ART CONTAINER */}
            <div className="w-full lg:w-[42%] max-w-[420px] hidden lg:flex items-center justify-center p-2 bg-transparent overflow-hidden self-stretch min-h-[240px]">
              <img 
                src={serviceHeroImg} 
                alt="Support network community graphic illustration" 
                className="w-full h-auto object-contain max-h-[280px]" 
              />
            </div>
          </div>

          {/* 🎯 CONTEXTUAL WORKSPACE FEED PANEL */}
          {selectedService && ageGroup && stateLocation && (
            <div 
              ref={resultsRef} 
              className="w-full bg-white rounded-3xl shadow-md border border-purple-50 overflow-hidden flex flex-col md:flex-row scroll-mt-24 animate-fade-in"
            >
              {/* COLUMN A: LOCAL PARAMETER TUNERS */}
              <div className="bg-[#FBF9F8] border-r border-purple-50 p-5 md:w-5/12 space-y-5 text-xs sm:text-sm">
                {selectedService === 'abortion' && (
                  <div className="space-y-3">
                    <h3 className="text-xs font-black text-[#034B41] tracking-normal">How many weeks pregnant?</h3>
                    <div className="flex flex-col gap-2">
                      {[{ value: 'under10', label: 'Under 10 Weeks' }, { value: '10to15', label: '10 to 15 Weeks' }, { value: 'over15', label: 'Over 15 Weeks' }].map(opt => (
                        <button
                          key={opt.value} onClick={() => { setWeeksPregnant(opt.value); setDeliveryFilter(opt.value === 'under10' ? 'mail' : 'in-person'); }}
                          className={`p-3 text-xs sm:text-sm font-bold rounded-xl border-2 text-left cursor-pointer transition-all ${weeksPregnant === opt.value ? 'border-[#CEC1F0] bg-[#E0D6FA] text-[#034B41]' : 'border-gray-100 bg-white text-slate-600'}`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>

                    {weeksPregnant === 'under10' && (
                      <div className="p-4 bg-purple-50 border border-[#E0D6FA] rounded-xl text-xs sm:text-sm text-purple-950 font-medium leading-relaxed animate-fade-in">
                        <span className="font-extrabold block text-sm sm:text-base mb-1 text-[#034B41]">✨ Recommended: Pills by mail</span>
                        At under 10 weeks, you are medically eligible for telehealth abortion medication options. We have automatically updated your filters to highlight discrete remote shipping services.
                      </div>
                    )}
                    {(weeksPregnant === '10to15' || weeksPregnant === 'over15') && (
                      <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs sm:text-sm text-purple-950 font-medium leading-relaxed animate-fade-in">
                        <span className="font-extrabold block text-sm sm:text-base mb-1 text-amber-800">🏥 Recommended: In-person care</span>
                        At this gestational stage, care must be safely provided inside physical clinics. We have updated your filters to "In-Person" to ensure safe clinical access.
                      </div>
                    )}
                  </div>
                )}

                {selectedService === 'testing' && (
                  <div className="space-y-3">
                    <h3 className="text-xs font-black text-[#034B41] tracking-normal">Do you feel active symptoms?</h3>
                    <div className="flex flex-col gap-2">
                      {[{ value: 'yes', label: 'Yes, feeling physical symptoms' }, { value: 'no', label: 'No, routine checkup' }].map(opt => (
                        <button
                          key={opt.value} onClick={() => { setHasStiSymptoms(opt.value); setDeliveryFilter(opt.value === 'no' ? 'mail' : 'in-person'); }}
                          className={`p-3 text-xs sm:text-sm font-bold rounded-xl border-2 text-left cursor-pointer transition-all ${hasStiSymptoms === opt.value ? 'border-[#CEC1F0] bg-[#E0D6FA] text-[#034B41]' : 'border-gray-100 bg-white text-slate-600'}`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>

                    {hasStiSymptoms === 'yes' && (
                      <div className="p-4 bg-purple-50 border border-[#E0D6FA] rounded-xl text-xs sm:text-sm text-purple-950 font-medium leading-relaxed animate-fade-in">
                        <span className="font-extrabold block text-sm sm:text-base mb-1 text-[#034B41]">🏥 Recommended: In-person testing</span>
                        If you have active symptoms, we strongly recommend in-clinic testing for faster laboratory results and immediate treatment options. Your filters have been set to In-Person clinics.
                      </div>
                    )}
                    {hasStiSymptoms === 'no' && (
                      <div className="p-4 bg-purple-50 border border-[#E0D6FA] rounded-xl text-xs sm:text-sm text-purple-950 font-medium leading-relaxed animate-fade-in">
                        <span className="font-extrabold block text-sm sm:text-base mb-1 text-[#034B41]">✨ Recommended: Home test kits</span>
                        For routine wellness checkups without symptoms, at-home self-swab kits are a highly private and convenient option. Your filters have been pre-set to At Home.
                      </div>
                    )}
                  </div>
                )}

                {selectedService === 'contraceptive' && (
                  <div className="space-y-3">
                    <h3 className="text-xs font-black text-[#034B41] tracking-normal">Is this an emergency accident?</h3>
                    <div className="flex flex-col gap-2">
                      {[{ value: 'emergency', label: 'Yes, need urgent Plan B' }, { value: 'routine', label: 'No, regular birth control' }].map(opt => (
                        <button
                          key={opt.value} 
                          onClick={() => { setContraceptiveUrgency(opt.value); setDeliveryFilter('all'); }}
                          className={`p-3 text-xs sm:text-sm font-bold rounded-xl border-2 text-left cursor-pointer transition-all ${contraceptiveUrgency === opt.value ? 'border-[#CEC1F0] bg-[#E0D6FA] text-[#034B41]' : 'border-gray-100 bg-white text-slate-600'}`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>

                    {contraceptiveUrgency === 'emergency' && (
                      <div className="p-4 bg-purple-50 border border-[#E0D6FA] rounded-xl text-xs sm:text-sm text-purple-950 font-medium leading-relaxed animate-fade-in">
                        <span className="font-extrabold block text-sm sm:text-base mb-1 text-[#034B41]">⚡ Prioritizing emergency access</span>
                        Time is critical for morning-after protection. We have prioritized physical local networks or fast express shipping streams for you.
                      </div>
                    )}
                  </div>
                )}

                {selectedService === 'pregnancy' && (
                  <div className="p-4 bg-purple-50 border border-[#E0D6FA] rounded-xl text-xs sm:text-sm text-purple-950 font-medium leading-relaxed">
                    <span className="font-extrabold block text-sm sm:text-base mb-1 text-[#034B41]">🤰 Confidential verification</span>
                    Select whether you prefer travelling privately to a health facility or locating discrete mail-delivery options using the choices directly below.
                  </div>
                )}

                {selectedService === 'lgbtq' && (
                  <div className="space-y-3">
                    <h3 className="text-xs font-black text-[#034B41] tracking-normal">What community resource do you need?</h3>
                    <div className="flex flex-col gap-2">
                      {[
                        { value: 'affirming', label: 'LGBTQ+ affirming health centers' },
                        { value: 'social', label: 'Safe youth support communities' }
                      ].map(opt => (
                        <button
                          key={opt.value} onClick={() => setLgbtqSupportType(opt.value)}
                          className={`p-3 text-xs sm:text-sm font-bold rounded-xl border-2 text-left cursor-pointer transition-all ${lgbtqSupportType === opt.value ? 'border-[#CEC1F0] bg-[#E0D6FA] text-[#034B41]' : 'border-gray-100 bg-white text-slate-600'}`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {selectedService === 'mental' && (
                  <div className="space-y-3">
                    <h3 className="text-xs font-black text-[#034B41] tracking-normal">What care mode is needed?</h3>
                    <div className="flex flex-col gap-2">
                      {[{ value: 'routine', label: 'Free counseling & therapy' }, { value: 'urgent', label: 'Immediate 24/7 lifelines' }].map(opt => (
                        <button
                          key={opt.value} onClick={() => setMentalHealthType(opt.value)}
                          className={`p-3 text-xs sm:text-sm font-bold rounded-xl border-2 text-left cursor-pointer transition-all ${mentalHealthType === opt.value ? 'border-[#CEC1F0] bg-[#E0D4FD] text-[#163D46]' : 'border-gray-200 bg-white text-slate-600'}`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {selectedService === 'gbv' && (
                  <div className="space-y-3">
                    <h3 className="text-xs font-black text-[#034B41] tracking-normal">What do you need right now?</h3>
                    <div className="flex flex-col gap-2">
                      {[
                        { value: 'shelter', label: 'I need an immediate safe place to go right now' },
                        { value: 'chat', label: 'I need someone safe to talk or text chat with secretly' }
                      ].map(opt => (
                        <button
                          key={opt.value} onClick={() => setGbvSupportPreference(opt.value)}
                          className={`p-3 text-xs sm:text-sm font-bold rounded-xl border-2 text-left cursor-pointer transition-all ${gbvSupportPreference === opt.value ? 'border-[#CEC1F0] bg-[#E0D4FD] text-[#163D46]' : 'border-gray-200 bg-white text-slate-600'}`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 🗣️ ADAPTIVE FILTERS */}
                <div className="pt-4 border-t border-gray-200 space-y-2">
                  <h3 className="text-xs font-black text-[#034B41] tracking-normal">
                    {isPhysicalItemTrack ? "How do you want to get care?" : "How do you want to talk to them?"}
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={() => setDeliveryFilter('in-person')} 
                      className={`py-2.5 rounded-xl border-2 text-center transition-all cursor-pointer ${deliveryFilter === 'in-person' ? 'border-[#CEC1F0] bg-[#E0D6FA] text-[#034B41]' : 'border-gray-100 bg-white text-slate-600 text-xs sm:text-sm font-bold'}`}
                    >
                      Go to a clinic
                    </button>
                    <button 
                      onClick={() => setDeliveryFilter('mail')} 
                      className={`py-2.5 rounded-xl border-2 text-center transition-all cursor-pointer ${deliveryFilter === 'mail' ? 'border-[#CEC1F0] bg-[#E0D6FA] text-[#034B41]' : 'border-gray-100 bg-white text-slate-600 text-xs sm:text-sm font-bold'}`}
                    >
                      {isPhysicalItemTrack ? "By mail / online" : "Online / text chat"}
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <button 
                    onClick={() => setInsuranceFilter(insuranceFilter === 'free-cash' ? 'all' : 'free-cash')} 
                    className={`w-full p-3 rounded-xl border-2 flex items-center gap-3 transition-all cursor-pointer ${insuranceFilter === 'free-cash' ? 'border-[#CEC1F0] bg-[#E0D6FA]' : 'border-gray-100 bg-white'}`}
                  >
                    <div className={`w-4 h-4 border rounded flex items-center justify-center ${insuranceFilter === 'free-cash' ? 'bg-[#034B41] border-[#034B41]' : 'border-slate-300 bg-white'}`}>
                      {insuranceFilter === 'free-cash' && <span className="text-white text-[10px]">✓</span>}
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-slate-600">Show free or low-cost services only</span>
                  </button>
                </div>

                {/* ⚠️ HIGH-VISIBILITY ORIGINAL PLACEMENT INSURANCE WARNING */}
                {insuranceFilter !== 'free-cash' && (
                  <div className="mt-4 bg-[#FFF9E6] border-l-4 border-amber-500 p-4 rounded-xl text-xs sm:text-sm text-[#034B41] font-semibold leading-relaxed shadow-sm animate-fade-in">
                    <span className="font-black block text-amber-800 text-sm sm:text-base mb-0.5">⚠️ Health insurance paper-trail notice</span>
                    Using a parent's health insurance card means a statement (called an EOB) will be printed and mailed straight home. If you want to keep your visit completely off-the-record, select <strong>"Show free or low-cost services only"</strong>.
                  </div>
                )}
              </div>

              {/* COLUMN B: SEARCH FEED DIRECTORY */}
              <div className="p-5 bg-white md:w-7/12 flex flex-col relative space-y-4 text-xs sm:text-sm">
                
                <div className="flex items-center justify-between border-b border-purple-50 pb-3">
                  <h3 className="text-xs font-black text-[#034B41] tracking-normal">Recommended providers</h3>
                  <span className="text-[10px] sm:text-xs font-black bg-[#E0D6FA] text-[#034B41] px-3 py-1 rounded-full">{activeResources.length} Found</span>
                </div>

                {/* Search Filtering Bar */}
                <div className="relative w-full">
                  <input 
                    type="text"
                    placeholder="Search providers by keyword or name..."
                    value={providerSearch}
                    onChange={(e) => setProviderSearch(e.target.value)}
                    className="w-full p-3 pl-9 bg-[#FDFAF9] border border-purple-100 rounded-xl text-xs sm:text-sm font-semibold focus:outline-none focus:border-[#CEC1F0] text-[#034B41]"
                  />
                  <span className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400 text-xs sm:text-sm">⚲</span>
                </div>

                {/* State Specific Youth Restriction Notices */}
                {ageGroup === 'under_18' && HIGH_RESTRICTION_STATES.includes(stateLocation) && (
                  <>
                    {selectedService === 'abortion' && (
                      <div className="bg-red-50 border border-red-100 p-4 rounded-xl text-xs sm:text-sm text-red-950 font-medium">
                        <strong>Youth access block warning:</strong> Because you are a minor inside {stateLocation}, local clinics face mandatory parent notification rules. To guarantee your absolute safety, we have prioritized secure legal bypass helplines and mail care networks.
                      </div>
                    )}
                  </>
                )}

                <div key={refreshTriggerKey} className="flex flex-col gap-3 overflow-y-auto max-h-[440px] pr-1 animate-fade-in">
                  {activeResources.length > 0 ? (
                    activeResources.map((fac, idx) => (
                      <div key={idx} className="p-4 bg-white border border-gray-100 shadow-sm rounded-2xl flex flex-col justify-between gap-3 hover:border-purple-200 transition-colors">
                        <div>
                          <h4 className="font-black text-xs sm:text-sm text-[#034B41] tracking-tight">{fac?.name || 'Care Pipeline'}</h4>
                          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mt-1 font-medium">{fac?.desc || ''}</p>
                        </div>
                        <div className="flex items-center justify-between pt-2.5 border-t border-gray-50">
                          <span className="text-[9px] sm:text-xs bg-[#FDFAF9] border border-purple-100 text-[#034B41] font-extrabold px-2 py-0.5 rounded tracking-normal">
                            {fac?.deliveryType === 'mail' ? (isPhysicalItemTrack ? 'Online / Mail' : 'Online / Chat') : fac?.deliveryType === 'in-person' ? 'Clinic site' : 'Reference link'}
                          </span>
                          <a 
                            href={fac?.link || '#'} target="_blank" rel="noopener noreferrer" 
                            className="bg-[#E0D6FA] hover:bg-[#CEC1F0] text-[#034B41] text-xs sm:text-sm font-black py-2.5 px-6 rounded-xl transition-all"
                          >
                            Access Resource ➔
                          </a>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center p-8 bg-[#FDFAF9] rounded-2xl border border-dashed border-gray-200">
                      <p className="text-xs sm:text-sm font-bold text-[#034B41]">No direct configuration matches</p>
                      <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">Try widening your access criteria filters on the left pane.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

         
          <div id="next-steps" className="w-full pt-8 py-6 my-4 border-t border-gray-200 flex flex-col gap-6">
            
            <div className="w-full max-w-none">
              <h3 className="font-extrabold text-base sm:text-lg text-[#034B41] flex items-center gap-2 sm:whitespace-nowrap">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                In case of crisis:
              </h3>
              <p className="text-sm sm:text-base text-[#6C768E] font-semibold leading-normal mt-1 w-full">
                If you are in an urgent crisis, we have compiled a list of immediate, confidential helplines that do not require parental permission.
              </p>
            </div>
            
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {CONDENSED_HELPLINES.map((line, lIdx) => (
                <div key={lIdx} id={lIdx === 0 ? "docs" : undefined} className="p-5 bg-white border border-purple-50 rounded-2xl flex flex-col justify-between gap-4 shadow-sm hover:border-purple-200 transition-colors">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-1.5 flex-wrap">
                      <span className="text-[9px] sm:text-xs bg-teal-50 border border-teal-100 text-[#034B41] font-extrabold px-2.5 py-1 rounded-md tracking-normal">{line.group}</span>
                    </div>
                    <h4 className="font-black text-xs sm:text-sm text-[#034B41] tracking-tight pt-0.5">{line.name}</h4>
                    <p className="text-sm sm:text-base text-slate-500 leading-relaxed font-medium">{line.desc}</p>
                  </div>
                  <div className="bg-[#FDFAF9] border border-purple-100 rounded-xl p-2.5 text-center mt-1">
                    <span className="text-[10px] sm:text-xs font-black text-red-600 tracking-tight select-all block break-words">{line.contact}</span>
                  </div>
                </div>
              ))}
            </div>

            
            <div className="w-full bg-[#F4FFFB] border border-teal-100 p-5 rounded-xl text-center shadow-sm max-w-3xl mx-auto mt-2 animate-fade-in text-xs sm:text-sm">
              <p className="font-bold text-[#3A4A60] leading-relaxed">
                Looking for support with a different situation? We have plenty of other youth-friendly resources ready for you. Explore all of your options right {' '}
                <a 
                  href="https://www.askingforafriend.org/faq?id=2a3b12a1-ecde-4b1e-b25b-7b46528d3196&search=?" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-[#097d76] underline font-black hover:text-purple-600 transition-colors"
                >
                  here
                </a>.
              </p>
            </div>
          </div>

          <div id="spacer" className="w-full h-12"></div>
        </div>
      </div>
    </div>
  );
}