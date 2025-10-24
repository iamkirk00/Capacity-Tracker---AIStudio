import React from 'react';
import { CheckIn } from '../types.ts';

interface LogListProps {
  checkIns: CheckIn[];
}

const LogItem: React.FC<{ checkIn: CheckIn }> = ({ checkIn }) => {
  const { timestamp, capacity, journal, overallCapacity, type } = checkIn;
  const time = new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const typeStyles = {
    normal: { icon: '●', color: 'text-slate-500' },
    increase: { icon: '▲', color: 'text-emerald-500' },
    drop: { icon: '▼', color: 'text-blue-500' },
  };

  const { icon, color } = typeStyles[type];

  return (
    <li className="flex flex-col p-4 space-y-2 border-b sm:flex-row sm:justify-between sm:items-start border-slate-200">
      <div className="flex items-start">
        <span className={`text-2xl mr-3 ${color}`} title={`Type: ${type}`}>{icon}</span>
        <div>
          <p className="font-semibold text-slate-800">{time}</p>
          <p className="text-sm text-slate-600">
            Capacity: <span className="font-bold text-brand-primary">{overallCapacity.toFixed(1)}</span>
            <span className="ml-4 text-xs text-slate-500">(E: {capacity.energy}, A: {capacity.attention}, P: {capacity.physical})</span>
          </p>
        </div>
      </div>
      {journal && (
        <p className="pt-1 pl-8 text-sm italic text-slate-700 sm:pl-0 sm:pt-0 sm:max-w-xs md:max-w-sm lg:max-w-md">
          "{journal}"
        </p>
      )}
    </li>
  );
};

const LogList: React.FC<LogListProps> = ({ checkIns }) => {
  const reversedCheckIns = [...checkIns].reverse();

  return (
    <div className="bg-white rounded-lg shadow-md">
      <h2 className="p-4 text-xl font-semibold border-b text-brand-dark border-slate-200">Today's Log</h2>
      {reversedCheckIns.length > 0 ? (
        <ul>
          {reversedCheckIns.map(checkIn => (
            <LogItem key={checkIn.id} checkIn={checkIn} />
          ))}
        </ul>
      ) : (
        <p className="p-4 text-slate-500">No entries logged yet today.</p>
      )}
    </div>
  );
};

export default LogList;