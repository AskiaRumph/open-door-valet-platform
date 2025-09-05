import React, { useState, useEffect } from 'react';
import { useFirestore } from '../../contexts/FirestoreContext';
import { mockAIDevPromptBarData } from '../../contexts/FirestoreContext';
import AidevpromptbarAIButtons from './AidevpromptbarAIButtons';

const AidevpromptbarList = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { db } = useFirestore();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Use mock data for development
        if (process.env.NODE_ENV === 'development' || !db?.supabase) {
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          setItems(mockAIDevPromptBarData);
        } else {
          const { data, error: fetchError } = await db.supabase
            .from('ai-dev-prompt-bar')
            .select('*')
            .order('created_at', { ascending: false });
          
          if (fetchError) {
            throw fetchError;
          }
          
          const itemsData = data.map(item => ({ 
            id: item.id, 
            ...item 
          }));
          setItems(itemsData);
        }
      } catch (error) {
        console.error('Failed to load items:', error);
        setError(error.message || 'Failed to load AI dev prompt bar items');
        // Fallback to mock data on error
        setItems(mockAIDevPromptBarData);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [db]);

  const handleRefresh = () => {
    if (db?.supabase) {
      const fetchItems = async () => {
        try {
          setLoading(true);
          setError(null);
          
          const { data, error: fetchError } = await db.supabase
            .from('ai-dev-prompt-bar')
            .select('*')
            .order('created_at', { ascending: false });
          
          if (fetchError) {
            throw fetchError;
          }
          
          const itemsData = data.map(item => ({ 
            id: item.id, 
            ...item 
          }));
          setItems(itemsData);
        } catch (error) {
          console.error('Failed to refresh items:', error);
          setError(error.message || 'Failed to refresh AI dev prompt bar items');
        } finally {
          setLoading(false);
        }
      };
      
      fetchItems();
    }
  };

  const handleViewItem = (item) => {
    console.log('Viewing item:', item);
    // Implement view functionality
  };

  const handleEditItem = (item) => {
    console.log('Editing item:', item);
    // Implement edit functionality
  };

  const handleDeleteItem = async (itemId) => {
    try {
      const { error } = await db.supabase
        .from('ai-dev-prompt-bar')
        .delete()
        .eq('id', itemId);
      
      if (error) {
        throw error;
      }
      
      // Remove from local state
      setItems(prevItems => prevItems.filter(item => item.id !== itemId));
    } catch (error) {
      console.error('Failed to delete item:', error);
      setError(error.message || 'Failed to delete item');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-vegas-gold"></div>
        <span className="ml-2 text-gray-400">Loading AI dev prompt bar...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-900/20 border border-red-800 rounded-lg">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">⚠️</span>
          <div>
            <h3 className="text-red-400 font-semibold mb-2">Error Loading Data</h3>
            <p className="text-red-300 text-sm mb-4">{error}</p>
            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-red-800 text-white rounded hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-black min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="bg-gray-900 rounded-lg shadow-xl p-6 mb-6 border border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-vegas-gold">
              AI Dev Prompt Bar
            </h1>
            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-vegas-gold text-black rounded-lg hover:bg-vegas-gold/80 transition-colors font-medium"
            >
              Refresh
            </button>
          </div>
          
          <AidevpromptbarAIButtons />
        </div>
        
        {/* Items List Section */}
        <div className="bg-gray-900 rounded-lg shadow-xl p-6 border border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">
              All AI Dev Prompt Bar Items
            </h2>
            <span className="text-sm text-gray-400">
              {items.length} item{items.length !== 1 ? 's' : ''}
            </span>
          </div>
          
          {items.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <div className="text-6xl mb-4">🤖</div>
              <h3 className="text-xl font-semibold mb-2">No AI Dev Prompt Bar Items Found</h3>
              <p className="text-gray-500">Create your first AI dev prompt bar item to get started!</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {items.map(item => (
                <div 
                  key={item.id} 
                  className="border border-gray-700 rounded-lg p-4 hover:shadow-lg hover:border-vegas-gold/50 transition-all duration-200 bg-gray-800/50"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-white text-lg mb-1">
                        {item.name || 'Untitled Prompt'}
                      </h3>
                      <p className="text-gray-300 text-sm mb-2">
                        {item.description || 'No description provided'}
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-gray-400">
                        <span>
                          Created: {new Date(item.created_at).toLocaleDateString()}
                        </span>
                        {item.updated_at && (
                          <span>
                            Updated: {new Date(item.updated_at).toLocaleDateString()}
                          </span>
                        )}
                        {item.category && (
                          <span className="px-2 py-1 bg-vegas-gold/20 text-vegas-gold rounded">
                            {item.category}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <button 
                        onClick={() => handleViewItem(item)}
                        className="px-3 py-1 text-blue-400 hover:text-blue-300 hover:bg-blue-900/20 rounded text-sm transition-colors"
                      >
                        View
                      </button>
                      <button 
                        onClick={() => handleEditItem(item)}
                        className="px-3 py-1 text-green-400 hover:text-green-300 hover:bg-green-900/20 rounded text-sm transition-colors"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteItem(item.id)}
                        className="px-3 py-1 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded text-sm transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  
                  {/* Additional item details */}
                  {item.tags && item.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {item.tags.map((tag, index) => (
                        <span 
                          key={index}
                          className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AidevpromptbarList;
