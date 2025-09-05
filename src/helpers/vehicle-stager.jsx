/**
 * VehicleStager - Manages dynamic loading of components (vehicles) for different garages
 * 
 * This helper manages the staging and loading of components based on the current garage context.
 * It ensures that only relevant components are loaded for the current business domain.
 */

class VehicleStager {
  constructor() {
    this.stagedVehicles = new Map();
    this.loadingPromises = new Map();
    this.garageContexts = new Map();
  }

  /**
   * Stage vehicles for a specific garage
   * @param {string} garageId - The garage ID to stage vehicles for
   */
  stageForGarage(garageId) {
    console.log(`[VehicleStager] Staging vehicles for garage: ${garageId}`);
    
    const garageConfig = this.getGarageConfig(garageId);
    if (!garageConfig) {
      console.warn(`[VehicleStager] No configuration found for garage: ${garageId}`);
      return;
    }

    // Store garage context
    this.garageContexts.set(garageId, {
      stagedAt: Date.now(),
      vehicles: garageConfig.vehicles || []
    });

    // Preload critical vehicles
    this.preloadCriticalVehicles(garageId, garageConfig);
  }

  /**
   * Get garage configuration
   * @param {string} garageId - The garage ID
   * @returns {Object} Garage configuration
   */
  getGarageConfig(garageId) {
    const configs = {
      'operations': {
        vehicles: [
          'DashboardLayout',
          'AssignmentTable',
          'ValetTable',
          'LocationManager',
          'ScheduleCalendar'
        ],
        critical: ['DashboardLayout'],
        lazy: ['AssignmentTable', 'ValetTable', 'LocationManager', 'ScheduleCalendar']
      },
      'clients': {
        vehicles: [
          'ClientTable',
          'BookingForm',
          'InvoiceGenerator',
          'SupportChat'
        ],
        critical: ['ClientTable'],
        lazy: ['BookingForm', 'InvoiceGenerator', 'SupportChat']
      },
      'analytics': {
        vehicles: [
          'ReportsDashboard',
          'AIChat',
          'PerformanceMetrics',
          'TrendAnalysis'
        ],
        critical: ['ReportsDashboard'],
        lazy: ['AIChat', 'PerformanceMetrics', 'TrendAnalysis']
      },
      'finance': {
        vehicles: [
          'FinanceOverview',
          'PaymentProcessor',
          'ExpenseTracker',
          'RevenueAnalysis'
        ],
        critical: ['FinanceOverview'],
        lazy: ['PaymentProcessor', 'ExpenseTracker', 'RevenueAnalysis']
      },
      'settings': {
        vehicles: [
          'SettingsPanel',
          'UserManagement',
          'IntegrationSettings',
          'SecuritySettings'
        ],
        critical: ['SettingsPanel'],
        lazy: ['UserManagement', 'IntegrationSettings', 'SecuritySettings']
      }
    };

    return configs[garageId] || null;
  }

  /**
   * Preload critical vehicles for a garage
   * @param {string} garageId - The garage ID
   * @param {Object} config - Garage configuration
   */
  async preloadCriticalVehicles(garageId, config) {
    if (!config.critical || config.critical.length === 0) {
      return;
    }

    console.log(`[VehicleStager] Preloading critical vehicles for ${garageId}:`, config.critical);

    try {
      await Promise.all(
        config.critical.map(vehicleName => 
          this.loadVehicle(garageId, vehicleName)
        )
      );
      console.log(`[VehicleStager] Critical vehicles loaded for ${garageId}`);
    } catch (error) {
      console.error(`[VehicleStager] Failed to preload critical vehicles for ${garageId}:`, error);
    }
  }

  /**
   * Load a specific vehicle for a garage
   * @param {string} garageId - The garage ID
   * @param {string} vehicleName - The vehicle name
   * @returns {Promise<Object>} The loaded vehicle component
   */
  async loadVehicle(garageId, vehicleName) {
    const cacheKey = `${garageId}:${vehicleName}`;
    
    // Return cached if available
    if (this.stagedVehicles.has(cacheKey)) {
      return this.stagedVehicles.get(cacheKey);
    }

    // Return existing loading promise
    if (this.loadingPromises.has(cacheKey)) {
      return this.loadingPromises.get(cacheKey);
    }

    // Start loading
    const loadingPromise = this._loadVehicleComponent(garageId, vehicleName);
    this.loadingPromises.set(cacheKey, loadingPromise);

    try {
      const vehicle = await loadingPromise;
      this.stagedVehicles.set(cacheKey, vehicle);
      this.loadingPromises.delete(cacheKey);
      console.log(`[VehicleStager] Vehicle loaded: ${vehicleName} for ${garageId}`);
      return vehicle;
    } catch (error) {
      this.loadingPromises.delete(cacheKey);
      console.error(`[VehicleStager] Failed to load vehicle ${vehicleName} for ${garageId}:`, error);
      throw error;
    }
  }

  /**
   * Internal method to load vehicle component
   * @param {string} garageId - The garage ID
   * @param {string} vehicleName - The vehicle name
   * @returns {Promise<Object>} The loaded component
   */
  async _loadVehicleComponent(garageId, vehicleName) {
    // Try different paths to find the vehicle
    const possiblePaths = [
      `../../../bricksOS/${garageId}/components/${vehicleName}`,
      `../../../bricksOS/${garageId}/${vehicleName}`,
      `../../../bricksOS/${garageId}/vehicles/${vehicleName}`,
      `../../../bricksOS/${garageId}/index`
    ];

    for (const path of possiblePaths) {
      try {
        const module = await import(path);
        return module.default || module[vehicleName] || module;
      } catch (error) {
        // Continue to next path
        continue;
      }
    }

    // If not found, return a placeholder component
    return this.createPlaceholderVehicle(vehicleName);
  }

  /**
   * Create a placeholder vehicle component
   * @param {string} vehicleName - The vehicle name
   * @returns {Object} Placeholder component
   */
  createPlaceholderVehicle(vehicleName) {
    return function PlaceholderVehicle() {
      return (
        <div className="p-6 text-center">
          <div className="text-4xl mb-4">🚗</div>
          <h3 className="text-lg font-semibold text-vegas-gold mb-2">
            {vehicleName}
          </h3>
          <p className="text-gray-400 text-sm">
            Vehicle component not found
          </p>
        </div>
      );
    };
  }

  /**
   * Unstage vehicles for a garage
   * @param {string} garageId - The garage ID
   */
  unstageGarage(garageId) {
    console.log(`[VehicleStager] Unstaging garage: ${garageId}`);
    
    // Remove garage context
    this.garageContexts.delete(garageId);
    
    // Remove staged vehicles for this garage
    const keysToRemove = Array.from(this.stagedVehicles.keys())
      .filter(key => key.startsWith(`${garageId}:`));
    
    keysToRemove.forEach(key => {
      this.stagedVehicles.delete(key);
    });

    console.log(`[VehicleStager] Garage unstaged: ${garageId}`);
  }

  /**
   * Get staging statistics
   * @returns {Object} Staging statistics
   */
  getStats() {
    return {
      stagedVehicles: this.stagedVehicles.size,
      loadingPromises: this.loadingPromises.size,
      garageContexts: this.garageContexts.size,
      garages: Array.from(this.garageContexts.keys())
    };
  }

  /**
   * Clear all staged vehicles
   */
  clear() {
    this.stagedVehicles.clear();
    this.loadingPromises.clear();
    this.garageContexts.clear();
    console.log('[VehicleStager] All vehicles cleared');
  }
}

// Export singleton instance
export default new VehicleStager();
