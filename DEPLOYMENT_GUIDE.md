# Healthcare App Deployment Guide

This guide explains how to deploy the Healthcare App with the backend on Render and the frontend on Vercel.

## Prerequisites

1. Render account (for backend deployment)
2. Vercel account (for frontend deployment)
3. MongoDB Atlas account (for database)
4. Gmail account (for email service)

## Backend Deployment (Render)

### 1. Prepare Environment Variables

Create the following environment variables in Render:

- `MONGODB_URI` - Your MongoDB connection string
- `JWT_SECRET` - A secure random string for JWT token signing
- `EMAIL_USER` - Gmail address for sending emails
- `EMAIL_APP_PASSWORD` - Gmail app password (not your regular password)
- `NODE_ENV` - Set to "production"
- `PORT` - Set to "10000"
- `FRONTEND_URL` - Your Vercel frontend URL (e.g., https://healthcare-app-design-4.vercel.app)

### 2. Deploy to Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Set the following configuration:
   - Name: `m-m-healthcare-backend`
   - Runtime: Node
   - Build Command: `cd server && npm install`
   - Start Command: `cd server && npm start`
   - Plan: Free (or choose a paid plan for production)
5. Add the environment variables from step 1
6. Click "Create Web Service"

### 3. Verify Deployment

Once deployed, check:
- The service is running (status should be "Live")
- Visit your API health endpoint: `https://your-service-name.onrender.com/api/health`
- Check the logs for any errors

## Frontend Deployment (Vercel)

### 1. Prepare Environment Variables

Create the following environment variable in Vercel:

- `VITE_API_URL` - Your Render backend URL (e.g., https://m-m-healthcare-backend.onrender.com/api)

### 2. Deploy to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Set the following configuration:
   - Framework Preset: Vite
   - Root Directory: Leave empty (root of repository)
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Add the environment variable from step 1
6. Click "Deploy"

### 3. Verify Deployment

Once deployed, check:
- The site is accessible
- You can register and login
- Health details can be saved and retrieved

## Configuration Files

### Render Configuration (render.yaml)

```yaml
services:
  - type: web
    name: m-m-healthcare-backend
    env: node
    plan: free
    buildCommand: cd server && npm install
    startCommand: cd server && npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 10000
      - key: MONGODB_URI
        sync: false
      - key: JWT_SECRET
        sync: false
      - key: EMAIL_USER
        sync: false
      - key: EMAIL_APP_PASSWORD
        sync: false
      - key: FRONTEND_URL
        value: https://healthcare-app-design-4.vercel.app
```

### Vercel Configuration (vercel.json)

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "env": {
    "VITE_API_URL": "https://m-m-healthcare-backend.onrender.com/api"
  }
}
```

## Environment Files

### Backend (.env.production)

```env
# MongoDB Connection
MONGODB_URI=your_mongodb_connection_string

# JWT Secret
JWT_SECRET=your_secure_jwt_secret

# Email Configuration
EMAIL_USER=your_gmail_address
EMAIL_APP_PASSWORD=your_gmail_app_password

# Server Configuration
PORT=10000
NODE_ENV=production

# Frontend URL (for CORS)
FRONTEND_URL=https://healthcare-app-design-4.vercel.app
```

### Frontend (.env.vercel.production)

```env
VITE_API_URL=https://m-m-healthcare-backend.onrender.com/api
```

## Troubleshooting

### Common Issues

1. **CORS Errors**: 
   - Ensure FRONTEND_URL in backend matches your Vercel deployment URL
   - Check that CORS is properly configured in server.js

2. **Database Connection Issues**:
   - Verify MONGODB_URI is correct
   - Check MongoDB Atlas IP whitelist
   - Ensure database credentials are correct

3. **Email Service Issues**:
   - Verify EMAIL_USER and EMAIL_APP_PASSWORD
   - Check Gmail security settings
   - Ensure 2-factor authentication is enabled with app password

4. **API Connection Issues**:
   - Verify VITE_API_URL in frontend matches your Render deployment URL
   - Check that both services are running
   - Ensure firewall settings allow connections

### Debugging Steps

1. Check Render logs for backend errors
2. Check Vercel logs for frontend errors
3. Test API endpoints directly using tools like Postman
4. Verify environment variables are correctly set
5. Check network tab in browser developer tools for failed requests

## Monitoring

1. Set up uptime monitoring for your Render service
2. Monitor MongoDB Atlas for connection issues
3. Check email delivery rates
4. Monitor Vercel performance metrics

## Scaling Considerations

For production use:
1. Upgrade from free Render plan to a paid plan
2. Use a more robust email service (e.g., SendGrid, AWS SES)
3. Implement database connection pooling
4. Add caching mechanisms
5. Set up proper logging and monitoring
6. Implement rate limiting
7. Add automated backups for the database