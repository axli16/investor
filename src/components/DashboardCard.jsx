// src/components/DashboardCard.jsx
import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

const DashboardCard = ({ title, value, change }) => (
  <div className="bg-gray-900 rounded-lg p-6 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-900/20 hover:translate-y-[-2px]">
    <h3 className="text-gray-400 mb-2">{title}</h3>
    <div className="text-2xl font-bold mb-2">{value}</div>
    <div className={`flex items-center ${change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
      {change >= 0 ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      <span>{Math.abs(change)}%</span>
    </div>
  </div>
);

export default DashboardCard;