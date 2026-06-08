'use client';

import { useState, useMemo } from 'react';
import Modal from '@/components/Modal';
import Toast from '@/components/Toast';

export default function InventoryClient({ initialBeds = [] }) {
  const [beds, setBeds] = useState(initialBeds);
  const [toast, setToast] = useState(null);
  const [updating, setUpdating] = useState(false);

  // Filter state
  const [activeWard, setActiveWard] = useState('All');

  // Modal control states
  const [selectedBed, setSelectedBed] = useState(null); // { id, ward_name, bed_number, status, patient_name, admitted_at }
  const [patientNameInput, setPatientNameInput] = useState('');

  // 1. KPI Counts
  const kpis = useMemo(() => {
    const total = beds.length;
    const occupied = beds.filter(b => b.status === 'Occupied').length;
    const vacant = total - occupied;
    const rate = total > 0 ? ((occupied / total) * 100).toFixed(0) : 0;
    return { total, occupied, vacant, rate };
  }, [beds]);

  // 2. Filtered list of beds
  const filteredBeds = useMemo(() => {
    if (activeWard === 'All') return beds;
    return beds.filter(b => b.ward_name === activeWard);
  }, [beds, activeWard]);

  // 3. Unique Wards list
  const wards = useMemo(() => {
    const unique = new Set(beds.map(b => b.ward_name));
    return ['All', ...Array.from(unique)];
  }, [beds]);

  // 4. Update status in D1
  const handleBedUpdate = async (newStatus) => {
    if (!selectedBed) return;
    setUpdating(true);
    try {
      const res = await fetch('/api/admin/inventory/beds', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedBed.id,
          status: newStatus,
          patient_name: newStatus === 'Occupied' ? patientNameInput : null,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setBeds(prev =>
          prev.map(b => (b.id === selectedBed.id ? { ...b, status: newStatus, patient_name: data.patient_name, admitted_at: data.admitted_at } : b))
        );
        setToast({
          message: newStatus === 'Occupied'
            ? `Bed ${selectedBed.bed_number} allocated to ${data.patient_name} successfully.`
            : `Bed ${selectedBed.bed_number} is now vacant. Patient discharged.`,
          type: 'success',
        });
        setSelectedBed(null);
        setPatientNameInput('');
      } else {
        setToast({ message: data.error || 'Failed to update bed allocation.', type: 'error' });
      }
    } catch (err) {
      setToast({ message: 'Network error. Please try again.', type: 'error' });
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}

      {/* KPI stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">Total Beds</p>
            <p className="text-2xl font-black text-slate-800">{kpis.total}</p>
          </div>
          <span className="text-xl">🛏️</span>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">Occupied</p>
            <p className="text-2xl font-black text-rose-600">{kpis.occupied}</p>
          </div>
          <span className="text-xl">🔴</span>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">Vacant</p>
            <p className="text-2xl font-black text-emerald-600">{kpis.vacant}</p>
          </div>
          <span className="text-xl">🟢</span>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">Occupancy Rate</p>
            <p className="text-2xl font-black text-indigo-600">{kpis.rate}%</p>
          </div>
          <span className="text-xl">📊</span>
        </div>
      </div>

      {/* Operation Theatre Status Tracker */}
      <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
        <div className="mb-4">
          <h3 className="font-bold text-gray-800 text-sm">Operation Theatre (OT) Live Status</h3>
          <p className="text-gray-500 text-[10px] font-medium mt-0.5">Real-time status metrics of surgical theatre suites.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl border border-amber-200 bg-amber-50/45 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] bg-amber-100 text-amber-700 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">In Use</span>
              <h4 className="font-bold text-xs text-gray-900 mt-1">Surgical Suite OT-1</h4>
              <p className="text-gray-500 text-[10px] font-semibold">CABG (Heart Surgery) • Surgeon: Dr. Amit Rawat</p>
            </div>
            <span className="text-2xl animate-pulse">😷</span>
          </div>

          <div className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50/45 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Ready / Idle</span>
              <h4 className="font-bold text-xs text-gray-900 mt-1">Surgical Suite OT-2</h4>
              <p className="text-gray-500 text-[10px] font-semibold">Sanitized & Sterile • Ready for next roster assignment</p>
            </div>
            <span className="text-2xl">🟢</span>
          </div>
        </div>
      </div>

      {/* Wards & Bed Grid */}
      <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-6">
        {/* Tab Selectors */}
        <div className="flex flex-wrap gap-2 border-b border-gray-100 pb-4">
          {wards.map(w => (
            <button
              key={w}
              onClick={() => setActiveWard(w)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeWard === w
                  ? 'bg-[#0a303f] text-white shadow'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {w}
            </button>
          ))}
        </div>

        {/* Visual Bed Map Grid */}
        {filteredBeds.length === 0 ? (
          <p className="text-center text-xs text-gray-400 italic py-10">No beds configured for this ward classification.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
            {filteredBeds.map(bed => {
              const isOccupied = bed.status === 'Occupied';
              return (
                <div
                  key={bed.id}
                  onClick={() => setSelectedBed(bed)}
                  className={`p-3 rounded-2xl border flex flex-col justify-between items-center text-center cursor-pointer transition-all hover:scale-102 hover:shadow-md select-none group relative ${
                    isOccupied
                      ? 'bg-rose-50 border-rose-200 hover:bg-rose-100 text-rose-800'
                      : 'bg-emerald-50 border-emerald-200 hover:bg-emerald-100 text-emerald-800'
                  }`}
                >
                  <span className="text-lg">🛏️</span>
                  <p className="font-bold text-[10px] mt-1.5 uppercase tracking-wide">{bed.bed_number}</p>
                  <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full mt-1.5 border ${
                    isOccupied ? 'bg-rose-100 text-rose-700 border-rose-200' : 'bg-emerald-100 text-emerald-700 border-emerald-200'
                  }`}>
                    {bed.status}
                  </span>

                  {/* Hover tooltip for occupied beds */}
                  {isOccupied && bed.patient_name && (
                    <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[9px] font-semibold px-2 py-1.5 rounded-lg shadow-md whitespace-nowrap z-10 pointer-events-none">
                      <p className="font-bold">Pat: {bed.patient_name}</p>
                      <p className="text-[7px] text-gray-400 mt-0.5">Admit: {new Date(bed.admitted_at).toLocaleDateString()}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Bed Assignment / Vacation Modal */}
      {selectedBed && (
        <Modal
          isOpen={true}
          onClose={() => {
            setSelectedBed(null);
            setPatientNameInput('');
          }}
          title={`${selectedBed.status === 'Occupied' ? 'Discharge Patient' : 'Allocate Bed'} - ${selectedBed.bed_number} (${selectedBed.ward_name})`}
        >
          {selectedBed.status === 'Occupied' ? (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 text-xs text-gray-600 space-y-2">
                <p><span className="font-bold text-gray-800">Current Occupant:</span> {selectedBed.patient_name}</p>
                <p><span className="font-bold text-gray-800">Admission Date:</span> {new Date(selectedBed.admitted_at).toLocaleDateString(undefined, { dateStyle: 'medium' })}</p>
              </div>
              <p className="text-xs text-gray-500 font-semibold">Discharging this patient will vacate the bed and mark it ready for future bookings. Do you wish to proceed?</p>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setSelectedBed(null)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-xs font-semibold hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleBedUpdate('Vacant')}
                  disabled={updating}
                  className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-semibold hover:bg-rose-700 transition-colors"
                >
                  {updating ? 'Discharging...' : 'Discharge Patient'}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label htmlFor="bed-patient" className="input-label">Patient Full Name *</label>
                <input
                  id="bed-patient"
                  type="text"
                  value={patientNameInput}
                  onChange={(e) => setPatientNameInput(e.target.value)}
                  placeholder="Enter patient name..."
                  className="input-field text-xs py-2"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setSelectedBed(null)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-xs font-semibold hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleBedUpdate('Occupied')}
                  disabled={updating || !patientNameInput}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50"
                >
                  {updating ? 'Assigning...' : 'Assign Bed'}
                </button>
              </div>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}
