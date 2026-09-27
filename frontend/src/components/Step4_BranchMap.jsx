import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Navigation, ArrowLeft, ShieldCheck, CheckCircle2, AlertTriangle, Building2, Info, Map as MapIcon, AlertOctagon } from 'lucide-react';

const customIcon = (color, pulse = false) => L.divIcon({
  className: 'custom-leaflet-icon',
  html: `
    <div style="position: relative; display: flex; justify-content: center; align-items: center;">
      ${pulse ? `<div style="position: absolute; width: 30px; height: 30px; background: ${color}; border-radius: 50%; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite; opacity: 0.7;"></div>` : ''}
      <div style="width: 20px; height: 20px; background: ${color}; border: 3px solid white; border-radius: 50%; box-shadow: 0 0 5px rgba(0,0,0,0.4); position: relative; z-index: 10;"></div>
    </div>
  `,
  iconSize: [20, 20],
  iconAnchor: [10, 10]
});

// Marker Types Requested
const greenIcon = customIcon('#10b981', true); // Green + Pulse
const blueIcon = customIcon('#3b82f6', false); // Secondary
const redIcon = customIcon('#ef4444', false); // Warning
const neutralIcon = L.divIcon({
  className: 'neutral-leaflet-icon',
  html: `<div style="width: 16px; height: 16px; border: 3px solid #64748b; border-radius: 50%; background: transparent; box-shadow: 0 0 5px rgba(0,0,0,0.3);"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8]
});

function ChangeMapView({ userCoords, currentBranch, alternatives, bypassed }) {
  const map = useMap();
  
  useEffect(() => {
    if (userCoords && currentBranch) {
      // Gather all coordinates to ensure NO bank is left off-screen
      const points = [userCoords, [currentBranch.latitude, currentBranch.longitude]];
      
      if (alternatives) {
        alternatives.forEach(alt => points.push([alt.latitude, alt.longitude]));
      }
      if (bypassed) {
        bypassed.forEach(byp => points.push([byp.latitude, byp.longitude]));
      }
      
      const bounds = L.latLngBounds(points);
      map.flyToBounds(bounds, { padding: [60, 60], duration: 1.5, maxZoom: 12 });
    }
  }, [userCoords, currentBranch, alternatives, bypassed, map]);
  
  return null;
}

export default function Step4_BranchMap({ routingResult, onBack, onSubmitApplication }) {
  const branch = routingResult?.recommended_branch || null;
  const alternatives = routingResult?.alternative_branches || [];
  const bypassed = routingResult?.bypassed_branches || [];
  const userLoc = routingResult?.user_location;

  const [selectedBranch, setSelectedBranch] = useState(branch);
  const [activeTab, setActiveTab] = useState('recommended');

  const userCoords = userLoc?.lat && userLoc?.lng ? [userLoc.lat, userLoc.lng] : [13.0827, 80.2707];
  
  const currentBranch = selectedBranch || branch;
  const activeCoords = currentBranch ? [currentBranch.latitude, currentBranch.longitude] : userCoords;

  if (!branch) {
    return (
      <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center shadow-lg animate-in fade-in zoom-in duration-500">
        <div className="mx-auto w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center mb-6">
          <AlertTriangle className="w-10 h-10 text-rose-500" />
        </div>
        <h2 className="text-3xl font-black text-primary tracking-tight mb-4">No Suitable Branches Found</h2>
        <p className="text-slate-500 mb-8 max-w-lg mx-auto text-lg font-medium">
          The routing engine could not find any branches within your radius that meet the strict MoSJE NPA and funding criteria.
        </p>
        <button onClick={onBack} className="px-6 py-3 bg-primary text-white rounded-xl font-bold uppercase tracking-wider text-base hover:bg-slate-800 transition-colors">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-slate-200/60 overflow-hidden animate-in fade-in slide-in-from-bottom-12 duration-700">
      
      {/* Header */}
      <div className="bg-primary p-8 md:p-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="relative z-10">
          <div className="inline-flex items-center space-x-2 bg-blue-500/20 text-blue-300 px-3 py-1.5 rounded-lg border border-blue-400/30 font-bold text-base mb-6 tracking-wide uppercase">
            <MapPin className="w-4 h-4" />
            <span>STEP 4 OF 4 • ROUTING</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
            Channel Partner <span className="text-amber-500">Allocation</span>
          </h2>
          <p className="mt-4 text-slate-300 text-lg md:text-xl font-medium max-w-2xl leading-relaxed">
            Your application is deterministically routed to the healthiest state partner.
          </p>
        </div>
      </div>

      <div className="p-6 sm:p-10">
        
        {/* MAP RENDERER */}
        <div className="relative rounded-2xl overflow-hidden border-2 border-slate-300 shadow-inner mb-6">
          <div className="absolute top-4 left-4 z-[400] bg-white/95 backdrop-blur px-4 py-2 rounded-xl shadow-lg border border-slate-200 flex items-center gap-2">
            <MapIcon className="w-5 h-5 text-primary" />
            <span className="text-base font-black uppercase tracking-widest text-primary">Live SIH Routing Map</span>
          </div>
          
          <div className="h-[400px] md:h-[500px] w-full z-0">
            <MapContainer center={userCoords} zoom={11} style={{ height: '100%', width: '100%' }}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <ChangeMapView userCoords={userCoords} currentBranch={currentBranch} alternatives={alternatives} bypassed={bypassed} />
              
              {/* Applicant Marker */}
              <Marker position={userCoords} icon={neutralIcon}>
                <Popup><strong className="text-slate-700">Applicant Location</strong></Popup>
              </Marker>

              {/* Primary Recommended Marker */}
              <Marker position={[currentBranch.latitude, currentBranch.longitude]} icon={greenIcon}>
                <Popup>
                  <strong className="text-emerald-700 text-lg">{currentBranch.name}</strong><br/>
                  <span className="text-emerald-600 font-bold">Primary Partner</span>
                </Popup>
              </Marker>

              {/* Alternative Branches on Map */}
              {alternatives.map((alt, i) => (
                <Marker key={`alt-${i}`} position={[alt.latitude, alt.longitude]} icon={blueIcon}>
                  <Popup>
                    <strong className="text-blue-700">{alt.name}</strong><br/>
                    <div className="text-sm mt-1">Secondary Partner</div>
                  </Popup>
                </Marker>
              ))}
              
              {/* Bypassed Branches on Map */}
              {bypassed.map((byp, i) => (
                <Marker key={`byp-${i}`} position={[byp.latitude, byp.longitude]} icon={redIcon}>
                  <Tooltip direction="top" offset={[0, -10]} opacity={1}>
                    <div className="text-rose-700 font-bold">{byp.name}</div>
                    <div className="text-xs mt-1">{byp.bypass_reason}</div>
                  </Tooltip>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>
      </div>
      
      {/* Scrutiny Card (Task 3 Requirement) */}
        <div className="mb-8">
          <div className="flex gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200 mb-6 flex-wrap">
            <button onClick={() => setActiveTab('recommended')} className={`flex-1 py-3 px-2 sm:px-4 rounded-lg font-black text-sm sm:text-base uppercase tracking-wider transition-all ${activeTab === 'recommended' ? 'bg-white text-primary shadow-sm border border-slate-200' : 'text-slate-500 hover:bg-slate-200/50'}`}>
              Primary Partner
            </button>
            <button onClick={() => setActiveTab('alternatives')} className={`flex-1 py-3 px-2 sm:px-4 rounded-lg font-black text-sm sm:text-base uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${activeTab === 'alternatives' ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-200' : 'text-slate-500 hover:bg-slate-200/50'}`}>
              <Building2 className="w-4 h-4 hidden sm:block" /> Healthy Alts ({alternatives.length})
            </button>
            <button onClick={() => setActiveTab('bypassed')} className={`flex-1 py-3 px-2 sm:px-4 rounded-lg font-black text-sm sm:text-base uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${activeTab === 'bypassed' ? 'bg-rose-50 text-rose-700 shadow-sm border border-rose-200' : 'text-slate-500 hover:bg-slate-200/50'}`}>
              <AlertOctagon className="w-4 h-4 hidden sm:block" /> Blocked NPAs ({bypassed.length})
            </button>
          </div>

          {activeTab === 'recommended' && (
            <div className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-200 shadow-inner">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-emerald-100 text-emerald-800 text-sm font-black px-2.5 py-1 rounded border border-emerald-200 uppercase">Primary Route</span>
                    <span className="bg-slate-200 text-slate-800 text-sm font-black px-2.5 py-1 rounded border border-slate-300">{currentBranch.type}</span>
                  </div>
                  <h3 className="text-2xl font-black text-primary mb-1">{currentBranch.name}</h3>
                  <p className="text-slate-600 font-medium text-base mb-4">{currentBranch.district}, {currentBranch.state}</p>
                </div>
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center border-4 border-emerald-100 shadow-sm">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                <div className="bg-white p-4 rounded-xl border border-emerald-100 shadow-sm text-center">
                  <div className="text-sm font-bold text-slate-500 uppercase">Distance</div>
                  <div className="text-xl font-black text-slate-800">{currentBranch.distance_km} km</div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-emerald-100 shadow-sm text-center">
                  <div className="text-sm font-bold text-slate-500 uppercase">NPA Rate</div>
                  <div className="text-xl font-black text-emerald-600">{currentBranch.npa_rate}%</div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-emerald-100 shadow-sm text-center">
                  <div className="text-sm font-bold text-slate-500 uppercase">Remaining Allocation</div>
                  <div className="text-xl font-black text-blue-600">Rs {currentBranch.funds_available_lakhs} L</div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-emerald-100 shadow-sm text-center">
                  <div className="text-sm font-bold text-slate-500 uppercase">Contact Officer</div>
                  <div className="text-sm font-black text-slate-800 truncate" title={currentBranch.contact_officer}>{(currentBranch.contact_officer || 'Officer').split(' ')[1] || (currentBranch.contact_officer || 'Officer')}</div>
                </div>
              </div>
              <p className="mt-4 text-sm text-slate-500 bg-white p-3 rounded border border-emerald-100">
                <strong>System Rationale:</strong> {currentBranch.routing_rationale}
              </p>
            </div>
          )}

          

          {activeTab === 'alternatives' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-start gap-3 mb-4">
                <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <p className="text-base font-medium text-blue-800">
                  These are other healthy MoSJE channel partners in your region. They meet the funding and NPA criteria but are slightly further away than the primary partner.
                </p>
              </div>
              {alternatives.map((alt, idx) => (
                <div key={idx} className="bg-white p-5 rounded-xl border border-blue-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="bg-blue-100 text-blue-800 text-xs font-black px-2 py-0.5 rounded border border-blue-200 uppercase">{alt.type}</span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-lg">{alt.name}</h4>
                    <p className="text-slate-500 text-sm font-medium">{alt.distance_km} km away | NPA: {alt.npa_rate}%</p>
                  </div>
                  <button onClick={() => { setSelectedBranch(alt); setActiveTab('recommended'); }} className="px-6 py-2.5 bg-slate-100 hover:bg-primary hover:text-white text-slate-700 font-bold uppercase tracking-wider rounded-lg transition-colors border border-slate-300 hover:border-primary">
                    Select
                  </button>
                </div>
              ))}
              {alternatives.length === 0 && <p className="text-center text-slate-500 italic p-4 border border-slate-200 rounded-xl">No other healthy alternatives found nearby.</p>}
            </div>
          )}

          {activeTab === 'bypassed' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="bg-rose-50 border border-rose-100 p-4 rounded-xl flex items-start gap-3">
                <Info className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                <p className="text-base font-medium text-rose-800">
                  Channel Partner Scrutiny: The MoSJE router explicitly blocked these partners due to statutory violations (NPA &gt; 10% or Funds Exhausted &gt; 95%).
                </p>
              </div>
              {bypassed.map((byp, idx) => (
                <div key={idx} className="bg-white p-5 rounded-xl border border-rose-200 shadow-sm flex items-center justify-between opacity-90">
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg">{byp.name}</h4>
                    <p className="text-slate-500 text-sm">{byp.distance_km} km away</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded border border-rose-100">
                      <AlertTriangle className="inline w-3 h-3 mr-1" />
                      {byp.bypass_reason}
                    </span>
                  </div>
                </div>
              ))}
              {bypassed.length === 0 && <p className="text-center text-slate-500 italic p-4 border border-slate-200 rounded-xl">No nearby partners were flagged.</p>}
            </div>
          )}
        </div>

        {/* Footer Actions */}
      <div className="bg-[#f8fafc] p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-center border-t border-slate-200 gap-4">
        <button
          onClick={onBack}
          className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-4 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-base transition-all shadow-sm order-2 sm:order-1"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
        
        <button
          onClick={() => {
            
            onSubmitApplication(selectedBranch);
          }}
          className="w-full sm:w-auto flex items-center justify-center space-x-3 px-8 py-4 rounded-xl bg-primary hover:bg-slate-800 text-white font-black text-base shadow-xl transition-all hover:-translate-y-0.5 order-1 sm:order-2"
        >
          <ShieldCheck className="w-5 h-5" />
          <span>Finalize Application Routing</span>
        </button>
      </div>

    </div>
  );
}

