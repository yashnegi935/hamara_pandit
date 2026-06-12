# GemGuide AI - Vedic Gemstone Recommendation Platform

An astrology-based gemstone recommendation platform that evaluates Vedic birth charts, analyzes functional benefics/malefics, current dashas, and planetary transits to recommend appropriate gemstones and remedies.

This project is configured as a unified MERN application, designed for single-service deployment on Render. The Express backend serves the React frontend static build directly in production.

---

## Folder Structure

```
gemguide-ai/
├── client/          # React frontend (Vite)
├── server/          # Node.js Express backend & API
├── package.json     # Monorepo scripts and dependencies
├── render.yaml      # Render blueprint configuration
├── README.md        # Deployment and setup instructions
└── .env.example     # Environment variable template
```

---

## Local Setup

### 1. Install Dependencies and Run Development Mode
You can run both the client and server concurrently using a single command from the root directory:

```bash
# Install root dependencies
npm install

# Run backend & frontend concurrently in dev mode
npm run dev
```

The frontend will run at `http://localhost:5173` and the backend will run at `http://localhost:5005`.

### 2. Database Seeding (Local)
To seed the gemstone details into your local MongoDB instance, run:

```bash
npm run seed
```

---

## Production Build & Run

To build the client bundle and start the production server locally:

```bash
# Build the client and install all folder dependencies
npm run build

# Start the Express production server
npm start
```

---

## Render Deployment Steps

This project is configured to deploy directly to **Render** as a single service using the `render.yaml` blueprint.

### 1. Create a MongoDB Atlas Database
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a free shared cluster.
2. In the **Network Access** tab, add IP address `0.0.0.0/0` to allow connections from Render's dynamic IPs.
3. In the **Database Access** tab, create a new user with a password.
4. Get your connection string: `mongodb+srv://<username>:<password>@cluster0.xxxx.mongodb.net/gemguide_ai?retryWrites=true&w=majority`.

### 2. Push to GitHub
Create a new GitHub repository, commit your code, and push it:
```bash
git init
git add .
git commit -m "Configure for single service Render deployment"
git remote add origin <your-github-repo-url>
git branch -M main
git push -u origin main
```

### 3. Deploy to Render
1. Log in to [Render](https://render.com).
2. Go to **Blueprints** in the top navigation.
3. Click **New Blueprint Instance**.
4. Connect your GitHub repository.
5. Render will automatically parse the `render.yaml` file.
6. Provide values for the required environment variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string.
   - `JWT_SECRET`: A secure random string for token signing.
   - `ASTROLOGY_API_KEY`: Your VedicAstroAPI API key.
7. Click **Approve**. Render will automatically build and deploy your application.

### 4. Seed Gemstones on Render
Once the deployment succeeds and the service status is **Live**:
1. Open your Render Web Service dashboard.
2. Click on the **Shell** tab in the left sidebar.
3. Run the database seed script:
   ```bash
   npm run seed
   ```
4. Your application database is now populated, and the application is ready to use!
