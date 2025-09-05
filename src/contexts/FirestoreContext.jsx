import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { supabaseConfig, devConfig } from '../config/supabase';

// Create Supabase client
const supabase = createClient(supabaseConfig.url, supabaseConfig.anonKey);

// Create context
const FirestoreContext = createContext();

// Provider component
export const FirestoreProvider = ({ children }) => {
  const [db, setDb] = useState({ supabase });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        setLoading(true);
        setError(null);

        // Test connection
        const { data, error: testError } = await supabase
          .from('ai-dev-prompt-bar')
          .select('count')
          .limit(1);

        if (testError) {
          console.warn('Supabase connection test failed:', testError);
          // Don't throw error, just log it
        }

        setDb({ supabase });
        console.log('Database initialized successfully');
      } catch (err) {
        console.error('Failed to initialize database:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    initializeDatabase();
  }, []);

  const value = {
    db,
    loading,
    error,
    supabase
  };

  return (
    <FirestoreContext.Provider value={value}>
      {children}
    </FirestoreContext.Provider>
  );
};

// Custom hook to use the context
export const useFirestore = () => {
  const context = useContext(FirestoreContext);
  if (!context) {
    throw new Error('useFirestore must be used within a FirestoreProvider');
  }
  return context;
};

// Mock data for development
export const mockAIDevPromptBarData = [
  {
    id: '1',
    name: 'React Component Generator',
    description: 'Generate React components with TypeScript and Tailwind CSS',
    category: 'Frontend',
    tags: ['react', 'typescript', 'tailwind'],
    prompt: 'Create a React component that...',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    name: 'API Endpoint Creator',
    description: 'Generate REST API endpoints with proper error handling',
    category: 'Backend',
    tags: ['api', 'rest', 'nodejs'],
    prompt: 'Create a REST API endpoint that...',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Database Schema Designer',
    description: 'Design database schemas with relationships and constraints',
    category: 'Database',
    tags: ['database', 'schema', 'sql'],
    prompt: 'Design a database schema for...',
    created_at: new Date(Date.now() - 172800000).toISOString(),
    updated_at: new Date().toISOString()
  }
];

// Mock functions for development
export const mockFirestoreFunctions = {
  async getAIDevPromptBarItems() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { data: mockAIDevPromptBarData, error: null };
  },

  async createAIDevPromptBarItem(item) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    const newItem = {
      id: Date.now().toString(),
      ...item,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    return { data: newItem, error: null };
  },

  async updateAIDevPromptBarItem(id, updates) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    const updatedItem = {
      ...updates,
      id,
      updated_at: new Date().toISOString()
    };
    return { data: updatedItem, error: null };
  },

  async deleteAIDevPromptBarItem(id) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return { data: { id }, error: null };
  }
};

export default FirestoreContext;
