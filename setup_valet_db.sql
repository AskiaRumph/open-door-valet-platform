-- Basic Valet Database Setup
-- Run this in chunks to see the database being built

-- 1. Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    display_name TEXT,
    role TEXT DEFAULT 'customer' CHECK (role IN ('admin','staff','valet','customer')),
    phone TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active','inactive','suspended')),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Create clients table
CREATE TABLE IF NOT EXISTS public.clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    company_name TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    zip_code TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Create locations table
CREATE TABLE IF NOT EXISTS public.locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    zip_code TEXT NOT NULL,
    capacity INTEGER DEFAULT 100,
    current_occupancy INTEGER DEFAULT 0,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'maintenance')),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Create valets table
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
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Create service types table
CREATE TABLE IF NOT EXISTS public.service_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    base_price DECIMAL(10,2) NOT NULL,
    duration_minutes INTEGER DEFAULT 60,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Create tickets table
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
    total_amount DECIMAL(10,2),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 7. Insert sample data
INSERT INTO public.profiles (id, display_name, role, phone, status) VALUES
    ('550e8400-e29b-41d4-a716-446655440001', 'John Admin', 'admin', '+1-555-0101', 'active'),
    ('550e8400-e29b-41d4-a716-446655440002', 'Sarah Staff', 'staff', '+1-555-0102', 'active'),
    ('550e8400-e29b-41d4-a716-446655440003', 'Mike Valet', 'valet', '+1-555-0103', 'active')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.clients (id, profile_id, name, email, company_name, address, city, state, zip_code) VALUES
    ('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Downtown Valet Services', 'info@downtownvalet.com', 'Downtown Valet Services', '123 Main St', 'New York', 'NY', '10001')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.locations (id, client_id, name, address, city, state, zip_code, capacity) VALUES
    ('770e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 'Main Street Garage', '123 Main St', 'New York', 'NY', '10001', 150)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.valets (id, profile_id, client_id, first_name, last_name, email, phone, license_number, rating) VALUES
    ('880e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440001', 'Mike', 'Johnson', 'mike.johnson@downtownvalet.com', '+1-555-0103', 'VAL001', 4.5)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.service_types (id, client_id, name, description, base_price, duration_minutes) VALUES
    ('990e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 'Standard Parking', 'Basic valet parking service', 25.00, 60)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.tickets (id, client_id, location_id, valet_id, service_type_id, customer_name, customer_phone, customer_email, vehicle_info, status, priority, total_amount) VALUES
    ('aa0e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440001', '990e8400-e29b-41d4-a716-446655440001', 'John Smith', '+1-555-0201', 'john.smith@email.com', '{"make": "Toyota", "model": "Camry", "year": 2020, "color": "Silver"}', 'in_progress', 'normal', 25.00)
ON CONFLICT (id) DO NOTHING;
