// src/components/ActivityPanel.jsx
import React from 'react';

const ActivityPanel = ({ hideValues }) => {
  // Sample activity data
  const recentActivity = [
    { date: '2025-03-15', type: 'Buy', stock: 'AAPL', amount: 1787.20 },
    { date: '2025-03-10', type: 'Sell', stock: 'NFLX', amount: 1200.00 },
    { date: '2025-03-05', type: 'Dividend', stock: 'MSFT', amount: 45.60 },
    { date: '2025-02-28', type: 'Deposit', stock: '', amount: 5000.00 }
  ];

  return (
    <div className="bg-gray-900 rounded-lg p-6 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-900/20">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-white">Activity</h2>
        <button className="text-emerald-400 hover:text-emerald-300 transition-colors duration-300">View All</button>
      </div>
      <div className="space-y-3">
        {recentActivity.map((activity, index) => (
          <div 
            key={index} 
            className="flex justify-between items-center py-2 border-b border-gray-800 transition-all duration-300 hover:bg-gray-800/50 rounded px-2"
          >
            <div className="flex items-center space-x-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs ${
                activity.type === 'Buy' ? 'bg-green-900 text-green-300' : 
                activity.type === 'Sell' ? 'bg-red-900 text-red-300' : 
                activity.type === 'Dividend' ? 'bg-blue-900 text-blue-300' : 
                'bg-emerald-900 text-emerald-300'
              }`}>
                {activity.type.substring(0, 1)}
              </div>
              <div>
                <div className="font-medium">{activity.type}</div>
                <div className="text-xs text-gray-400">{activity.date}</div>
              </div>
            </div>
            <div className="text-right">
              <div className={hideValues ? "blur-sm" : ""}>
                ${activity.amount.toLocaleString()}
              </div>
              <div className="text-xs text-gray-400">
                {activity.stock}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityPanel;