import React from 'react';

const DashboardLayout = ({ children, title = "Dashboard" }) => {
  return (
    <div className="glass-effect rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-vegas-gold">{title}</h2>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-400">Online</span>
        </div>
      </div>
      
      <div className="space-y-4">
        {children || (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">🏗️</div>
            <p className="text-gray-400">Dashboard Layout Component</p>
            <p className="text-sm text-gray-500 mt-2">
              This is a micro-frontend component loaded dynamically
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardLayout;
