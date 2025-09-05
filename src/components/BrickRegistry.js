/**
 * BrickRegistry - Central registry for managing micro-frontend bricks
 * 
 * This registry manages:
 * - Brick manifests and metadata
 * - Dynamic loading of brick modules
 * - Dependency resolution
 * - Memory management and cleanup
 * - Loading strategies (eager, lazy, on-demand)
 */

class BrickRegistry {
  constructor() {
    this.manifests = new Map();
    this.loadedBricks = new Map();
    this.loadingPromises = new Map();
    this.dependencies = new Map();
  }

  /**
   * Register a brick manifest
   */
  register(brickId, manifest) {
    console.log(`[BrickRegistry] Registering brick: ${brickId}`);
    
    this.manifests.set(brickId, {
      ...manifest,
      id: brickId,
      registeredAt: Date.now()
    });

    // Build dependency graph
    if (manifest.dependencies) {
      this.dependencies.set(brickId, manifest.dependencies);
    }
  }

  /**
   * Get brick manifest
   */
  getManifest(brickId) {
    return this.manifests.get(brickId);
  }

  /**
   * Load a brick module
   */
  async loadBrick(brickId) {
    // Return cached if already loaded
    if (this.loadedBricks.has(brickId)) {
      console.log(`[BrickRegistry] Brick ${brickId} already loaded, returning cached`);
      return this.loadedBricks.get(brickId);
    }

    // Return existing loading promise
    if (this.loadingPromises.has(brickId)) {
      console.log(`[BrickRegistry] Brick ${brickId} already loading, returning promise`);
      return this.loadingPromises.get(brickId);
    }

    // Start loading
    const loadingPromise = this._loadBrickModule(brickId);
    this.loadingPromises.set(brickId, loadingPromise);

    try {
      const module = await loadingPromise;
      this.loadedBricks.set(brickId, module);
      this.loadingPromises.delete(brickId);
      console.log(`[BrickRegistry] Brick ${brickId} loaded successfully`);
      return module;
    } catch (error) {
      this.loadingPromises.delete(brickId);
      console.error(`[BrickRegistry] Failed to load brick ${brickId}:`, error);
      throw error;
    }
  }

  /**
   * Internal method to load brick module
   */
  async _loadBrickModule(brickId) {
    const manifest = this.getManifest(brickId);
    if (!manifest) {
      throw new Error(`Brick manifest not found: ${brickId}`);
    }

    // Load dependencies first
    if (manifest.dependencies && manifest.dependencies.length > 0) {
      console.log(`[BrickRegistry] Loading dependencies for ${brickId}:`, manifest.dependencies);
      await Promise.all(
        manifest.dependencies.map(dep => this.loadBrick(dep))
      );
    }

    // Load the brick module
    const modulePath = manifest.modulePath || `../../../bricksOS/${brickId}/index.js`;
    
    try {
      const module = await import(modulePath);
      return module.default || module;
    } catch (error) {
      // Try alternative paths
      const alternativePaths = [
        `../../../bricksOS/${brickId}/brick.js`,
        `../../../bricksOS/${brickId}/main.js`,
        `../../../bricksOS/${brickId}/index.ts`,
        `../../../bricksOS/${brickId}/brick.ts`
      ];

      for (const path of alternativePaths) {
        try {
          const module = await import(path);
          return module.default || module;
        } catch (e) {
          // Continue to next path
        }
      }

      throw error;
    }
  }

  /**
   * Unload a brick to free memory
   */
  async unloadBrick(brickId) {
    console.log(`[BrickRegistry] Unloading brick: ${brickId}`);
    
    // Check if brick is in use
    const dependents = this._getDependents(brickId);
    if (dependents.length > 0) {
      console.warn(`[BrickRegistry] Cannot unload ${brickId}, still in use by:`, dependents);
      return false;
    }

    // Remove from loaded bricks
    this.loadedBricks.delete(brickId);
    
    // Call cleanup if available
    const manifest = this.getManifest(brickId);
    if (manifest && manifest.cleanup) {
      try {
        await manifest.cleanup();
      } catch (error) {
        console.error(`[BrickRegistry] Error during cleanup of ${brickId}:`, error);
      }
    }

    console.log(`[BrickRegistry] Brick ${brickId} unloaded successfully`);
    return true;
  }

  /**
   * Get bricks that depend on this brick
   */
  _getDependents(brickId) {
    const dependents = [];
    
    for (const [id, deps] of this.dependencies.entries()) {
      if (deps.includes(brickId)) {
        dependents.push(id);
      }
    }
    
    return dependents;
  }

  /**
   * Preload priority bricks
   */
  async preloadPriorityBricks() {
    const priorityBricks = Array.from(this.manifests.values())
      .filter(manifest => manifest.priority === 'high' || manifest.strategy === 'eager')
      .map(manifest => manifest.id);

    console.log(`[BrickRegistry] Preloading priority bricks:`, priorityBricks);
    
    await Promise.all(
      priorityBricks.map(brickId => this.loadBrick(brickId))
    );
  }

  /**
   * Get registry statistics
   */
  getStats() {
    return {
      registered: this.manifests.size,
      loaded: this.loadedBricks.size,
      loading: this.loadingPromises.size,
      loadedBricks: Array.from(this.loadedBricks.keys())
    };
  }

  /**
   * Clear all bricks (for testing)
   */
  clear() {
    this.manifests.clear();
    this.loadedBricks.clear();
    this.loadingPromises.clear();
    this.dependencies.clear();
  }
}

// Export singleton instance
export default new BrickRegistry();
