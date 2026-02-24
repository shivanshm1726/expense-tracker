echo "Starting MySQL container..."
docker compose up -d mysql
echo "Starting backend (Spring Boot) ..."
#!/bin/bash
set -euo pipefail

echo "Bringing up MySQL + backend via Docker Compose (will build backend image)..."
docker compose up --build -d mysql backend

echo "Waiting for backend to become healthy and respond on http://localhost:8080 ..."
for i in {1..40}; do
  if curl -sSf http://localhost:8080/ > /dev/null 2>&1; then
    echo "Backend is up"
    break
  fi
  printf "."
  sleep 2
done

echo "Done. Start frontend locally with:\n  cd frontend && npm install && npm run dev"
echo "Or open the app at http://localhost:5173 after the frontend is running. Backend API: http://localhost:8080/api"
