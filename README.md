This is CRUD project for concert management system.

## Getting Started

First, run the backend server

```bash
#Direct to backend folder
cd backend

#Create .env file inside backend folder
COPY ENVCONF.text content from attachment file in submit test email, then PASTE it into this .env file

#Install Dependency
npm i

#Start Server
npm run start
```

Then, run the frontend (on port 3000)

```bash
#Direct to frontend folder
cd frontend

#Install Dependency
npm i

#Start Server
npm run dev
```

Open http://localhost:3000 with your browser to see the result.

## Dev Tools
Frontend
- NextJS (React base)
- Chakra UI (React component library)
- Zustand (Local state management)
- Bootstrap 5 (CSS base)

Backend
- NestJS (NodeJS base)
- Mongoose (MongoDB connection)

Database
- MongoDB (NoSQL)

## Frontend Structure
```bash
src/
└── app/
    ├── stores/           # Global state (Zustand stores)
    ├── Test/             # Test assignment page (feature module)
    │   ├── utils/        # Business logic / helpers
    │   ├── components/   # UI components used in Test page
    │   └── page.js       # Main page entry (Next.js route)
    └── layout.js         # Global layout
```

## Backend Structure
```bash
src/
 ├── concert/
 │    ├── dto/            # Data Transfer Objects
 │    ├── concert.controller.ts
 │    ├── concert.service.ts
 │    └── concert.module.ts
 │
 ├── reserve/
 │    ├── dto/
 │    ├── reserve.controller.ts
 │    ├── reserve.service.ts
 │    └── reserve.module.ts
 │
 ├── user/
 │    ├── dto/
 │    ├── user.controller.ts
 │    ├── user.service.ts
 │    └── user.module.ts
 │
 ├── schemas/              # MongoDB schemas (Mongoose)
 │    ├── concert.schema.ts
 │    ├── reserve.schema.ts
 │    └── user.schema.ts
 │
 ├── app.module.ts         # Root module
 └── main.ts               # Entry point
```
