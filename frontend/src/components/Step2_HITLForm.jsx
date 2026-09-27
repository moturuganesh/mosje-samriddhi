import React, { useState } from 'react';
import { MapPin, FileEdit, ArrowRight, Loader2, AlertCircle, ArrowLeft, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { evaluateScheme } from '../api';

const INDIA_LOCATIONS = {
  'Andaman and Nicobar': ['Port Blair'],
  'Andhra Pradesh': ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore', 'Tirupati'],
  'Arunachal Pradesh': ['Itanagar', 'Tawang', 'Pasighat'],
  'Assam': ['Guwahati', 'Silchar', 'Dibrugarh', 'Jorhat'],
  'Bihar': ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur'],
  'Chandigarh': ['Chandigarh'],
  'Chhattisgarh': ['Raipur', 'Bhilai', 'Bilaspur'],
  'Delhi': ['New Delhi', 'North Delhi', 'South Delhi', 'East Delhi', 'West Delhi'],
  'Goa': ['Panaji', 'Margao', 'Vasco da Gama'],
  'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Gandhinagar'],
  'Haryana': ['Gurugram', 'Faridabad', 'Panipat', 'Ambala'],
  'Himachal Pradesh': ['Shimla', 'Manali', 'Dharamshala', 'Solan'],
  'Jammu and Kashmir': ['Srinagar', 'Jammu', 'Anantnag'],
  'Jharkhand': ['Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro'],
  'Karnataka': ['Bangalore', 'Mysore', 'Hubli', 'Mangalore', 'Belgaum'],
  'Kerala': ['Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Thrissur', 'Ernakulam'],
  'Madhya Pradesh': ['Indore', 'Bhopal', 'Jabalpur', 'Gwalior'],
  'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad'],
  'Manipur': ['Imphal', 'Churachandpur'],
  'Meghalaya': ['Shillong', 'Tura'],
  'Mizoram': ['Aizawl', 'Lunglei'],
  'Nagaland': ['Kohima', 'Dimapur'],
  'Odisha': ['Bhubaneswar', 'Cuttack', 'Rourkela', 'Puri'],
  'Punjab': ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala'],
  'Rajasthan': ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Ajmer'],
  'Sikkim': ['Gangtok', 'Namchi'],
  'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Salem', 'Tiruchirappalli', 'Tirunelveli', 'Vellore', 'Erode', 'Kanchipuram', 'Chengalpattu', 'Tuticorin', 'Thanjavur', 'Dindigul'],
  'Telangana': ['Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar'],
  'Tripura': ['Agartala', 'Udaipur (TR)'],
  'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Varanasi', 'Agra', 'Allahabad', 'Noida'],
  'Uttarakhand': ['Dehradun', 'Haridwar', 'Roorkee', 'Nainital'],
  'West Bengal': ['Kolkata', 'Howrah', 'Darjeeling', 'Siliguri', 'Asansol'],
};

export default function Step2_HITLForm({ initialData, onVerified, onBack, isVoiceActive, speakText }) {
  const [formData, setFormData] = useState(initialData || {
    applicant_name: '',
    category: 'SC',
    gender: 'Female',
    annual_family_income: 150000,
    project_cost: 1500000,
    state: 'Tamil Nadu',
    district: 'Chennai',
    sector: 'Services',
    purpose: '',
    business_stage: 'Seed / Early-Stage',
    education_status: 'Not Applicable (Business Loan)',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [gpsStatus, setGpsStatus] = useState(''); // Added for GPS

  const handleGPSLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    
    setGpsStatus('Locating...');
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setFormData(prev => ({ ...prev, latitude, longitude }));
        
        try {
          // Reverse Geocoding to get State and District
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await res.json();
          if (data && data.address) {
            const state = data.address.state;
            const dist = data.address.state_district || data.address.county || data.address.city;
            if (state) setFormData(prev => ({ ...prev, state }));
            if (dist) {
              const cleanedDist = dist.replace(' District', '');
              setFormData(prev => ({ ...prev, district: cleanedDist }));
            }
            setGpsStatus('Detected! ✓');
          } else {
            setGpsStatus('GPS Found, parsing failed.');
          }
        } catch (e) {
          setGpsStatus('GPS OK (Reverse geo failed)');
        }
      },
      (error) => {
        setGpsStatus('Permission Denied');
      }
    );
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePresetCost = (amount) => {
    setFormData(prev => ({ ...prev, project_cost: amount }));
  };

  const handleEvaluate = async () => {
    setLoading(true);
    setError(null);
    if (isVoiceActive && speakText) speakText('Evaluating your profile against 25 statutory schemes.');
    try {
      const data = await evaluateScheme(formData);
      onVerified(data, formData);
      if (isVoiceActive && speakText) speakText(`You are eligible for ${data.eligible_schemes.length} schemes. Proceeding to scheme selection.`);
    } catch (err) {
      console.error(err);
      setError('Evaluation failed. Ensure all fields are filled properly and backend is running.');
      if (isVoiceActive && speakText) speakText('Evaluation encountered an error.');
    } finally {
      setLoading(false);
    }
  };

  const isIncomeEligible = formData.annual_family_income <= 500000; // Under 5.0L for schemes

  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden">
      
      {/* Official Header */}
      <div className="bg-[#0f172a] p-6 sm:p-8 flex items-start gap-4 text-white">
        <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
          <FileEdit className="w-6 h-6 text-amber-400" />
        </div>
        <div className="flex-1 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-blue-500/20 text-blue-300 font-bold text-[10px] uppercase tracking-widest border border-blue-500/30 mb-2">
              Step 2 of 4 • Human-in-the-Loop Review
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">Verify Applicant Profile</h2>
            <p className="text-slate-400 text-base mt-2 max-w-2xl">
              Please review the parameters extracted by our secure OCR system. Correct any discrepancies before the deterministic evaluation engine cross-references 25+ statutory schemes.
            </p>
          </div>
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3 flex items-center gap-3 shrink-0">
            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            <div>
              <p className="text-emerald-400 text-[10px] font-bold uppercase tracking-widest">Document Status</p>
              <p className="text-white text-base font-black">Verified Authentic</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-8 grid md:grid-cols-2 gap-8">
        
        {/* LEFT COLUMN - Demographics */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <h3 className="text-base font-black text-[#0f172a] uppercase tracking-wider">Extracted Demographics</h3>
          </div>

          <div className="space-y-2">
            <label className="text-base font-bold text-slate-500 uppercase tracking-wider">Applicant Full Name (As per Aadhaar)</label>
            <input
              type="text"
              value={formData.applicant_name ?? ''}
              onChange={(e) => handleChange('applicant_name', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 text-base font-bold focus:ring-2 focus:ring-[#0f172a] focus:border-[#0f172a] bg-slate-50 focus:bg-white transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-base font-bold text-slate-500 uppercase tracking-wider">Social Category</label>
              <select
                value={formData.category ?? 'SC'}
                onChange={(e) => handleChange('category', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-base font-bold bg-slate-50 focus:bg-white"
              >
                <option value="SC">Scheduled Caste (SC)</option>
                <option value="OBC">Other Backward Classes (OBC)</option>
                <option value="Safai Karamchari">Safai Karamchari</option>
                <option value="General">General / Others</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-base font-bold text-slate-500 uppercase tracking-wider">Gender</label>
              <select
                value={formData.gender ?? 'Female'}
                onChange={(e) => handleChange('gender', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-base font-bold bg-slate-50 focus:bg-white"
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Transgender">Transgender</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
              <label className="text-base font-bold text-slate-500 uppercase tracking-wider">State</label>
              <select
                value={formData.state ?? ''}
                onChange={(e) => { 
                  handleChange('state', e.target.value); 
                  if(INDIA_LOCATIONS[e.target.value]) {
                    handleChange('district', INDIA_LOCATIONS[e.target.value][0]); 
                  }
                }}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-base font-bold bg-slate-50 focus:bg-white"
              >
                <option value="">Select State...</option>
                {Object.keys(INDIA_LOCATIONS).map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-base font-bold text-slate-500 uppercase tracking-wider">District</label>
              <select
                value={formData.district ?? ''}
                onChange={(e) => handleChange('district', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-base font-bold bg-slate-50 focus:bg-white"
                disabled={!formData.state || !INDIA_LOCATIONS[formData.state]}
              >
                <option value="">Select District...</option>
                {formData.state && INDIA_LOCATIONS[formData.state] && INDIA_LOCATIONS[formData.state].map(dist => (
                  <option key={dist} value={dist}>{dist}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-base font-bold text-slate-500 uppercase tracking-wider">Annual Family Income (₹)</label>
              {isIncomeEligible ? (
                <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded font-black uppercase tracking-widest">Valid (≤ 5.0L)</span>
              ) : (
                <span className="text-[10px] bg-rose-100 text-rose-700 px-2 py-0.5 rounded font-black uppercase tracking-widest">Exceeds Limit</span>
              )}
            </div>
            
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
              <input
                type="number"
                value={formData.annual_family_income ?? ''}
                onChange={(e) => handleChange('annual_family_income', e.target.value === '' ? '' : Number(e.target.value))}
                className={`w-full pl-8 pr-4 py-3 rounded-xl border text-base font-bold focus:ring-2 bg-slate-50 focus:bg-white transition-all ${
                  isIncomeEligible ? 'border-slate-300 focus:ring-[#0f172a] focus:border-[#0f172a]' : 'border-rose-300 text-rose-700 focus:ring-rose-500'
                }`}
              />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN - Project Request */}
        <div className="space-y-6">
          
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <ShieldCheck className="w-4 h-4 text-amber-500" />
            <h3 className="text-base font-black text-[#0f172a] uppercase tracking-wider">Financial Requirement</h3>
          </div>

          <div className="bg-[#f8fafc] p-5 rounded-2xl border border-slate-200">
            <div className="space-y-2">
              <label className="text-base font-bold text-slate-500 uppercase tracking-wider">Proposed Project Cost (₹)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                <input
                  type="number"
                  value={formData.project_cost ?? ''}
                  onChange={(e) => handleChange('project_cost', e.target.value === '' ? '' : Number(e.target.value))}
                  className={`w-full pl-8 pr-4 py-3 rounded-xl border text-base font-bold bg-white focus:ring-2 ${
                    formData.project_cost > 5000000 ? 'border-rose-300 text-rose-900 focus:ring-rose-500' : 'border-slate-300 focus:ring-amber-500 focus:border-amber-500'
                  }`}
                />
              </div>
              
              {formData.project_cost > 5000000 && (
                <p className="text-[11px] font-bold text-rose-600 flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3 h-3" /> Project Cost exceeds maximum NSFDC Term Loan limit of ₹50.0 Lakhs.
                </p>
              )}
              
              <div className="flex flex-wrap gap-2 pt-3">
                <button type="button" onClick={() => { handlePresetCost(2000000); handleChange('education_status', 'B.Tech / Professional Degree'); }} className="text-[10px] uppercase tracking-wider font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-lg border border-emerald-200 transition-colors">
                  ₹20.0L (Education)
                </button>
                <button type="button" onClick={() => handlePresetCost(100000)} className="text-[10px] uppercase tracking-wider font-bold bg-white hover:bg-amber-50 text-slate-600 hover:text-amber-700 px-3 py-1.5 rounded-lg border border-slate-200 transition-colors">
                  ₹1.0L (Micro)
                </button>
                <button type="button" onClick={() => handlePresetCost(1500000)} className="text-[10px] uppercase tracking-wider font-bold bg-white hover:bg-blue-50 text-slate-600 hover:text-blue-700 px-3 py-1.5 rounded-lg border border-slate-200 transition-colors">
                  ₹15.0L (Term Loan)
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
             <div className="space-y-2">
              <label className="text-base font-bold text-slate-500 uppercase tracking-wider">Business Sector</label>
              <select
                value={formData.sector ?? 'Services'}
                onChange={(e) => handleChange('sector', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-base font-bold bg-slate-50 focus:bg-white"
              >
                <option value="Services">Services & Retail</option>
                <option value="Manufacturing">Manufacturing & Artisans</option>
                <option value="Agriculture">Agriculture & Allied (Dairy/Farming)</option>
                <option value="Tech">Technology & Digital</option>
                <option value="Healthcare">Healthcare & Sanitation</option>
                <option value="Transport">Transport & Logistics</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-base font-bold text-slate-500 uppercase tracking-wider">Proposed Activity / Purpose</label>
              <select
                value={formData.purpose ?? ''}
                onChange={(e) => handleChange('purpose', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-base font-bold bg-slate-50 focus:bg-white"
              >
                <option value="">Select Primary Purpose...</option>
                <option value="Retail Grocery / Kirana">Retail Grocery / Kirana</option>
                <option value="Tailoring / Textile Unit">Tailoring / Textile Unit</option>
                <option value="Agriculture / Tractor / Land">Agriculture / Tractor / Land Purchase</option>
                <option value="Sanitation / Waste Management">Sanitation / Waste Management</option>
                <option value="Auto Rickshaw / Tourist Taxi">Auto Rickshaw / Tourist Taxi</option>
                <option value="Pharmacy / Medical Clinic">Pharmacy / Medical Clinic</option>
                <option value="Green / Solar / EV">Green / Solar / Electric Vehicle (EV)</option>
                <option value="Higher Education (ELS)">Higher Education (ELS)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-base font-bold text-slate-500 uppercase tracking-wider">Business Stage</label>
              <select
                value={formData.business_stage ?? 'Seed / Early-Stage'}
                onChange={(e) => handleChange('business_stage', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-base font-bold bg-slate-50 focus:bg-white"
              >
                <option value="Ideation">Ideation / Greenfield</option>
                <option value="Seed / Early-Stage">Seed / Early-Stage</option>
                <option value="Growth / Scaling">Growth / Scaling (Expansion)</option>
              </select>
            </div>

             <div className="space-y-2">
              <label className="text-base font-bold text-slate-500 uppercase tracking-wider">Education (If ELS)</label>
              <select
                value={formData.education_status ?? 'Not Applicable (Business Loan)'}
                onChange={(e) => handleChange('education_status', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-base font-bold bg-slate-50 focus:bg-white"
              >
                <option value="Not Applicable (Business Loan)">Not Applicable</option>
                <option value="B.Tech / Professional Degree">B.Tech / Professional</option>
                <option value="Diploma / Technical Course">Diploma / Technical</option>
                <option value="Medical / MBBS">Medical / MBBS</option>
              </select>
            </div>
          </div>
        </div>

      </div>
      
      {/* Footer Actions */}
      <div className="bg-[#f8fafc] p-6 sm:p-8 flex justify-between items-center border-t border-slate-200">
        <button
          onClick={onBack}
          disabled={loading}
          className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-base transition-all shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
        
        {error && <span className="text-rose-600 text-base font-bold">{error}</span>}

        <button
          onClick={handleEvaluate}
          disabled={loading || formData.project_cost > 5000000 || !isIncomeEligible}
          className="flex items-center space-x-3 px-8 py-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-[#0f172a] font-black text-base shadow-xl shadow-amber-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Scanning 25+ Schemes...</span>
            </>
          ) : (
            <>
              <span>Evaluate Eligibility</span>
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
