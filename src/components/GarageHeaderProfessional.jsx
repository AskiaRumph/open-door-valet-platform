import React, { useState } from 'react';
import { IconChevronDown, IconSearch, IconBell, IconSettings, IconUser, IconLogout } from '@tabler/icons-react';

const GarageHeaderProfessional = ({ currentGarage, onGarageChange, onShowAuth }) => {
  const [showGarageMenu, setShowGarageMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleGarageSelect = (garage) => {
    setShowGarageMenu(false);
    if (onGarageChange) {
      onGarageChange(garage);
    }
  };

  const handleLogout = () => {
    setShowUserMenu(false);
    if (onShowAuth) {
      onShowAuth();
    }
  };

  return (
    <header className="bg-gradient-to-r from-gray-900 to-black border-b border-gray-800 px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Left side - Garage selector */}
        <div className="flex items-center space-x-4">
          {currentGarage ? (
            <div className="relative">
              <button
                onClick={() => setShowGarageMenu(!showGarageMenu)}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <span className="text-2xl">{currentGarage.icon}</span>
                <div className="text-left">
                  <div className="text-white font-semibold">{currentGarage.name}</div>
                  <div className="text-xs text-gray-400">{currentGarage.description}</div>
                </div>
                <IconChevronDown className="h-4 w-4 text-gray-400" />
              </button>

              {/* Garage dropdown menu */}
              {showGarageMenu && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50">
                  <div className="p-2">
                    <div className="text-xs text-gray-400 px-3 py-2">Select Garage</div>
                    {[
                      { id: 'operations', name: 'Operations', icon: '🏢', description: 'Core valet operations' },
                      { id: 'clients', name: 'Client Portal', icon: '👤', description: 'Customer management' },
                      { id: 'analytics', name: 'Analytics', icon: '📈', description: 'Data insights' },
                      { id: 'finance', name: 'Finance', icon: '💳', description: 'Financial management' },
                      { id: 'settings', name: 'Settings', icon: '⚙️', description: 'System configuration' }
                    ].map((garage) => (
                      <button
                        key={garage.id}
                        onClick={() => handleGarageSelect(garage)}
                        className="w-full flex items-center space-x-3 px-3 py-2 hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        <span className="text-xl">{garage.icon}</span>
                        <div className="text-left">
                          <div className="text-white font-medium">{garage.name}</div>
                          <div className="text-xs text-gray-400">{garage.description}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-gray-400">Select a garage to begin</div>
          )}
        </div>

        {/* Right side - User actions */}
        <div className="flex items-center space-x-2">
          {/* Search button */}
          <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
            <IconSearch className="h-5 w-5" />
          </button>

          {/* Notifications */}
          <button className="relative p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
            <IconBell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 bg-vegas-gold text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              3
            </span>
          </button>

          {/* Settings */}
          <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
            <IconSettings className="h-5 w-5" />
          </button>

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
            >
              <div className="w-8 h-8 bg-vegas-gold bg-opacity-20 rounded-full flex items-center justify-center">
                <IconUser className="h-4 w-4 text-vegas-gold" />
              </div>
              <span className="text-sm font-medium">Developer</span>
              <IconChevronDown className="h-4 w-4" />
            </button>

            {/* User dropdown menu */}
            {showUserMenu && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50">
                <div className="p-2">
                  <div className="px-3 py-2 border-b border-gray-700">
                    <div className="text-white font-medium">Developer</div>
                    <div className="text-xs text-gray-400">dev@valetplatform.com</div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-2 px-3 py-2 text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <IconLogout className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default GarageHeaderProfessional;
