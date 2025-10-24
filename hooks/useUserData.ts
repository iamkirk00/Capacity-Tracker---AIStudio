import { useState, useEffect, useCallback } from 'react';
import { CheckIn, CapacityState, CheckInType } from '../types';

const calculateOverallCapacity = (capacity: CapacityState): number => {
  const { energy, attention, physical } = capacity;
  // All three values are on a 0-12 scale where 12 is optimal.
  return (energy + attention + physical) / 3;
};

const determineCheckInType = (current: number, previous: number | null): CheckInType => {
  if (previous === null) return 'normal';
  const diff = current - previous;
  if (diff > 0.5) return 'increase'; // A noticeable recovery
  if (diff < -2.0) return 'drop'; // A sudden drop
  return 'normal';
};

export const useUserData = (userId: string) => {
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [loading, setLoading] = useState(true);

  const getStorageKey = useCallback(() => `capacity-tracker-data-${userId}`, [userId]);

  useEffect(() => {
    try {
      const storedData = localStorage.getItem(getStorageKey());
      if (storedData) {
        const parsedData: CheckIn[] = JSON.parse(storedData);
        // Filter for today's check-ins
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todaysCheckins = parsedData.filter(c => new Date(c.timestamp) >= today);
        setCheckIns(todaysCheckins.sort((a, b) => a.timestamp - b.timestamp));
      }
    // FIX: Added curly braces to the catch block to fix the syntax error.
    } catch (error) {
      console.error("Failed to load user data from localStorage", error);
    } finally {
      setLoading(false);
    }
  }, [userId, getStorageKey]);

  useEffect(() => {
    try {
      if (!loading) {
        // Ensure check-ins are sorted before saving
        const sortedCheckIns = [...checkIns].sort((a, b) => a.timestamp - b.timestamp);
        localStorage.setItem(getStorageKey(), JSON.stringify(sortedCheckIns));
      }
    } catch (error) {
      console.error("Failed to save user data to localStorage", error);
    }
  }, [checkIns, loading, getStorageKey]);

  const addCheckIn = useCallback((capacity: CapacityState, journal: string, timestamp: number) => {
    const overallCapacity = calculateOverallCapacity(capacity);
    
    // To correctly determine the 'type', we must find the check-in immediately preceding the new one in time.
    const sortedCheckIns = [...checkIns].sort((a, b) => a.timestamp - b.timestamp);
    const lastCheckIn = sortedCheckIns.filter(c => c.timestamp < timestamp).pop() || null;

    const type = determineCheckInType(overallCapacity, lastCheckIn?.overallCapacity ?? null);

    const newCheckIn: CheckIn = {
      id: `checkin-${timestamp}-${Math.random()}`,
      timestamp,
      capacity,
      journal,
      overallCapacity,
      type,
    };

    setCheckIns(prev => [...prev, newCheckIn].sort((a, b) => a.timestamp - b.timestamp));
  }, [checkIns]);

  return { checkIns, addCheckIn, loading };
};
