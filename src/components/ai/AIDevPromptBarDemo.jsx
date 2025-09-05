import React from 'react';
import AidevpromptbarList from './AidevpromptbarList';

const AIDevPromptBarDemo = () => {
  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-black border-b border-gray-800 p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-vegas-gold mb-2">
            AI Dev Prompt Bar Demo
          </h1>
          <p className="text-gray-400">
            A powerful tool for managing AI development prompts with Supabase integration
          </p>
        </div>
      </div>

      {/* Main Content */}
      <AidevpromptbarList />
    </div>
  );
};

export default AIDevPromptBarDemo;
