/**
 * GARAGES - Central configuration for all garage domains
 * 
 * Each garage represents a different business domain or feature area
 * with its own lots (specific features) and vehicles (components)
 */

export const GARAGES = [
  {
    id: 'operations',
    name: 'Operations',
    description: 'Core valet operations and management',
    icon: '🏢',
    color: 'vegas-gold',
    lots: [
      { id: 'dashboard', name: 'Dashboard', icon: '📊', description: 'Main operations dashboard' },
      { id: 'assignments', name: 'Assignments', icon: '📋', description: 'Valet assignment management' },
      { id: 'valets', name: 'Valets', icon: '👥', description: 'Valet team management' },
      { id: 'locations', name: 'Locations', icon: '📍', description: 'Service location management' },
      { id: 'schedule', name: 'Schedule', icon: '📅', description: 'Scheduling and calendar' }
    ]
  },
  {
    id: 'clients',
    name: 'Client Portal',
    description: 'Customer management and services',
    icon: '👤',
    color: 'ai-blue',
    lots: [
      { id: 'clients', name: 'Clients', icon: '👥', description: 'Client management' },
      { id: 'bookings', name: 'Bookings', icon: '📝', description: 'Service bookings' },
      { id: 'invoices', name: 'Invoices', icon: '💰', description: 'Billing and invoicing' },
      { id: 'support', name: 'Support', icon: '🎧', description: 'Customer support' }
    ]
  },
  {
    id: 'analytics',
    name: 'Analytics',
    description: 'Data insights and reporting',
    icon: '📈',
    color: 'success-green',
    lots: [
      { id: 'reports', name: 'Reports', icon: '📊', description: 'Analytics and reports' },
      { id: 'ai-insights', name: 'AI Insights', icon: '🤖', description: 'AI-powered analytics' },
      { id: 'performance', name: 'Performance', icon: '⚡', description: 'Performance metrics' },
      { id: 'trends', name: 'Trends', icon: '📈', description: 'Trend analysis' }
    ]
  },
  {
    id: 'finance',
    name: 'Finance',
    description: 'Financial management and accounting',
    icon: '💳',
    color: 'vegas-gold',
    lots: [
      { id: 'finance', name: 'Finance', icon: '💰', description: 'Financial overview' },
      { id: 'payments', name: 'Payments', icon: '💳', description: 'Payment processing' },
      { id: 'expenses', name: 'Expenses', icon: '📉', description: 'Expense tracking' },
      { id: 'revenue', name: 'Revenue', icon: '📈', description: 'Revenue analysis' }
    ]
  },
  {
    id: 'settings',
    name: 'Settings',
    description: 'System configuration and administration',
    icon: '⚙️',
    color: 'gray',
    lots: [
      { id: 'settings', name: 'Settings', icon: '⚙️', description: 'System settings' },
      { id: 'users', name: 'Users', icon: '👤', description: 'User management' },
      { id: 'integrations', name: 'Integrations', icon: '🔗', description: 'Third-party integrations' },
      { id: 'security', name: 'Security', icon: '🔒', description: 'Security settings' }
    ]
  }
];

// Helper functions
export function getGarageById(id) {
  return GARAGES.find(garage => garage.id === id);
}

export function getLotById(garageId, lotId) {
  const garage = getGarageById(garageId);
  return garage?.lots?.find(lot => lot.id === lotId);
}

export function getAllLots() {
  return GARAGES.flatMap(garage => 
    garage.lots.map(lot => ({
      ...lot,
      garageId: garage.id,
      garageName: garage.name
    }))
  );
}

export function getGaragesByColor(color) {
  return GARAGES.filter(garage => garage.color === color);
}

export default GARAGES;
