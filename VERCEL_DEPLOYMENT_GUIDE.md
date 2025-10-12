# Vercel Deployment Guide

This guide explains how to deploy both the frontend and backend of the Healthcare App to Vercel.

## Prerequisites

1. Vercel account (https://vercel.com)
2. MongoDB database (MongoDB Atlas recommended)
3. Environment variables for both frontend and backend

## Backend Deployment (server/)

1. Create a new project in Vercel
2. Connect your GitHub repository
3. Set the root directory to `/server`
4. Set the build command to `npm install`
5. Set the output directory to ` `
6. Add the following environment variables:
   - `MONGODB_URI` - Your MongoDB connection string
   - `JWT_SECRET` - Secret for JWT token generation
   - `EMAIL_USER` - Email for sending OTPs
   - `EMAIL_PASS` - Password for email account
   - `FRONTEND_URL` - URL of your frontend deployment
   - `NODE_ENV` - Set to `production`

## Frontend Deployment (root directory)

1. Create a new project in Vercel
2. Connect your GitHub repository
3. Set the root directory to `/`
4. Set the build command to `npm run build`
5. Set the output directory to `dist`
6. Add the following environment variables:
   - `VITE_API_URL` - URL of your backend deployment (e.g., https://your-backend.vercel.app/api)

## Environment Variables

### Backend Environment Variables (.env)

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email_for_sending_otp
EMAIL_PASS=your_email_password
FRONTEND_URL=https://your-frontend.vercel.app
NODE_ENV=production
PORT=3000
```

### Frontend Environment Variables (.env)

```env
VITE_API_URL=https://your-backend.vercel.app/api
```

## Deployment Steps

1. Deploy the backend first to get the API URL
2. Update the frontend environment variable with the backend URL
3. Deploy the frontend
4. Update the backend's FRONTEND_URL environment variable with the frontend URL
5. Redeploy the backend

## MongoDB Setup

1. Create a MongoDB Atlas account: https://www.mongodb.com/cloud/atlas
2. Create a new cluster
3. Add a database user
4. Configure network access (add your Vercel IPs or allow access from anywhere for testing)
5. Get the connection string and add it to your MONGODB_URI environment variable

## Troubleshooting

### CORS Issues
If you encounter CORS issues, make sure:
1. The FRONTEND_URL in your backend environment variables matches your frontend deployment URL
2. The CORS configuration in server.js allows your frontend origin

### Email Verification Not Working
If OTP emails are not being sent:
1. Check your EMAIL_USER and EMAIL_PASS environment variables
2. Ensure your email provider allows SMTP access
3. For Gmail, you might need to enable "Less secure app access" or use an App Password

### Database Connection Issues
If the backend cannot connect to MongoDB:
1. Verify your MONGODB_URI is correct
2. Check that your MongoDB Atlas cluster allows connections from Vercel IPs
3. Ensure your database user has proper read/write permissions