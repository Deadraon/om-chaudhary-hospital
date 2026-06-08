'use client';

import { useState, useMemo } from 'react';

export default function AnalyticsClient({
  initialMonthly = [],
  initialDepartment = [],
  initialDoctorLoad = [],
  summaryStats = {},
}) {
  const [monthlyData] = useState(initialMonthly);
  const [departmentData] = useState(initialDepartment);
  const [doctorLoadData] = useState(initialDoctorLoad);

  // Formatting date range filters (local simulation)
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  // Custom Colors
  const chartColors = [
    '#0091c6', // Sarvodaya Blue
    '#10b981', // Emerald
    '#f59e0b', // Amber
    '#ec4899', // Pink
    '#6366f1', // Indigo
    '#8b5cf6', // Violet
    '#f43f5e', // Rose
  ];

  // Helper: Format YYYY-MM to readable Month
  const formatMonth = (yrMo) => {
    if (!yrMo) return 'Unknown';
    const [year, month] = yrMo.split('-');
    const date = new Date(year, parseInt(month) - 1, 1);
    return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
  };

  // 1. Calculations for Bar Chart
  const barChartMax = useMemo(() => {
    const maxVal = Math.max(...monthlyData.map(d => d.count), 0);
    return maxVal > 0 ? Math.ceil(maxVal / 5) * 5 : 10;
  }, [monthlyData]);

  // 2. Calculations for Donut Chart
  const totalDeptAppointments = useMemo(() => {
    return departmentData.reduce((acc, curr) => acc + curr.count, 0);
  }, [departmentData]);

  const donutSlices = useMemo(() => {
    let accumulatedPercent = 0;
    return departmentData.map((d, index) => {
      const percentage = totalDeptAppointments > 0 ? (d.count / totalDeptAppointments) * 100 : 0;
      const slice = {
        name: d.name,
        count: d.count,
        percent: percentage.toFixed(1),
        color: chartColors[index % chartColors.length],
        startPercent: accumulatedPercent,
      };
      accumulatedPercent += percentage;
      return slice;
    });
  }, [departmentData, totalDeptAppointments]);

  // SVG Donut slice paths calculation helpers
  const getCoordinatesForPercent = (percent) => {
    const x = Math.cos(2 * Math.PI * percent);
    const y = Math.sin(2 * Math.PI * percent);
    return [x, y];
  };

  // 3. Doctor Load max count
  const doctorLoadMax = useMemo(() => {
    return Math.max(...doctorLoadData.map(d => d.count), 1);
  }, [doctorLoadData]);

  return (
    <div className="space-y-6">
      {/* Date Range Selector */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-gray-900 text-sm">Roster Analytics Period</h3>
          <p className="text-gray-500 text-[11px] mt-0.5">Filter data visualizations based on chosen date brackets.</p>
        </div>
        <div className="flex gap-2 items-center">
          <input
            type="date"
            value={dateRange.start}
            onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
            className="input-field text-xs py-1.5 px-3 max-w-[140px]"
            aria-label="Start date"
          />
          <span className="text-gray-400 text-xs font-semibold">to</span>
          <input
            type="date"
            value={dateRange.end}
            onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
            className="input-field text-xs py-1.5 px-3 max-w-[140px]"
            aria-label="End date"
          />
          <button
            onClick={() => setDateRange({ start: '', end: '' })}
            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition-colors border border-gray-200"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Summary KPI Widgets */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center text-lg font-bold">👥</div>
          <div>
            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">Total Patients</p>
            <p className="text-xl font-black text-gray-900">{summaryStats.totalPatients}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-lg font-bold">🩺</div>
          <div>
            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">Active Staff</p>
            <p className="text-xl font-black text-gray-900">{summaryStats.totalDoctors}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg font-bold">📅</div>
          <div>
            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">Appointments</p>
            <p className="text-xl font-black text-gray-900">{summaryStats.totalAppointments}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-lg font-bold">💬</div>
          <div>
            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">Second Opinions</p>
            <p className="text-xl font-black text-gray-900">{summaryStats.totalOpinions}</p>
          </div>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Bar Chart */}
        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div className="mb-4">
            <h4 className="font-bold text-gray-800 text-sm">Monthly Booking Trend</h4>
            <p className="text-gray-500 text-[10px] font-medium mt-0.5">Summary of appointment volumes over the last 6 months.</p>
          </div>

          {monthlyData.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-xs text-gray-400 italic">No historical booking data.</div>
          ) : (
            <div className="relative h-64 w-full">
              {/* Y Axis Gridlines */}
              <div className="absolute inset-y-0 left-8 right-0 flex flex-col justify-between text-[10px] text-gray-400 font-semibold select-none">
                {[...Array(5)].map((_, idx) => {
                  const val = Math.round((barChartMax / 4) * (4 - idx));
                  return (
                    <div key={idx} className="w-full flex items-center border-b border-gray-50 h-0">
                      <span className="w-8 -ml-8 pr-2 text-right">{val}</span>
                    </div>
                  );
                })}
              </div>

              {/* Bars container */}
              <div className="absolute bottom-6 left-8 right-0 top-2 flex justify-around items-end">
                {monthlyData.map((d, index) => {
                  const heightPercent = barChartMax > 0 ? (d.count / barChartMax) * 100 : 0;
                  return (
                    <div key={d.month} className="group relative flex flex-col items-center w-full max-w-[40px]">
                      {/* Bar tooltip */}
                      <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] font-bold px-2 py-1.5 rounded-lg shadow-md whitespace-nowrap z-10">
                        {d.count} Appointments
                      </div>
                      
                      {/* Interactive Bar */}
                      <div 
                        style={{ height: `${heightPercent}%` }}
                        className="w-full bg-gradient-to-t from-primary-600 to-sky-400 rounded-t-xl hover:from-primary-700 hover:to-sky-500 transition-all duration-500 shadow-sm cursor-pointer"
                      />

                      {/* X label */}
                      <span className="absolute -bottom-6 text-[10px] text-gray-400 font-semibold whitespace-nowrap">
                        {formatMonth(d.month)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Department Ratio Donut Chart */}
        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div className="mb-4">
            <h4 className="font-bold text-gray-800 text-sm">Department Distribution</h4>
            <p className="text-gray-500 text-[10px] font-medium mt-0.5">Ratio distribution of patients across specialized departments.</p>
          </div>

          {departmentData.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-xs text-gray-400 italic">No department data.</div>
          ) : (
            <div className="flex flex-col sm:flex-row items-center gap-6 h-64">
              {/* Donut SVG */}
              <div className="relative w-40 h-40 flex-shrink-0">
                <svg className="w-full h-full -rotate-90" viewBox="-1.2 -1.2 2.4 2.4">
                  {/* Background Circle */}
                  <circle cx="0" cy="0" r="0.8" fill="none" stroke="#f1f5f9" strokeWidth="0.35" />
                  
                  {/* Slices */}
                  {donutSlices.map((slice, idx) => {
                    const startPercent = slice.startPercent / 100;
                    const endPercent = (slice.startPercent + parseFloat(slice.percent)) / 100;
                    
                    const [startX, startY] = getCoordinatesForPercent(startPercent);
                    const [endX, endY] = getCoordinatesForPercent(endPercent);
                    
                    const largeArcFlag = parseFloat(slice.percent) > 50 ? 1 : 0;
                    
                    const pathData = [
                      `M ${startX * 0.8} ${startY * 0.8}`, // Move to inner radius edge
                      `A 0.8 0.8 0 <sup>${largeArcFlag}</sup> 1 ${endX * 0.8} ${endY * 0.8}`, // Outer Arc
                      `L 0 0`, // Line to center
                      `Z`
                    ].join(' ');

                    return (
                      <path
                        key={idx}
                        d={pathData.replace(/<sup>/g, '').replace(/<\/sup>/g, '')}
                        fill={slice.color}
                        className="hover:scale-105 transition-transform origin-center cursor-pointer"
                        style={{ transformOrigin: '0px 0px' }}
                      />
                    );
                  })}
                  {/* Donut Center Cutout Hole */}
                  <circle cx="0" cy="0" r="0.55" fill="white" />
                </svg>

                {/* Inner Donut Details */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <p className="text-gray-400 text-[9px] font-bold uppercase tracking-wider">Appointments</p>
                  <p className="text-lg font-black text-slate-800">{totalDeptAppointments}</p>
                </div>
              </div>

              {/* Donut Legend */}
              <div className="flex-1 max-h-60 overflow-y-auto w-full pr-1 space-y-2">
                {donutSlices.slice(0, 5).map((slice, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: slice.color }} />
                      <span className="font-semibold text-gray-700 truncate max-w-[120px]" title={slice.name}>{slice.name}</span>
                    </div>
                    <span className="text-gray-400 font-bold">{slice.percent}%</span>
                  </div>
                ))}
                {donutSlices.length > 5 && (
                  <p className="text-[10px] text-gray-400 font-medium italic text-right">+ {donutSlices.length - 5} more departments</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Doctor Load (Horizontal Bars) */}
        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm col-span-1 lg:col-span-2">
          <div className="mb-4">
            <h4 className="font-bold text-gray-800 text-sm">Specialist Workload</h4>
            <p className="text-gray-500 text-[10px] font-medium mt-0.5">Comparison metrics of scheduled appointments per doctor roster.</p>
          </div>

          {doctorLoadData.length === 0 ? (
            <div className="py-12 text-center text-xs text-gray-400 italic">No specialist workload data.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              {doctorLoadData.slice(0, 6).map((doc, idx) => {
                const widthPercent = (doc.count / doctorLoadMax) * 100;
                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-gray-700">Dr. {doc.name}</span>
                      <span className="text-gray-500 font-bold">{doc.count} Cases</span>
                    </div>
                    <div className="w-full bg-slate-50 rounded-full h-2 overflow-hidden border border-slate-100">
                      <div
                        style={{ width: `${widthPercent}%` }}
                        className="bg-gradient-to-r from-primary-600 to-sky-400 h-full rounded-full"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
