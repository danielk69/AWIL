# AWIL - Name Management System

A full-stack web application for managing and visualizing name data with user authentication.

## Features

- User authentication system
- Data import from spreadsheets
- Data visualization with charts
- Admin portal for data management
- User portal for theme selection

## Tech Stack

- Frontend: React with TypeScript
- Backend: Node.js with Express
- Database: PostgreSQL
- UI Framework: Material-UI
- Charts: Chart.js

## Project Structure

```
awil/
├── backend/           # Node.js backend
│   ├── src/          # Source code
│   ├── config/       # Configuration files
│   └── package.json  # Backend dependencies
└── frontend/         # React frontend
    ├── src/          # Source code
    ├── public/       # Static files
    └── package.json  # Frontend dependencies
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- PostgreSQL
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/awil.git
cd awil
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

4. Set up environment variables:
   - Copy `.env.example` to `.env` in both backend and frontend directories
   - Update the variables with your values

5. Start the development servers:

Backend:
```bash
cd backend
npm run dev
```

Frontend:
```bash
cd frontend
npm start
```

## Deployment

The application is deployed using:
- Backend: Railway.app
- Frontend: Netlify
- Database: Railway PostgreSQL

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. # awil
