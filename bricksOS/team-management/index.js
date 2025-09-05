import React from 'react';

// ValetTable component
const ValetTable = ({ garage, lot }) => {
  return (
    <div className="p-6 bg-black min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-vegas-gold mb-2">
            Valet Team Management
          </h1>
          <p className="text-gray-400">
            Manage your valet team for {garage?.name} garage
          </p>
        </div>

        {/* Team Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Valets</p>
                <p className="text-2xl font-bold text-vegas-gold">24</p>
              </div>
              <div className="w-12 h-12 bg-vegas-gold/20 rounded-lg flex items-center justify-center">
                <i className="fas fa-users text-vegas-gold text-xl"></i>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Active Today</p>
                <p className="text-2xl font-bold text-success-green">18</p>
              </div>
              <div className="w-12 h-12 bg-success-green/20 rounded-lg flex items-center justify-center">
                <i className="fas fa-user-check text-success-green text-xl"></i>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">On Break</p>
                <p className="text-2xl font-bold text-warning-yellow">3</p>
              </div>
              <div className="w-12 h-12 bg-warning-yellow/20 rounded-lg flex items-center justify-center">
                <i className="fas fa-coffee text-warning-yellow text-xl"></i>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Off Duty</p>
                <p className="text-2xl font-bold text-gray-400">3</p>
              </div>
              <div className="w-12 h-12 bg-gray-600/20 rounded-lg flex items-center justify-center">
                <i className="fas fa-moon text-gray-400 text-xl"></i>
              </div>
            </div>
          </div>
        </div>

        {/* Valet Table */}
        <div className="bg-gray-900 rounded-lg border border-gray-800">
          <div className="p-6 border-b border-gray-800">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-white">Valet Team</h2>
              <button className="bg-vegas-gold text-black px-4 py-2 rounded-lg font-semibold hover:bg-vegas-gold/80 transition-colors">
                <i className="fas fa-plus mr-2"></i>Add Valet
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Valet</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Role</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Location</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Rating</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                <tr className="hover:bg-gray-800/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-vegas-gold/20 rounded-full flex items-center justify-center mr-4">
                        <span className="text-vegas-gold font-semibold text-lg">JD</span>
                      </div>
                      <div>
                        <div className="text-white font-medium">John Doe</div>
                        <div className="text-gray-400 text-sm">john.doe@valet.com</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-vegas-gold/20 text-vegas-gold text-xs rounded-full">
                      Senior Valet
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-success-green/20 text-success-green text-xs rounded-full">
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-300">Downtown Plaza</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex text-yellow-400">
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                      </div>
                      <span className="ml-2 text-gray-400 text-sm">4.9</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-ai-blue hover:text-ai-blue/80 mr-3">
                      <i className="fas fa-eye"></i>
                    </button>
                    <button className="text-success-green hover:text-success-green/80 mr-3">
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
                      <div className="w-12 h-12 bg-ai-blue/20 rounded-full flex items-center justify-center mr-4">
                        <span className="text-ai-blue font-semibold text-lg">SM</span>
                      </div>
                      <div>
                        <div className="text-white font-medium">Sarah Miller</div>
                        <div className="text-gray-400 text-sm">sarah.miller@valet.com</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-ai-blue/20 text-ai-blue text-xs rounded-full">
                      Valet
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-warning-yellow/20 text-warning-yellow text-xs rounded-full">
                      On Break
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-300">Mall Entrance</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex text-yellow-400">
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="far fa-star"></i>
                      </div>
                      <span className="ml-2 text-gray-400 text-sm">4.2</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-ai-blue hover:text-ai-blue/80 mr-3">
                      <i className="fas fa-eye"></i>
                    </button>
                    <button className="text-success-green hover:text-success-green/80 mr-3">
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
                      <div className="w-12 h-12 bg-success-green/20 rounded-full flex items-center justify-center mr-4">
                        <span className="text-success-green font-semibold text-lg">MJ</span>
                      </div>
                      <div>
                        <div className="text-white font-medium">Mike Johnson</div>
                        <div className="text-gray-400 text-sm">mike.johnson@valet.com</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-success-green/20 text-success-green text-xs rounded-full">
                      Lead Valet
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-success-green/20 text-success-green text-xs rounded-full">
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-300">Hotel Lobby</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex text-yellow-400">
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                      </div>
                      <span className="ml-2 text-gray-400 text-sm">5.0</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-ai-blue hover:text-ai-blue/80 mr-3">
                      <i className="fas fa-eye"></i>
                    </button>
                    <button className="text-success-green hover:text-success-green/80 mr-3">
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
export default ValetTable;
export { ValetTable };
