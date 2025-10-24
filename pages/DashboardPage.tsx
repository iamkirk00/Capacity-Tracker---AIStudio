import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserData } from '../hooks/useUserData';
import Header from '../components/Header';
import CheckInForm from '../components/CheckInForm';
import CapacityChart from '../components/CapacityChart';
import LogList from '../components/LogList';
import { CapacityState } from '../types';

interface DashboardPageProps {
  userId: string;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ userId }) => {
  const { checkIns, addCheckIn, loading } = useUserData(userId);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('checkin');

  const handleLogout = () => {
    localStorage.removeItem('capacity-tracker-key');
    navigate('/');
  };

  const handleAddCheckIn = (capacity: CapacityState, journal: string, timestamp: number) => {
    addCheckIn(capacity, journal, timestamp);
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  const isFirstCheckIn = checkIns.length === 0;

  return (
    <div className="min-h-screen bg-slate-100">
      <Header userId={userId} onLogout={handleLogout} />
      <main className="container p-4 mx-auto md:p-6">
        <div className="mb-6 border-b border-slate-300">
          <nav className="flex -mb-px space-x-6" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('checkin')}
              className={`${
                activeTab === 'checkin'
                  ? 'border-brand-primary text-brand-primary'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg focus:outline-none`}
            >
              Check-In & Log
            </button>
            <button
              onClick={() => setActiveTab('timeline')}
              className={`${
                activeTab === 'timeline'
                  ? 'border-brand-primary text-brand-primary'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg focus:outline-none`}
            >
              Daily Timeline
            </button>
          </nav>
        </div>

        <div>
          {activeTab === 'checkin' && (
            <div className="space-y-6">
              <CheckInForm
                onSubmit={handleAddCheckIn}
                lastCheckIn={checkIns[checkIns.length - 1] || null}
                isFirstCheckIn={isFirstCheckIn}
              />
              <LogList checkIns={checkIns} />
            </div>
          )}
          {activeTab === 'timeline' && (
             <CapacityChart data={checkIns} />
          )}
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
