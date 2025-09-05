# Open Door Valet Database - Local Setup 🚗

## 🎯 What You Have

A complete **valet parking management system** running locally with PostgreSQL and PostGIS!

## 🚀 Quick Start

### 1. Database Status
Your database is running in Docker:
- **Container**: `open-door-valet-db`
- **Port**: `localhost:5432`
- **Database**: `valet_db`
- **User**: `valet`
- **Password**: `valet123`

### 2. Easy Commands
Run `valet_db_commands.bat` for a menu-driven interface to explore your database!

### 3. Direct Database Access
```bash
docker exec -it open-door-valet-db psql -U valet -d valet_db
```

## 🏗️ Database Structure

### Core Tables
- **`profiles`** - User management (admin, staff, valet, customer)
- **`clients`** - Business clients and companies
- **`locations`** - Parking locations with capacity tracking
- **`valets`** - Valet staff with ratings and performance
- **`service_types`** - Configurable services and pricing
- **`tickets`** - Service requests and tracking

### Sample Data
- ✅ 3 user profiles (admin, staff, valet)
- ✅ 1 client company (Downtown Valet Services)
- ✅ 1 parking location (Main Street Garage - 150 capacity)
- ✅ 1 valet (Mike Johnson - 4.5 rating)
- ✅ 1 service type (Standard Parking - $25)
- ✅ 2 tickets (John Smith, Jane Doe)

## 🔍 Explore Your Data

### Quick Queries
```sql
-- View all profiles
SELECT display_name, role, status FROM public.profiles;

-- View all tickets
SELECT customer_name, status, priority, total_amount FROM public.tickets;

-- View revenue summary
SELECT c.name, SUM(t.total_amount) as revenue, COUNT(t.id) as tickets
FROM public.tickets t 
JOIN public.clients c ON t.client_id = c.id 
GROUP BY c.id, c.name;
```

### Business Insights
- **Total Revenue**: $50.00 (2 tickets)
- **Ticket Status**: 1 pending, 1 in_progress
- **Valet Performance**: Mike Johnson handles 2 tickets, avg $25.00
- **Location**: Main Street Garage at 0% occupancy

## 🛠️ Add More Data

### Insert New Ticket
```sql
INSERT INTO public.tickets (
    client_id, location_id, valet_id, service_type_id,
    customer_name, customer_phone, customer_email,
    status, priority, total_amount
) VALUES (
    '660e8400-e29b-41d4-a716-446655440001',
    '770e8400-e29b-41d4-a716-446655440001',
    '880e8400-e29b-41d4-a716-446655440001',
    '990e8400-e29b-41d4-a716-446655440001',
    'Bob Wilson', '+1-555-0203', 'bob@email.com',
    'pending', 'normal', 25.00
);
```

### Update Ticket Status
```sql
UPDATE public.tickets 
SET status = 'completed', updated_at = now() 
WHERE customer_name = 'John Smith';
```

## 🌟 Features

- **UUID Primary Keys** - Enterprise-grade identifiers
- **JSONB Support** - Flexible vehicle information storage
- **Automatic Timestamps** - Created/updated tracking
- **Referential Integrity** - Proper foreign key relationships
- **Check Constraints** - Data validation (status, roles, ratings)
- **PostGIS Ready** - Spatial data support for locations

## 📊 Sample Reports

### Ticket Summary by Status
```sql
SELECT status, COUNT(*) as count 
FROM public.tickets 
GROUP BY status 
ORDER BY count DESC;
```

### Valet Performance
```sql
SELECT 
    v.first_name || ' ' || v.last_name as name,
    v.rating,
    COUNT(t.id) as tickets,
    ROUND(AVG(t.total_amount), 2) as avg_value
FROM public.valets v
LEFT JOIN public.tickets t ON v.id = t.valet_id
GROUP BY v.id, v.first_name, v.last_name, v.rating;
```

## 🎮 Interactive Mode

For advanced queries, use interactive mode:
```bash
docker exec -it open-door-valet-db psql -U valet -d valet_db
```

Then run any SQL commands directly!

## 🔧 Management

### Stop Database
```bash
docker stop open-door-valet-db
```

### Start Database
```bash
docker start open-door-valet-db
```

### Remove Database
```bash
docker rm -f open-door-valet-db
```

## 🎉 You're All Set!

Your valet parking management system is now running locally with:
- ✅ Complete database schema
- ✅ Sample data for testing
- ✅ Easy-to-use command interface
- ✅ Business intelligence queries
- ✅ Professional-grade structure

**Next steps**: Try the batch file, run some queries, add more data, and see your valet business come to life! 🚗💼
