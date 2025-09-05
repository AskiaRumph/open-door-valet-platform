import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  IconChevronLeft, 
  IconChevronRight, 
  IconX, 
  IconSettings, 
  IconBell, 
  IconUser,
  IconSparkles,
  IconTrendingUp,
  IconCircle
} from '@tabler/icons-react';

// Lot grouping configuration
const LOT_GROUPS = {
  core: {
    title: 'Core Operations',
    icon: IconSparkles,
    order: 1
  },
  management: {
    title: 'Management',
    icon: IconTrendingUp,
    order: 2
  },
  other: {
    title: 'More',
    icon: IconCircle,
    order: 3
  }
};

export default function LotSidebarEnhanced({ 
  garage, 
  currentLotId, 
  collapsed, 
  onToggleCollapse,
  isMobileOpen,
  onMobileClose,
  user = null
}) {
  const navigate = useNavigate();
  const [hoveredLot, setHoveredLot] = useState(null);
  const [collapsedGroups, setCollapsedGroups] = useState(new Set());
  
  // Sort lots alphabetically
  const sortedLots = useMemo(() => {
    if (!garage?.lots) return [];
    return [...garage.lots].sort((a, b) => a.name.localeCompare(b.name));
  }, [garage]);
  
  // Group lots by category (keeping for potential future use)
  const groupedLots = useMemo(() => {
    if (!garage?.lots) return {};
    
    const groups = {};
    garage.lots.forEach(lot => {
      const group = lot.group || 'other';
      if (!groups[group]) groups[group] = [];
      groups[group].push(lot);
    });
    
    return groups;
  }, [garage]);

  // Toggle group collapse
  const toggleGroup = (groupKey) => {
    setCollapsedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(groupKey)) {
        newSet.delete(groupKey);
      } else {
        newSet.add(groupKey);
      }
      return newSet;
    });
  };

  // Calculate user's PowerScore (mock data for now)
  const powerScore = user?.powerScore || 95;
  const powerScoreProgress = (powerScore / 100) * 360;

  return (
    <div className="h-full w-full flex flex-col relative overflow-hidden">
      {/* Simplified background to match header */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-950 to-black pointer-events-none" />
      
      {/* Content container */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Enhanced Navigation - no header needed, collapse button is in OdvCentral */}
        <nav className="flex-1 overflow-y-auto py-4 px-2 custom-scrollbar">
          <div className="space-y-2">
            {sortedLots.map((lot, index) => {
              const Icon = lot.icon;
              const isActive = currentLotId === lot.id;
              const isHovered = hoveredLot === lot.id;
              
              return (
                <Link
                  key={lot.id}
                  to={`/${garage.id}/${lot.id}`}
                  onClick={onMobileClose}
                  onMouseEnter={() => setHoveredLot(lot.id)}
                  onMouseLeave={() => setHoveredLot(null)}
                  className={`
                    group relative flex items-center px-4 py-3 rounded-xl
                    transition-all duration-300
                    ${collapsed ? 'justify-center' : 'space-x-3'}
                    ${isActive ? 'lot-item-active' : 'hover:bg-gray-800/50'}
                  `}
                  title={collapsed ? lot.name : undefined}
                >
                  {/* Icon */}
                  {Icon && (
                    <Icon className={`
                      relative z-10 h-6 w-6 transition-all duration-300
                      ${isActive 
                        ? 'text-vegas-gold drop-shadow-[0_0_6px_rgba(174,163,109,0.8)]' 
                        : 'text-vegas-gold'
                      }
                    `} />
                  )}
                  
                  {/* Text - always gradient */}
                  {!collapsed && (
                    <span className="relative z-10 text-base font-medium uppercase tracking-wide text-gradient-gold">
                      {lot.name}
                    </span>
                  )}
                  
                  {/* Subtle gold glow effect for active lot */}
                  {isActive && (
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-vegas-gold/10 via-vegas-gold/15 to-vegas-gold/10 blur-md" />
                  )}
                  
                  {/* Notification badge */}
                  {lot.notifications && lot.notifications > 0 && (
                    <span className={`
                      absolute ${collapsed ? '-top-1 -right-1' : 'top-1/2 -translate-y-1/2 right-3'}
                      h-5 w-5 bg-vegas-gold text-black text-xs font-bold rounded-full 
                      flex items-center justify-center animate-pulse
                    `}>
                      {lot.notifications}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Settings at bottom */}
        <div className="border-t border-gray-800/50 p-2">
          <Link
            to={`/${garage?.id}/settings`}
            onClick={onMobileClose}
            className={`
              group relative flex items-center px-4 py-3 rounded-xl
              transition-all duration-300 hover:bg-gray-800/50
              ${collapsed ? 'justify-center' : 'space-x-3'}
            `}
            title={collapsed ? 'Settings' : undefined}
          >
            <IconSettings className="relative z-10 h-6 w-6 text-vegas-gold transition-all duration-300" />
            
            {!collapsed && (
              <span className="relative z-10 text-base font-medium uppercase tracking-wide text-gradient-gold">
                SETTINGS
              </span>
            )}
          </Link>
        </div>

      </div>

      {/* Border glow effect */}
      <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-vegas-gold/20 to-transparent" />
    </div>
  );
}

// Add custom scrollbar styles to your global CSS
const scrollbarStyles = `
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: rgba(174,163,109,0.3) transparent;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(174,163,109,0.3);
  border-radius: 3px;
  transition: background 0.2s;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(174,163,109,0.5);
}
`;
