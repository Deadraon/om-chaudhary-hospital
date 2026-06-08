'use client';

import { useState, useEffect } from 'react';
import Modal from './Modal';
import Toast from './Toast';

export default function ScheduleManagerModal({ isOpen, onClose, doctor }) {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  // New slot form state
  const [newSlot, setNewSlot] = useState({
    day_of_week: 'Monday',
    session: 'Morning',
    start_time: '09:00',
    end_time: '13:00',
  });

  useEffect(() => {
    if (isOpen && doctor) {
      fetchSchedules();
    }
  }, [isOpen, doctor]);

  const fetchSchedules = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/doctors/schedule?doctor_id=${doctor.id}`);
      if (res.ok) {
        const data = await res.json();
        setSchedules(data);
      } else {
        setToast({ message: 'Failed to fetch schedules.', type: 'error' });
      }
    } catch (err) {
      setToast({ message: 'Network error fetching schedules.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleAddLocalSlot = (e) => {
    e.preventDefault();
    
    // Check for duplicates in local state
    const isDuplicate = schedules.some(
      s => s.day_of_week === newSlot.day_of_week && s.session === newSlot.session
    );

    if (isDuplicate) {
      setToast({ message: `Slot for ${newSlot.day_of_week} (${newSlot.session}) already exists locally.`, type: 'error' });
      return;
    }

    setSchedules(prev => [...prev, { ...newSlot, id: 'temp-' + Date.now() }]);
    setToast({ message: 'Slot added to list. Remember to save changes.', type: 'success' });
  };

  const handleDeleteLocalSlot = (id) => {
    setSchedules(prev => prev.filter(s => s.id !== id));
  };

  const handleSaveSchedules = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/doctors/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          doctor_id: doctor.id,
          schedules: schedules.map(({ day_of_week, start_time, end_time, session }) => ({
            day_of_week,
            start_time,
            end_time,
            session,
          })),
        }),
      });

      if (res.ok) {
        setToast({ message: 'Doctor OPD schedule updated successfully!', type: 'success' });
        setTimeout(() => {
          onClose();
        }, 1000);
      } else {
        const data = await res.json();
        setToast({ message: data.error || 'Failed to save schedule.', type: 'error' });
      }
    } catch (err) {
      setToast({ message: 'Network error saving schedule.', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen || !doctor) return null;

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const sessions = ['Morning', 'Evening'];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`OPD Schedule Manager - Dr. ${doctor.name}`} size="lg">
      <div className="space-y-6">
        {toast && (
          <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
        )}

        {/* Existing Schedules Roster */}
        <div>
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Active Roster Slots</h4>
          {loading ? (
            <div className="py-6 text-center text-xs text-gray-500 font-medium">Loading slots...</div>
          ) : schedules.length === 0 ? (
            <div className="py-6 text-center text-xs text-gray-400 italic bg-gray-50 rounded-xl border border-dashed border-gray-200">
              No OPD sessions scheduled. Add slots below.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-48 overflow-y-auto pr-1">
              {schedules.map((slot) => (
                <div
                  key={slot.id}
                  className="flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-gray-50 shadow-sm"
                >
                  <div>
                    <p className="font-semibold text-xs text-gray-900">{slot.day_of_week}</p>
                    <p className="text-gray-500 text-[10px] font-semibold mt-0.5">
                      {slot.session} ({slot.start_time} - {slot.end_time})
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteLocalSlot(slot.id)}
                    className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                    title="Remove Slot"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <hr className="border-gray-100" />

        {/* Add New Slot Form */}
        <form onSubmit={handleAddLocalSlot} className="space-y-4 bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Add OPD Session Slot</h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label htmlFor="slot-day" className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Day</label>
              <select
                id="slot-day"
                value={newSlot.day_of_week}
                onChange={(e) => setNewSlot(prev => ({ ...prev, day_of_week: e.target.value }))}
                className="input-field text-xs py-2"
              >
                {daysOfWeek.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="slot-session" className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Session</label>
              <select
                id="slot-session"
                value={newSlot.session}
                onChange={(e) => {
                  const session = e.target.value;
                  const start_time = session === 'Morning' ? '09:00' : '17:00';
                  const end_time = session === 'Morning' ? '13:00' : '20:00';
                  setNewSlot(prev => ({ ...prev, session, start_time, end_time }));
                }}
                className="input-field text-xs py-2"
              >
                {sessions.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="slot-start" className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Start Time</label>
              <input
                id="slot-start"
                type="text"
                value={newSlot.start_time}
                onChange={(e) => setNewSlot(prev => ({ ...prev, start_time: e.target.value }))}
                placeholder="09:00"
                className="input-field text-xs py-2"
                required
              />
            </div>

            <div>
              <label htmlFor="slot-end" className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">End Time</label>
              <input
                id="slot-end"
                type="text"
                value={newSlot.end_time}
                onChange={(e) => setNewSlot(prev => ({ ...prev, end_time: e.target.value }))}
                placeholder="13:00"
                className="input-field text-xs py-2"
                required
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-bold transition-all shadow-sm"
            >
              + Add Slot to List
            </button>
          </div>
        </form>

        {/* Modal Controls */}
        <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-250 text-gray-750 text-xs font-semibold rounded-xl hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveSchedules}
            disabled={saving}
            className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-semibold hover:shadow transition-all disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Roster Changes'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
