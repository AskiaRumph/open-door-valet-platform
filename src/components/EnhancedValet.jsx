import React, { useState, useEffect, Suspense, lazy } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import brickRegistry from './BrickRegistry';
import { BRICK_MANIFESTS } from './BrickManifest';

/**
 * EnhancedValet - Smart component loader with micro-frontend support
 * 
 * This enhanced valet knows:
 * - Which vehicles (components) are in which garage (domain)
 * - How to load only what's needed, when it's needed
 * - How to manage dependencies between bricks
 * - How to unload bricks to free memory
 * 
 * The complete metaphor:
 * - Garages: Feature domains (operations, finance, etc.)
 * - Lots: Specific features (assignments, clients, etc.)
 * - Vehicles: Components that run in the lots
 * - Bricks: The actual code modules
 * - Valet: This service that fetches and manages everything
 */

// Loading states for better UX
const LoadingVehicle = ({ vehicleName, brickId }) => (
  <div className="flex items-center justify-center p-8">
    <div className="text-center">
      <div className="relative">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vegas-gold mx-auto mb-4"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          🚗
        </div>
      </div>
      <p className="text-gray-400">Valet fetching {vehicleName}</p>
      <p className="text-xs text-gray-500 mt-1">from {brickId} garage</p>
    </div>
  </div>
);

// Error state with retry
const VehicleError = ({ error, retry, vehicleInfo }) => (
  <div className="p-6 bg-red-900/20 border border-red-800 rounded-lg">
    <div className="flex items-start space-x-3">
      <span className="text-2xl">🚫</span>
      <div className="flex-1">
        <h3 className="text-red-400 font-semibold mb-2">
          Vehicle Not Available
        </h3>
        <p className="text-red-300 text-sm">
          Unable to fetch {vehicleInfo.vehicleName} from {vehicleInfo.brickId}
        </p>
        <details className="mt-2">
          <summary className="cursor-pointer text-red-400 text-sm hover:text-red-300">
            Error Details
          </summary>
          <pre className="mt-2 text-xs bg-red-900/30 p-2 rounded overflow-auto text-red-200">
            {error.message}
          </pre>
        </details>
        <button 
          onClick={retry}
          className="mt-4 px-4 py-2 bg-red-800 text-white rounded hover:bg-red-700 transition-colors"
        >
          Call Valet Again
        </button>
      </div>
    </div>
  </div>
);

// Brick status monitor
const BrickStatus = ({ brickId, status }) => {
  const statusColors = {
    loading: 'text-yellow-500',
    loaded: 'text-green-500',
    error: 'text-red-500',
    unloaded: 'text-gray-500'
  };

  return (
    <div className={`flex items-center space-x-2 text-xs ${statusColors[status]}`}>
      <div className="w-2 h-2 rounded-full bg-current animate-pulse" />
      <span>{brickId}: {status}</span>
    </div>
  );
};

class EnhancedValet extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      status: 'idle',
      error: null,
      loadedBricks: new Set(),
      Vehicle: null
    };
  }

  async componentDidMount() {
    await this.fetchVehicle();
  }

  async componentDidUpdate(prevProps) {
    // If brick or vehicle changed, reload
    if (
      prevProps.brickId !== this.props.brickId || 
      prevProps.vehicleName !== this.props.vehicleName
    ) {
      await this.fetchVehicle();
    }
  }

  async componentWillUnmount() {
    // Optionally unload brick to free memory
    const { brickId, autoUnload = false } = this.props;
    
    if (autoUnload && brickId) {
      console.log(`[EnhancedValet] Parking lot closed, unloading ${brickId}`);
      await brickRegistry.unloadBrick(brickId);
    }
  }

  async fetchVehicle() {
    const { brickId, vehicleName = 'index', fallback } = this.props;
    
    this.setState({ status: 'loading', error: null });

    try {
      // First, register the brick if not already registered
      if (!brickRegistry.getManifest(brickId)) {
        const manifest = BRICK_MANIFESTS[brickId];
        if (manifest) {
          brickRegistry.register(brickId, manifest);
        } else {
          // Try to load brick.config.js dynamically
          await this.loadBrickConfig(brickId);
        }
      }

      // Load the brick module
      const brickModule = await brickRegistry.loadBrick(brickId);
      
      // Get the specific vehicle (component) from the brick
      let Vehicle = null;
      
      // Try different paths to find the vehicle
      const vehiclePaths = [
        brickModule[vehicleName],
        brickModule.components?.[vehicleName],
        brickModule.vehicles?.[vehicleName],
        brickModule.default?.[vehicleName],
        brickModule.default
      ];

      for (const path of vehiclePaths) {
        if (path) {
          Vehicle = path;
          break;
        }
      }

      // If still not found and we have a components map, try lazy loading
      if (!Vehicle && brickModule.components) {
        const componentPath = brickModule.components[vehicleName];
        if (componentPath) {
          Vehicle = lazy(() => this.loadVehicleComponent(brickId, componentPath));
        }
      }

      // Fallback to provided component
      if (!Vehicle && fallback) {
        console.warn(`[EnhancedValet] Vehicle ${vehicleName} not found in ${brickId}, using fallback`);
        Vehicle = fallback;
      }

      if (!Vehicle) {
        throw new Error(`Vehicle "${vehicleName}" not found in brick "${brickId}"`);
      }

      this.setState({ 
        status: 'loaded', 
        Vehicle,
        loadedBricks: new Set([...this.state.loadedBricks, brickId])
      });

    } catch (error) {
      console.error(`[EnhancedValet] Failed to fetch vehicle:`, error);
      this.setState({ status: 'error', error });
    }
  }

  async loadBrickConfig(brickId) {
    try {
      // Try to dynamically import brick.config.js
      const configModule = await import(`../../../bricksOS/${brickId}/brick.config.js`);
      const config = configModule.default || configModule[`${brickId}BrickConfig`];
      
      if (config) {
        // Convert brick.config.js format to manifest format
        const manifest = {
          name: config.name,
          version: config.version,
          description: config.description,
          components: config.components || config.vehicles || {},
          services: config.services || [],
          dependencies: config.dependencies?.required || [],
          priority: config.priority || 'normal',
          strategy: config.loadingStrategy || 'lazy'
        };
        
        brickRegistry.register(brickId, manifest);
      }
    } catch (error) {
      console.warn(`[EnhancedValet] Could not load brick.config.js for ${brickId}:`, error);
    }
  }

  async loadVehicleComponent(brickId, componentPath) {
    // Handle relative paths
    const fullPath = componentPath.startsWith('.') 
      ? `../../../bricksOS/${brickId}/${componentPath.slice(2)}`
      : componentPath;
    
    const module = await import(fullPath);
    return { default: module.default || module };
  }

  retry = () => {
    this.fetchVehicle();
  }

  render() {
    const { status, error, Vehicle } = this.state;
    const { vehicleName, brickId, showStatus = false, ...vehicleProps } = this.props;

    // Show brick status in development
    if (showStatus && import.meta.env.DEV) {
      const stats = brickRegistry.getStats();
      return (
        <div className="fixed bottom-20 right-6 bg-black/90 border border-gray-800 rounded-lg p-3 text-xs">
          <div className="font-semibold text-gray-400 mb-2">Brick Registry</div>
          <div className="space-y-1">
            <div>Loaded: {stats.loaded}/{stats.registered}</div>
            {stats.loadedBricks.map(id => (
              <BrickStatus key={id} brickId={id} status="loaded" />
            ))}
          </div>
        </div>
      );
    }

    // Loading state
    if (status === 'loading') {
      return <LoadingVehicle vehicleName={vehicleName} brickId={brickId} />;
    }

    // Error state
    if (status === 'error') {
      return (
        <VehicleError 
          error={error}
          retry={this.retry}
          vehicleInfo={{ vehicleName, brickId }}
        />
      );
    }

    // Loaded state
    if (status === 'loaded' && Vehicle) {
      return (
        <ErrorBoundary
          FallbackComponent={({ error, resetErrorBoundary }) => (
            <VehicleError 
              error={error}
              retry={resetErrorBoundary}
              vehicleInfo={{ vehicleName, brickId }}
            />
          )}
        >
          <Suspense fallback={<LoadingVehicle vehicleName={vehicleName} brickId={brickId} />}>
            <Vehicle {...vehicleProps} />
          </Suspense>
        </ErrorBoundary>
      );
    }

    // Idle state
    return null;
  }
}

// Hooks version for modern React
export function useValet(brickId, vehicleName = 'index') {
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);
  const [Vehicle, setVehicle] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function loadVehicle() {
      setStatus('loading');
      setError(null);

      try {
        // Ensure brick is registered
        if (!brickRegistry.getManifest(brickId)) {
          const manifest = BRICK_MANIFESTS[brickId];
          if (manifest) {
            brickRegistry.register(brickId, manifest);
          }
        }

        // Load brick
        const brickModule = await brickRegistry.loadBrick(brickId);
        
        // Find vehicle
        const vehicle = brickModule[vehicleName] || 
                       brickModule.components?.[vehicleName] ||
                       brickModule.default;

        if (mounted) {
          setVehicle(() => vehicle);
          setStatus('loaded');
        }
      } catch (err) {
        if (mounted) {
          setError(err);
          setStatus('error');
        }
      }
    }

    loadVehicle();

    return () => {
      mounted = false;
    };
  }, [brickId, vehicleName]);

  return { status, error, Vehicle };
}

// Preload critical bricks on app start
export async function preloadCriticalBricks() {
  console.log('[EnhancedValet] Preloading critical bricks...');
  
  // Register all manifests
  Object.entries(BRICK_MANIFESTS).forEach(([id, manifest]) => {
    brickRegistry.register(id, manifest);
  });

  // Preload critical bricks
  await brickRegistry.preloadPriorityBricks();
  
  console.log('[EnhancedValet] Critical bricks loaded:', brickRegistry.getStats());
}

export default EnhancedValet;
