# Expense Tracker

A full-stack Expense Tracker built with **Spring Boot** + **React (Vite)** + **PostgreSQL** + **Tailwind CSS**.

---

## 📁 Project Structure

```
ExpenseTracker/
├── backend/          # Spring Boot REST API
│   ├── Dockerfile
│   ├── pom.xml
│   ├── render.yaml   # Render deployment config
│   └── src/
├── frontend/         # React + Vite + Tailwind
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── vercel.json   # Vercel deployment config
│   └── src/
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## � Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Backend    | Spring Boot 3.2, Java 17         |
| Frontend   | React 18, Vite 5, Tailwind CSS 3 |
| Database   | PostgreSQL 15                     |
| Security   | Spring Security, BCrypt           |
| Charts     | Recharts                          |
| HTTP       | Axios                             |
| Export     | Apache POI (Excel)                |
| Deploy     | Render, Vercel, Supabase       |

---

## 📝 Features

- ✅ User Registration & Login (BCrypt hashed passwords)
- ✅ Add / Edit / Delete Expenses & Incomes
- ✅ Filter by Category, Source & Date Range
- ✅ Dashboard with Stats Cards
- ✅ Monthly Bar Chart & Category Pie Chart
- ✅ Budget Management (monthly budgets with alerts)
- ✅ Recurring Expenses (auto-processed by scheduler)
- ✅ Excel Report Export
- ✅ Dark Mode Support
- ✅ Responsive Modern UI

---

## 🚀 Local Development

### Prerequisites
- **Java 17+** (JDK)
- **Maven** (or use included `mvnw`)
- **Node.js 18+** and **npm**
- **PostgreSQL 15** running locally

### Quick Start (with script)

```bash
chmod +x run_local.sh
./run_local.sh
```

### Manual Start

**1. Create PostgreSQL database:**
```sql
CREATE DATABASE expense_tracker_db;
```

**2. Run Backend:**
```bash
cd backend
./mvnw spring-boot:run
```
Backend runs at: **http://localhost:8080**

**3. Run Frontend:**
```bash
cd frontend
npm install
npm run dev
```
Frontend runs at: **http://localhost:5173**

---

## 🐳 Docker Compose (Full Stack)

```bash
# Copy env file and customize
cp .env.example .env

# Build and start all services (Postgres + Backend + Frontend)
docker-compose up --build -d

# Check logs
docker-compose logs -f
```

- Frontend: **http://localhost:3000**
- Backend API: **http://localhost:8080/api**
- PostgreSQL: **localhost:5432**

```bash
# Stop all services
docker-compose down

# Stop and remove volumes (reset DB)
docker-compose down -v
```

---

## ☁️ Production Deployment (Supabase + Render + Vercel)

### Architecture

```
User's Browser
     │
     ▼
┌──────────────┐        HTTPS API calls        ┌──────────────────┐
│   Vercel     │  ──────────────────────────►   │  Render Backend  │
│  (Frontend)  │  ◄──────────────────────────   │  (Spring Boot)   │
│  React SPA   │        JSON responses          │   Port 8080      │
└──────────────┘                                └────────┬─────────┘
                                                         │
                                                    JDBC + SSL
                                                         │
                                                         ▼
                                                ┌──────────────────┐
                                                │ Supabase Postgres│
                                                │  (Free - 500MB)  │
                                                │  No expiry       │
                                                └──────────────────┘
```

### Step 1: Create Database on Supabase

1. Go to [supabase.com](https://supabase.com) → **Sign up** (use GitHub)
2. Click **New Project**
   - **Name**: `expense-tracker`
   - **Database Password**: choose a strong password (**save it!**)
   - **Region**: closest to you
3. Wait for project to spin up (~2 min)
4. Go to **Settings** → **Database** → scroll to **Connection parameters**
5. Note down:
   - **Host**: `db.xxxx.supabase.co`
   - **Port**: `5432`
   - **Database name**: `postgres`
   - **User**: `postgres`
   - **Password**: *(the password you set)*
6. Your JDBC URL will be: `jdbc:postgresql://db.xxxx.supabase.co:5432/postgres`

> **Note**: Tables are auto-created by Spring Boot on first startup (`ddl-auto=update`). No manual SQL needed.

### Step 2: Deploy Backend on Render

1. Go to [render.com](https://render.com) → **Sign up** (use GitHub)
2. Click **New +** → **Web Service** → **Connect your GitHub repo**
3. Configure:
   - **Name**: `expense-tracker-backend`
   - **Root Directory**: `backend`
   - **Environment**: **Docker**
   - **Dockerfile Path**: `./Dockerfile`
   - **Plan**: **Free**

4. Add **Environment Variables**:

   | Key                 | Value                                                   |
   |---------------------|---------------------------------------------------------|
   | `DATABASE_URL`      | `jdbc:postgresql://db.xxxx.supabase.co:5432/postgres`   |
   | `DATABASE_USERNAME` | `postgres`                                              |
   | `DATABASE_PASSWORD` | *(your Supabase DB password)*                           |
   | `FRONTEND_URL`      | `https://your-app.vercel.app` *(set after Step 3)*      |
   | `PORT`              | `8080`                                                  |

5. Click **Deploy Web Service** — wait ~5-10 min for build
6. Copy your backend URL: `https://expense-tracker-backend.onrender.com`

### Step 3: Deploy Frontend on Vercel

1. Go to [vercel.com](https://vercel.com) → **Sign up** (use GitHub)
2. Click **Add New...** → **Project** → **Import** your GitHub repo
3. Configure:
   - **Root Directory**: `frontend`
   - **Framework Preset**: Vite *(auto-detected)*
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

4. Add **Environment Variable**:

   | Key            | Value                                                  |
   |----------------|--------------------------------------------------------|
   | `VITE_API_URL` | `https://expense-tracker-backend.onrender.com/api`     |

5. Click **Deploy** — takes ~1-2 min
6. Copy your frontend URL: `https://your-app.vercel.app`

### Step 4: Connect Everything (CORS)

1. Go back to **Render** → your backend service → **Environment**
2. Set `FRONTEND_URL` = `https://your-app.vercel.app` *(your actual Vercel URL)*
3. Click **Save Changes** → backend auto-redeploys

### Step 5: Test 🎉

1. Open `https://your-app.vercel.app`
2. Register a new account
3. Add expenses, incomes, budgets
4. Check dashboard — all data stored in Supabase!

> **Note**: On Render free tier, the backend spins down after 15 min of inactivity. First request after that takes ~30-60 seconds to cold-start. This is normal for free tier demos.

---

### Option 2: Docker on VPS (DigitalOcean / AWS EC2)

```bash
# SSH into your server
ssh user@your-server-ip

# Clone repo
git clone https://github.com/shivanshm1726/expense-tracker.git
cd expense-tracker

# Create .env with production values
cp .env.example .env
nano .env   # set strong passwords, real domain, etc.

# Build and run
docker-compose up --build -d
```

Set up nginx reverse proxy + Let's Encrypt for HTTPS.

---

## � Environment Variables

| Variable             | Description                          | Default                           |
|----------------------|--------------------------------------|-----------------------------------|
| `DATABASE_URL`       | PostgreSQL JDBC connection URL       | `jdbc:postgresql://localhost:5432/expense_tracker_db` |
| `DATABASE_USERNAME`  | Database username                    | `shivanshmishra`                  |
| `DATABASE_PASSWORD`  | Database password                    | *(empty)*                         |
| `FRONTEND_URL`       | Frontend origin (for CORS)           | `http://localhost:5173`           |
| `PORT`               | Backend server port                  | `8080`                            |
| `VITE_API_URL`       | Backend API base URL (frontend)      | `http://localhost:8080/api`       |

---

## 📄 API Endpoints

| Method   | Endpoint                          | Description                    |
|----------|-----------------------------------|--------------------------------|
| POST     | `/api/auth/register`              | Register a new user            |
| POST     | `/api/auth/login`                 | Login                          |
| GET      | `/api/expenses`                   | Get all expenses (filtered)    |
| POST     | `/api/expenses`                   | Add expense                    |
| PUT      | `/api/expenses/{id}`              | Update expense                 |
| DELETE   | `/api/expenses/{id}`              | Delete expense                 |
| GET      | `/api/expenses/monthly-summary`   | Monthly expense summary        |
| GET      | `/api/expenses/category-summary`  | Category-wise summary          |
| GET      | `/api/incomes`                    | Get all incomes (filtered)     |
| POST     | `/api/incomes`                    | Add income                     |
| PUT      | `/api/incomes/{id}`               | Update income                  |
| DELETE   | `/api/incomes/{id}`               | Delete income                  |
| GET      | `/api/incomes/monthly-summary`    | Monthly income summary         |
| GET      | `/api/incomes/source-summary`     | Source-wise summary            |
| GET      | `/api/budgets`                    | Get all budgets                |
| GET      | `/api/budgets/current`            | Get current month budget       |
| POST     | `/api/budgets`                    | Set budget                     |
| DELETE   | `/api/budgets/{id}`               | Delete budget                  |
| GET      | `/api/recurring`                  | Get recurring expenses         |
| POST     | `/api/recurring`                  | Add recurring expense          |
| PUT      | `/api/recurring/{id}`             | Update recurring expense       |
| PATCH    | `/api/recurring/{id}/active`      | Toggle active status           |
| DELETE   | `/api/recurring/{id}`             | Delete recurring expense       |
| POST     | `/api/recurring/process-due`      | Process due recurring expenses |
| GET      | `/api/reports/export`             | Export Excel report            |

---
