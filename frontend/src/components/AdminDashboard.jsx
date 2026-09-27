import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
// Leaflet CSS in index.html
import { LayoutDashboard, Building2, RefreshCw, Filter } from 'lucide-react';
import { fetchAdminBranches, fetchAllApplications, updateApplicationStatus } from '../api';

const createNpaIcon = (category) => {
  let color = '#16a34a';
  let label = 'G';
  if (category === 'MODERATE_NPA_YELLOW') {
    color = '#eab308';
    label = 'Y';
  } else if (category === 'HIGH_NPA_RED') {
    color = '#dc2626';
    label = 'R';
  }

  return L.divIcon({
    className: 'custom-admin-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 30px;
        height: 30px;
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 2px 6px rgba(0,0,0,0.4);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 11px;
      ">
        ${label}
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
};

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL');

    const [activeTab, setActiveTab] = useState('analytics'); // 'analytics' or 'pipeline'
  const [applications, setApplications] = useState([]);
  const [loadingApps, setLoadingApps] = useState(false);

  const loadApplications = async () => {
    try {
      setLoadingApps(true);
      const appsData = await fetchAllApplications();
      setApplications(appsData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingApps(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'pipeline') {
      loadApplications();
    }
  }, [activeTab]);

  const [toastMessage, setToastMessage] = useState(null);

  const handleStatusChange = async (arn, newStatus) => {
    try {
      await updateApplicationStatus(arn, newStatus);
      setApplications(apps => apps.map(a => a.arn === arn ? { ...a, status: newStatus } : a));
      
      // Show Success Toast
      setToastMessage(`Success: Application ${arn} marked as ${newStatus}`);
      setTimeout(() => setToastMessage(null), 3000);
      
      // Also refresh the Geo-Spatial Map data to show fund deduction
      loadData();
    } catch (e) {
      alert("Failed to update status");
      loadApplications();
    }
  };
const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetchAdminBranches();
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredBranches = data?.branches?.filter((b) => {
    if (filterStatus === 'ALL') return true;
    return b.status === filterStatus;
  }) || [];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-[160px] pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 text-white p-8 rounded-3xl shadow-xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <LayoutDashboard className="w-6 h-6 text-amber-400" />
            <h2 className="text-2xl font-black">Ministry Admin Heatmap &amp; Branch Liquidity</h2>
          </div>
          <p className="text-slate-400 text-base mt-1">
            Live MoSJE / TAHDCO National Monitoring of State Channelizing Agencies (SCAs) and Bank Partners in Tamil Nadu
          </p>
        </div>

        <button
          onClick={loadData}
          disabled={loading}
          className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-base font-bold border border-slate-700 shadow-sm"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Live Data</span>
        </button>
      </div>

      
      <div className="flex border-b border-slate-300 mb-6">
        <button 
          onClick={() => setActiveTab('analytics')}
          className={`px-6 py-3 font-black text-lg ${activeTab === 'analytics' ? 'border-b-4 border-[#0f172a] text-[#0f172a]' : 'text-slate-500 hover:text-slate-800'}`}
        >
          Geo-Spatial Analytics
        </button>
        <button 
          onClick={() => setActiveTab('pipeline')}
          className={`px-6 py-3 font-black text-lg ${activeTab === 'pipeline' ? 'border-b-4 border-[#0f172a] text-[#0f172a]' : 'text-slate-500 hover:text-slate-800'}`}
        >
          Application Pipeline (Bank View)
        </button>
      </div>

      {activeTab === 'analytics' && (
        <div className="space-y-4">

      {data && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-base font-bold text-slate-500 uppercase tracking-wider block">Disbursable MoSJE Corpus</span>
            <span className="text-2xl font-black text-blue-700 mt-1 block">
              Rs {data.total_funds_available_lakhs} Lakhs
            </span>
            <span className="text-[11px] text-slate-400">Allocated across {data.total_branches} Branches</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-base font-bold text-slate-500 uppercase tracking-wider block">National Average NPA</span>
            <span className="text-2xl font-black text-amber-600 mt-1 block">
              {data.average_npa_percentage}%
            </span>
            <span className="text-[11px] text-emerald-600 font-semibold">Statutory Target: &lt;= 5.0%</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-base font-bold text-slate-500 uppercase tracking-wider block">Active Channel Partners</span>
            <span className="text-2xl font-black text-emerald-700 mt-1 block">
              {data.active_branches} Active
            </span>
            <span className="text-[11px] text-slate-400">{data.monitored_branches} under surveillance</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-base font-bold text-slate-500 uppercase tracking-wider block">Blocked / Distressed</span>
            <span className="text-2xl font-black text-rose-700 mt-1 block">
              {data.blocked_branches} Blocked
            </span>
            <span className="text-[11px] text-rose-600 font-semibold">Routing algorithm locked out</span>
          </div>
        </div>
      )}

      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-700" /> GIS NPA Traffic-Light Heatmap (Tamil Nadu)
          </h3>
          <div className="flex items-center gap-3 text-base font-bold">
            <span className="flex items-center gap-1 text-emerald-700">G: Low NPA (&lt; 4%)</span>
            <span className="flex items-center gap-1 text-amber-700">Y: Moderate (4-8%)</span>
            <span className="flex items-center gap-1 text-rose-700">R: High NPA (&gt; 8% / Blocked)</span>
          </div>
        </div>

        <div className="h-[480px] w-full rounded-2xl overflow-hidden border border-slate-300 shadow-inner">
          <MapContainer
            center={[11.1271, 78.6569]}
            zoom={7}
            scrollWheelZoom={false}
            className="h-full w-full"
          >
            <TileLayer
              attribution="&copy; OpenStreetMap"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {data?.branches?.map((b) => (
              <Marker
                key={b.id}
                position={[b.latitude, b.longitude]}
                icon={createNpaIcon(b.npa_category)}
              >
                <Popup>
                  <div className="text-base space-y-1">
                    <strong className="text-slate-900 font-bold block">{b.name}</strong>
                    <p className="text-slate-600">{b.district}, {b.state} ({b.type})</p>
                    <div className="pt-1 space-y-0.5">
                      <p>NPA: <strong className={b.npa_rate > 8 ? "text-rose-700" : "text-emerald-700"}>{b.npa_rate}%</strong></p>
                      <p>Disbursable Corpus: <strong>Rs {b.funds_available_lakhs} Lakhs</strong></p>
                      <p>Status: <span className="font-bold uppercase text-[10px]">{b.status}</span></p>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex justify-between items-center border-b border-slate-100 pb-4">
          <h3 className="text-base font-bold text-slate-900">Channel Partner Ledger &amp; Risk Classification</h3>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="text-base font-semibold bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-slate-800"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active Only</option>
              <option value="MONITORED">Monitored</option>
              <option value="BLOCKED">Blocked</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-base">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px]">
              <tr>
                <th className="p-3">Branch / SCA Name</th>
                <th className="p-3">Type</th>
                <th className="p-3">Location</th>
                <th className="p-3">Funds (Rs L)</th>
                <th className="p-3">NPA %</th>
                <th className="p-3">Liquidity</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredBranches.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50">
                  <td className="p-3 font-bold text-slate-900">{b.name}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-bold">
                      {b.type}
                    </span>
                  </td>
                  <td className="p-3">{b.district}, {b.state}</td>
                  <td className="p-3 font-bold text-blue-700">Rs {b.funds_available_lakhs}L</td>
                  <td className="p-3">
                    <span className={`font-bold ${b.npa_rate > 8 ? "text-rose-700" : "text-emerald-700"}`}>
                      {b.npa_rate}%
                    </span>
                  </td>
                  <td className="p-3">{b.funds_available_lakhs > 100 ? "High" : "Low"}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                      b.status === "ACTIVE"
                        ? "bg-emerald-100 text-emerald-800"
                        : b.status === "MONITORED"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-rose-100 text-rose-800"
                    }`}>
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      </div>
      )}

      {activeTab === 'pipeline' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                        <h3 className="text-xl font-black text-slate-900">Live Application Pipeline</h3>
            {toastMessage && (
              <div className="bg-emerald-100 text-emerald-800 px-4 py-2 rounded-lg font-bold text-sm shadow-sm animate-in slide-in-from-top-2">
                {toastMessage}
              </div>
            )}
            <button onClick={loadApplications} className="text-sm font-bold bg-slate-100 px-3 py-1.5 rounded-lg hover:bg-slate-200">Refresh Pipeline</button>
          </div>
          
          {loadingApps ? (
            <div className="text-center py-10 text-slate-500 font-bold">Loading applications...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-base">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Application ARN</th>
                    <th className="p-3">Applicant Name</th>
                    <th className="p-3">Assigned Bank / Branch</th>
                    <th className="p-3">Loan Details</th>
                    <th className="p-3">Current Status</th>
                    <th className="p-3 text-right">Simulate Bank Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {applications.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3 font-black text-blue-700">{app.arn}</td>
                      <td className="p-3 font-bold text-slate-900">{app.user?.name || 'Unknown'}</td>
                      <td className="p-3">
                        <div className="text-xs font-bold text-slate-900">{app.branch_data?.name}</div>
                        <div className="text-[10px] text-slate-500">{app.branch_data?.type} - {app.branch_data?.district}</div>
                      </td>
                      <td className="p-3">
                        <div className="text-xs font-bold text-emerald-700">Rs {app.scheme_data?.loan_amount}</div>
                        <div className="text-[10px] text-slate-500">{app.scheme_data?.scheme_name}</div>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-lg text-xs font-black uppercase ${
                          app.status.includes('Routed') ? 'bg-blue-100 text-blue-800' :
                          app.status.includes('KYC') ? 'bg-amber-100 text-amber-800' :
                          app.status.includes('Disbursed') ? 'bg-emerald-100 text-emerald-800' :
                          'bg-rose-100 text-rose-800'
                        }`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <select 
                          value={app.status}
                          onChange={(e) => handleStatusChange(app.arn, e.target.value)}
                          className="bg-slate-800 text-white font-bold text-xs px-2 py-1.5 rounded-lg focus:outline-none cursor-pointer"
                        >
                          <option value="Routed to Branch">1. Routed to Branch</option>
                          <option value="Pending Physical KYC">2. Pending Physical KYC</option>
                          <option value="Loan Approved & Disbursed">3. Loan Disbursed</option>
                          <option value="Rejected (NPA Risk)">X. Reject Application</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                  {applications.length === 0 && (
                    <tr>
                      <td colSpan="6" className="p-6 text-center text-slate-500 font-bold">No applications found in the system.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}


