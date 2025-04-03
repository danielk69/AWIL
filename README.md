# AWIL - A Web-based Interface for Learning

A full-stack web application for managing and visualizing learning data.

## Features

- User authentication system
- Data import from Excel spreadsheets
- Data management interface
- Data visualization with charts
- Responsive design

## Tech Stack

- Frontend: React with TypeScript
- Backend: Node.js with Express
- Database: Azure Database for PostgreSQL
- Deployment: Azure Web App (Backend) and Azure Static Web Apps (Frontend)

## Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)
- Azure account
- Azure CLI (optional)

## Local Development Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/awil.git
   cd awil
   ```

2. Install dependencies:
   ```bash
   npm run install-all
   ```

3. Set up environment variables:
   - Backend: Create `.env` file in the `backend` directory
   - Frontend: Create `.env` file in the `frontend` directory

4. Start the development servers:
   ```bash
   # Start backend
   cd backend
   npm run dev

   # Start frontend (in a new terminal)
   cd frontend
   npm start
   ```

## Azure Deployment

### Backend Deployment

1. Create an Azure Web App:
   - Go to Azure Portal
   - Create a new Web App
   - Choose Node.js 18 LTS as runtime stack
   - Select your subscription and resource group
   - Choose Free F1 plan

2. Configure environment variables in Azure Web App:
   - Go to Configuration > Application settings
   - Add the following variables:
     ```
     PORT=3001
     DB_HOST=your-db-server.postgres.database.azure.com
     DB_USER=your-db-user
     DB_PASSWORD=your-db-password
     DB_NAME=your-db-name
     JWT_SECRET=your-jwt-secret
     NODE_ENV=production
     ```

3. Deploy backend:
   - Connect your GitHub repository
   - Select the main branch
   - Set the build command to: `npm run build`
   - Set the start command to: `npm start`

### Frontend Deployment

1. Create an Azure Static Web App:
   - Go to Azure Portal
   - Create a new Static Web App
   - Connect your GitHub repository
   - Select the main branch
   - Set the build command to: `npm run build`
   - Set the output location to: `build`

2. Configure environment variables:
   - Go to Configuration > Application settings
   - Add the following variables:
     ```
     REACT_APP_API_URL=https://your-backend-name.azurewebsites.net/api
     REACT_APP_TITLE=AWIL
     ```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the ISC License.
