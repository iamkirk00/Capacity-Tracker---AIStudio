import React, { useState, useEffect } from 'react';
import { CapacityState, CheckIn } from '../types';

interface CheckInFormProps {
  onSubmit: (capacity: CapacityState, journal: string, timestamp: number) => void;
  lastCheckIn: CheckIn | null;
  isFirstCheckIn: boolean;
}

const CapacitySlider: React.FC<{
  label: string;
  value: number;
  onChange: (value: number) => void;
  inverted?: boolean;
}> = ({ label, value, onChange, inverted = false }) => {
  
  const sliderValue = inverted ? 12 - value : value;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSliderValue = parseInt(e.target.value, 10);
    onChange(inverted ? 12 - newSliderValue : newSliderValue);
  };

  return (
    <div>
        <label className="block mb-2 text-sm font-medium text-slate-700">{label}: <span className="font-bold text-brand-primary">{value}</span></label>
        <div className="flex items-center w-full space-x-3">
            <span className="text-xs text-slate-500">Full</span>
            <input
                type="range"
                min="0"
                max="12"
                step="1"
                value={sliderValue}
                onChange={handleChange}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-slate-200"
            />
            <span className="text-xs text-slate-500">Empty</span>
        </div>
    </div>
  );
};

const CheckInForm: React.FC<CheckInFormProps> = ({ onSubmit, lastCheckIn, isFirstCheckIn }) => {
  const [capacity, setCapacity] = useState<CapacityState>({ energy: 8, attention: 8, physical: 8 });
  const [journal, setJournal] = useState('');
  const [isJournaling, setIsJournaling] = useState(false);
  const [time, setTime] = useState(new Date().toTimeString().substring(0, 5));
  const [isEditingTime, setIsEditingTime] = useState(false);


  useEffect(() => {
      if (isFirstCheckIn) {
          setCapacity({ energy: 12, attention: 12, physical: 12 });
      } else if (lastCheckIn) {
          setCapacity(lastCheckIn.capacity);
      }
  }, [lastCheckIn, isFirstCheckIn]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const [hours, minutes] = time.split(':').map(Number);
    const checkInDate = new Date();
    checkInDate.setHours(hours, minutes, 0, 0);
    const timestamp = checkInDate.getTime();

    onSubmit(capacity, journal, timestamp);
    setJournal('');
    setIsJournaling(false);
    // Do not reset time to current, user might want to log multiple past events
  };

  const handleCapacityChange = (field: keyof CapacityState, value: number) => {
    setCapacity(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
       <div className="flex items-start justify-between mb-4">
        <h2 className="text-xl font-semibold text-brand-dark">
          {isFirstCheckIn ? "Check-in Today" : "New Check-In"}
        </h2>
        <div className="text-sm">
          {!isEditingTime ? (
            <button
              type="button"
              onClick={() => setIsEditingTime(true)}
              className="flex items-center px-2 py-1 transition-colors rounded-md text-slate-600 hover:bg-slate-100"
              title="Change check-in time"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              {time}
            </button>
          ) : (
            <div className="flex items-center space-x-2">
              <input
                type="time"
                id="checkin-time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-24 p-1 text-sm border rounded-md border-slate-300 focus:ring-brand-secondary focus:border-brand-secondary"
              />
              <button
                type="button"
                onClick={() => setIsEditingTime(false)}
                className="px-2 py-1 text-xs font-semibold text-white transition-colors rounded-md bg-brand-secondary hover:bg-brand-primary"
              >
                Set
              </button>
            </div>
          )}
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="p-4 space-y-6 border rounded-lg border-slate-200">
            <CapacitySlider label="Energy" value={capacity.energy} onChange={(v) => handleCapacityChange('energy', v)} inverted />
            <CapacitySlider label="Attention" value={capacity.attention} onChange={(v) => handleCapacityChange('attention', v)} inverted />
            <CapacitySlider label="Physical" value={capacity.physical} onChange={(v) => handleCapacityChange('physical', v)} inverted />
        </div>
        
        <div>
          {!isJournaling ? (
            <button
              type="button"
              onClick={() => setIsJournaling(true)}
              className="w-full p-2 text-sm transition-colors rounded-md text-brand-secondary hover:bg-slate-100"
            >
              Do you want to journal about how you feel?
            </button>
          ) : (
            <div>
              <label htmlFor="journal" className="block mb-2 text-sm font-medium text-slate-700">Journal</label>
              <textarea
                id="journal"
                value={journal}
                onChange={(e) => setJournal(e.target.value)}
                placeholder="What drained or recharged you?"
                className="w-full p-2 border rounded-md border-slate-300 focus:ring-brand-secondary focus:border-brand-secondary"
                rows={3}
              ></textarea>
              <div className="flex justify-end mt-2">
                 <button
                    type="button"
                    disabled
                    title="AI analysis coming soon!"
                    className="px-3 py-1 text-xs font-semibold text-white transition-colors duration-200 rounded-md bg-slate-400 cursor-not-allowed"
                >
                    GPT Review
                </button>
              </div>
            </div>
          )}
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 font-bold text-white transition-colors duration-200 rounded-md bg-brand-primary hover:bg-brand-secondary"
        >
          Log Capacity
        </button>
      </form>
    </div>
  );
};

export default CheckInForm;