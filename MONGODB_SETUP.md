# MongoDB Atlas Setup Guide for TZ-WEB

## ⚠️ Current Issue
**Error:** `queryTxt ETIMEOUT newproject.v2jyfr2.mongodb.net`
**Cause:** DNS lookup timeout when connecting to MongoDB Atlas cluster

This indicates MongoDB Atlas network access is not properly configured.

---

## ✅ Step-by-Step Setup

### Step 1: Access MongoDB Atlas

1. Go to https://cloud.mongodb.com/
2. Sign in with your account
3. Click on **"Clusters"** (left sidebar)
4. Select your **"newproject"** cluster

### Step 2: Configure Network Access ⚡ (CRITICAL)

**This is the most common cause of the ETIMEOUT error!**

1. In MongoDB Atlas, click **"Network Access"** (left sidebar)
2. Click **"ADD IP ADDRESS"** button
3. You have two options:

   **Option A: Allow Your Current IP (Recommended for Development)**
   - Click "My Current IP"
   - It will auto-detect your IP
   - Add a description: "Development Machine"
   - Click "Add IP Address"

   **Option B: Allow All IPs (For Testing - Less Secure)**
   - Click "ACCESS ANYWHERE"
   - Enter CIDR: `0.0.0.0/0`
   - Add description: "All IPs (Testing)"
   - Click "Confirm"

4. Wait for the change to take effect (usually instant)

### Step 3: Verify Connection String Format

Your connection string should look like:
```
mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/?appName=PROJECT_NAME
```

Expected format:
```
mongodb+srv://saniaakram298_db_user:O0D3j6weIu1jte5G@newproject.v2jyfr2.mongodb.net/?appName=newproject
```

✅ Your current `.env` file is correctly formatted!

### Step 4: Create Database User (If Not Done)

1. In MongoDB Atlas, click **"Database Access"** (left sidebar)
2. Click **"ADD NEW DATABASE USER"**
3. Username: `saniaakram298_db_user`
4. Password: `O0D3j6weIu1jte5G`
5. Select **"Database User"** role
6. Click "Add User"

**Note:** If user already exists, verify the credentials match exactly.

### Step 5: Verify Cluster Status

1. Go to **"Clusters"** page
2. Check your **"newproject"** cluster status
3. It should show:
   - ✅ Green status
   - Running state
   - M0 (free tier) or your tier type

### Step 6: Test Connection

Run this verification script:

```bash
npm run test:db
```

Or test manually:

```bash
npm install
npm run seed
```

---

## 🔧 Troubleshooting Steps

### If Still Getting `queryTxt ETIMEOUT`:

1. **Check Network Access Again**
   - Go to Network Access
   - Ensure your IP is listed
   - If using VPN/Proxy, add VPN IP instead
   - Try Option B (Allow All IPs) for testing

2. **Check Your Internet Connection**
   - Try: `ping google.com`
   - Try: `nslookup newproject.v2jyfr2.mongodb.net`
   - Your ISP/network might be blocking DNS on port 27017

3. **Verify Firewall Settings**
   - Temporarily disable Windows Firewall
   - Check antivirus settings
   - Ask network admin if ports 27017/27018 are open

4. **Use MongoDB Compass (Alternative Connection Test)**
   - Download: https://www.mongodb.com/products/compass
   - Paste your connection string
   - Click "Connect"
   - This helps isolate the issue

### If Getting `ECONNREFUSED`:

- Cluster is down or deployment failed
- Go to Clusters → Click cluster → Check deployment status
- Retry deployment if needed

### If Getting `Authentication Failed`:

- Username or password is incorrect
- Go to Database Access
- Reset the password or create new user
- Update `.env` file with correct credentials

---

## 📋 Checklist Before Running Seed

- [ ] MongoDB Atlas Account Active
- [ ] Cluster "newproject" created and running
- [ ] Network Access configured (your IP added)
- [ ] Database User created: `saniaakram298_db_user`
- [ ] `.env` file has correct DATABASE_URI
- [ ] `.env.local` is in `.gitignore` (never commit secrets!)
- [ ] Local Node.js packages installed: `npm install`

---

## 🚀 Running the Seed

Once all checks pass:

```bash
# Install dependencies
npm install

# Test connection first
npm run test:db

# If test passes, run seed
npm run seed
```

Expected output:
```
🔌 Connecting to MongoDB...
✅ Connected to MongoDB in XXXms
🗑️  Clearing existing courses...
✅ Cleared existing courses
📝 Inserting seed courses...
✅ Seeded 6 courses successfully
   - Python Programming: Basic to Advanced
   - AI: DSML & Deep Learning Engineer
   - Generative & Agentic AI Engineer
   - MERN Stack: Full-Stack Web Development
   - Digital Marketing Mastery
   - UI/UX Designing
✅ Disconnected from MongoDB
```

---

## 📚 MongoDB Atlas Help Resources

- **Cluster Deployment:** https://docs.mongodb.com/manual/tutorial/atlas-cluster-setup/
- **Network Access:** https://docs.mongodb.com/manual/reference/atlas-limits/#IP-Address-and-Cluster-Name-Constraints
- **Connection Strings:** https://docs.mongodb.com/manual/reference/connection-string/
- **Database Users:** https://docs.mongodb.com/manual/topics/security/

---

## ⚡ Quick Fix Summary

This error usually means **IP whitelist not configured**:

1. Go to MongoDB Atlas
2. Click "Network Access"
3. Click "ADD IP ADDRESS"
4. Click "My Current IP"
5. Click "Add IP Address"
6. Wait 1-2 minutes
7. Try `npm run seed` again

That's it! This fixes 95% of `queryTxt ETIMEOUT` errors.
