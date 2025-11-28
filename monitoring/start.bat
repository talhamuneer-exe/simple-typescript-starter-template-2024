@echo off

REM Start monitoring stack
echo Starting Prometheus and Grafana...
docker-compose up -d

echo.
echo Waiting for services to be ready...
timeout /t 5 /nobreak >nul

echo.
echo ✅ Monitoring stack started!
echo.
echo Access the services:
echo   - Prometheus: http://localhost:9090
echo   - Grafana:    http://localhost:3001 (admin/admin)
echo.
echo Verify metrics endpoint:
echo   curl http://localhost:5001/metrics
echo.
echo To stop the services, run:
echo   docker-compose down

