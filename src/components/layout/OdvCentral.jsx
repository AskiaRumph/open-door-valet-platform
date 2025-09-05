import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import { IconMenu, IconX, IconChevronRight, IconChevronLeft, IconSearch, IconBell, IconSettings, IconUser, IconHome, IconClock, IconStar, IconTrendingUp, IconAlertCircle, IconCircleCheck, IconInfoCircle } from '@tabler/icons-react';
import GarageHeaderProfessional from '../GarageHeaderProfessional';
import LotsSidebar from '../LotsSidebar';
import LotSidebarEnhanced from '../LotSidebarEnhanced';
import { GARAGES } from '../../constants/garages';
import { useAuth } from '../../hooks/useAuth.jsx';
import VehicleStager from '../../helpers/vehicle-stager.jsx';

// Enhanced navigation with breadcrumbs
const Breadcrumbs = ({ garage, lot }) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex items-center space-x-2 text-sm text-gray-400">
      <button 
        onClick={() => navigate('/')}
        className="hover:text-vegas-gold transition-colors"
      >
        <IconHome className="h-4 w-4" />
      </button>
      {garage && (
        <>
          <IconChevronRight className="h-3 w-3" />
          <button 
            onClick={() => navigate(`/${garage.id}`)}
            className="hover:text-vegas-gold transition-colors"
          >
            {garage.name}
          </button>
        </>
      )}
      {lot && (
        <>
          <IconChevronRight className="h-3 w-3" />
          <span className="text-vegas-gold font-medium">{lot.name}</span>
        </>
      )}
    </div>
  );
};

// Quick actions floating panel
const QuickActions = ({ onSearch, notifications = 0 }) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(searchQuery);
    setSearchQuery('');
    setSearchOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-30 flex flex-col items-end space-y-3">
      {/* Search */}
      <div className={`transition-all duration-300 ${searchOpen ? 'w-64' : 'w-12'}` }>
        {searchOpen ? (
          <form onSubmit={handleSearch} className="flex items-center bg-gray-900 border border-gray-700 rounded-full px-4 py-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search.."
              className="flex-1 bg-transparent outline-none text-white placeholder-gray-400"
              autoFocus
            />
            <button type="submit" className="ml-2 text-vegas-gold">
              <IconSearch className="h-4 w-4" />
            </button>
            <button 
              type="button" 
              onClick={() => setSearchOpen(false)}
              className="ml-2 text-gray-400 hover:text-white"
            >
              <IconX className="h-4 w-4" />
            </button>
          </form>
        ) : (
          <button
            onClick={() => setSearchOpen(true)}
            className="w-12 h-12 bg-gray-900 border border-gray-700 rounded-full flex items-center justify-center hover:bg-gray-800 hover:border-vegas-gold transition-all group"
          >
            <IconSearch className="h-5 w-5 text-gray-400 group-hover:text-vegas-gold" />
          </button>
        )}
      </div>

      {/* Notifications */}
      <button className="relative w-12 h-12 bg-gray-900 border border-gray-700 rounded-full flex items-center justify-center hover:bg-gray-800 hover:border-vegas-gold transition-all group">
        <IconBell className="h-5 w-5 text-gray-400 group-hover:text-vegas-gold" />
        {notifications > 0 && (
          <span className="absolute -top-1 -right-1 bg-vegas-gold text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {notifications}
          </span>
        )}
      </button>
    </div>
  );
};

// Status indicator with animations
const StatusIndicator = ({ status = 'active' }) => {
  const statusConfig = {
    active: { color: 'bg-green-500', pulse: true, text: 'Active' },
    idle: { color: 'bg-yellow-500', pulse: false, text: 'Idle' },
    offline: { color: 'bg-gray-500', pulse: false, text: 'Offline' },
    busy: { color: 'bg-vegas-gold', pulse: true, text: 'Busy' }
  };

  const config = statusConfig[status] || statusConfig.active;

  return (
    <div className="flex items-center space-x-2">
      <div className="relative">
        <div className={`w-2 h-2 rounded-full ${config.color}`} />
        {config.pulse && (
          <div className={`absolute inset-0 w-2 h-2 rounded-full ${config.color} animate-ping`} />
        )}
      </div>
      <span className="text-xs text-gray-400">{config.text}</span>
    </div>
  );
};

// Note: RecentActivity component moved to ActivityFeedModal in assignments brick

// Enhanced OdvCentral component
export default function OdvCentral({ children, onShowAuth }) {
  console.log('🏗️ OdvCentral component loading..');
  console.log('📌 OdvCentral received onShowAuth?', !!onShowAuth);
  const { user } = useAuth();
  const { garageId, lotId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  console.log('🔍 Navigation Debug:', {
    pathname: location.pathname,
    garageId,
    lotId,
    garagesAvailable: GARAGES.map(g => g.id)
  });
  
  // State management
  const [sidebarCollapsed, setSidebarCollapsed] = useState(
    localStorage.getItem('sidebarCollapsed') === 'true'
  );
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [currentGarage, setCurrentGarage] = useState(null);
  const [currentLot, setCurrentLot] = useState(lotId);
  const [userStatus, setUserStatus] = useState('active');
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  // Recent activity moved to ActivityFeedModal in assignments brick

  // Check if we're at root (Court Vision)
  const isCourtVision = location.pathname === '/';
  
  // Get current garage from URL or default
  useEffect(() => {
    if (garageId) {
      const garage = GARAGES.find(g => g.id === garageId);
      setCurrentGarage(garage || GARAGES[0]);
      
      // Stage vehicles for this garage
      if (garage) {
        VehicleStager.stageForGarage(garage.id);
      }
    } else {
      setCurrentGarage(null);
    }
  }, [garageId]);

  // Update current lot when URL changes
  useEffect(() => {
    setCurrentLot(lotId);
  }, [lotId]);

  // Persist sidebar state
  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', sidebarCollapsed);
  }, [sidebarCollapsed]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Cmd/Ctrl + K for command palette
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowCommandPalette(true);
      }
      // Cmd/Ctrl + B for sidebar toggle
      if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
        e.preventDefault();
        setSidebarCollapsed(prev => !prev);
      }
      // Escape to close modals
      if (e.key === 'Escape') {
        setShowCommandPalette(false);
        setIsMobileSidebarOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const handleGarageChange = useCallback((garage) => {
    setCurrentGarage(garage);
    navigate(`/${garage.id}`);
    setCurrentLot(null);
    
    // Stage vehicles for the new garage
    VehicleStager.stageForGarage(garage.id);
  }, [navigate]);

  const handleLotSelect = useCallback((selectedLotId) => {
    setCurrentLot(selectedLotId);
    setIsMobileSidebarOpen(false);
  }, []);

  const handleSearch = useCallback((query) => {
    console.debug('Search query:', query);
    // Implement search functionality
  }, []);

  // Calculate if current lot needs special layouts
  const needsFullScreen = useMemo(() => 
    ['assignments', 'clients', 'valets', 'task-bucket'].includes(currentLot),
    [currentLot]
  );
  
  const noPaddingLots = useMemo(() => 
    ['clients', 'valets', 'task-bucket', 'shuttle', 'finance', 
     'finance-terminal', 'leaderboards', 'ratings', 'parkology', 'invoices'].includes(currentLot),
    [currentLot]
  );

  // Find current lot details
  const currentLotDetails = useMemo(() => 
    currentGarage?.lots?.find(l => l.id === currentLot),
    [currentGarage, currentLot]
  );

  return (
    <div className="flex h-screen w-screen text-white overflow-hidden bg-black">
      {/* Command Palette */}
      {showCommandPalette && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-gray-900 border border-gray-800 rounded-xl shadow-2xl">
            <div className="p-4 border-b border-gray-800">
              <input
                type="text"
                placeholder="Type a command or search.."
                className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg outline-none focus:ring-2 focus:ring-vegas-gold"
                autoFocus
              />
            </div>
            <div className="p-4">
              <p className="text-gray-500 text-center">Command palette coming, soon..</p>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}
      
      {/* Column 1: Logo and LotSidebar - Enhanced */}
      <>
          {/* Desktop Sidebar */}
          <div className={`hidden md:flex ${
            sidebarCollapsed ? 'w-16' : 'w-56'
          } transition-all duration-300 ease-in-out flex-shrink-0 bg-gradient-to-b from-gray-900 to-black border-r border-gray-800 flex-col h-screen sticky top-0 overflow-hidden`}>
            {/* Logo Area with collapse button */}
            <div className="h-20 px-4 flex items-center justify-between border-b border-gray-800 flex-shrink-0 bg-black/50">
              <Link to="/" className="group flex items-center" title="Court Vision - Home">
                <img
                  src="/odv-logo.png"
                  alt="ODV Logo"
                  className={`${sidebarCollapsed ? 'h-10' : 'h-16'} w-auto transition-all duration-300 group-hover:brightness-110 cursor-pointer`}
                />
              </Link>
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="p-1.5 text-vegas-gold hover:text-vegas-gold/70 transition-colors"
              >
                {sidebarCollapsed ? <IconChevronRight className="h-5 w-5" /> : <IconChevronLeft className="h-5 w-5" />}
              </button>
            </div>

            {/* Enhanced LotSidebar */}
            {currentGarage && (
              <LotSidebarEnhanced
                garage={currentGarage}
                currentLotId={currentLot}
                collapsed={sidebarCollapsed}
                onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
                isMobileOpen={false}
                onMobileClose={() => {}}
                user={user || { email: 'dev@odv.com' }}  // Temporary dev bypass
              />
            )}

          </div>

          {/* Mobile Sidebar */}
          <div className={`fixed inset-y-0 left-0 z-50 w-56 bg-gradient-to-b from-gray-900 to-black border-r border-gray-800 transform transition-transform duration-300 ease-in-out md:hidden ${
            isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}>
            {/* Mobile Close Button */}
            <button
              onClick={() => setIsMobileSidebarOpen(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white"
            >
              <IconX size={24} />
            </button>
            
            {/* Logo Area */}
            <div className="h-20 px-6 flex items-center justify-center border-b border-gray-800 flex-shrink-0">
              <Link to="/" className="group" title="Court Vision - Home">
                <img
                  src="/odv-logo.png"
                  alt="ODV Logo"
                  className="h-16 w-auto transition-all duration-300 group-hover:brightness-110 cursor-pointer"
                />
              </Link>
            </div>

            {/* Enhanced LotSidebar */}
            {currentGarage && (
              <LotSidebarEnhanced
                garage={currentGarage}
                currentLotId={currentLot}
                collapsed={false}
                onToggleCollapse={() => {}}
                isMobileOpen={isMobileSidebarOpen}
                onMobileClose={() => setIsMobileSidebarOpen(false)}
                user={user}
              />
            )}
          </div>
        </>

      {/* Column 2: Header and Main Content - Enhanced */}
      <div className="flex flex-col flex-grow min-w-0">
        {/* Enhanced Header */}
        <div className="relative">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="md:hidden absolute left-4 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-white z-20"
            >
              <IconMenu size={24} />
            </button>
            
            {/* Professional Garage Header */}
            <GarageHeaderProfessional 
              currentGarage={currentGarage} 
              onGarageChange={handleGarageChange}
              onShowAuth={onShowAuth}
            />
            
          </div>

        {/* Main Content Area with animations */}
        <main className={`flex-grow overflow-hidden bg-black relative ${
          noPaddingLots || !currentLot ? 'p-0' : needsFullScreen ? 'p-2' : 'p-3 sm:p-4 lg:p-6'
        }`}>
          {/* Background gradient effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/20 via-transparent to-vegas-gold/5 pointer-events-none" />
          
          
          {/* Content wrapper with smooth transitions */}
          <div className={`h-full relative z-10 ${noPaddingLots ? '' : needsFullScreen ? 'flex flex-col' : ''}`}>
            {/* Show ODV logo as backdrop when no lot is selected */}
            {(!currentGarage || !currentLot) && (
              <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/95">
                <img 
                  src="/odv-logo.png"
                  alt="Open Door Valet"
                  className="w-96 h-auto opacity-30 animate-pulse"
                  style={{ filter: 'brightness(1.2) saturate(1.5)' }}
                  onError={(e) => {
                    console.error('Failed to load logo:', e.target.src);
                    e.target.src = '/images/odv-logo.png'; // Fallback to images folder
                  }}
                />
              </div>
            )}
            
            <div className={`${needsFullScreen || noPaddingLots ? 'h-full' : 'h-full'} ${needsFullScreen ? 'flex-1' : ''} min-w-0 overflow-hidden ${
              noPaddingLots ? '' : needsFullScreen ? 'border border-gray-800 rounded-lg shadow-xl' : 'rounded-2xl border border-gray-800 shadow-2xl'
            } transition-all duration-300 ${(!currentGarage || !currentLot) ? 'bg-black/95' : ''} relative z-10`}>
              <div className="h-full w-full overflow-y-auto overflow-x-hidden bg-black/90 backdrop-blur-sm">
                {children}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Floating UI Elements */}
      <QuickActions onSearch={handleSearch} notifications={3} />
      {/* Recent Activity moved to ActivityFeedModal in assignments brick */}

      {/* Vegas Gold accent line */}
      <div className="fixed bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-vegas-gold to-transparent opacity-50" />
    </div>
  );
}
