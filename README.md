A full-stack Address Book web application built with .NET Core Web API (backend) and Angular (frontend).
It provides a secure and user-friendly dashboard to manage contacts, departments, and job titles with role-based authorization.

🔗 Live Demo:

Backend (Swagger API): https://addressboook.runasp.net/swagger/index.html

Frontend (Angular App): https://address-book-panel.netlify.app/login

/address-book-backend
├── Controllers       # API endpoints
├── wwwroot           # Static files (images)
├── Models            # Entity models
├── Services          # Business logic
├── Interfaces        # Service interfaces
├── Migrations        # EF Core migrations
└── appsettings.json  # Configuration

/address-book-frontend
├── src/app
│   ├── components        # Reusable UI components
│   ├── core/models       # TypeScript models
│   ├── core/services     # API communication
│   ├── core/interceptors # HTTP interceptors (JWT, errors)
│   ├── core/guards       # Route guards (auth)
│   ├── auth              # Authentication module
│   └── shared            # Shared UI and utilities
└── angular.json          # Angular configuration


This project is a complete Address Book Management System, showcasing modern full-stack development using:

.NET Core Web API for backend services

Angular for frontend UI

Angular Material for responsive components

SweetAlert2 for confirmation dialogs

Toastr for notifications

JWT Authorization for secure access
