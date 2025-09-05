import React from 'react'
import EnhancedValet from './components/EnhancedValet'
import { preloadCriticalBricks } from './components/EnhancedValet'

function App() {
  React.useEffect(() => {
    // Preload critical bricks on app start
    preloadCriticalBricks()
  }, [])

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 p-4">
        <h1 className="text-2xl font-bold text-vegas-gold">
          Valet Platform - Micro-Frontend Demo
        </h1>
      </header>
      
      <main className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Dashboard Core */}
          <div className="bg-gray-800 rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-4">Dashboard Core</h2>
            <EnhancedValet 
              brickId="dashboard-core"
              vehicleName="DashboardLayout"
              showStatus={true}
            />
          </div>

          {/* Team Management */}
          <div className="bg-gray-800 rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-4">Team Management</h2>
            <EnhancedValet 
              brickId="team-management"
              vehicleName="TeamTable"
              showStatus={true}
            />
          </div>

          {/* Assignment System */}
          <div className="bg-gray-800 rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-4">Assignment System</h2>
            <EnhancedValet 
              brickId="assignment-system"
              vehicleName="AssignmentTable"
              showStatus={true}
            />
          </div>

          {/* AI Insights */}
          <div className="bg-gray-800 rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-4">AI Insights</h2>
            <EnhancedValet 
              brickId="ai-insights"
              vehicleName="AIChat"
              showStatus={true}
            />
          </div>

          {/* Client Management */}
          <div className="bg-gray-800 rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-4">Client Management</h2>
            <EnhancedValet 
              brickId="client-management"
              vehicleName="ClientTable"
              showStatus={true}
            />
          </div>

          {/* Ticket System */}
          <div className="bg-gray-800 rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-4">Ticket System</h2>
            <EnhancedValet 
              brickId="ticket-system"
              vehicleName="TicketTable"
              showStatus={true}
            />
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
