-- =====================================================
-- Explore Your Valet Database - Useful Queries
-- =====================================================

-- 1. View all profiles with their roles
SELECT display_name, role, status, created_at 
FROM public.profiles 
ORDER BY role, display_name;

-- 2. View all clients and their locations
SELECT c.name as client_name, c.company_name, c.city, c.state,
       l.name as location_name, l.capacity, l.current_occupancy
FROM public.clients c
JOIN public.locations l ON c.id = l.client_id
ORDER BY c.name;

-- 3. View all valets with their ratings and client
SELECT v.first_name, v.last_name, v.license_number, v.rating, v.status,
       c.name as client_name
FROM public.valets v
JOIN public.clients c ON v.client_id = c.id
ORDER BY v.rating DESC;

-- 4. View all service types with pricing
SELECT st.name, st.description, st.base_price, st.duration_minutes,
       c.name as client_name
FROM public.service_types st
JOIN public.clients c ON st.client_id = c.id
ORDER BY st.base_price;

-- 5. View all tickets with full details
SELECT t.customer_name, t.status, t.priority, t.total_amount,
       v.first_name || ' ' || v.last_name as valet_name,
       l.name as location_name, st.name as service_type,
       t.created_at
FROM public.tickets t
JOIN public.valets v ON t.valet_id = v.id
JOIN public.locations l ON t.location_id = l.id
JOIN public.service_types st ON t.service_type_id = st.id
ORDER BY t.created_at DESC;

-- 6. Count tickets by status
SELECT status, COUNT(*) as ticket_count
FROM public.tickets
GROUP BY status
ORDER BY ticket_count DESC;

-- 7. Count tickets by priority
SELECT priority, COUNT(*) as ticket_count
FROM public.tickets
GROUP BY priority
ORDER BY 
  CASE priority
    WHEN 'urgent' THEN 1
    WHEN 'high' THEN 2
    WHEN 'normal' THEN 3
    WHEN 'low' THEN 4
  END;

-- 8. View total revenue by client
SELECT c.name as client_name, 
       SUM(t.total_amount) as total_revenue,
       COUNT(t.id) as total_tickets
FROM public.tickets t
JOIN public.clients c ON t.client_id = c.id
GROUP BY c.id, c.name
ORDER BY total_revenue DESC;

-- 9. View valet performance
SELECT v.first_name || ' ' || v.last_name as valet_name,
       v.rating,
       COUNT(t.id) as total_tickets,
       COUNT(CASE WHEN t.status = 'completed' THEN 1 END) as completed_tickets,
       ROUND(AVG(t.total_amount), 2) as avg_ticket_value
FROM public.valets v
LEFT JOIN public.tickets t ON v.id = t.valet_id
GROUP BY v.id, v.first_name, v.last_name, v.rating
ORDER BY v.rating DESC;

-- 10. View location capacity utilization
SELECT l.name as location_name,
       l.capacity,
       l.current_occupancy,
       ROUND((l.current_occupancy::decimal / l.capacity) * 100, 1) as utilization_percent
FROM public.locations l
ORDER BY utilization_percent DESC;
