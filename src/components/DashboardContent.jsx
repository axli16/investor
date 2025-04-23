// src/components/DashboardContent.jsx
import React from 'react';
import DashboardCard from './DashboardCard';
import HoldingsPanel from './HoldingsPanel';
import ActivityPanel from './ActivityPanel';

const DashboardContent = ({ hideValues }) => {
  const portfolioValue = 36000;
  const portfolioGain = 2.4;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <DashboardCard 
          title="Total Value" 
          value={`$${portfolioValue.toLocaleString()}`} 
          change={portfolioGain} 
        />
        <DashboardCard 
          title="Day Change" 
          value={`$${(portfolioValue * 0.015).toLocaleString()}`} 
          change={1.5} 
        />
        <DashboardCard 
          title="Total Gain" 
          value={`$${(portfolioValue * portfolioGain / 100).toLocaleString()}`} 
          change={portfolioGain} 
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <HoldingsPanel hideValues={hideValues} />
        <ActivityPanel hideValues={hideValues} />
      </div>
    </div>
  );
};

export default DashboardContent;