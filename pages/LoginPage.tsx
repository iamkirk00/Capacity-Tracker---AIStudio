
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const [key, setKey] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (key.match(/^0x[a-fA-F0-9]+$/)) {
      localStorage.setItem('capacity-tracker-key', key);
      navigate(`/user/${key}`);
    } else {
      alert('Please enter a valid hex key (e.g., 0xA1B2C3).');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-brand-dark">Capacity Tracker</h1>
          <p className="mt-2 text-slate-600">Enter your unique key to access your daily log.</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="key-input" className="sr-only">
              Access Key
            </label>
            <input
              id="key-input"
              name="key"
              type="text"
              required
              className="relative block w-full px-3 py-3 text-lg placeholder-slate-500 border rounded-md appearance-none border-slate-300 focus:outline-none focus:ring-brand-secondary focus:border-brand-secondary focus:z-10"
              placeholder="e.g., 0xA1B2C3"
              value={key}
              onChange={(e) => setKey(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="relative flex justify-center w-full px-4 py-3 text-lg font-medium text-white border border-transparent rounded-md group bg-brand-primary hover:bg-brand-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary"
          >
            Unlock Dashboard
          </button>
        </form>
         <p className="mt-4 text-xs text-center text-slate-500">
          This is a prototype. Your key is stored only in your browser's local storage for convenience.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
