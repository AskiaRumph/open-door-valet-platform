import React from 'react';

// AssignmentTable component
const AssignmentTable = ({ garage, lot }) => {
  return (
    <div className="p-6 bg-black min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-vegas-gold mb-2">
            Assignment Management
          </h1>
          <p className="text-gray-400">
            Manage valet assignments and scheduling for {garage?.name} garage
          </p>
        </div>

        {/* Assignment Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Active Assignments</p>
                <p className="text-2xl font-bold text-vegas-gold">24</p>
              </div>
              <div className="w-12 h-12 bg-vegas-gold/20 rounded-lg flex items-center justify-center">
                <i className="fas fa-calendar-check text-vegas-gold text-xl"></i>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Scheduled Hours</p>
                <p className="text-2xl font-bold text-ai-blue">168</p>
              </div>
              <div className="w-12 h-12 bg-ai-blue/20 rounded-lg flex items-center justify-center">
                <i className="fas fa-clock text-ai-blue text-xl"></i>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Coverage Rate</p>
                <p className="text-2xl font-bold text-success-green">94%</p>
              </div>
              <div className="w-12 h-12 bg-success-green/20 rounded-lg flex items-center justify-center">
                <i className="fas fa-chart-line text-success-green text-xl"></i>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Conflicts</p>
                <p className="text-2xl font-bold text-warning-yellow">3</p>
              </div>
              <div className="w-12 h-12 bg-warning-yellow/20 rounded-lg flex items-center justify-center">
                <i className="fas fa-exclamation-triangle text-warning-yellow text-xl"></i>
              </div>
            </div>
          </div>
        </div>

        {/* Assignment Table */}
        <div className="bg-gray-900 rounded-lg border border-gray-800">
          <div className="p-6 border-b border-gray-800">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-white">Current Assignments</h2>
              <button className="bg-vegas-gold text-black px-4 py-2 rounded-lg font-semibold hover:bg-vegas-gold/80 transition-colors">
                <i className="fas fa-plus mr-2"></i>New Assignment
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Valet</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Location</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Shift</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                <tr className="hover:bg-gray-800/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-vegas-gold/20 rounded-full flex items-center justify-center mr-3">
                        <span className="text-vegas-gold font-semibold">JD</span>
                      </div>
                      <div>
                        <div className="text-white font-medium">John Doe</div>
                        <div className="text-gray-400 text-sm">Senior Valet</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-white">Downtown Plaza</td>
                  <td className="px-6 py-4 text-gray-300">9:00 AM - 5:00 PM</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-success-green/20 text-success-green text-xs rounded-full">
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-ai-blue hover:text-ai-blue/80 mr-3">
                      <i className="fas fa-edit"></i>
                    </button>
                    <button className="text-error-red hover:text-error-red/80">
                      <i className="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
                <tr className="hover:bg-gray-800/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-ai-blue/20 rounded-full flex items-center justify-center mr-3">
                        <span className="text-ai-blue font-semibold">SM</span>
                      </div>
                      <div>
                        <div className="text-white font-medium">Sarah Miller</div>
                        <div className="text-gray-400 text-sm">Valet</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-white">Mall Entrance</td>
                  <td className="px-6 py-4 text-gray-300">2:00 PM - 10:00 PM</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-warning-yellow/20 text-warning-yellow text-xs rounded-full">
                      Pending
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-ai-blue hover:text-ai-blue/80 mr-3">
                      <i className="fas fa-edit"></i>
                    </button>
                    <button className="text-error-red hover:text-error-red/80">
                      <i className="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
                <tr className="hover:bg-gray-800/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-success-green/20 rounded-full flex items-center justify-center mr-3">
                        <span className="text-success-green font-semibold">MJ</span>
                      </div>
                      <div>
                        <div className="text-white font-medium">Mike Johnson</div>
                        <div className="text-gray-400 text-sm">Lead Valet</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-white">Hotel Lobby</td>
                  <td className="px-6 py-4 text-gray-300">6:00 AM - 2:00 PM</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-success-green/20 text-success-green text-xs rounded-full">
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-ai-blue hover:text-ai-blue/80 mr-3">
                      <i className="fas fa-edit"></i>
                    </button>
                    <button className="text-error-red hover:text-error-red/80">
                      <i className="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

// Export the component
export default AssignmentTable;
export { AssignmentTable };
