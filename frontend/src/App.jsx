import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Step1_Ingestion from './components/Step1_Ingestion';
import Step2_HITLForm from './components/Step2_HITLForm';
import SchemeExplorer from './components/SchemeExplorer';
import SchemeDirectory from './components/SchemeDirectory';
import Step3_SchemeMoratorium from './components/Step3_SchemeMoratorium';
import Step4_BranchMap from './components/Step4_BranchMap';
import TextChatDrawer from './components/TextChatDrawer';
import AudioKiosk from './components/AudioKiosk';
import AuthModal from './components/AuthModal';
import SanctionDocketModal from './components/SanctionDocketModal';
import CitizenDashboard from './components/CitizenDashboard';
import AdminDashboard from './components/AdminDashboard';
import LandingPage from './pages/LandingPage';
import { routeBranch, submitApplication } from './api';

export default function App() {
  
const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStep, setSubmitStep] = useState(0);
  const [formData, setFormData] = useState(null);
  const [evaluationResult, setEvaluationResult] = useState(null);
  const [emiResult, setEmiResult] = useState(null);
  const [routingResult, setRoutingResult] = useState(null);
  
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isAudioKioskOpen, setIsAudioKioskOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [pendingBranch, setPendingBranch] = useState(null);
  const [showDocketModal, setShowDocketModal] = useState(false);
  const [submittedApplication, setSubmittedApplication] = useState(null);
  const [currentView, setCurrentView] = useState('landing'); // 'landing', 'flow', or 'dashboard'
  const [showDirectory, setShowDirectory] = useState(false);
  const [toast, setToast] = useState(null);
  const [docketData, setDocketData] = useState(null);
  
  const showToast = ({type, message}) => {
    setToast({type, message});
    setTimeout(() => setToast(null), 4000);
  };
  
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (window.refreshTranslation) {
      // Delay slightly to ensure React has fully mounted the new DOM nodes
      setTimeout(() => window.refreshTranslation(), 50);
    }
  }, [step, currentView]);


  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('mosje_token');
    const storedUser = localStorage.getItem('mosje_user');
    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('mosje_token');
        localStorage.removeItem('mosje_user');
      }
    }
  }, []);

  const handleAuthSuccess = (data) => {
    localStorage.setItem('mosje_token', data.access_token);
    localStorage.setItem('mosje_user', JSON.stringify(data.user));
    setUser(data.user);
    
    // If they were on the landing page and trying to start the flow
    if (currentView === 'landing') {
      setStep(1);
      setCurrentView('flow');
    } else if (step === 5) {
      // Fallback if they somehow got to the end without logging in
      handleFinalSubmit(null, data.user);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('mosje_token');
    localStorage.removeItem('mosje_user');
    setUser(null);
    setCurrentView('landing');
  };

  const handleStartApply = () => {
    if (!user) {
      setIsAuthModalOpen(true);
    } else {
      setStep(1);
      setCurrentView('flow');
    }
  };

  const handleDocumentScanned = (data) => {
    setFormData(data);
    setStep(2);
  };


  // Coordinates mapping for accurate dynamic TN district routing
  const districtCoords = {
  // Andaman and Nicobar
  'Port Blair': { lat: 11.6234, lon: 92.7265 },
  // Andhra Pradesh
  'Visakhapatnam': { lat: 17.6868, lon: 83.2185 },
  'Vijayawada': { lat: 16.5062, lon: 80.648 },
  'Guntur': { lat: 16.3067, lon: 80.4365 },
  'Nellore': { lat: 14.4426, lon: 79.9865 },
  'Tirupati': { lat: 13.6288, lon: 79.4192 },
  // Arunachal Pradesh
  'Itanagar': { lat: 27.0844, lon: 93.6053 },
  'Tawang': { lat: 27.5861, lon: 91.869 },
  'Pasighat': { lat: 28.0619, lon: 95.3259 },
  // Assam
  'Guwahati': { lat: 26.1445, lon: 91.7362 },
  'Silchar': { lat: 24.8333, lon: 92.7789 },
  'Dibrugarh': { lat: 27.4728, lon: 94.912 },
  'Jorhat': { lat: 26.7509, lon: 94.2037 },
  // Bihar
  'Patna': { lat: 25.5941, lon: 85.1376 },
  'Gaya': { lat: 24.7914, lon: 85.0002 },
  'Bhagalpur': { lat: 25.2425, lon: 87.0169 },
  'Muzaffarpur': { lat: 26.1197, lon: 85.391 },
  // Chandigarh
  'Chandigarh': { lat: 30.7333, lon: 76.7794 },
  // Chhattisgarh
  'Raipur': { lat: 21.2514, lon: 81.6296 },
  'Bhilai': { lat: 21.1938, lon: 81.3509 },
  'Bilaspur': { lat: 22.0797, lon: 82.1409 },
  // Delhi
  'New Delhi': { lat: 28.6139, lon: 77.209 },
  'North Delhi': { lat: 28.6758, lon: 77.1352 },
  'South Delhi': { lat: 28.4817, lon: 77.193 },
  'East Delhi': { lat: 28.62, lon: 77.3 },
  'West Delhi': { lat: 28.6638, lon: 77.0679 },
  // Goa
  'Panaji': { lat: 15.4909, lon: 73.8278 },
  'Margao': { lat: 15.2736, lon: 73.958 },
  'Vasco da Gama': { lat: 15.3945, lon: 73.8111 },
  // Gujarat
  'Ahmedabad': { lat: 23.0225, lon: 72.5714 },
  'Surat': { lat: 21.1702, lon: 72.8311 },
  'Vadodara': { lat: 22.3072, lon: 73.1812 },
  'Rajkot': { lat: 22.3039, lon: 70.8022 },
  'Gandhinagar': { lat: 23.2156, lon: 72.6369 },
  // Haryana
  'Gurugram': { lat: 28.4595, lon: 77.0266 },
  'Faridabad': { lat: 28.4089, lon: 77.3178 },
  'Panipat': { lat: 29.3909, lon: 76.9635 },
  'Ambala': { lat: 30.3782, lon: 76.7767 },
  // Himachal Pradesh
  'Shimla': { lat: 31.1048, lon: 77.1734 },
  'Manali': { lat: 32.2396, lon: 77.1887 },
  'Dharamshala': { lat: 32.219, lon: 76.3234 },
  'Solan': { lat: 30.9084, lon: 77.0999 },
  // Jammu and Kashmir
  'Srinagar': { lat: 34.0837, lon: 74.7973 },
  'Jammu': { lat: 32.7266, lon: 74.857 },
  'Anantnag': { lat: 33.7311, lon: 75.1487 },
  // Jharkhand
  'Ranchi': { lat: 23.3441, lon: 85.3096 },
  'Jamshedpur': { lat: 22.8046, lon: 86.2029 },
  'Dhanbad': { lat: 23.7957, lon: 86.4304 },
  'Bokaro': { lat: 23.6693, lon: 86.1511 },
  // Karnataka
  'Bangalore': { lat: 12.9716, lon: 77.5946 },
  'Mysore': { lat: 12.2958, lon: 76.6394 },
  'Hubli': { lat: 15.3647, lon: 75.124 },
  'Mangalore': { lat: 12.9141, lon: 74.856 },
  'Belgaum': { lat: 15.8497, lon: 74.4977 },
  // Kerala
  'Thiruvananthapuram': { lat: 8.5241, lon: 76.9366 },
  'Kochi': { lat: 9.9312, lon: 76.2673 },
  'Kozhikode': { lat: 11.2588, lon: 75.7804 },
  'Thrissur': { lat: 10.5276, lon: 76.2144 },
  'Ernakulam': { lat: 9.9816, lon: 76.2999 },
  // Madhya Pradesh
  'Indore': { lat: 22.7196, lon: 75.8577 },
  'Bhopal': { lat: 23.2599, lon: 77.4126 },
  'Jabalpur': { lat: 23.1815, lon: 79.9864 },
  'Gwalior': { lat: 26.2183, lon: 78.1828 },
  // Maharashtra
  'Mumbai': { lat: 19.076, lon: 72.8777 },
  'Pune': { lat: 18.5204, lon: 73.8567 },
  'Nagpur': { lat: 21.1458, lon: 79.0882 },
  'Nashik': { lat: 20.011, lon: 73.7903 },
  'Aurangabad': { lat: 19.8762, lon: 75.3433 },
  // Manipur
  'Imphal': { lat: 24.817, lon: 93.9368 },
  'Churachandpur': { lat: 24.3312, lon: 93.6841 },
  // Meghalaya
  'Shillong': { lat: 25.5788, lon: 91.8933 },
  'Tura': { lat: 25.5135, lon: 90.2036 },
  // Mizoram
  'Aizawl': { lat: 23.7271, lon: 92.7176 },
  'Lunglei': { lat: 22.8841, lon: 92.741 },
  // Nagaland
  'Kohima': { lat: 25.6751, lon: 94.1086 },
  'Dimapur': { lat: 25.9069, lon: 93.7269 },
  // Odisha
  'Bhubaneswar': { lat: 20.2961, lon: 85.8245 },
  'Cuttack': { lat: 20.4625, lon: 85.883 },
  'Rourkela': { lat: 22.2604, lon: 84.8536 },
  'Puri': { lat: 19.8135, lon: 85.8312 },
  // Punjab
  'Ludhiana': { lat: 30.901, lon: 75.8573 },
  'Amritsar': { lat: 31.634, lon: 74.8723 },
  'Jalandhar': { lat: 31.326, lon: 75.5762 },
  'Patiala': { lat: 30.3398, lon: 76.3869 },
  // Rajasthan
  'Jaipur': { lat: 26.9124, lon: 75.7873 },
  'Jodhpur': { lat: 26.2389, lon: 73.0243 },
  'Udaipur': { lat: 24.5854, lon: 73.7125 },
  'Kota': { lat: 25.2138, lon: 75.8648 },
  'Ajmer': { lat: 26.4499, lon: 74.6399 },
  // Sikkim
  'Gangtok': { lat: 27.3314, lon: 88.6138 },
  'Namchi': { lat: 27.1685, lon: 88.3615 },
  // Tamil Nadu
  'Chennai': { lat: 13.0827, lon: 80.2707 },
  'Coimbatore': { lat: 11.0168, lon: 76.9558 },
  'Madurai': { lat: 9.9252, lon: 78.1198 },
  'Salem': { lat: 11.6643, lon: 78.146 },
  'Tiruchirappalli': { lat: 10.7905, lon: 78.7047 },
  'Tirunelveli': { lat: 8.7139, lon: 77.7567 },
  'Vellore': { lat: 12.9165, lon: 79.1325 },
  'Erode': { lat: 11.341, lon: 77.7172 },
  'Kanchipuram': { lat: 12.8342, lon: 79.7036 },
  'Chengalpattu': { lat: 12.692, lon: 79.985 },
  'Tuticorin': { lat: 8.7642, lon: 78.1348 },
  'Thanjavur': { lat: 10.787, lon: 79.1378 },
  'Dindigul': { lat: 10.3673, lon: 77.9803 },
  // Telangana
  'Hyderabad': { lat: 17.385, lon: 78.4867 },
  'Warangal': { lat: 17.9689, lon: 79.5941 },
  'Nizamabad': { lat: 18.6705, lon: 78.0932 },
  'Karimnagar': { lat: 18.4386, lon: 79.1288 },
  // Tripura
  'Agartala': { lat: 23.8315, lon: 91.2868 },
  'Udaipur (TR)': { lat: 23.535, lon: 91.482 },
  // Uttar Pradesh
  'Lucknow': { lat: 26.8467, lon: 80.9462 },
  'Kanpur': { lat: 26.4499, lon: 80.3319 },
  'Varanasi': { lat: 25.3176, lon: 82.9739 },
  'Agra': { lat: 27.1767, lon: 78.0081 },
  'Allahabad': { lat: 25.4358, lon: 81.8463 },
  'Noida': { lat: 28.5355, lon: 77.391 },
  // Uttarakhand
  'Dehradun': { lat: 30.3165, lon: 78.0322 },
  'Haridwar': { lat: 29.9457, lon: 78.1642 },
  'Roorkee': { lat: 29.8543, lon: 77.888 },
  'Nainital': { lat: 29.3919, lon: 79.4542 },
  // West Bengal
  'Kolkata': { lat: 22.5726, lon: 88.3639 },
  'Howrah': { lat: 22.5958, lon: 88.2636 },
  'Darjeeling': { lat: 27.041, lon: 88.2663 },
  'Siliguri': { lat: 26.7271, lon: 88.3953 },
  'Asansol': { lat: 23.6739, lon: 86.9524 },
};

  const handleFormVerified = (evalResult, updatedFormData) => {
    setEvaluationResult(evalResult);
    if (updatedFormData) {
      setFormData(updatedFormData);
    }
    setStep(3);
  };

  const handleEmiCalculated = async (emiData, originalProfile) => {
    setEmiResult(emiData);
    try {
      const userDistrict = originalProfile?.district || 'Chengalpattu';
      let coords = districtCoords[userDistrict];
        
        // HIGHEST PRIORITY: Exact HTML5 Live Geolocation captured in Step 2
        if (originalProfile?.latitude && originalProfile?.longitude) {
          coords = { lat: originalProfile.latitude, lon: originalProfile.longitude };
        } else if (!coords) {
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(userDistrict + ', ' + (originalProfile?.state || 'India'))}`);
          const data = await res.json();
          if (data && data.length > 0) {
            coords = { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
          } else {
            coords = { lat: 20.5937, lon: 78.9629 }; // Center of India fallback
          }
        } catch(e) {
          coords = { lat: 20.5937, lon: 78.9629 };
        }
      }

      const result = await routeBranch({
        user_lat: coords.lat,
        user_lng: coords.lon,
        district: userDistrict,
        state: originalProfile?.state || 'Tamil Nadu',
        loan_amount: emiData.loan_amount,
        scheme_name: emiData.scheme_name || (evaluationResult?.primary_recommended_scheme?.scheme_name)
      });
      setRoutingResult(result);
      setStep(5);
    } catch (error) {
      console.error("Routing error:", error);
      showToast({type: 'error', message: "Error finding branch. Please try again."});
    }
  };

  const handleFinalSubmit = async (branchSelection = null, loggedInUser = user) => {
    if (!loggedInUser) {
      setPendingBranch(branchSelection); // Save their choice before modal
      setIsAuthModalOpen(true);
      return;
    }

    setIsSubmitting(true);
    setSubmitStep(1); // Encrypting

    try {
      const payload = {
        scheme_data: emiResult?.selected_scheme_data || evaluationResult?.primary_recommended_scheme || {},
        branch_data: branchSelection || routingResult?.recommended_branch || {},
        sri_score: routingResult?.recommended_sri || 0,
      };
      
      // Simulate enterprise processing steps for visual polish
      await new Promise(r => setTimeout(r, 800));
      setSubmitStep(2); // Transmitting
      
      await new Promise(r => setTimeout(r, 1200));
      const res = await submitApplication(payload);
      
      setSubmitStep(3); // Success
      await new Promise(r => setTimeout(r, 1500));

      setIsSubmitting(false);
      setStep(1);
      setCurrentView('dashboard');
      
      // Force refresh translation if they are in Hindi
      if (window.refreshTranslation) setTimeout(() => window.refreshTranslation(), 100);
      
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
      showToast({type: 'error', message: "Error: " + (err.response?.data?.detail || err.message || "Failed")});
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {toast && (
        <div className={`fixed top-24 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded-xl shadow-lg border text-white font-bold animate-in slide-in-from-top-4 fade-in duration-300 ${toast.type === 'error' ? 'bg-red-600 border-red-700 toast-error' : 'bg-emerald-600 border-emerald-700 toast-success'}`}>
          {toast.message}
        </div>
      )}
      <Navbar 
        onOpenChat={() => setIsChatOpen(true)} 
        onOpenAudioKiosk={() => setIsAudioKioskOpen(true)} 
        onBrowseDirectory={() => setShowDirectory(true)}
        user={user}
        onLoginClick={() => setIsAuthModalOpen(true)}
        onLogoutClick={handleLogout}
        onDashboardClick={() => setCurrentView('dashboard')}
        onAdminClick={() => setCurrentView('admin')}
        onHomeClick={() => setCurrentView('landing')}
      />
      
      <main id="main-content" tabIndex="-1" className="outline-none scroll-mt-24">
        {currentView === 'landing' ? (
        <LandingPage 
          onStartApply={handleStartApply} 
          onBrowseDirectory={() => setShowDirectory(true)} 
        />
      ) : currentView === 'admin' ? (
        <AdminDashboard />
      ) : currentView === 'dashboard' ? (
        <CitizenDashboard user={user} onViewDocket={(data) => { setDocketData(data); setShowDocketModal(true); }} />
      ) : (
        <main className="max-w-4xl mx-auto pt-32 md:pt-36 lg:pt-40 pb-12 px-2 sm:px-4 sm:px-6">
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-black text-primary tracking-tight mb-3">
              Apply for MoSJE Loan
            </h1>
            <p className="text-slate-500 font-medium text-lg">
              Upload your certificate and get matched with zero-hallucination schemes.
            </p>
          </div>

          <div className="mb-12 relative px-2 sm:px-4">
            <div className="absolute top-5 left-7 sm:left-10 right-7 sm:right-10 h-1.5 bg-slate-200 -z-10 -translate-y-1/2 rounded-full"></div>
            <div className={`absolute top-5 left-7 sm:left-10 h-1.5 bg-primary -z-10 -translate-y-1/2 rounded-full transition-all duration-700 ease-out`} style={{ width: `calc(${((step - 1) / 4) * 100}% - 40px)` }}></div>
            
            <div className="flex justify-between items-start">
              {[
                { num: 1, label: 'Digital KYC' },
                { num: 2, label: 'Verify' },
                { num: 3, label: 'Schemes' },
                { num: 4, label: 'EMI Calc' },
                { num: 5, label: 'Route' }
              ].map((s) => (
                <div key={s.num} className="flex flex-col items-center w-14 sm:w-20">
                  <div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-black border-4 transition-all duration-500 ${
                      step >= s.num 
                        ? 'bg-primary border-white text-white shadow-lg shadow-slate-900/20' 
                        : 'bg-slate-100 border-white text-slate-400'
                    }`}
                  >
                    {step > s.num ? '✓' : s.num}
                  </div>
                  <span className={`text-xs font-bold mt-2 ${step >= s.num ? 'text-primary' : 'text-slate-400'}`}>
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {step === 1 && <Step1_Ingestion onComplete={handleDocumentScanned} />}
          {step === 2 && <Step2_HITLForm initialData={formData} onVerified={handleFormVerified} onBack={() => setStep(1)} />}
          {step === 3 && <SchemeExplorer evaluationResult={evaluationResult} onSelectScheme={(scheme) => { setEvaluationResult({...evaluationResult, primary_recommended_scheme: scheme}); setStep(4); }} />}
          {step === 4 && <Step3_SchemeMoratorium evaluationResult={evaluationResult} onComplete={(emi) => handleEmiCalculated(emi, formData)} onBack={() => setStep(3)} />}
          {step === 5 && <Step4_BranchMap routingResult={routingResult} onBack={() => setStep(4)} onSubmitApplication={(b) => handleFinalSubmit(b)} />}
        </main>
      )}
      </main>

      <TextChatDrawer 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
        formData={formData}
        evaluationResult={evaluationResult}
        emiResult={emiResult}
        assignedBranch={routingResult?.recommended_branch}
      />

      <AudioKiosk
        isOpen={isAudioKioskOpen}
        onClose={() => setIsAudioKioskOpen(false)}
        formData={formData}
        evaluationResult={evaluationResult}
        emiResult={emiResult}
        assignedBranch={routingResult?.recommended_branch}
      />

      

      
      {isSubmitting && (
        <div className="fixed inset-0 z-[100] bg-slate-900/90 backdrop-blur-md flex flex-col items-center justify-center text-white p-4 animate-in fade-in duration-300">
          <div className="bg-slate-800 rounded-3xl p-8 max-w-sm w-full border border-slate-700 shadow-2xl flex flex-col items-center text-center">
            
            <div className="relative w-24 h-24 mb-6">
              <div className="absolute inset-0 border-4 border-slate-700 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-amber-400 rounded-full border-t-transparent animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-black text-amber-400">{submitStep > 0 ? submitStep : 1}/3</span>
              </div>
            </div>
            
            <h3 className="text-2xl font-black mb-2 tracking-tight">Processing Docket</h3>
            
            <div className="space-y-3 w-full mt-4 text-left">
              <div className={`flex items-center gap-3 transition-opacity duration-300 ${submitStep >= 1 ? 'opacity-100' : 'opacity-30'}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${submitStep > 1 ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`}>
                  {submitStep > 1 && <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                </div>
                <span className="font-bold text-sm">Encrypting Beneficiary Data</span>
              </div>
              
              <div className={`flex items-center gap-3 transition-opacity duration-300 ${submitStep >= 2 ? 'opacity-100' : 'opacity-30'}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${submitStep > 2 ? 'bg-emerald-500' : (submitStep === 2 ? 'bg-amber-500 animate-pulse' : 'bg-slate-700')}`}>
                  {submitStep > 2 && <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                </div>
                <span className="font-bold text-sm">Transmitting to {routingResult?.recommended_branch?.type || 'Bank'} Gateway</span>
              </div>
              
              <div className={`flex items-center gap-3 transition-opacity duration-300 ${submitStep >= 3 ? 'opacity-100' : 'opacity-30'}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${submitStep === 3 ? 'bg-emerald-500 animate-bounce' : 'bg-slate-700'}`}>
                  {submitStep === 3 && <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                </div>
                <span className="font-bold text-sm">Generating MoSJE Sanction</span>
              </div>
            </div>
            
          </div>
        </div>
      )}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />
      <SanctionDocketModal
        isOpen={showDocketModal}
        onClose={() => setShowDocketModal(false)}
        docketData={docketData}
      />
      {showDirectory && <SchemeDirectory onClose={() => setShowDirectory(false)} />}
    </div>
  );
}

