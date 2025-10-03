# Address Book Web Application

A **full-stack Address Book web application** built with **.NET Core Web API** (backend) and **Angular** (frontend).  
It provides a secure and user-friendly dashboard to manage **contacts, departments, and job titles** with **role-based authorization**.

---

## 🔗 Live Demo

- **Backend (Swagger API):** [https://addressboook.runasp.net/swagger/index.html](https://addressboook.runasp.net/swagger/index.html)  
- **Frontend (Angular App):** [https://address-book-panel.netlify.app/login](https://address-book-panel.netlify.app/login)

---

## 📂 Project Structure

### Backend (`address-book-backend`)
address-book-backend\
├── Controllers # API endpoints\
├── wwwroot # Static files (images)\
├── Models # Entity models\
├── Services # Business logic\
├── Interfaces # Service interfaces\
├── Migrations # EF Core migrations\
└── appsettings.json # Configuration
**

### Frontend (`address-book-frontend`)
├── src/app\
│ ├── components # Reusable UI components\
│ ├── core/models # TypeScript models\
│ ├── core/services # API communication\
│ ├── core/interceptors # HTTP interceptors (JWT, errors)\
│ ├── core/guards # Route guards (auth)\
│ ├── auth # Authentication module\
│ └── shared # Shared UI and utilities\
└── angular.json # Angular configuration

---

## ⚙ Features

- Manage **contacts**, **departments**, and **job titles**
- Role-based **access control**
- Responsive UI with **Angular Material**
- User-friendly **notifications** via **Toastr**
- Confirmation dialogs via **SweetAlert2**
- Secure access with **JWT Authorization**

---

## 🛠 Technology Stack

- **Backend:** .NET Core Web API  
- **Frontend:** Angular 17  
- **UI Components:** Angular Material  
- **Notifications:** Toastr  
- **Dialogs:** SweetAlert2  
- **Authentication:** JWT  

---

## 🚀 How to Run

### Backend
1. Navigate to `address-book-backend`
2. Run `dotnet restore`  
3. Apply migrations: `dotnet ef database update`
4. Run the API: `dotnet run`

### Frontend
1. Navigate to `address-book-frontend`
2. Install dependencies: `npm install`
3. Run Angular app: `ng serve`  
4. Open browser at `http://localhost:4200`

---

## 📦 Additional Notes

- All static files (images) are in `wwwroot`
- API endpoints are in `Controllers`
- Models follow **Entity Framework Core conventions**
- Services handle business logic and are accessed via interfaces
- Angular services communicate with the backend via HTTP

---
