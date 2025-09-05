import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { IconChevronRight, IconChevronLeft, IconHome, IconClock, IconStar, IconTrendingUp, IconAlertCircle, IconCircleCheck, IconInfoCircle } from '@tabler/icons-react';

const LotsSidebar = ({ 
  garage, 
  currentLotId, 
  collapsed, 
  onToggleCollapse, 
  isMobileOpen, 
  onMobileClose,
  user 
}) => {
  const location = useLocation();

  const getLotIcon = (lotId) => {
    const iconMap = {
      'dashboard': IconHome,
      'assignments': IconClock,
      'valets': IconStar,
      'clients': IconCircleCheck,
      'bookings': IconClock,
      'invoices': IconTrendingUp,
      'support': IconAlertCircle,
      'reports': IconTrendingUp,
      'ai-insights': IconInfoCircle,
      'performance': IconStar,
      'trends': IconTrendingUp,
      'finance': IconTrendingUp,
      'payments': IconCircleCheck,
      'expenses': IconAlertCircle,
      'revenue': IconTrendingUp,
      'settings': IconInfoCircle,
      'users': IconStar,
      'integrations': IconCircleCheck,
      'security': IconAlertCircle
    };
    return iconMap[lotId] || IconInfoCircle;
  };

  const isActiveLot = (lotId) => {
    return currentLotId === lotId;
  };

  const handleLotClick = (lotId) => {
    if (onMobileClose) {
      onMobileClose();
    }
  };

  if (!garage) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center text-gray-400">
          <div className="text-4xl mb-2">🏢</div>
          <p className="text-sm">No garage selected</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Garage info */}
      {!collapsed && (
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{garage.icon}</span>
            <div>
              <h3 className="text-white font-semibold">{garage.name}</h3>
              <p className="text-xs text-gray-400">{garage.description}</p>
            </div>
          </div>
        </div>
      )}

      {/* Lots navigation */}
      <nav className="p-2">
        <div className="space-y-1">
          {garage.lots?.map((lot) => {
            const IconComponent = getLotIcon(lot.id);
            const isActive = isActiveLot(lot.id);
            
            return (
              <Link
                key={lot.id}
                to={`/${garage.id}/${lot.id}`}
                onClick={() => handleLotClick(lot.id)}
                className={`group flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-vegas-gold/20 text-vegas-gold border border-vegas-gold/30'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}
                title={collapsed ? lot.name : ''}
              >
                <IconComponent className={`h-5 w-5 flex-shrink-0 ${
                  isActive ? 'text-vegas-gold' : 'text-gray-400 group-hover:text-white'
                }`} />
                
                {!collapsed && (
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{lot.name}</div>
                    <div className="text-xs text-gray-500 truncate">{lot.description}</div>
                  </div>
                )}

                {!collapsed && isActive && (
                  <IconChevronRight className="h-4 w-4 text-vegas-gold" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* User info */}
      {!collapsed && user && (
        <div className="p-4 border-t border-gray-800 mt-auto">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-vegas-gold bg-opacity-20 rounded-full flex items-center justify-center">
              <span className="text-vegas-gold text-sm font-semibold">
                {user.name?.charAt(0) || user.email?.charAt(0) || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white text-sm font-medium truncate">
                {user.name || 'User'}
              </div>
              <div className="text-xs text-gray-400 truncate">
                {user.email || 'user@example.com'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Collapse button */}
      {!collapsed && (
        <div className="p-2 border-t border-gray-800">
          <button
            onClick={onToggleCollapse}
            className="w-full flex items-center justify-center space-x-2 px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors"
          >
            <IconChevronLeft className="h-4 w-4" />
            <span className="text-sm">Collapse</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default LotsSidebar;
