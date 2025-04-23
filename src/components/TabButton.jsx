// src/components/TabButton.jsx
import React from 'react';

const TabButton = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`px-6 py-2 rounded-lg mr-2 transition-all duration-300 ${
      active 
        ? 'bg-emerald-900/20 text-emerald-400 border-b-2 border-emerald-400' 
        : 'hover:bg-gray-800 text-gray-300'
    }`}
  >
    {label}
  </button>
);

export default TabButton;