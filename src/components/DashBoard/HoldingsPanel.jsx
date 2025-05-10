// src/components/HoldingsPanel.jsx
import React, {useState} from 'react';


const HoldingsPanel = ({ hideValues }) => {

  const user = JSON.parse(localStorage.getItem('user'));
  // Sample holdings data
  const holdings = [
    { name: 'AAPL', shares: 10, price: 178.72, value: 1787.20, change: 0.78 },
    { name: 'MSFT', shares: 5, price: 337.22, value: 1686.10, change: 1.24 },
    { name: 'GOOGL', shares: 8, price: 142.56, value: 1140.48, change: -0.45 },
    { name: 'AMZN', shares: 12, price: 132.08, value: 1584.96, change: 0.32 },
    { name: 'TSLA', shares: 15, price: 151.86, value: 2277.90, change: -1.67 },
    { name: 'TSLA', shares: 15, price: 151.86, value: 2277.90, change: -1.67 },
    { name: 'TSLA', shares: 15, price: 151.86, value: 2277.90, change: -1.67 },
    { name: 'TSLA', shares: 15, price: 151.86, value: 2277.90, change: -1.67 },
    { name: 'TSLA', shares: 15, price: 151.86, value: 2277.90, change: -1.67 },
    { name: 'TSLA', shares: 15, price: 151.86, value: 2277.90, change: -1.67 },
    { name: 'TSLA', shares: 15, price: 151.86, value: 2277.90, change: -1.67 },
    { name: 'TSLA', shares: 15, price: 151.86, value: 2277.90, change: -1.67 },
    { name: 'TSLA', shares: 15, price: 151.86, value: 2277.90, change: -1.67 },
  ];

  return (
    <div className="bg-gray-900 rounded-lg p-6 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-900/20">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-white">Holdings</h2>
        {/* <button className="text-emerald-400 hover:text-emerald-300 transition-colors duration-300">View All</button> */}
      </div>
      <div className="space-y-3">
        {holdings.map((holding, index) => (
          <div 
            key={index} 
            className="flex justify-between items-center py-2 border-b border-gray-800 transition-all duration-300 hover:bg-gray-800/50 rounded px-2"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-sm">{holding.name.substring(0, 1)}</div>
              <span className="font-medium">{holding.name}</span>
            </div>
            <div className="text-right">
              <div className={hideValues ? "blur-sm" : ""}>
                ${holding.value.toLocaleString()}
              </div>
              <div className={`text-sm ${holding.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {holding.change >= 0 ? '+' : ''}{holding.change}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HoldingsPanel;