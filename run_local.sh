#!/bin/bash
set -euo pipefail

# ──────────────────────────────────────────────
# ExpenseTracker — Local Development Launcher
# Uses local PostgreSQL (Homebrew) + Spring Boot + Vite
# ──────────────────────────────────────────────

# Use Java 23 (project requires 17+)
export JAVA_HOME="/Library/Java/JavaVirtualMachines/jdk-23.jdk/Contents/Home"
export PATH="$JAVA_HOME/bin:$PATH"
echo "Using Java: $(java -version 2>&1 | head -1)"

# ── 1. Ensure PostgreSQL database exists ──
echo "Checking PostgreSQL database..."
if ! psql -lqt | cut -d \| -f 1 | grep -qw expense_tracker_db; then
  echo "Creating database 'expense_tracker_db'..."
  createdb expense_tracker_db
  echo "Database created."
else
  echo "Database 'expense_tracker_db' already exists."
fi

# ── 2. Build & start Spring Boot backend ──
echo "Building backend..."
cd backend
./mvnw clean package -DskipTests -q
echo "Starting backend on http://localhost:8080 ..."
java -jar target/expense-tracker-1.0.0.jar &
BACKEND_PID=$!
cd ..

echo "Waiting for backend to start..."
for i in {1..30}; do
  if curl -sSf http://localhost:8080/ > /dev/null 2>&1; then
    echo "Backend is up! (PID: $BACKEND_PID)"
    break
  fi
  printf "."
  sleep 2
done

# ── 3. Start Vite frontend dev server ──
echo ""
echo "Starting frontend on http://localhost:5173 ..."
cd frontend
npm install --silent
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "═══════════════════════════════════════════"
echo "  ExpenseTracker is running!"
echo "  Frontend : http://localhost:5173"
echo "  Backend  : http://localhost:8080/api"
echo "  Database : PostgreSQL @ localhost:5432"
echo ""
echo "  Press Ctrl+C to stop all services."
echo "═══════════════════════════════════════════"

# Cleanup on exit
trap "echo 'Shutting down...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit 0" SIGINT SIGTERM
wait
