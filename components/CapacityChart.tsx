import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CheckIn } from '../types';

interface CapacityChartProps {
  data: CheckIn[];
}

const CustomDot: React.FC<any> = (props) => {
    const { cx, cy, payload } = props;
    
    // Do not render dot if there's no actual data for this point
    if (payload.overallCapacity === null || payload.overallCapacity === undefined) {
        return null;
    }

    let color = '#334155'; // slate-700 (normal)
    if (payload.type === 'increase') {
        color = '#10b981'; // emerald-500 (green)
    } else if (payload.type === 'drop') {
        color = '#3b82f6'; // blue-500 (blue)
    }

    return (
        <svg x={cx - 5} y={cy - 5} width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="5" cy="5" r="5" fill={color}/>
        </svg>
    );
};

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        if (data.overallCapacity === null || data.overallCapacity === undefined) {
            return null; // Don't show tooltip for expected path points
        }
        return (
            <div className="p-3 bg-white border rounded-md shadow-lg border-slate-200">
                <p className="font-bold text-slate-700">{`Time: ${label}`}</p>
                <p className="text-brand-primary">{`Your Capacity: ${data.overallCapacity.toFixed(2)}`}</p>
                <p className="text-slate-500">{`Expected: ${data.expected.toFixed(2)}`}</p>
                <p className="text-sm text-slate-500">{`E: ${data.capacity.energy}, A: ${data.capacity.attention}, P: ${data.capacity.physical}`}</p>
                {data.journal && <p className="mt-2 text-xs italic text-slate-600">"{data.journal}"</p>}
            </div>
        );
    }
    return null;
};

const CapacityChart: React.FC<CapacityChartProps> = ({ data }) => {
  const today = new Date();
  today.setHours(8, 0, 0, 0);
  const eightAmTimestamp = today.getTime();

  // 1. Generate hourly points for the expected path
  const hourlyExpectedData = Array.from({ length: 13 }, (_, i) => {
      const timestamp = eightAmTimestamp + i * 60 * 60 * 1000;
      return {
          timestamp,
          time: new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          overallCapacity: null, // No user data for these points
          expected: 12 - i,
      };
  });

  // 2. Format user data and calculate expected capacity at each user's check-in time
  const formattedUserData = data.map(item => {
    const hoursSince8Am = (item.timestamp - eightAmTimestamp) / (1000 * 60 * 60);
    return {
      ...item,
      time: new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      expected: Math.max(0, 12 - hoursSince8Am),
    };
  });

  // 3. Combine, create a map to merge points at the same time, then convert back to array and sort
  const combinedDataMap = new Map();
  [...hourlyExpectedData, ...formattedUserData].forEach(item => {
      combinedDataMap.set(item.time, { ...combinedDataMap.get(item.time), ...item });
  });
  const chartData = Array.from(combinedDataMap.values()).sort((a,b) => a.timestamp - b.timestamp);
  
  return (
    <div className="p-4 bg-white rounded-lg shadow-md min-h-96">
      <h2 className="mb-4 text-xl font-semibold text-brand-dark">Daily Capacity Timeline</h2>
      {data.length > 0 ? (
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="time" tick={{ fill: '#64748b' }} />
          <YAxis domain={[0, 12]} tick={{ fill: '#64748b' }} />
          <Tooltip content={<CustomTooltip />}/>
          <Legend />
          <Line 
            type="monotone" 
            dataKey="overallCapacity" 
            name="Your Capacity"
            stroke="#1e40af" 
            strokeWidth={2}
            dot={<CustomDot />}
            activeDot={{ r: 8, stroke: '#60a5fa' }} 
            connectNulls
            />
          <Line 
            type="monotone"
            dataKey="expected"
            name="Expected Path"
            stroke="#94a3b8"
            strokeDasharray="5 5"
            dot={false}
            activeDot={false}
            />
        </LineChart>
      </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-full text-slate-500">
            <p>No check-ins yet for today. Add one to see your timeline!</p>
        </div>
      )}
    </div>
  );
};

export default CapacityChart;
