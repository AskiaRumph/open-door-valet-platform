import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './hooks/useAuth.jsx'
import { FirestoreProvider } from './contexts/FirestoreContext'
import OdvCentral from './components/layout/OdvCentral'
import ParkingLot from './components/ParkingLot'
import AIDevPromptBarDemo from './components/ai/AIDevPromptBarDemo'
import EnhancedValet from './components/EnhancedValet'
import { preloadCriticalBricks } from './components/EnhancedValet'

// Demo components for different lots
const DashboardLot = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold text-vegas-gold mb-6">Operations Dashboard</h1>
    <EnhancedValet 
      brickId="dashboard-core"
      vehicleName="DashboardLayout"
      showStatus={true}
    />
  </div>
)

const AssignmentsLot = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold text-vegas-gold mb-6">Assignment Management</h1>
    <EnhancedValet 
      brickId="assignment-system"
      vehicleName="AssignmentTable"
      showStatus={true}
    />
  </div>
)

const ValetsLot = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold text-vegas-gold mb-6">Valet Team Management</h1>
    <EnhancedValet 
      brickId="team-management"
      vehicleName="TeamTable"
      showStatus={true}
    />
  </div>
)

const ClientsLot = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold text-vegas-gold mb-6">Client Management</h1>
    <EnhancedValet 
      brickId="client-management"
      vehicleName="ClientTable"
      showStatus={true}
    />
  </div>
)

const AnalyticsLot = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold text-vegas-gold mb-6">Analytics & Insights</h1>
    <EnhancedValet 
      brickId="ai-insights"
      vehicleName="AIChat"
      showStatus={true}
    />
  </div>
)

function App() {
  React.useEffect(() => {
    // Preload critical bricks on app start
    preloadCriticalBricks()
  }, [])

  return (
    <AuthProvider>
      <FirestoreProvider>
        <Router>
          <div className="min-h-screen bg-black text-white">
            <Routes>
              {/* Root route */}
              <Route path="/" element={<OdvCentral />} />
              
              {/* AI Dev Prompt Bar Demo */}
              <Route path="/ai-dev-prompt-bar" element={<AIDevPromptBarDemo />} />
              
              {/* Garage routes with ParkingLot */}
              <Route path="/:garageId" element={<OdvCentral><ParkingLot /></OdvCentral>} />
              
              {/* Lot routes with ParkingLot */}
              <Route path="/:garageId/:lotId" element={<OdvCentral><ParkingLot /></OdvCentral>} />
            </Routes>
          </div>
        </Router>
      </FirestoreProvider>
    </AuthProvider>
  )
}

export default App
