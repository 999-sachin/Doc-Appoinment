# Quick Start Guide - CureConnect

## ✅ Backend is Running!

I can see your backend is already running successfully:
- ✅ Server running on port 5000
- ✅ MongoDB Connected

## Next Steps:

### 1. Seed the Database (Add Sample Doctors)

Open your browser and go to:
```
http://localhost:5000/api/seed
```

Or use Postman/curl:
```bash
curl -X POST http://localhost:5000/api/seed
```

This will add 6 sample doctors to your database.

### 2. Verify Backend is Working

Test the API in your browser:
```
http://localhost:5000/api/doctors
```

You should see JSON data with doctors.

### 3. Start/Refresh Frontend

Make sure your frontend is running:
```bash
cd Frontend
npm run dev
```

Then refresh your browser - the doctors should appear!

## Common Issues:

### ❌ "Cannot find module index.js" Error

**Problem:** You're running `nodemon` directly instead of `npm run dev`

**Solution:** Always use:
```bash
cd Backend
npm run dev
```

**NOT:**
```bash
nodemon  # ❌ This won't work
```

### ❌ Frontend shows "No doctors found"

**Solution:** 
1. Make sure backend is running (check terminal for "Server running on port 5000")
2. Seed the database: Visit `http://localhost:5000/api/seed` in browser
3. Refresh frontend

### ❌ Connection Refused Errors

**Check:**
1. Is backend running? Look for "🚀 Server running on port 5000" in terminal
2. Is MongoDB running? Look for "✅ MongoDB Connected" in terminal
3. Try accessing `http://localhost:5000/api/doctors` directly in browser

## Commands Summary:

```bash
# Terminal 1 - Backend
cd Backend
npm run dev

# Terminal 2 - Frontend  
cd Frontend
npm run dev

# Browser - Seed Database
http://localhost:5000/api/seed
```

