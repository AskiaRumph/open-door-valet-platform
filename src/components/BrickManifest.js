/**
 * BrickManifest - Central manifest for all available bricks
 * 
 * This file contains the metadata for all available micro-frontend bricks
 * in the Valet Platform ecosystem.
 */

export const BRICK_MANIFESTS = {
  // Core Dashboard Bricks
  'dashboard-core': {
    name: 'Dashboard Core',
    version: '1.0.0',
    description: 'Core dashboard functionality and layout',
    modulePath: '../../../bricksOS/dashboard-core/index.js',
    components: {
      'DashboardLayout': './components/DashboardLayout',
      'StatsOverview': './components/StatsOverview',
      'QuickActions': './components/QuickActions'
    },
    services: ['analytics', 'notifications'],
    dependencies: [],
    priority: 'high',
    strategy: 'eager'
  },

  // Team Management Bricks
  'team-management': {
    name: 'Team Management',
    version: '1.0.0',
    description: 'Valet team management and scheduling',
    modulePath: '../../../bricksOS/team-management/index.js',
    components: {
      'TeamTable': './components/TeamTable',
      'ValetProfile': './components/ValetProfile',
      'ScheduleCalendar': './components/ScheduleCalendar',
      'AddValetForm': './components/AddValetForm'
    },
    services: ['gps-tracking', 'notifications'],
    dependencies: ['dashboard-core'],
    priority: 'high',
    strategy: 'lazy'
  },

  // Assignment System Bricks
  'assignment-system': {
    name: 'Assignment System',
    version: '1.0.0',
    description: 'Valet assignment and scheduling system',
    modulePath: '../../../bricksOS/assignment-system/index.js',
    components: {
      'AssignmentTable': './components/AssignmentTable',
      'ScheduleGrid': './components/ScheduleGrid',
      'ConflictResolver': './components/ConflictResolver',
      'AssignmentForm': './components/AssignmentForm'
    },
    services: ['scheduling', 'conflict-detection'],
    dependencies: ['team-management'],
    priority: 'high',
    strategy: 'lazy'
  },

  // Client Management Bricks
  'client-management': {
    name: 'Client Management',
    version: '1.0.0',
    description: 'Client portal and management system',
    modulePath: '../../../bricksOS/client-management/index.js',
    components: {
      'ClientTable': './components/ClientTable',
      'ClientProfile': './components/ClientProfile',
      'BookingForm': './components/BookingForm',
      'InvoiceGenerator': './components/InvoiceGenerator'
    },
    services: ['billing', 'notifications'],
    dependencies: ['dashboard-core'],
    priority: 'medium',
    strategy: 'lazy'
  },

  // AI Insights Bricks
  'ai-insights': {
    name: 'AI Insights',
    version: '1.0.0',
    description: 'AI-powered analytics and insights',
    modulePath: '../../../bricksOS/ai-insights/index.js',
    components: {
      'AIChat': './components/AIChat',
      'PredictiveAnalytics': './components/PredictiveAnalytics',
      'ComputerVision': './components/ComputerVision',
      'VoiceCommands': './components/VoiceCommands'
    },
    services: ['openai', 'vision-api', 'speech-recognition'],
    dependencies: ['dashboard-core'],
    priority: 'medium',
    strategy: 'lazy'
  },

  // Ticket System Bricks
  'ticket-system': {
    name: 'Ticket System',
    version: '1.0.0',
    description: 'Customer support ticket management',
    modulePath: '../../../bricksOS/ticket-system/index.js',
    components: {
      'TicketTable': './components/TicketTable',
      'TicketForm': './components/TicketForm',
      'TicketViewer': './components/TicketViewer',
      'TicketComments': './components/TicketComments'
    },
    services: ['notifications', 'email'],
    dependencies: ['client-management'],
    priority: 'medium',
    strategy: 'lazy'
  },

  // Reports and Analytics Bricks
  'reports-analytics': {
    name: 'Reports & Analytics',
    version: '1.0.0',
    description: 'Advanced reporting and analytics',
    modulePath: '../../../bricksOS/reports-analytics/index.js',
    components: {
      'ReportBuilder': './components/ReportBuilder',
      'ChartLibrary': './components/ChartLibrary',
      'DataExport': './components/DataExport',
      'KPIDashboard': './components/KPIDashboard'
    },
    services: ['data-processing', 'export'],
    dependencies: ['dashboard-core'],
    priority: 'low',
    strategy: 'lazy'
  },

  // Settings and Configuration Bricks
  'settings-config': {
    name: 'Settings & Configuration',
    version: '1.0.0',
    description: 'System settings and configuration',
    modulePath: '../../../bricksOS/settings-config/index.js',
    components: {
      'SettingsPanel': './components/SettingsPanel',
      'UserManagement': './components/UserManagement',
      'SystemConfig': './components/SystemConfig',
      'IntegrationSettings': './components/IntegrationSettings'
    },
    services: ['configuration', 'user-management'],
    dependencies: ['dashboard-core'],
    priority: 'low',
    strategy: 'lazy'
  },

  // Mobile App Bricks
  'mobile-app': {
    name: 'Mobile App',
    version: '1.0.0',
    description: 'Mobile app and PWA features',
    modulePath: '../../../bricksOS/mobile-app/index.js',
    components: {
      'MobileLayout': './components/MobileLayout',
      'OfflineIndicator': './components/OfflineIndicator',
      'PushNotifications': './components/PushNotifications',
      'AppInstaller': './components/AppInstaller'
    },
    services: ['pwa', 'offline-sync', 'push-notifications'],
    dependencies: ['dashboard-core'],
    priority: 'medium',
    strategy: 'lazy'
  },

  // Cloud Deployment Bricks
  'cloud-deployment': {
    name: 'Cloud Deployment',
    version: '1.0.0',
    description: 'Cloud deployment and monitoring',
    modulePath: '../../../bricksOS/cloud-deployment/index.js',
    components: {
      'CloudStatus': './components/CloudStatus',
      'DeploymentMonitor': './components/DeploymentMonitor',
      'PerformanceMetrics': './components/PerformanceMetrics',
      'HealthCheck': './components/HealthCheck'
    },
    services: ['cloud-monitoring', 'deployment'],
    dependencies: ['dashboard-core'],
    priority: 'low',
    strategy: 'lazy'
  }
};

// Helper function to get brick by feature
export function getBrickByFeature(feature) {
  const featureMap = {
    'dashboard': 'dashboard-core',
    'team': 'team-management',
    'assignments': 'assignment-system',
    'clients': 'client-management',
    'ai': 'ai-insights',
    'tickets': 'ticket-system',
    'reports': 'reports-analytics',
    'settings': 'settings-config',
    'mobile': 'mobile-app',
    'cloud': 'cloud-deployment'
  };

  return featureMap[feature] || null;
}

// Helper function to get all bricks by priority
export function getBricksByPriority(priority) {
  return Object.entries(BRICK_MANIFESTS)
    .filter(([_, manifest]) => manifest.priority === priority)
    .map(([id, _]) => id);
}

// Helper function to get all bricks by strategy
export function getBricksByStrategy(strategy) {
  return Object.entries(BRICK_MANIFESTS)
    .filter(([_, manifest]) => manifest.strategy === strategy)
    .map(([id, _]) => id);
}

export default BRICK_MANIFESTS;
