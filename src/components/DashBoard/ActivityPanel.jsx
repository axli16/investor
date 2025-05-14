// src/components/ActivityPanel.jsx
import React from 'react';
import { useState, useEffect } from 'react';
import { getActivities } from '../ActivityFunctions';

const ActivityPanel = ({ hideValues }) => {
  // Sample activity data
  const [recentActivity,setRecentActivity] = useState([]);

  useEffect(() => {
      setRecentActivity(getActivities);
  }, []);
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
                ${activity.amount.toLocaleString()} ({activity.multiplier})
              </div>
              <div
                className={`text-xs ${
                  activity.change > 0
                    ? 'text-green-500'  // Green if positive
                    : activity.change < 0
                    ? 'text-red-500'    // Red if negative
                    : 'text-gray-400'   // Grey if zero
                }`}
              >
                {`$${activity.change}`}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityPanel;