# ⚡ Quick Start Guide (5 Minutes)

Get Productivity Hub Backend running in 5 minutes!

---

## Prerequisites Check (1 min)

Verify you have:

```bash
node --version    # Should be 16+
npm --version     # Should be 7+
```

If not installed, download from [nodejs.org](https://nodejs.org)

---

## Installation (2 min)

```bash
# Navigate to project
cd /path/to/productivity-hub-backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

---

## Configuration (1 min)

Edit `.env` file:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/productivity-hub
JWT_SECRET=your-secret-key-here
```

---

## Start Server (1 min)

```bash
npm run dev
```

You should see:

```
[ts-node-dev] server is running on port 5000
Connected to MongoDB
✅ Ready!
```

---

## Verify Installation

### Option 1: Test with Curl

```bash
curl http://localhost:5000/api/health
```

Expected response:

```json
{
  "success": true,
  "message": "Server is running"
}
```

### Option 2: Test with Postman

1. Open Postman
2. Create POST request to `http://localhost:5000/api/auth/signup`
3. Body (JSON):

```json
{
  "email": "test@example.com",
  "password": "Test123456",
  "name": "Test User"
}
```

4. Send request

Expected: User created successfully

---

## What's Running?

✅ Express.js Server on port 5000  
✅ MongoDB connected  
✅ TypeScript compilation  
✅ Auto-reload on file changes

---

## Next Steps

1. **Read README.md** - Project overview
2. **Check API.md** - Available endpoints
3. **Review ARCHITECTURE.md** - How it works
4. **Follow DEVELOPMENT.md** - Development guide

---

## Common Issues

### MongoDB Connection Error

```
Error: connect ECONNREFUSED
```

**Solution:** Start MongoDB or update connection string in `.env`

### Port Already in Use

```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solution:**

- Change PORT in `.env` to different port (5001, 5002)
- Or kill process using port 5000

### TypeScript Errors

```
Error: TS errors
```

**Solution:** Run `npm run build` to check compilation

---

## Documentation Map

| Need             | Document         |
| ---------------- | ---------------- |
| Full overview    | README.md        |
| How system works | ARCHITECTURE.md  |
| All endpoints    | API.md           |
| Database info    | DATABASE.md      |
| Development      | DEVELOPMENT.md   |
| Timeline         | ROADMAP.md       |
| Navigation       | DOCUMENTATION.md |

---

## Quick Commands

```bash
# Development
npm run dev          # Start dev server

# Production
npm run build        # Build TypeScript
npm start            # Run production

# Verification
npx tsc --noEmit    # Check TypeScript

# Clean
rm -rf dist/        # Remove build
rm -rf node_modules/ # Remove dependencies (then npm install)
```

---

## Project Structure

```
/src
  ├─ /models       # Database schemas
  ├─ /controllers  # API logic
  ├─ /services     # Business logic
  ├─ /routes       # API routes
  ├─ app.ts        # Express app
  └─ server.ts     # Entry point

.env                # Your configuration
README.md           # Project overview
API.md              # All endpoints
```

---

## First API Call

### 1. Sign Up

```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123",
    "name": "John Doe"
  }'
```

### 2. Copy the token from response

### 3. Use token for protected requests

```bash
curl http://localhost:5000/api/users/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Troubleshooting

**Problem:** Server won't start  
**Solution:** Check MongoDB connection and PORT availability

**Problem:** Can't connect to database  
**Solution:** Verify MONGODB_URI in .env

**Problem:** TypeScript errors  
**Solution:** Run `npm install` again

**Problem:** Forgot to configure .env  
**Solution:** Copy from .env.example and update values

---

## You're Ready! 🚀

Server is running and ready for development.

**Next:** Read [README.md](README.md) for full project overview.

---

**Questions?** See [DOCUMENTATION.md](DOCUMENTATION.md) for navigation
