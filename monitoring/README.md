# Monitoring Setup with Prometheus and Grafana

This directory contains the configuration files for monitoring the Node.js API using Prometheus and Grafana.

## Overview

- **Prometheus**: Time-series database for metrics collection
- **Grafana**: Visualization and dashboarding tool
- **Metrics Endpoint**: `/metrics` - Exposes Prometheus metrics from the Node.js application

## Quick Start

### Prerequisites

- Docker and Docker Compose installed
- Node.js API running on port 5001 (or update `prometheus.yml` with correct port)

### Starting Monitoring Stack

1. **Start the monitoring services:**
   ```bash
   cd monitoring
   docker-compose up -d
   ```

2. **Access the services:**
   - **Prometheus**: http://localhost:9090
   - **Grafana**: http://localhost:3001
     - Username: `admin`
     - Password: `admin` (change in production!)

3. **Verify metrics endpoint:**
   ```bash
   curl http://localhost:5001/metrics
   ```

## Configuration

### Prometheus Configuration

The Prometheus configuration is located in `prometheus/prometheus.yml`. Key settings:

- **Scrape Interval**: 15 seconds (how often Prometheus scrapes metrics)
- **Target**: `host.docker.internal:5001` (Node.js API)
- **Metrics Path**: `/metrics`

**For Linux users**, you may need to change `host.docker.internal` to:
- `172.17.0.1` (default Docker bridge network gateway)
- Or use `host` network mode in docker-compose.yml

**For production**, update the target to your actual API hostname/IP.

### Grafana Configuration

Grafana is pre-configured with:
- **Prometheus datasource** (auto-provisioned)
- **Node.js API Dashboard** (auto-loaded)

Configuration files:
- `grafana/provisioning/datasources/prometheus.yml` - Datasource configuration
- `grafana/provisioning/dashboards/default.yml` - Dashboard provisioning
- `grafana/dashboards/nodejs-api-dashboard.json` - Pre-built dashboard

## Available Metrics

The Node.js API exposes the following Prometheus metrics:

### HTTP Metrics
- `http_requests_total` - Total number of HTTP requests (counter)
- `http_request_duration_seconds` - HTTP request duration histogram
- `http_active_requests` - Number of currently active requests (gauge)
- `http_errors_total` - Total number of HTTP errors (counter)
- `response_time_seconds` - Response time histogram by endpoint

### Security Metrics
- `security_events_total` - Security events counter (auth failures, injection attempts, etc.)
- `rate_limit_hits_total` - Rate limit hits counter

### Node.js Metrics (Default)
- `nodejs_heap_size_total_bytes` - Total heap size
- `nodejs_heap_size_used_bytes` - Used heap size
- `nodejs_eventloop_lag_seconds` - Event loop lag
- `nodejs_active_handles` - Active handles
- `nodejs_active_requests` - Active requests
- And more...

## Dashboard Panels

The pre-built dashboard includes:

1. **HTTP Request Rate** - Requests per second by method, route, and status code
2. **HTTP Request Duration (95th percentile)** - Response time distribution
3. **Active Requests** - Current number of active requests
4. **Error Rate** - Error rate by method, route, and error code
5. **Security Events** - Security event rate by type and endpoint
6. **HTTP Status Codes** - Distribution of status codes (pie chart)
7. **Node.js Memory Usage** - Heap size metrics
8. **Rate Limit Hits** - Rate limit violations by endpoint and IP
9. **Response Time by Endpoint** - p50, p95, p99 percentiles

## Customization

### Adding Custom Metrics

To add custom metrics, update `src/middleware/metrics.ts`:

```typescript
export const customMetric = new client.Counter({
  name: 'custom_metric_total',
  help: 'Description of custom metric',
  labelNames: ['label1', 'label2'],
  registers: [register],
});
```

### Creating Custom Dashboards

1. Create a new JSON file in `grafana/dashboards/`
2. Use Grafana UI to create/edit dashboards
3. Export the dashboard JSON and save it in the dashboards folder
4. Restart Grafana: `docker-compose restart grafana`

### Alerting (Optional)

To set up alerting:

1. Create `prometheus/alert_rules.yml` with your alert rules
2. Uncomment the `rule_files` section in `prometheus.yml`
3. Configure Alertmanager (not included in this setup)

Example alert rule:
```yaml
groups:
  - name: api_alerts
    rules:
      - alert: HighErrorRate
        expr: rate(http_errors_total[5m]) > 0.1
        for: 5m
        annotations:
          summary: "High error rate detected"
```

## Troubleshooting

### Prometheus can't scrape metrics

1. **Check if API is running:**
   ```bash
   curl http://localhost:5001/metrics
   ```

2. **Check Prometheus targets:**
   - Go to http://localhost:9090/targets
   - Verify the target is UP

3. **For Docker Desktop (Windows/Mac):**
   - Use `host.docker.internal` (already configured)
   
4. **For Linux:**
   - Change `host.docker.internal` to `172.17.0.1` or use host network mode

### Grafana can't connect to Prometheus

1. **Check Prometheus is running:**
   ```bash
   docker-compose ps
   ```

2. **Check network connectivity:**
   ```bash
   docker-compose exec grafana ping prometheus
   ```

3. **Verify datasource configuration:**
   - Go to Grafana → Configuration → Data Sources
   - Test the Prometheus connection

### Metrics not appearing

1. **Verify metrics endpoint:**
   ```bash
   curl http://localhost:5001/metrics | grep http_requests_total
   ```

2. **Check Prometheus is scraping:**
   - Go to http://localhost:9090/graph
   - Query: `up{job="nodejs-api"}`

3. **Check scrape interval:**
   - Metrics may take up to 15 seconds to appear (scrape interval)

## Production Considerations

1. **Change default passwords:**
   - Update Grafana admin password in `docker-compose.yml`
   - Use environment variables or secrets management

2. **Secure metrics endpoint:**
   - Add authentication to `/metrics` endpoint
   - Use HTTPS in production

3. **Resource limits:**
   - Add resource limits to docker-compose.yml
   - Monitor Prometheus storage usage

4. **Backup:**
   - Backup Grafana dashboards and Prometheus data
   - Use volume mounts for persistence

5. **Network security:**
   - Restrict access to monitoring services
   - Use firewall rules

6. **High availability:**
   - Consider Prometheus federation for multiple instances
   - Use Grafana HA setup

## Stopping Services

```bash
cd monitoring
docker-compose down
```

To remove volumes (deletes all data):
```bash
docker-compose down -v
```

## Additional Resources

- [Prometheus Documentation](https://prometheus.io/docs/)
- [Grafana Documentation](https://grafana.com/docs/)
- [prom-client Documentation](https://github.com/siimon/prom-client)

