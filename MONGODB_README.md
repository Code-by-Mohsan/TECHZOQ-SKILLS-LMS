# MongoDB Atlas Integration Setup Guide

## 📖 Overview

This project uses MongoDB Atlas to manage course data. This guide will help you set up and troubleshoot the connection.

---

## 🎯 Your Current Status

### ✅ Already Completed
- ✅ `.env` file configured with MongoDB connection string
- ✅ Seed script created at `/scripts/seed.ts`
- ✅ Database models defined at `/src/models/Course.ts`
- ✅ Connection handler at `/src/lib/db.ts`
- ✅ NPM scripts added

### ⚠️ Current Issue
```
Error: queryTxt ETIMEOUT newproject.v2jyfr2.mongodb.net
```
This means your IP is not whitelisted in MongoDB Atlas.

---

## 🚀 How to Fix (Read One of These)

### Option 1: Quick Fix (2-3 minutes)
👉 See: **MONGODB_QUICK_START.md**

**TL;DR:**
1. Go to https://cloud.mongodb.com/
2. Network Access → Add IP Address → My Current IP
3. Wait 1-2 minutes
4. Run `npm run test:db`

### Option 2: Detailed Setup (10-15 minutes)
👉 See: **MONGODB_SETUP.md**

Complete step-by-step guide with screenshots and troubleshooting.

---

## 📋 Project Structure

```
TZ-WEB/
├── .env                          # Database credentials (DO NOT COMMIT)
├── .env.local.example            # Template for .env
├── package.json                  # npm scripts including seed
├── MONGODB_QUICK_START.md        # Quick 5-minute setup
├── MONGODB_SETUP.md              # Detailed guide
├── SEED.md                       # Seed documentation
│
├── src/
│   ├── app/
│   │   └── courses/
│   │       └── CoursesPageClient.tsx  # Displays seeded courses
│   │
│   ├── lib/
│   │   └── db.ts                     # Database connection handler
│   │
│   ├── models/
│   │   └── Course.ts                 # MongoDB course schema
│   │
│   └── data/
│       └── courses.ts                # Course data (for reference)
│
├── scripts/
│   ├── seed.ts                       # ⭐ Seeds 6 courses to database
│   ├── diagnose-mongodb.ts           # Tests connection
│   ├── test-connection.ts            # Connection verification
│   └── check-env.ts                  # Environment check
```

---

## 🛠️ Available Commands

### Test Database Connection
```bash
npm run test:db
```
Runs comprehensive diagnostics to identify issues.

### Seed Database
```bash
npm run seed
```
Populates MongoDB with 6 sample courses.

### Check Environment
```bash
npm run check:env
```
Verifies .env file is loaded correctly.

---

## 📊 6 Sample Courses

The seed script will add:

1. **Python Programming: Basic to Advanced**
   - Category: Software Engineering
   - Level: Beginner
   - Duration: 8 Weeks

2. **AI: DSML & Deep Learning Engineer**
   - Category: AI & Data Science
   - Level: Advanced
   - Duration: 24 Weeks

3. **Generative & Agentic AI Engineer**
   - Category: AI & Data Science
   - Level: Advanced
   - Duration: 16 Weeks

4. **MERN Stack: Full-Stack Web Development**
   - Category: Software Engineering
   - Level: Intermediate
   - Duration: 16 Weeks

5. **Digital Marketing Mastery**
   - Category: Digital Marketing
   - Level: Beginner
   - Duration: 10 Weeks

6. **UI/UX Designing**
   - Category: Creative Design
   - Level: Beginner
   - Duration: 12 Weeks

---

## 🔄 Complete Setup Workflow

### 1. Verify Environment
```bash
npm install
```

### 2. Check Environment Variables
```bash
npm run test:db
```
Look for:
- ✅ DATABASE_URI loaded
- ✅ DNS resolved
- ✅ MongoDB connected

### 3. If Test Passes: Seed Database
```bash
npm run seed
```

### 4. Verify in Browser
- Start dev server: `npm run dev`
- Visit: http://localhost:3000/courses
- Should see 6 courses displayed

---

## 🔐 Security Notes

### .env File
- ✅ DO NOT commit `.env` to Git
- ✅ Keep credentials secret
- ✅ Use different credentials for production
- ✅ File already in `.gitignore`

### MongoDB Atlas
- Connection limits: Free tier = M0 (512MB storage)
- Use strong passwords
- Enable IP whitelist (done via Network Access)
- Consider using database roles for fine-grained access

---

## ❌ Common Errors & Solutions

### Error: `queryTxt ETIMEOUT newproject.v2jyfr2.mongodb.net`
**Cause:** IP not whitelisted
**Fix:** Network Access → Add IP Address
**Time to Fix:** 2-3 minutes

### Error: `ECONNREFUSED`
**Cause:** MongoDB cluster not running or paused
**Fix:** Check cluster status in MongoDB Atlas
**Verify:** Should show "green" running status

### Error: `Authentication failed`
**Cause:** Wrong username/password
**Fix:** Update `.env` with correct credentials
**Check:** Database Access section in MongoDB Atlas

### Error: `Cannot find module 'mongoose'`
**Cause:** Dependencies not installed
**Fix:** Run `npm install`

---

## 📱 Development Workflow

### First Time Setup
```bash
# 1. Install dependencies
npm install

# 2. Test database connection
npm run test:db

# 3. Seed database with sample data
npm run seed

# 4. Start development server
npm run dev

# 5. Open browser to http://localhost:3000/courses
```

### Running Next Time
```bash
# Just start the development server
npm run dev

# Data persists in MongoDB Atlas
```

---

## 🌐 Database Architecture

```
MongoDB Atlas (Cloud)
│
├── Database: techzoq
│
└── Collections:
    ├── courses          ← 6 seeded courses
    ├── users            ← User accounts
    ├── enrollments      ← Student enrollments
    ├── batches          ← Course batches
    ├── batches          ← More collections...
    └── ...
```

**Growing:** As your app runs, new collections are created automatically.

---

## 🚨 Mongos vs MongoDB - Important!

Your connection uses **SRV** protocol:
```
mongodb+srv://...
```

This means:
- ✅ Automatic failover
- ✅ Load balancing
- ✅ Connection pooling
- ✅ DNS-based routing

---

## 📚 Additional Resources

- **Seed Documentation:** See `SEED.md`
- **Quick Setup:** See `MONGODB_QUICK_START.md`
- **Detailed Setup:** See `MONGODB_SETUP.md`
- **MongoDB Docs:** https://docs.mongodb.com/
- **Atlas Dashboard:** https://cloud.mongodb.com/

---

## ✨ Next Steps After Setup

Once seeding is complete:

1. **View Courses** → http://localhost:3000/courses
2. **Search & Filter** → Try category filters
3. **Add More Data** → Modify `/scripts/seed.ts`
4. **Create Admin Panel** → Manage courses
5. **Deploy to Production** → Use MongoDB Atlas + Vercel

---

## 💡 Tips

1. **Keep `npm run test:db` bookmarked** - Use it anytime you suspect connection issues
2. **MongoDB Atlas Free Tier** - Great for development, consider upgrade for production
3. **Local MongoDB Alternative** - Can use local MongoDB instead during development (see `.env.local.example`)
4. **Backup Data** - MongoDB Atlas has built-in backups for paid tiers
5. **Monitor Usage** - Check MongoDB Atlas dashboard occasionally

---

## 🆘 Still Having Issues?

### Systematic Troubleshooting

1. **Run Diagnostics**
   ```bash
   npm run test:db
   ```

2. **Check Error Code**
   - `ETIMEOUT` = IP whitelist
   - `ECONNREFUSED` = Cluster not running
   - `401` = Invalid credentials

3. **Try Getting Connection String Again**
   - MongoDB Atlas → Clusters → Connect → Connection String

4. **Verify Your IP**
   - Google: "What is my IP"
   - Network Access → IP Address whitelist

5. **Check Network**
   - Try on different network (mobile hotspot)
   - Temporarily disable firewall/VPN

6. **Last Resort: Start Fresh**
   - Create new MongoDB cluster
   - Create new database user
   - Update `.env`
   - Test connection

---

**You're all set! Ready to seed your database! 🎉**

Need help? Check the quick start guide: **MONGODB_QUICK_START.md**
