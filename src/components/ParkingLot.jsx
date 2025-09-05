import React from 'react';
import { useParams } from 'react-router-dom';
import EnhancedValet from './EnhancedValet';
import { GARAGES } from '../constants/garages';

/**
 * ParkingLot - Dynamic component loader based on garage/lot routing
 * 
 * This component determines which bricksOS component to load
 * based on the current garage and lot from the URL.
 * 
 * Just like a real parking lot where each space has a specific vehicle,
 * each lot in our garage has a specific business component (brick).
 */
const ParkingLot = () => {
  const { garageId, lotId } = useParams();
  
  // Find the current garage and lot configuration
  const garage = GARAGES.find(g => g.id === garageId);
  const lot = garage?.lots?.find(l => l.id === lotId);
  
  // If no garage found
  if (!garage) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-2xl text-gray-400 mb-2">🚫 Garage Not Found</h2>
          <p className="text-gray-500">
            The requested garage "{garageId}" could not be found.
          </p>
        </div>
      </div>
    );
  }
  
  // If garage but no lot - show a simple garage overview
  if (!lotId) {
    console.log(`🏢 ParkingLot: Showing overview for ${garageId} garage`);
    return (
      <div className="h-full w-full p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-4">
            {garage.name} Garage
          </h1>
          <p className="text-gray-400 mb-8">
            {garage.description || 'Select a lot from the sidebar to get started.'}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {garage.lots?.map(lot => (
              <div 
                key={lot.id}
                className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-yellow-600 transition-colors cursor-pointer"
                onClick={() => window.location.href = `/${garageId}/${lot.id}`}
              >
                <h3 className="text-xl font-semibold text-white mb-2">{lot.name}</h3>
                <p className="text-gray-400 text-sm">{lot.description || 'Manage ' + lot.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  // If lot not found in garage
  if (!lot) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-2xl text-gray-400 mb-2">🚫 Lot Not Found</h2>
          <p className="text-gray-500">
            The requested lot "{lotId}" in garage "{garageId}" could not be found.
          </p>
        </div>
      </div>
    );
  }
  
  // Get the brick ID from the lot configuration
  const brickId = lot.brickId || lotId;
  
  // Get component name from lot configuration
  // Priority order:
  // 1. lot.parking.component (for fullscreen layouts)
  // 2. lot.parking.slots.main (for standard layouts)
  // 3. lot.componentName (legacy support)
  // 4. 'index' (default fallback)
  let componentName = 'index';
  
  if (lot.parking) {
    if (lot.parking.component) {
      // Fullscreen layout with single component
      componentName = lot.parking.component;
    } else if (lot.parking.slots?.main) {
      // Standard layout with main slot
      componentName = lot.parking.slots.main;
    }
  } else if (lot.componentName) {
    // Legacy support for direct componentName
    componentName = lot.componentName;
  }
  
  // Log a warning if we're falling back to index
  if (componentName === 'index') {
    console.warn(`⚠️ ParkingLot: No component specified for ${garageId}/${lotId}, using 'index' fallback`);
  }
  
  console.log(`🚗 ParkingLot: EnhancedValet fetching ${brickId}/${componentName} for ${garageId}/${lotId}`);
  
  return (
    <div className="h-full w-full">
      <EnhancedValet 
        brickId={brickId} 
        vehicleName={componentName}
        garage={garage}
        lot={lot}
        autoUnload={false}
      />
    </div>
  );
};

export default ParkingLot;
