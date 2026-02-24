# Expense Tracker 

A simple full-stack Expense Tracker built with **Spring Boot** + **React** + **MySQL**.

---

## 📁 Project Structure

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
- **Render free tier** spins down after 15 min of inactivity. The first request after idle takes ~30–60 seconds.
- **Vite environment variables** must start with `VITE_` to be exposed to the frontend.
- If you change `VITE_API_URL` on Netlify, you must **re-trigger a deploy** (Deploys → Trigger Deploy).
- Make sure your MySQL cloud provider allows connections from Render's IPs.
