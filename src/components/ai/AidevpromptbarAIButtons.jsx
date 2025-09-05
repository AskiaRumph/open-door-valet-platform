import React, { useState } from 'react';
import { IconPlus, IconSearch, IconFilter, IconDownload, IconUpload, IconRefresh } from '@tabler/icons-react';

const AidevpromptbarAIButtons = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);

  const handleCreateNew = () => {
    setShowCreateModal(true);
    console.log('Creating new AI dev prompt bar item...');
  };

  const handleSearch = () => {
    setShowSearchModal(true);
    console.log('Opening search...');
  };

  const handleFilter = () => {
    setShowFilterModal(true);
    console.log('Opening filters...');
  };

  const handleExport = () => {
    console.log('Exporting AI dev prompt bar items...');
    // Implement export functionality
  };

  const handleImport = () => {
    console.log('Importing AI dev prompt bar items...');
    // Implement import functionality
  };

  const handleRefresh = () => {
    console.log('Refreshing AI dev prompt bar items...');
    // Implement refresh functionality
  };

  return (
    <div className="space-y-4">
      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleCreateNew}
          className="flex items-center space-x-2 px-4 py-2 bg-vegas-gold text-black rounded-lg hover:bg-vegas-gold/80 transition-colors font-medium"
        >
          <IconPlus className="h-4 w-4" />
          <span>Create New</span>
        </button>

        <button
          onClick={handleSearch}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
        >
          <IconSearch className="h-4 w-4" />
          <span>Search</span>
        </button>

        <button
          onClick={handleFilter}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
        >
          <IconFilter className="h-4 w-4" />
          <span>Filter</span>
        </button>

        <button
          onClick={handleExport}
          className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <IconDownload className="h-4 w-4" />
          <span>Export</span>
        </button>

        <button
          onClick={handleImport}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <IconUpload className="h-4 w-4" />
          <span>Import</span>
        </button>

        <button
          onClick={handleRefresh}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
        >
          <IconRefresh className="h-4 w-4" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-vegas-gold/20 rounded-lg flex items-center justify-center">
              <span className="text-vegas-gold text-lg">🤖</span>
            </div>
            <div>
              <p className="text-sm text-gray-400">Total Prompts</p>
              <p className="text-xl font-semibold text-white">0</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
              <span className="text-green-500 text-lg">✅</span>
            </div>
            <div>
              <p className="text-sm text-gray-400">Active</p>
              <p className="text-xl font-semibold text-white">0</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <span className="text-blue-500 text-lg">📊</span>
            </div>
            <div>
              <p className="text-sm text-gray-400">Categories</p>
              <p className="text-xl font-semibold text-white">0</p>
            </div>
          </div>
        </div>
      </div>

      {/* Modals would go here */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-white mb-4">Create New AI Dev Prompt</h3>
            <p className="text-gray-400 text-sm mb-4">Create modal functionality coming soon...</p>
            <button
              onClick={() => setShowCreateModal(false)}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showSearchModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-white mb-4">Search AI Dev Prompts</h3>
            <p className="text-gray-400 text-sm mb-4">Search functionality coming soon...</p>
            <button
              onClick={() => setShowSearchModal(false)}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showFilterModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-white mb-4">Filter AI Dev Prompts</h3>
            <p className="text-gray-400 text-sm mb-4">Filter functionality coming soon...</p>
            <button
              onClick={() => setShowFilterModal(false)}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AidevpromptbarAIButtons;
