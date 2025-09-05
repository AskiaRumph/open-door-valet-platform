@echo off
echo ========================================
echo Open Door Valet Database Commands
echo ========================================
echo.
echo Available commands:
echo 1. View all profiles
echo 2. View all clients
echo 3. View all locations
echo 4. View all valets
echo 5. View all tickets
echo 6. View ticket summary
echo 7. View revenue summary
echo 8. View valet performance
echo 9. Interactive mode
echo 10. Exit
echo.
set /p choice="Enter your choice (1-10): "

if "%choice%"=="1" (
    docker exec -i open-door-valet-db psql -U valet -d valet_db -c "SELECT display_name, role, status FROM public.profiles ORDER BY role, display_name;"
) else if "%choice%"=="2" (
    docker exec -i open-door-valet-db psql -U valet -d valet_db -c "SELECT name, company_name, city, state FROM public.clients;"
) else if "%choice%"=="3" (
    docker exec -i open-door-valet-db psql -U valet -d valet_db -c "SELECT name, address, capacity, current_occupancy FROM public.locations;"
) else if "%choice%"=="4" (
    docker exec -i open-door-valet-db psql -U valet -d valet_db -c "SELECT first_name, last_name, license_number, rating FROM public.valets;"
) else if "%choice%"=="5" (
    docker exec -i open-door-valet-db psql -U valet -d valet_db -c "SELECT customer_name, status, priority, total_amount FROM public.tickets ORDER BY created_at;"
) else if "%choice%"=="6" (
    docker exec -i open-door-valet-db psql -U valet -d valet_db -c "SELECT status, COUNT(*) as ticket_count FROM public.tickets GROUP BY status ORDER BY ticket_count DESC;"
) else if "%choice%"=="7" (
    docker exec -i open-door-valet-db psql -U valet -d valet_db -c "SELECT c.name as client_name, SUM(t.total_amount) as total_revenue, COUNT(t.id) as total_tickets FROM public.tickets t JOIN public.clients c ON t.client_id = c.id GROUP BY c.id, c.name ORDER BY total_revenue DESC;"
) else if "%choice%"=="8" (
    docker exec -i open-door-valet-db psql -U valet -d valet_db -c "SELECT v.first_name || ' ' || v.last_name as valet_name, v.rating, COUNT(t.id) as total_tickets, ROUND(AVG(t.total_amount), 2) as avg_ticket_value FROM public.valets v LEFT JOIN public.tickets t ON v.id = t.valet_id GROUP BY v.id, v.first_name, v.last_name, v.rating ORDER BY v.rating DESC;"
) else if "%choice%"=="9" (
    docker exec -it open-door-valet-db psql -U valet -d valet_db
) else if "%choice%"=="10" (
    echo Goodbye!
    exit /b
) else (
    echo Invalid choice. Please try again.
)

echo.
pause
call valet_db_commands.bat
