// src/components/NavItem.jsx
import React from 'react';
import { BarChart, PieChart, TrendingUp } from 'lucide-react';

const NavItem = ({ icon, label, active, onClick }) => {
  const getIcon = () => {
    switch (icon) {
      case 'BarChart':
        return <BarChart />;
      case 'PieChart':
        return <PieChart />;
      case 'TrendingUp':
        return <TrendingUp />;
      default:
        return null;
    }
  };

  return (
    <button
      onClick={onClick}
      className={`flex items-center space-x-3 w-full py-3 px-4 rounded-lg transition-all duration-300 ${
        active 
          ? 'bg-emerald-900/20 text-emerald-400' 
          : 'hover:bg-gray-800 text-gray-300'
      }`}
    >
      <span className={`${active ? 'text-emerald-400' : 'text-gray-400'}`}>
        {getIcon()}
      </span>
      <span>{label}</span>
    </button>
  );
};

export default NavItem;