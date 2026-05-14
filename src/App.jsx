import React, { useState } from 'react';
import { 
  ChevronRight, 
  ChevronLeft, 
  Stethoscope, 
  Pill, 
  Activity, 
  Calendar, 
  AlertCircle, 
  Hospital 
} from 'lucide-react';

const App = () => {
  // State Management
  const [step, setStep] = useState(1);
  const [service, setService] = useState(null);
  const [age, setAge] = useState('');
  const [state, setState] = useState('');
  const [weeks, setWeeks] = useState(null);
  const [hasSymptoms, setHasSymptoms] = useState(null);

  // Constants
  const STATES = ["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"];

  const services = [
    { id: 'abortion', label: 'I want an abortion', icon: <Pill className="w-6 h-6" /> },
    { id: 'sti', label: 'I want STI testing', icon: <Activity className="w-6 h-6" /> },
    { id: 'contraceptive', label: 'I want a contraceptive', icon: <Calendar className="w-6 h-6" /> },
    { id: 'pregnancy', label: 'I want to test for pregnancy', icon: <Stethoscope className="w-6 h-6" /> },
  ];

  // Navigation Logic
  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const resetFlow = () => {
    setStep(1);
    setService(null);
    setWeeks(null);
    setHasSymptoms(null);
  };

  // Rendering Helper for Results
  const renderResults = () => {
    if (service === 'abortion') {
      const isEarly = weeks <= 11;
      return (
        <div className="space-y-6">
          <div className="bg-teal-50 border-l-4 border-teal-500 p-6 rounded-r-xl">
            <h3 className="text-xl font-bold text-teal-900 mb-2 flex items-center">
              <Pill className="mr-2" /> Recommended: {isEarly ? 'Abortion Pills (Telehealth)' : 'In-Clinic Procedure'}
            </h3>
            <p className="text-teal-800 text-sm leading-relaxed">
              {isEarly 
                ? "Since you are early in your pregnancy (under 11 weeks), medication abortion is a safe, private option you can often manage from home via telehealth." 
                : "At this stage of pregnancy, a clinic visit for a procedure is the standard of care to ensure your safety and comfort."}
            </p>
            <button className="mt-4 bg-teal-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-teal-700 transition">
              Find Providers
            </button>
          </div>

          <div className="bg-white border border-gray-100 shadow-sm p-6 rounded-xl">
            <h4 className="text-lg font-bold text-gray-800 mb-4">Other Alternatives</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 border rounded-lg hover:border-purple-300 transition cursor-pointer">
                <Hospital className="text-purple-600 shrink-0" />
                <div>
                  <h5 className="font-semibold">{isEarly ? 'In-Clinic Visit' : 'Abortion Pills'}</h5>
                  <p className="text-xs text-gray-500">
                    {isEarly 
                      ? "If you prefer to be in a medical environment with provider support throughout the process."
                      : "Only available in some states and cases. Consult with a provider to see if this is still an option."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (service === 'sti') {
      const needsClinic = hasSymptoms === 'yes';
      return (
        <div className="space-y-6">
          <div className="bg-indigo-50 border-l-4 border-indigo-500 p-6 rounded-r-xl">
            <h3 className="text-xl font-bold text-indigo-900 mb-2 flex items-center">
              <Activity className="mr-2" /> Recommended: {needsClinic ? 'In-Person Clinic Visit' : 'At-Home Test Kit'}
            </h3>
            <p className="text-indigo-800 text-sm">
              {needsClinic 
                ? "Because you're experiencing symptoms, we recommend seeing a provider in person for a physical exam and immediate treatment."
                : "For routine screening without symptoms, an at-home kit is discreet, accurate, and easy to use."}
            </p>
            <button className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-full font-semibold">
              Get Started
            </button>
          </div>
          
          <div className="p-4 border rounded-xl opacity-60">
            <h4 className="font-bold text-gray-600 mb-1">Also available</h4>
            <p className="text-sm text-gray-500">
              {needsClinic ? "At-home kits (may not provide immediate treatment)" : "Walk-in clinics for comprehensive screening"}
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="text-center p-10 bg-gray-50 rounded-xl">
        <Hospital className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-bold">Standard Care Search</h3>
        <p className="text-gray-500">We are finding the best options for {service} in {state}.</p>
        <button className="mt-6 bg-purple-600 text-white px-8 py-3 rounded-full font-bold">Search Local Data</button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans text-gray-900">
      <div className="max-w-2xl w-full bg-white rounded-[2rem] shadow-2xl overflow-hidden min-h-[600px] flex flex-col">
        
        {/* Brand Header */}
        <div className="p-8 pb-4 flex justify-between items-center border-b border-gray-50">
          <div>
            <h1 className="text-2xl font-black text-purple-700 tracking-tight">ASKING FOR A FRIEND</h1>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-widest">Service Finder</p>
          </div>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className={`h-1.5 w-8 rounded-full transition-all duration-300 ${i <= step ? 'bg-purple-500' : 'bg-gray-100'}`} />
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-8 overflow-y-auto">
          
          {/* Step 1: Services */}
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-3xl font-bold mb-6 text-gray-800">What do you need help with today?</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => { setService(item.id); nextStep(); }}
                    className={`flex items-center p-5 rounded-2xl border-2 transition-all text-left ${
                      service === item.id 
                        ? 'border-purple-500 bg-purple-50 text-purple-700 shadow-md' 
                        : 'border-gray-100 hover:border-purple-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className={`p-3 rounded-xl mr-4 ${service === item.id ? 'bg-purple-500 text-white' : 'bg-gray-100'}`}>
                      {item.icon}
                    </div>
                    <span className="font-bold text-lg">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Age and State */}
          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-3xl font-bold mb-2 text-gray-800">Tell us a bit about you.</h2>
              <p className="text-gray-500 mb-8">This helps us find legally compliant care in your area.</p>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Your Age</label>
                  <input 
                    type="number" 
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="e.g. 24"
                    className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:outline-none text-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Your State</label>
                  <select 
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:outline-none text-lg appearance-none bg-white"
                  >
                    <option value="">Select State</option>
                    {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Conditional Questions (Abortion) */}
          {step === 3 && service === 'abortion' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-3xl font-bold mb-2 text-gray-800">How far along are you?</h2>
              <p className="text-gray-500 mb-8">This is calculated from the first day of your last period.</p>
              
              <div className="grid grid-cols-1 gap-3">
                {[
                  { label: 'Under 10 weeks', val: 10 },
                  { label: '11 to 15 weeks', val: 14 },
                  { label: '16 weeks or more', val: 18 }
                ].map((opt) => (
                  <button
                    key={opt.val}
                    onClick={() => { setWeeks(opt.val); nextStep(); }}
                    className="p-5 text-left border-2 border-gray-100 rounded-2xl hover:border-purple-300 hover:bg-purple-50 font-bold text-lg transition-all"
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Conditional Questions (STI) */}
          {step === 3 && service === 'sti' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300 text-center py-4">
              <AlertCircle className="w-16 h-16 text-purple-600 mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-6 text-gray-800">Are you having symptoms?</h2>
              <p className="text-gray-500 mb-8 max-w-sm mx-auto">This includes unusual itching, discharge, or pain during urination.</p>
              
              <div className="flex gap-4">
                <button 
                  onClick={() => { setHasSymptoms('yes'); nextStep(); }}
                  className="flex-1 p-5 rounded-2xl border-2 border-gray-100 hover:border-purple-500 font-black text-xl hover:bg-purple-50 transition-all"
                >
                  YES
                </button>
                <button 
                  onClick={() => { setHasSymptoms('no'); nextStep(); }}
                  className="flex-1 p-5 rounded-2xl border-2 border-gray-100 hover:border-purple-500 font-black text-xl hover:bg-purple-50 transition-all"
                >
                  NO
                </button>
              </div>
            </div>
          )}

          {/* Catch-all for other services step 3 */}
          {step === 3 && (service === 'contraceptive' || service === 'pregnancy') && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300 text-center py-10">
              <h2 className="text-3xl font-bold mb-4">Almost there!</h2>
              <p className="text-gray-500">We're preparing the most relevant {service} resources in {state}.</p>
              <button onClick={nextStep} className="mt-8 bg-purple-600 text-white px-10 py-4 rounded-full font-bold shadow-lg shadow-purple-200">View Results</button>
            </div>
          )}

          {/* Results Screen */}
          {step === 4 && (
            <div className="animate-in fade-in zoom-in-95 duration-500">
              <div className="mb-8">
                <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase">Your Recommended Care Path</span>
                <h2 className="text-3xl font-black mt-2">Here is what we found:</h2>
              </div>
              
              {renderResults()}
            </div>
          )}

        </div>

        {/* Navigation Footer */}
        <div className="p-8 border-t border-gray-50 bg-white flex justify-between items-center">
          {step > 1 ? (
            <button 
              onClick={prevStep}
              className="flex items-center text-gray-400 font-bold hover:text-purple-600 transition"
            >
              <ChevronLeft className="w-5 h-5 mr-1" /> Back
            </button>
          ) : <div />}

          {step === 2 && (
            <button 
              disabled={!age || !state}
              onClick={nextStep}
              className={`flex items-center px-8 py-3 rounded-full font-bold transition-all shadow-lg ${
                (!age || !state) 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-purple-600 text-white hover:bg-purple-700 shadow-purple-200'
              }`}
            >
              Next <ChevronRight className="w-5 h-5 ml-1" />
            </button>
          )}

          {step === 4 && (
            <button 
              onClick={resetFlow}
              className="flex items-center px-8 py-3 rounded-full font-bold text-purple-600 border-2 border-purple-100 hover:bg-purple-50"
            >
              Start Over
            </button>
          )}
        </div>
      </div>

      {/* Background Decorative Elements */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-50 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-teal-50 rounded-full blur-3xl opacity-50" />
      </div>
    </div>
  );
};

export default App;