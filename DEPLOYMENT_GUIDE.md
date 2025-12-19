# 🚀 Full Stack Vercel Deployment Guide
## Education Institute Application

Deploy both your **server** and **client** to Vercel.

---

## 📊 Deployment Architecture

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│  Client (Vercel)                                   │
│  https://your-client.vercel.app                    │
│                                                     │
│  ┌─────────────────────────────────────┐          │
│  │  React + Vite Frontend              │          │
│  │  - User Interface                   │          │
│  │  - API calls to /api/*              │          │
│  └─────────────────────────────────────┘          │
│                    │                                │
│                    │ API Requests                   │
│                    ▼                                │
└─────────────────────────────────────────────────────┘
                     │
                     │ Proxied via vercel.json
                     ▼
┌─────────────────────────────────────────────────────┐
│                                                     │
│  Server (Vercel)                                   │
│  https://your-server.vercel.app                    │
│                                                     │
│  ┌─────────────────────────────────────┐          │
│  │  Node.js + Express API              │          │
│  │  - Serverless Functions             │          │
│  │  - 10s timeout (free tier)          │          │
│  └─────────────────────────────────────┘          │
│                    │                                │
│                    │ Database Queries               │
│                    ▼                                │
└─────────────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────┐
│                                                     │
│  MongoDB Atlas (Cloud)                             │
│  mongodb+srv://...                                 │
│                                                     │
│  ┌─────────────────────────────────────┐          │
│  │  Database Collections:              │          │
│  │  - users                            │          │
│  │  - courses                          │          │
│  │  - applications                     │          │
│  │  - departments                      │          │
│  └─────────────────────────────────────┘          │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## 🎯 Deployment Order

### Phase 1: Deploy Server ⚡ (Deploy First!)

**Why first?** Client needs the server URL to connect to.

1. **MongoDB Atlas** (5 min)
   - Create cluster
   - Create user
   - Whitelist 0.0.0.0/0
   - Get connection string

2. **Deploy Server to Vercel** (3 min)
   - Import repository
   - Root: `server`
   - Add env vars
   - Deploy

3. **Test Server** (1 min)
   - Visit server URL
   - Check logs

**Result**: `https://your-server.vercel.app`

---

### Phase 2: Deploy Client ⚡

**After server is deployed and tested.**

1. **Update Client Config** (2 min)
   - Edit `client/vercel.json`
   - Add server URL

2. **Deploy Client to Vercel** (3 min)
   - Import repository
   - Root: `client`
   - Add env vars
   - Deploy

3. **Test Client** (1 min)
   - Visit client URL
   - Check if it loads

**Result**: `https://your-client.vercel.app`

---

### Phase 3: Connect Everything 🔗

1. **Update Server CORS** (1 min)
   - Add client URL to `ALLOWED_ORIGINS`
   - Vercel auto-redeploys

2. **Test Full App** (5 min)
   - Registration
   - Login
   - Create application
   - Admin features

**Result**: Fully functional app! 🎉

---

## 📋 Step-by-Step Instructions

### STEP 1: MongoDB Atlas Setup

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up / Log in
3. **Create Cluster**:
   - Choose FREE tier (M0)
   - Select region closest to you
   - Click "Create Cluster"
4. **Create Database User**:
   - Security → Database Access → Add New User
   - Username: `admin` (or your choice)
   - Password: Generate secure password
   - Database User Privileges: Read and write to any database
   - Add User
5. **Whitelist IP**:
   - Security → Network Access → Add IP Address
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Confirm
6. **Get Connection String**:
   - Databases → Connect → Connect your application
   - Copy connection string:
     ```
     mongodb+srv://admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
     ```
   - Replace `<password>` with your actual password
   - Add database name: `/educationdb` before the `?`
     ```
     mongodb+srv://admin:yourpassword@cluster0.xxxxx.mongodb.net/educationdb?retryWrites=true&w=majority
     ```

---

### STEP 2: Deploy Server to Vercel

1. **Push Code to Git** (if not already):
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Go to Vercel**:
   - Visit [vercel.com/new](https://vercel.com/new)
   - Sign up / Log in with GitHub

3. **Import Project**:
   - Click "Import Project"
   - Select your repository
   - Click "Import"

4. **Configure Server**:
   - **Project Name**: `education-institute-server`
   - **Framework Preset**: Other
   - **Root Directory**: Click "Edit" → Enter `server`
   - **Build Command**: Leave empty
   - **Output Directory**: Leave empty

5. **Environment Variables**:
   Click "Environment Variables" and add:
   
   | Name | Value |
   |------|-------|
   | `MONGO_URI` | Your MongoDB connection string from Step 1 |
   | `JWT_SECRET` | Generate: `openssl rand -base64 32` or use strong password |
   | `NODE_ENV` | `production` |
   | `ALLOWED_ORIGINS` | `http://localhost:5173` |

6. **Deploy**:
   - Click "Deploy"
   - Wait 1-2 minutes
   - Copy your server URL: `https://education-institute-server.vercel.app`

7. **Test Server**:
   ```bash
   curl https://education-institute-server.vercel.app
   ```
   Should return: "Education Institute API is running..."

---

### STEP 3: Update Client Configuration

1. **Edit `client/vercel.json`**:
   ```json
   {
     "rewrites": [
       {
         "source": "/api/:path*",
         "destination": "https://education-institute-server.vercel.app/api/:path*"
       }
     ],
     "headers": [
       {
         "source": "/(.*)",
         "headers": [
           {
             "key": "X-Content-Type-Options",
             "value": "nosniff"
           },
           {
             "key": "X-Frame-Options",
             "value": "DENY"
           },
           {
             "key": "X-XSS-Protection",
             "value": "1; mode=block"
           }
         ]
       }
     ]
   }
   ```
   
   Replace `education-institute-server.vercel.app` with YOUR actual server URL.

2. **Commit Changes**:
   ```bash
   git add client/vercel.json
   git commit -m "Update API URL for production"
   git push origin main
   ```

---

### STEP 4: Deploy Client to Vercel

1. **Go to Vercel**:
   - Visit [vercel.com/new](https://vercel.com/new)

2. **Import Project** (again, for client):
   - Click "Import Project"
   - Select SAME repository
   - Click "Import"

3. **Configure Client**:
   - **Project Name**: `education-institute-client`
   - **Framework Preset**: Vite
   - **Root Directory**: Click "Edit" → Enter `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

4. **Environment Variables**:
   
   | Name | Value |
   |------|-------|
   | `VITE_API_URL` | `/api` |

5. **Deploy**:
   - Click "Deploy"
   - Wait 1-2 minutes
   - Copy your client URL: `https://education-institute-client.vercel.app`

---

### STEP 5: Update Server CORS

1. **Go to Server Project in Vercel**:
   - Dashboard → `education-institute-server` → Settings → Environment Variables

2. **Edit `ALLOWED_ORIGINS`**:
   - Click on `ALLOWED_ORIGINS` → Edit
   - Update value to:
     ```
     http://localhost:5173,https://education-institute-client.vercel.app
     ```
   - Replace with YOUR actual client URL
   - Save

3. **Redeploy** (automatic):
   - Vercel will automatically redeploy when env vars change
   - Or manually: Deployments → Latest → ⋯ → Redeploy

---

### STEP 6: Test Full Application

1. **Visit Client URL**: `https://education-institute-client.vercel.app`

2. **Test Registration**:
   - Click "Register"
   - Fill form
   - Submit
   - Should succeed

3. **Test Login**:
   - Use registered credentials
   - Should log in successfully

4. **Test Features**:
   - View courses
   - Create application
   - Admin dashboard (if admin user)

5. **Check for Errors**:
   - Open browser console (F12)
   - Look for any errors
   - Check Network tab for failed requests

---

## ✅ Deployment Checklist

### Pre-Deployment
- [ ] MongoDB Atlas cluster created
- [ ] Database user created
- [ ] IP whitelist set to 0.0.0.0/0
- [ ] Connection string copied
- [ ] JWT secret generated
- [ ] Code pushed to Git

### Server Deployment
- [ ] Server deployed to Vercel
- [ ] Environment variables added
- [ ] Server URL tested
- [ ] API endpoints working
- [ ] MongoDB connection successful
- [ ] Server URL saved

### Client Deployment
- [ ] `client/vercel.json` updated with server URL
- [ ] Changes committed and pushed
- [ ] Client deployed to Vercel
- [ ] Environment variables added
- [ ] Client URL tested
- [ ] Client URL saved

### Final Configuration
- [ ] Server `ALLOWED_ORIGINS` updated with client URL
- [ ] Server redeployed
- [ ] Full app tested
- [ ] Registration works
- [ ] Login works
- [ ] API calls successful
- [ ] No CORS errors

---

## 🆘 Troubleshooting

### Server Issues

**MongoDB Connection Fails**
- Check `MONGO_URI` in Vercel env vars
- Verify IP whitelist in MongoDB Atlas (0.0.0.0/0)
- Check database user permissions
- View Vercel function logs

**Function Timeout**
- Optimize database queries
- Add database indexes
- Upgrade to Vercel Pro (60s timeout)
- Or switch to Render (no timeout)

**Routes Return 404**
- Check `vercel.json` exists in server folder
- Verify route imports have `.js` extension
- Check Vercel function logs

### Client Issues

**Build Fails**
- Run `npm run build` locally to test
- Check for TypeScript errors
- Verify all dependencies in `package.json`
- Check Vercel build logs

**API Calls Fail (404)**
- Verify `vercel.json` has correct server URL
- Check browser Network tab for actual URL
- Ensure server is deployed and working

**CORS Errors**
- Add client URL to server's `ALLOWED_ORIGINS`
- Ensure no spaces in comma-separated list
- Redeploy server after updating env vars
- Check browser console for exact error

### Connection Issues

**Client Can't Reach Server**
- Verify `vercel.json` rewrite rules
- Check server URL is correct
- Test server URL directly in browser
- Check both deployments are successful

**Slow First Request**
- Normal for serverless (cold start)
- Subsequent requests will be faster
- Use UptimeRobot to keep warm
- Or upgrade to Vercel Pro

---

## 📊 Environment Variables Summary

### Server (Vercel)
```env
MONGO_URI=mongodb+srv://admin:password@cluster.mongodb.net/educationdb?retryWrites=true&w=majority
JWT_SECRET=aB3dE5fG7hI9jK1lM3nO5pQ7rS9tU1vW3xY5zA7bC9d=
NODE_ENV=production
ALLOWED_ORIGINS=http://localhost:5173,https://education-institute-client.vercel.app
```

### Client (Vercel)
```env
VITE_API_URL=/api
```

---

## 💰 Cost Breakdown

### Free Tier (Perfect for Start)
- **Vercel Server**: Free (100 GB bandwidth)
- **Vercel Client**: Free (100 GB bandwidth)
- **MongoDB Atlas**: Free (512 MB storage)
- **Total**: $0/month

### Limitations
- Server: 10s timeout, cold starts
- Client: 100 GB bandwidth
- Database: 512 MB storage

### Paid Tier (For Production)
- **Vercel Pro**: $20/month (60s timeout, 1TB bandwidth)
- **MongoDB Atlas**: $9/month (2 GB storage)
- **Total**: ~$29/month

---

## 🎉 Success!

Your app is now live at:
- **Client**: `https://education-institute-client.vercel.app`
- **Server**: `https://education-institute-server.vercel.app`

---

## 🔗 Important Links

- **Vercel Dashboard**: [vercel.com/dashboard](https://vercel.com/dashboard)
- **MongoDB Atlas**: [cloud.mongodb.com](https://cloud.mongodb.com)
- **Server Logs**: Vercel → Server Project → Deployments → View Function Logs
- **Client Logs**: Vercel → Client Project → Deployments → View Build Logs

---

## 📚 Additional Resources

- `server/DEPLOYMENT.md` - Detailed server deployment guide
- `server/DEPLOYMENT_CHECKLIST.md` - Server quick checklist
- `client/DEPLOYMENT.md` - Detailed client deployment guide
- `client/DEPLOYMENT_CHECKLIST.md` - Client quick checklist

---

## 🚀 Next Steps

1. **Custom Domain** (Optional):
   - Buy domain from Namecheap, GoDaddy, etc.
   - Add to Vercel project
   - Update DNS records
   - Update server CORS

2. **Monitoring** (Optional):
   - Set up error tracking (Sentry)
   - Add analytics (Google Analytics)
   - Monitor performance (Vercel Analytics)

3. **Backups**:
   - MongoDB Atlas auto-backups
   - Export important data regularly

4. **Security**:
   - Rotate JWT secret periodically
   - Monitor access logs
   - Keep dependencies updated

---

**Need Help?** Check the detailed guides in `server/DEPLOYMENT.md` and `client/DEPLOYMENT.md`
