# Role-Based Access Control (RBAC) Dashboard

A comprehensive Role-Based Access Control system built with Next.js 13, featuring a modern UI and robust authentication system.

## Features

- 🔐 Complete authentication system with role-based access
- 👥 User management (Create, Read, Update, Delete)
- 🛡️ Role management with customizable permissions
- 📊 Dashboard with activity monitoring
- 🎨 Modern UI with dark/light mode
- 🔄 Real-time activity tracking
- 📱 Responsive design

## Tech Stack

- **Framework:** Next.js 13 (App Router)
- **Language:** TypeScript
- **Auth:** JWT with HTTP-only cookies
- **Database:** PostgreSQL with Prisma ORM
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Charts:** Recharts
- **Form Handling:** React Hook Form + Zod
- **State Management:** React Hooks

## Project Structure

```
├── app/
│   ├── api/            # API routes
│   ├── users/          # User management pages
│   ├── roles/          # Role management pages
│   └── login/          # Authentication pages
├── components/
│   ├── ui/            # Reusable UI components
│   ├── dashboard/     # Dashboard-specific components
│   ├── users/         # User management components
│   └── roles/         # Role management components
├── lib/
│   ├── api.ts         # API client functions
│   ├── auth.ts        # Authentication utilities
│   └── db.ts          # Database client
└── prisma/
    └── schema.prisma  # Database schema
```

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   ```
   DATABASE_URL="your-postgres-url"
   JWT_SECRET="your-secret-key"
   NEXT_PUBLIC_API_URL="http://localhost:3000/api"
   ```
4. Initialize the database:
   ```bash
   npx prisma generate
   npx prisma db push
   npx prisma db seed
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```

## Default Credentials

Administrator:
- Email: admin@example.com
- Password: admin123

Regular User:
- Email: user@example.com
- Password: user123

## Features in Detail


## Screenshots
-  Signup  Page Admin/User
<img src="screenshots/Screenshot (1280).png" alt="Add Contact Form" width="700"/>
<img src="screenshots/Screenshot (1281).png" alt="Add Contact Form" width="700"/>

-  DashBoard Page
<img src="screenshots/Screenshot (1283).png" alt="Contact List Page" width="700"/>
<img src="screenshots/Screenshot (1284).png" alt="Contact List Page" width="700"/>

-  Users Page
<img src="screenshots/Screenshot (1285).png" alt="Add Contact Form" width="700" />

-  Edit User Page
<img src="screenshots/Screenshot (1286).png" alt="Edit Contact Form" width="700" />

-  Roles Page
<img src="screenshots/Screenshot (1287).png" alt="Edit Contact Form" width="700" />

-  Light Mode Display
<img src="screenshots/Screenshot (1288).png" alt="Edit Contact Form" width="700" />



### User Management
- Create new users with roles
- Edit user details and status
- Delete users
- View user activity history

### Role Management
- Create custom roles
- Assign permissions to roles
- Edit role permissions
- Delete roles

### Dashboard
- User statistics
- Role distribution chart
- Recent activity log
- System status metrics

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.