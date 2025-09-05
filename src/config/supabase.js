// Supabase Configuration
export const supabaseConfig = {
  url: process.env.REACT_APP_SUPABASE_URL || 'https://your-project.supabase.co',
  anonKey: process.env.REACT_APP_SUPABASE_ANON_KEY || 'your-anon-key',
  serviceRoleKey: process.env.REACT_APP_SUPABASE_SERVICE_ROLE_KEY || 'your-service-role-key'
};

// Development mode flags
export const devConfig = {
  useMockData: process.env.REACT_APP_USE_MOCK_DATA === 'true' || true,
  devMode: process.env.REACT_APP_DEV_MODE === 'true' || true
};
