// src/components/Investor.jsx
import React, { useState, useEffect } from 'react';
import { DollarSign, Menu, X, Eye, EyeOff } from 'lucide-react';
import NavItem from './NavItem';
import TabButton from './TabButton';
import DashboardContent from './DashboardContent';
import '../styles/animations.css';

const Investor = () => {
  const [activeTab, setActiveTab] = useState('stock');
  const [showMenu, setShowMenu] = useState(false);
  const [hideValues, setHideValues] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardContent hideValues={hideValues} />;
      case 'trade':
        return <div className="text-center py-16">Trade functionality would be implemented here</div>;
      case 'buy':
        return <div className="text-center py-16">Buy functionality would be implemented here</div>;
      case 'settings':
        return <div className="text-center py-16">Settings functionality would be implemented here</div>;
      default:
        return <div>Page not found</div>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-950">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 text-emerald-400">
            <DollarSign size={64} />
          </div>
          <p className="mt-4 text-emerald-400">Loading your portfolio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Mobile Navigation */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-gray-900 p-4 border-b border-gray-800">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <DollarSign className="text-emerald-400" />
            <span className="ml-2 font-semibold">Investor</span>
          </div>
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 rounded-full hover:bg-gray-800 transition-colors duration-300"
          >
            {showMenu ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {showMenu && (
        <div className="fixed inset-0 bg-gray-950 z-40 pt-16 pb-4 px-4 md:hidden animate-fade-in">
          <nav className="space-y-4">
            <NavItem 
              icon="BarChart" 
              label="Dashboard" 
              active={currentPage === 'dashboard'} 
              onClick={() => {
                setCurrentPage('dashboard');
                setShowMenu(false);
              }}
            />
            <NavItem 
              icon="PieChart" 
              label="Trade" 
              active={currentPage === 'trade'} 
              onClick={() => {
                setCurrentPage('trade');
                setShowMenu(false);
              }}
            />
            <NavItem 
              icon="TrendingUp" 
              label="Buy/Sell" 
              active={currentPage === 'buy'} 
              onClick={() => {
                setCurrentPage('buy');
                setShowMenu(false);
              }}
            />
            <hr className="border-gray-800" />
            <button
              onClick={() => setHideValues(!hideValues)}
              className="flex items-center space-x-2 w-full py-3 px-4 rounded-lg transition-colors duration-300 hover:bg-gray-800"
            >
              {hideValues ? <EyeOff size={20} /> : <Eye size={20} />}
              <span>{hideValues ? 'Show Values' : 'Hide Values'}</span>
            </button>
          </nav>
        </div>
      )}

      <div className="flex">
        {/* Sidebar - Desktop */}
        <div className="hidden md:flex md:w-64 flex-col h-screen fixed bg-gray-900 border-r border-gray-800">
          <div className="p-6 flex items-center space-x-2">
            <DollarSign className="text-emerald-400" size={24} />
            <span className="font-bold text-xl">Investor</span>
          </div>
          <nav className="flex-1 px-4 py-4 space-y-2">
            <NavItem 
              icon="BarChart" 
              label="Dashboard" 
              active={currentPage === 'dashboard'} 
              onClick={() => setCurrentPage('dashboard')}
            />
            <NavItem 
              icon="PieChart" 
              label="Trade" 
              active={currentPage === 'trade'} 
              onClick={() => setCurrentPage('trade')}
            />
            <NavItem 
              icon="TrendingUp" 
              label="Buy/Sell" 
              active={currentPage === 'buy'} 
              onClick={() => setCurrentPage('buy')}
            />
          </nav>
          <div className="p-4 border-t border-gray-800">
            <button
              onClick={() => setHideValues(!hideValues)}
              className="flex items-center space-x-2 w-full py-2 px-3 rounded-lg transition-colors duration-300 hover:bg-gray-800"
            >
              {hideValues ? <EyeOff size={20} /> : <Eye size={20} />}
              <span>{hideValues ? 'Show Values' : 'Hide Values'}</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 md:ml-64 p-4 pt-20 md:pt-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold">Welcome back {user.username}</h1>
              <p className="text-gray-400">Here's your portfolio overview</p>
            </div>

            {/* Tab Navigation 
            <div className="mb-6 flex overflow-x-auto pb-2">
              <TabButton 
                label="Stock" 
                active={activeTab === 'stock'} 
                onClick={() => setActiveTab('stock')}
              />
              <TabButton 
                label="Trade" 
                active={activeTab === 'trade'} 
                onClick={() => setActiveTab('trade')}
              />
              <TabButton 
                label="Buy/Sell" 
                active={activeTab === 'buy'} 
                onClick={() => setActiveTab('buy')}
              />
            </div>
              */}
            {/* Main Content */}
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Investor;