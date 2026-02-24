# Features

- Register / Login — manage an account and secure your data.
- Dashboard — glance at monthly charts and summary cards (income vs expense, totals).
- Add Expense — create records with title, amount, category, date, linked to your account.
- Add Income — record income with title, amount, source, date.
- Budgets — set monthly spending limits for a user/month.
- Recurring Expenses — schedule repeating payments (frequency, next due date, active toggle).
- Reports — aggregated category/source summaries and monthly totals; exportable.
- Tables & Charts — sortable tables and interactive charts; filter by date.

Usage (very short)

1. Register → Login.
2. Dashboard for quick overview.
3. Expenses → New Expense → fill fields → Save.
4. Income → New Income → fill fields → Save.
5. Budgets → Add Budget → set Month/Year/Limit → Save.
6. Recurring → Add → set Title/Amount/Category/Frequency/NextDueDate → Activate.
7. Reports → choose range/filters → export if needed.

How data is stored

- Database: PostgreSQL (default connection: localhost:5432, db: `expense_tracker_db`).

That's it — use pages in order: Register → Login → Dashboard → Expenses/Income/Budgets/Recurring → Reports.
# Expense Tracker 

A simple full-stack Expense Tracker built with **Spring Boot** + **React** + **MySQL**.

---

## 📁 Project Structure

```
ExpenseTracker/
├── backend/                          ← Spring Boot (Java 17)
│   ├── pom.xml
│   └── src/main/java/com/expensetracker/
│       ├── ExpenseTrackerApplication.java   ← Main class
│       ├── config/
│       │   ├── SecurityConfig.java          ← Spring Security config
│       │   └── CorsConfig.java              ← CORS for React
│       ├── controller/
│       │   ├── AuthController.java          ← Login & Register APIs
│       │   └── ExpenseController.java       ← Expense CRUD APIs
│       ├── dto/
│       │   ├── RegisterRequest.java
│       │   ├── LoginRequest.java
│       │   ├── ExpenseRequest.java
│       │   ├── ExpenseResponse.java
│       │   ├── MonthlySummary.java
│       │   └── CategorySummary.java
│       ├── entity/
│       │   ├── User.java                    ← User table
│       │   └── Expense.java                 ← Expense table
│       ├── repository/
│       │   ├── UserRepository.java
│       │   └── ExpenseRepository.java
│       └── service/
│           ├── UserService.java
│           └── ExpenseService.java
│
├── frontend/                         ← React (Vite)
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── src/
│       ├── main.jsx
│       ├── App.jsx                   ← Routes
│       ├── index.css                 ← Tailwind imports
│       ├── services/
│       │   └── api.js                ← Axios API calls
│       ├── pages/
│       │   ├── Login.jsx
│       │   ├── Register.jsx
│       │   └── Dashboard.jsx
│       └── components/
│           ├── StatsCards.jsx
│           ├── MonthlyChart.jsx      ← Bar chart (Recharts)
│           ├── CategoryChart.jsx     ← Pie chart (Recharts)
│           ├── ExpenseTable.jsx
│           └── ExpenseModal.jsx      ← Add/Edit modal
│
└── README.md
```

---

## 🚀 How to Run

### Prerequisites
- **Java 17** (JDK)
- **Maven** (comes with most IDEs)
- **Node.js 18+** and **npm**
- **MySQL 8** running locally

---

### Step 1: Set Up MySQL Database

Open MySQL and create the database:

```sql
CREATE DATABASE expense_tracker_db;
```

> **Note:** Update `backend/src/main/resources/application.properties` if your MySQL username/password is different from `root`/`root`.

---

### Step 2: Run Backend (Spring Boot)

```bash
cd backend
./mvnw spring-boot:run
```

Or if you have Maven installed globally:

```bash
cd backend
mvn spring-boot:run
```

Backend runs at: **http://localhost:8080**

---

### Step 3: Run Frontend (React)

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: **http://localhost:5173**

---

## 📡 REST API Endpoints

| Method | Endpoint                         | Description             |
|--------|----------------------------------|-------------------------|
| POST   | `/api/auth/register`             | Register new user       |
| POST   | `/api/auth/login`                | Login user              |
| GET    | `/api/expenses?userId=1`         | Get all expenses        |
| POST   | `/api/expenses?userId=1`         | Add new expense         |
| PUT    | `/api/expenses/{id}?userId=1`    | Update expense          |
| DELETE | `/api/expenses/{id}?userId=1`    | Delete expense          |
| GET    | `/api/expenses/monthly-summary`  | Monthly totals (chart)  |
| GET    | `/api/expenses/category-summary` | Category totals (chart) |

---

## 🛠 Tech Stack

| Layer    | Technology        |
|----------|-------------------|
| Backend  | Spring Boot 3.2   |
| Frontend | React 18 (Vite)   |
| Database | MySQL 8           |
| Security | Spring Security   |
| Styling  | Tailwind CSS      |
| Charts   | Recharts          |
| HTTP     | Axios             |

---

## 📝 Features

- ✅ User Registration & Login
- ✅ Add / Edit / Delete Expenses
- ✅ View All Expenses (Table)
- ✅ Filter by Category & Date Range
- ✅ Dashboard with Stats Cards
- ✅ Monthly Bar Chart
- ✅ Category Pie Chart
- ✅ Clean, Modern UI

---

## 🌐 Deployment Guide (Netlify + Render)

### Architecture

| Component | Hosted On | URL |
|-----------|-----------|-----|
| Frontend (React) | **Netlify** | `https://your-app.netlify.app` |
| Backend (Spring Boot) | **Render** | `https://your-backend.onrender.com` |
| Database (MySQL) | **Aiven / PlanetScale / Railway** | Remote MySQL instance |

---

### Step A: Set Up a Remote MySQL Database

Since Render doesn't offer MySQL, use a **free cloud MySQL** provider:

**Option 1 — [Aiven](https://aiven.io)** (recommended, free tier available):
1. Sign up at https://aiven.io
2. Create a **MySQL** service (free plan)
3. Note down the **Host**, **Port**, **Username**, **Password**, and **Database name**
4. Your JDBC URL will look like:
   ```
   jdbc:mysql://HOST:PORT/DATABASE?sslMode=REQUIRED
   ```

**Option 2 — [Railway](https://railway.app)**:
1. Sign up → New Project → Add MySQL
2. Copy the connection details from the Variables tab

---

### Step B: Deploy Backend on Render

1. **Push your code to GitHub** (if you haven't already):
   ```bash
   git init
   git add .
   git commit -m "initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/ExpenseTracker.git
   git push -u origin main
   ```

2. **Go to [Render](https://render.com)** → Sign up / Log in

3. **Create a New Web Service**:
   - Click **"New" → "Web Service"**
   - Connect your **GitHub repo**
   - Configure:
     | Setting | Value |
     |---------|-------|
     | **Name** | `expense-tracker-backend` |
     | **Root Directory** | `backend` |
     | **Runtime** | `Docker` |
     | **Instance Type** | `Free` |

4. **Add Environment Variables** (in the Render dashboard):
   | Key | Value |
   |-----|-------|
   | `DATABASE_URL` | `jdbc:mysql://YOUR_HOST:PORT/YOUR_DB?sslMode=REQUIRED` |
   | `DATABASE_USERNAME` | Your MySQL username |
   | `DATABASE_PASSWORD` | Your MySQL password |
   | `FRONTEND_URL` | `https://your-app.netlify.app` (set after Netlify deploy) |
   | `PORT` | `8080` |

5. Click **"Create Web Service"** — Render will build & deploy your backend.

6. **Copy your Render backend URL** (e.g., `https://expense-tracker-backend.onrender.com`)

---

### Step C: Deploy Frontend on Netlify

1. **Go to [Netlify](https://netlify.com)** → Sign up / Log in

2. **Add a New Site → Import from Git**:
   - Connect your **GitHub repo**
   - Configure build settings:
     | Setting | Value |
     |---------|-------|
     | **Base directory** | `frontend` |
     | **Build command** | `npm run build` |
     | **Publish directory** | `frontend/dist` |

3. **Add Environment Variable** (Site Settings → Environment Variables):
   | Key | Value |
   |-----|-------|
   | `VITE_API_URL` | `https://expense-tracker-backend.onrender.com/api` |

   > ⚠️ Replace with your **actual Render backend URL** + `/api`

4. Click **"Deploy Site"**

5. **Copy your Netlify URL** (e.g., `https://your-app.netlify.app`)

---

### Step D: Connect Frontend ↔ Backend

1. Go back to **Render Dashboard** → your backend service → **Environment**
2. Set `FRONTEND_URL` = `https://your-app.netlify.app` (your Netlify URL, **no trailing slash**)
3. **Redeploy** the backend on Render (Manual Deploy → Deploy latest commit)

---

### ⚠️ Important Notes

- **Render free tier** spins down after 15 min of inactivity. The first request after idle takes ~30–60 seconds.
- **Vite environment variables** must start with `VITE_` to be exposed to the frontend.
- If you change `VITE_API_URL` on Netlify, you must **re-trigger a deploy** (Deploys → Trigger Deploy).
- Make sure your MySQL cloud provider allows connections from Render's IPs.
