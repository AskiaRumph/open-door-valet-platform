-- =====================================================
-- Open Door Valet - Local PostgreSQL Database Setup
-- Modified for local PostgreSQL (no Supabase auth)
-- =====================================================
-- Run this in your local PostgreSQL database
-- Connection: localhost:5432, Database: valet_db, User: valet, Password: valet123

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- =====================================================
-- 1. CREATE ALL TABLES
-- =====================================================

-- Create profiles table (simplified for local testing)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID DEFAULT gen_random_uuid(), -- Mock auth user ID for local testing
    display_name TEXT,
    role TEXT DEFAULT 'customer' CHECK (role IN ('admin','staff','valet','customer')),
    phone TEXT,
    avatar_url TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active','inactive','suspended')),
    preferences JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    last_login TIMESTAMPTZ,
    last_activity TIMESTAMPTZ
);

-- Clients table
CREATE TABLE IF NOT EXISTS public.clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    company_name TEXT,
    business_type TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    address TEXT,
    city TEXT,
    state TEXT,
    zip_code TEXT,
    country TEXT DEFAULT 'USA',
    timezone TEXT DEFAULT 'UTC',
    preferences JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Locations table
CREATE TABLE IF NOT EXISTS public.locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    zip_code TEXT NOT NULL,
    country TEXT DEFAULT 'USA',
    capacity INTEGER DEFAULT 100,
    current_occupancy INTEGER DEFAULT 0,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'maintenance')),
    coordinates geography(Point,4326),
    operating_hours JSONB DEFAULT '{}'::jsonb,
    amenities JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Valets table
CREATE TABLE IF NOT EXISTS public.valets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    license_number TEXT UNIQUE,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended', 'off_duty')),
    rating DECIMAL(3,2) DEFAULT 0.0 CHECK (rating >= 0.0 AND rating <= 5.0),
    total_tickets INTEGER DEFAULT 0,
    completed_tickets INTEGER DEFAULT 0,
    performance_score DECIMAL(5,2) DEFAULT 0.0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Valet assignments to locations
CREATE TABLE IF NOT EXISTS public.valet_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    valet_id UUID REFERENCES public.valets(id) ON DELETE CASCADE,
    location_id UUID REFERENCES public.locations(id) ON DELETE CASCADE,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(valet_id, location_id, start_time)
);

-- Service types
CREATE TABLE IF NOT EXISTS public.service_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    base_price DECIMAL(10,2) NOT NULL,
    duration_minutes INTEGER DEFAULT 60,
    capacity_impact INTEGER DEFAULT 1,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tickets (service requests)
CREATE TABLE IF NOT EXISTS public.tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
    location_id UUID REFERENCES public.locations(id) ON DELETE CASCADE,
    valet_id UUID REFERENCES public.valets(id),
    service_type_id UUID REFERENCES public.service_types(id) ON DELETE CASCADE,
    customer_name TEXT NOT NULL,
    customer_phone TEXT,
    customer_email TEXT,
    vehicle_info JSONB DEFAULT '{}'::jsonb,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show')),
    priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    scheduled_time TIMESTAMPTZ,
    estimated_duration INTEGER DEFAULT 60,
    actual_duration INTEGER,
    total_amount DECIMAL(10,2),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Ticket updates/history
CREATE TABLE IF NOT EXISTS public.ticket_updates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id UUID REFERENCES public.tickets(id) ON DELETE CASCADE,
    valet_id UUID REFERENCES public.valets(id),
    status TEXT NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Shuttle vehicles
CREATE TABLE IF NOT EXISTS public.shuttle_vehicles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
    vehicle_type TEXT NOT NULL,
    make TEXT,
    model TEXT,
    year INTEGER,
    license_plate TEXT UNIQUE,
    capacity INTEGER DEFAULT 8,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'maintenance', 'out_of_service')),
    current_location_id UUID REFERENCES public.locations(id),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- =====================================================
-- 2. CREATE INDEXES FOR PERFORMANCE
-- =====================================================

-- Profiles indexes
CREATE INDEX IF NOT EXISTS idx_profiles_auth_user_id ON public.profiles(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_status ON public.profiles(status);

-- Clients indexes
CREATE INDEX IF NOT EXISTS idx_clients_profile_id ON public.clients(profile_id);
CREATE INDEX IF NOT EXISTS idx_clients_email ON public.clients(email);
CREATE INDEX IF NOT EXISTS idx_clients_status ON public.clients(status);

-- Locations indexes
CREATE INDEX IF NOT EXISTS idx_locations_client_id ON public.locations(client_id);
CREATE INDEX IF NOT EXISTS idx_locations_status ON public.locations(status);
CREATE INDEX IF NOT EXISTS idx_locations_city_state ON public.locations(city, state);
CREATE INDEX IF NOT EXISTS idx_locations_coords ON public.locations USING GIST (coordinates);

-- Valets indexes
CREATE INDEX IF NOT EXISTS idx_valets_profile_id ON public.valets(profile_id);
CREATE INDEX IF NOT EXISTS idx_valets_client_id ON public.valets(client_id);
CREATE INDEX IF NOT EXISTS idx_valets_status ON public.valets(status);
CREATE INDEX IF NOT EXISTS idx_valets_license ON public.valets(license_number);

-- Valet assignments indexes
CREATE INDEX IF NOT EXISTS idx_valet_assignments_valet_id ON public.valet_assignments(valet_id);
CREATE INDEX IF NOT EXISTS idx_valet_assignments_location_id ON public.valet_assignments(location_id);
CREATE INDEX IF NOT EXISTS idx_valet_assignments_status ON public.valet_assignments(status);

-- Service types indexes
CREATE INDEX IF NOT EXISTS idx_service_types_client_id ON public.service_types(client_id);
CREATE INDEX IF NOT EXISTS idx_service_types_status ON public.service_types(status);

-- Tickets indexes
CREATE INDEX IF NOT EXISTS idx_tickets_client_id ON public.tickets(client_id);
CREATE INDEX IF NOT EXISTS idx_tickets_location_id ON public.tickets(location_id);
CREATE INDEX IF NOT EXISTS idx_tickets_valet_id ON public.tickets(valet_id);
CREATE INDEX IF NOT EXISTS idx_tickets_status ON public.tickets(status);
CREATE INDEX IF NOT EXISTS idx_tickets_scheduled_time ON public.tickets(scheduled_time);

-- Ticket updates indexes
CREATE INDEX IF NOT EXISTS idx_ticket_updates_ticket_id ON public.ticket_updates(ticket_id);
CREATE INDEX IF NOT EXISTS idx_ticket_updates_created_at ON public.ticket_updates(created_at);

-- Shuttle vehicles indexes
CREATE INDEX IF NOT EXISTS idx_shuttle_vehicles_client_id ON public.shuttle_vehicles(client_id);
CREATE INDEX IF NOT EXISTS idx_shuttle_vehicles_status ON public.shuttle_vehicles(status);

-- =====================================================
-- 3. CREATE TRIGGER FUNCTION
-- =====================================================

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- =====================================================
-- 4. APPLY TRIGGERS TO ALL TABLES
-- =====================================================

-- Drop existing triggers if they exist (safe re-deployment)
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
DROP TRIGGER IF EXISTS update_clients_updated_at ON public.clients;
DROP TRIGGER IF EXISTS update_locations_updated_at ON public.locations;
DROP TRIGGER IF EXISTS update_valets_updated_at ON public.valets;
DROP TRIGGER IF EXISTS update_valet_assignments_updated_at ON public.valet_assignments;
DROP TRIGGER IF EXISTS update_service_types_updated_at ON public.service_types;
DROP TRIGGER IF EXISTS update_tickets_updated_at ON public.tickets;
DROP TRIGGER IF EXISTS update_ticket_updates_updated_at ON public.ticket_updates;
DROP TRIGGER IF EXISTS update_shuttle_vehicles_updated_at ON public.shuttle_vehicles;

-- Re-create the triggers after ensuring they do not already exist
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clients_updated_at
    BEFORE UPDATE ON public.clients
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_locations_updated_at
    BEFORE UPDATE ON public.locations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_valets_updated_at
    BEFORE UPDATE ON public.valets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_valet_assignments_updated_at
    BEFORE UPDATE ON public.valet_assignments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_service_types_updated_at
    BEFORE UPDATE ON public.service_types
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tickets_updated_at
    BEFORE UPDATE ON public.tickets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ticket_updates_updated_at
    BEFORE UPDATE ON public.ticket_updates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_shuttle_vehicles_updated_at
    BEFORE UPDATE ON public.shuttle_vehicles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 5. INSERT SAMPLE DATA FOR TESTING
-- =====================================================

-- Insert sample profiles
INSERT INTO public.profiles (id, display_name, role, phone, status) VALUES
    ('550e8400-e29b-41d4-a716-446655440001', 'John Admin', 'admin', '+1-555-0101', 'active'),
    ('550e8400-e29b-41d4-a716-446655440002', 'Sarah Staff', 'staff', '+1-555-0102', 'active'),
    ('550e8400-e29b-41d4-a716-446655440003', 'Mike Valet', 'valet', '+1-555-0103', 'active'),
    ('550e8400-e29b-41d4-a716-446655440004', 'Alice Customer', 'customer', '+1-555-0104', 'active')
ON CONFLICT (id) DO NOTHING;

-- Insert sample clients
INSERT INTO public.clients (id, profile_id, name, email, company_name, business_type, address, city, state, zip_code) VALUES
    ('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Downtown Valet Services', 'info@downtownvalet.com', 'Downtown Valet Services', 'Hospitality', '123 Main St', 'New York', 'NY', '10001'),
    ('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440004', 'Central Park Hotel', 'parking@centralparkhotel.com', 'Central Park Hotel', 'Hotel', '456 Park Ave', 'New York', 'NY', '10022')
ON CONFLICT (id) DO NOTHING;

-- Insert sample locations
INSERT INTO public.locations (id, client_id, name, address, city, state, zip_code, capacity, coordinates) VALUES
    ('770e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 'Main Street Garage', '123 Main St', 'New York', 'NY', '10001', 150, ST_GeogFromText('POINT(-74.006 40.7128)')),
    ('770e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440002', 'Central Park Hotel Parking', '456 Park Ave', 'New York', 'NY', '10022', 200, ST_GeogFromText('POINT(-73.9712 40.7589)'))
ON CONFLICT (id) DO NOTHING;

-- Insert sample valets
INSERT INTO public.valets (id, profile_id, client_id, first_name, last_name, email, phone, license_number, rating) VALUES
    ('880e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440001', 'Mike', 'Johnson', 'mike.johnson@downtownvalet.com', '+1-555-0103', 'VAL001', 4.5),
    ('880e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440001', 'Sarah', 'Wilson', 'sarah.wilson@downtownvalet.com', '+1-555-0102', 'VAL002', 4.8)
ON CONFLICT (id) DO NOTHING;

-- Insert sample service types
INSERT INTO public.service_types (id, client_id, name, description, base_price, duration_minutes) VALUES
    ('990e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 'Standard Parking', 'Basic valet parking service', 25.00, 60),
    ('990e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440001', 'Premium Parking', 'Premium parking with car wash', 45.00, 90),
    ('990e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440002', 'Hotel Guest Parking', 'Parking for hotel guests', 35.00, 120)
ON CONFLICT (id) DO NOTHING;

-- Insert sample tickets
INSERT INTO public.tickets (id, client_id, location_id, valet_id, service_type_id, customer_name, customer_phone, customer_email, vehicle_info, status, priority, scheduled_time, total_amount) VALUES
    ('aa0e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440001', '990e8400-e29b-41d4-a716-446655440001', 'John Smith', '+1-555-0201', 'john.smith@email.com', '{"make": "Toyota", "model": "Camry", "year": 2020, "color": "Silver"}', 'in_progress', 'normal', now() + interval '1 hour', 25.00),
    ('aa0e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440002', '880e8400-e29b-41d4-a716-446655440002', '990e8400-e29b-41d4-a716-446655440003', 'Jane Doe', '+1-555-0202', 'jane.doe@email.com', '{"make": "Honda", "model": "Accord", "year": 2019, "color": "Blue"}', 'pending', 'high', now() + interval '30 minutes', 35.00)
ON CONFLICT (id) DO NOTHING;

-- Insert sample ticket updates
INSERT INTO public.ticket_updates (id, ticket_id, valet_id, status, notes) VALUES
    ('bb0e8400-e29b-41d4-a716-446655440001', 'aa0e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440001', 'confirmed', 'Customer arrived, vehicle parked in spot A15'),
    ('bb0e8400-e29b-41d4-a716-446655440002', 'aa0e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440001', 'in_progress', 'Vehicle being retrieved from parking spot')
ON CONFLICT (id) DO NOTHING;

-- Insert sample shuttle vehicles
INSERT INTO public.shuttle_vehicles (id, client_id, vehicle_type, make, model, year, license_plate, capacity, current_location_id) VALUES
    ('cc0e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 'Van', 'Ford', 'Transit', 2021, 'SHUTTLE1', 12, '770e8400-e29b-41d4-a716-446655440001'),
    ('cc0e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440002', 'SUV', 'Chevrolet', 'Suburban', 2022, 'SHUTTLE2', 8, '770e8400-e29b-41d4-a716-446655440002')
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- SETUP COMPLETE! 🎉
-- =====================================================

-- Your Open Door Valet database is now ready with:
-- ✅ All tables created with proper relationships
-- ✅ PostGIS extension enabled for spatial data
-- ✅ Performance indexes for fast queries
-- ✅ Automatic updated_at timestamps
-- ✅ Sample data for testing
-- ✅ **100% IDEMPOTENT** - Safe to run multiple times

-- Test queries you can run:
-- SELECT * FROM public.profiles;
-- SELECT * FROM public.clients;
-- SELECT * FROM public.locations;
-- SELECT * FROM public.valets;
-- SELECT * FROM public.tickets;
-- SELECT * FROM public.service_types;
-- SELECT * FROM public.ticket_updates;
-- SELECT * FROM public.shuttle_vehicles;

-- Next steps:
-- 1. Connect to your database using a PostgreSQL client
-- 2. Run some test queries to see the data
-- 3. Test the triggers and relationships

