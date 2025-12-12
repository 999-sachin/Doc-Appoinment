# CureConnect Setup Guide

## Prerequisites
1. **Node.js** (v14 or higher)
2. **MongoDB** (running locally or MongoDB Atlas connection string)

## Step 1: Install Dependencies

### Backend
```bash
cd Backend
npm install
```

### Frontend
```bash
cd Frontend
npm install
```

## Step 2: Start MongoDB

Make sure MongoDB is running on your system:
- **Windows**: MongoDB should be running as a service, or start it manually
- **Mac/Linux**: Run `mongod` in a terminal
- **Or use MongoDB Atlas**: Update the `MONGO_URI` in Backend/.env

## Step 3: Start the Backend Server

```bash
cd Backend
npm run dev
```

The backend should start on `http://localhost:5000`

You should see:
```
✅ MongoDB Connected
🚀 Server running on port 5000
```

## Step 4: Seed the Database (Optional)

Once the backend is running, you can seed the database with sample doctors:

**Option 1: Using Browser/Postman**
- Make a POST request to: `http://localhost:5000/api/seed`

**Option 2: Using curl**
```bash
curl -X POST http://localhost:5000/api/seed
```

## Step 5: Start the Frontend

Open a new terminal:

```bash
cd Frontend
npm run dev
```

The frontend should start on `http://localhost:5173` (or similar port)

## Troubleshooting

### Backend won't start
- Check if MongoDB is running
- Check if port 5000 is already in use
- Verify all dependencies are installed: `cd Backend && npm install`

### Connection Refused Errors
- Make sure the backend server is running before starting the frontend
- Check that the backend is running on port 5000
- Verify MongoDB connection

### No Doctors Showing
- Make sure you've seeded the database (Step 4)
- Check browser console for errors
- Verify backend API is responding: `http://localhost:5000/api/doctors`

## Environment Variables (Optional)

Create a `.env` file in the Backend folder:

```
MONGO_URI=mongodb://127.0.0.1:27017/cureconnect
PORT=5000
JWT_SECRET=your-secret-key-here
```

## Running Both Servers

You need **two terminal windows**:
1. **Terminal 1**: Backend server (`cd Backend && npm run dev`)
2. **Terminal 2**: Frontend server (`cd Frontend && npm run dev`)

