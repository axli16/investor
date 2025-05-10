// src/components/DashboardContent.jsx
import React, {useState, useEffect} from 'react';
import axios from 'axios';
import DashboardCard from './DashboardCard';
import HoldingsPanel from './HoldingsPanel';
import ActivityPanel from './ActivityPanel';

const DashboardContent = ({ hideValues }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [balance, setBalance] = useState();
  const portfolioGain = 2.4;

  useEffect(() => {
    getBalance(user);
  })

  function getBalance(user){
    const apiUrl = import.meta.env.VITE_USER_DB_LINK;
    const requestConfig = {
        headers: {
            'x-api-key': import.meta.env.VITE_USER_DB_KEY
        }
    };
    axios.get(`${apiUrl}/balance?user=${user.username}`, requestConfig).then(response => {
        setBalance(response.data.balance);
    }).catch((error) => {
        console.log("Balance not available.");
    });
  }
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <DashboardCard 
          title="Total Value" 
          value={`$${balance}`} 
          change={balance} 
        />
        <DashboardCard 
          title="Day Change" 
          value={`$${(10 * 0.015).toLocaleString()}`} 
          change={1.5} 
        />
        <DashboardCard 
          title="Total Gain" 
          value={`$${(12 * portfolioGain / 100).toLocaleString()}`} 
          change={portfolioGain} 
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* <HoldingsPanel hideValues={hideValues} /> */}
        <ActivityPanel hideValues={hideValues} />
      </div>
    </div>
  );
};

export default DashboardContent;