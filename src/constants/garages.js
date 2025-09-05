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
      { 
        id: 'dashboard', 
        name: 'Dashboard', 
        icon: '📊', 
        description: 'Main operations dashboard',
        brickId: 'dashboard-core',
        componentName: 'DashboardLayout'
      },
      { 
        id: 'assignments', 
        name: 'Assignments', 
        icon: '📋', 
        description: 'Valet assignment management',
        brickId: 'assignment-system',
        componentName: 'AssignmentTable'
      },
      { 
        id: 'valets', 
        name: 'Valets', 
        icon: '👥', 
        description: 'Valet team management',
        brickId: 'team-management',
        componentName: 'ValetTable'
      },
      { 
        id: 'locations', 
        name: 'Locations', 
        icon: '📍', 
        description: 'Service location management',
        brickId: 'location-management',
        componentName: 'LocationManager'
      },
      { 
        id: 'schedule', 
        name: 'Schedule', 
        icon: '📅', 
        description: 'Scheduling and calendar',
        brickId: 'schedule-system',
        componentName: 'ScheduleCalendar'
      }
    ]
  },
  {
    id: 'clients',
    name: 'Client Portal',
    description: 'Customer management and services',
    icon: '👤',
    color: 'ai-blue',
    lots: [
      { 
        id: 'clients', 
        name: 'Clients', 
        icon: '👥', 
        description: 'Client management',
        brickId: 'client-management',
        componentName: 'ClientTable'
      },
      { 
        id: 'bookings', 
        name: 'Bookings', 
        icon: '📝', 
        description: 'Service bookings',
        brickId: 'booking-system',
        componentName: 'BookingForm'
      },
      { 
        id: 'invoices', 
        name: 'Invoices', 
        icon: '💰', 
        description: 'Billing and invoicing',
        brickId: 'invoice-system',
        componentName: 'InvoiceGenerator'
      },
      { 
        id: 'support', 
        name: 'Support', 
        icon: '🎧', 
        description: 'Customer support',
        brickId: 'support-system',
        componentName: 'SupportChat'
      }
    ]
  },
  {
    id: 'analytics',
    name: 'Analytics',
    description: 'Data insights and reporting',
    icon: '📈',
    color: 'success-green',
    lots: [
      { 
        id: 'reports', 
        name: 'Reports', 
        icon: '📊', 
        description: 'Analytics and reports',
        brickId: 'analytics-core',
        componentName: 'ReportsDashboard'
      },
      { 
        id: 'ai-insights', 
        name: 'AI Insights', 
        icon: '🤖', 
        description: 'AI-powered analytics',
        brickId: 'ai-insights',
        componentName: 'AIChat'
      },
      { 
        id: 'performance', 
        name: 'Performance', 
        icon: '⚡', 
        description: 'Performance metrics',
        brickId: 'performance-metrics',
        componentName: 'PerformanceDashboard'
      },
      { 
        id: 'trends', 
        name: 'Trends', 
        icon: '📈', 
        description: 'Trend analysis',
        brickId: 'trend-analysis',
        componentName: 'TrendAnalysis'
      }
    ]
  },
  {
    id: 'finance',
    name: 'Finance',
    description: 'Financial management and accounting',
    icon: '💳',
    color: 'vegas-gold',
    lots: [
      { 
        id: 'finance', 
        name: 'Finance', 
        icon: '💰', 
        description: 'Financial overview',
        brickId: 'finance-core',
        componentName: 'FinanceOverview'
      },
      { 
        id: 'payments', 
        name: 'Payments', 
        icon: '💳', 
        description: 'Payment processing',
        brickId: 'payment-system',
        componentName: 'PaymentProcessor'
      },
      { 
        id: 'expenses', 
        name: 'Expenses', 
        icon: '📉', 
        description: 'Expense tracking',
        brickId: 'expense-tracker',
        componentName: 'ExpenseTracker'
      },
      { 
        id: 'revenue', 
        name: 'Revenue', 
        icon: '📈', 
        description: 'Revenue analysis',
        brickId: 'revenue-analysis',
        componentName: 'RevenueAnalysis'
      }
    ]
  },
  {
    id: 'settings',
    name: 'Settings',
    description: 'System configuration and administration',
    icon: '⚙️',
    color: 'gray',
    lots: [
      { 
        id: 'settings', 
        name: 'Settings', 
        icon: '⚙️', 
        description: 'System settings',
        brickId: 'settings-core',
        componentName: 'SettingsPanel'
      },
      { 
        id: 'users', 
        name: 'Users', 
        icon: '👤', 
        description: 'User management',
        brickId: 'user-management',
        componentName: 'UserManagement'
      },
      { 
        id: 'integrations', 
        name: 'Integrations', 
        icon: '🔗', 
        description: 'Third-party integrations',
        brickId: 'integration-system',
        componentName: 'IntegrationSettings'
      },
      { 
        id: 'security', 
        name: 'Security', 
        icon: '🔒', 
        description: 'Security settings',
        brickId: 'security-system',
        componentName: 'SecuritySettings'
      }
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
