// src/components/DashboardContent.jsx
import React, {useState, useEffect} from 'react';
import axios from 'axios';
import DashboardCard from './DashboardCard';
import HoldingsPanel from './HoldingsPanel';
import ActivityPanel from './ActivityPanel';
import { getChange, getPercentChange, setStarting } from '../ActivityFunctions';

const DashboardContent = ({ hideValues }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [balance, setBalance] = useState();
  const portfolioGain = 2.4;

  useEffect(() => {
    getBalance(user);
    setStarting(balance);
  })

  function getBalance(user){
    const apiUrl = import.meta.env.VITE_USER_DB_LINK;
    const requestConfig = {
        headers: {
            'x-api-key': import.meta.env.VITE_USER_DB_KEY
        }
    };
    axios.get(`${apiUrl}/balance?user=${user.username}`, requestConfig).then(response => {
        setBalance(response.data.balance.toFixed(2));
    }).catch((error) => {
        console.log("Balance not available.");
    });
  }
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DashboardCard 
          title="Total Value" 
          value={`$${balance}`} 
          change={balance} 
        />
        <DashboardCard 
          title="Session Change" 
          value={`$${getChange().toFixed(2)}`} 
          change={`${getPercentChange().toFixed(2)}`} 
        />
      </div>
      <div className="">
        {/* <HoldingsPanel hideValues={hideValues} /> */}
        <ActivityPanel hideValues={hideValues} />
      </div>
    </div>
  );
};

export default DashboardContent;