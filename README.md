# AnsaarFeast - MERN Stack Food Delivery Application

A full-stack food delivery application built using the MERN stack (MongoDB, Express.js, React.js, Node.js). Users can browse food items categorized by type, search items in real-time, customize item portions, manage a cart, register/log in with secure JWT authentication, and view historical orders.

---

## 🛠 Tech Stack

- **Frontend:**
  - React 18
  - React Router DOM v6
  - Bootstrap 5 & Bootstrap Dark 5
  - Material-UI Icons & Badges
  - React Context API & `useReducer` for State Management
- **Backend:**
  - Node.js & Express.js
  - MongoDB Atlas & Mongoose ODM
  - JSON Web Tokens (JWT) for authentication
  - bcryptjs for password hashing
  - express-validator for request validation
  - Axios for reverse geocoding API integration (OpenCage)

---

## 📁 Folder Structure

```text
Gofood-main/
├── backend/
│   ├── middleware/
│   │   └── fetchdetails.js     # JWT verification middleware
│   ├── models/
│   │   ├── Orders.js           # Order schema & model
│   │   └── User.js             # User schema & model
│   ├── Routes/
│   │   └── Auth.js             # Authentication, location, food & order endpoints
│   ├── .env.example            # Template for backend environment variables
│   ├── db.js                   # MongoDB connection logic
│   ├── index.js                # Express app initialization & CORS setup
│   └── package.json            # Backend scripts and dependencies
├── public/
│   └── index.html              # HTML shell & font definitions
├── src/
│   ├── components/
│   │   ├── Card.js             # Food item card component
│   │   ├── ContextReducer.js   # Global cart state & reducer
│   │   ├── Footer.js           # Page footer
│   │   └── Navbar.js           # Navigation bar with dynamic cart & auth links
│   ├── screens/
│   │   ├── Cart.js             # Cart modal view & checkout action
│   │   ├── Home.js             # Main catalog screen with search & categories
│   │   ├── Login.js            # User login screen
│   │   ├── MyOrder.js          # Past order history screen
│   │   └── Signup.js           # User registration screen (with geolocation)
│   ├── App.js                  # Application routing & context providers
│   ├── index.js                # React DOM root entry
│   └── Modal.js                # Portal modal for cart overlay
├── .env.example                # Template for frontend environment variables
├── .gitignore                  # Git ignore rules (protects all .env files)
├── package.json                # Frontend scripts and dependencies
└── README.md
```

---

## 🔐 Environment Variables

### 1. Frontend (`.env` in project root)
Create a `.env` file in the root folder:
```env
REACT_APP_API_URL=http://localhost:5000
```
> In production, change this to your deployed backend URL (without trailing slash).

### 2. Backend (`backend/.env`)
Create a `.env` file in the `backend/` folder:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_random_jwt_secret
OPENCAGE_API_KEY=your_opencage_geocoding_api_key
CORS_ORIGIN=http://localhost:3000
PORT=5000
```

---

## 🚀 Local Setup & Running

### Prerequisites
- Node.js (v16+ recommended)
- npm
- MongoDB Atlas cluster or local MongoDB instance

### 1. Setup Backend
1. Open a terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure `backend/.env` using `backend/.env.example` as a template.
4. Run the backend server:
   ```bash
   npm start
   # or for development with auto-reload:
   npm run dev
   ```
   The backend will be available at `http://localhost:5000`.

### 2. Setup Frontend
1. In the project root directory:
   ```bash
   npm install
   ```
2. Configure `.env` in the root using `.env.example` as a template.
3. Start the React development server:
   ```bash
   npm start
   ```
   The frontend will open automatically at `http://localhost:3000`.

---

## ☁️ Deployment Architecture

### Frontend (Vercel / Netlify / Cloudflare Pages)
- **Framework Preset:** Create React App
- **Build Command:** `npm run build`
- **Output Directory:** `build`
- **Environment Variables:** Set `REACT_APP_API_URL` to your production backend URL.
- **Rewrites/Redirects:** Ensure Single Page Application (SPA) redirects are configured (`/*` -> `/index.html`).

### Backend (Render / Railway / Heroku / AWS EC2)
- **Root Directory:** `backend`
- **Build / Install Command:** `npm install`
- **Start Command:** `npm start`
- **Environment Variables:**
  - `MONGO_URI`: Your MongoDB Atlas URI
  - `JWT_SECRET`: Random secure string
  - `OPENCAGE_API_KEY`: Active OpenCage API key
  - `CORS_ORIGIN`: Your production frontend domain (e.g. `https://your-app.vercel.app`)
  - `PORT`: Provided by host or default `5000`

### Database (MongoDB Atlas)
- Ensure your MongoDB Atlas cluster has your backend server's IP address (or `0.0.0.0/0` if hosting dynamically) added to **Network Access > IP Access List**.
- Verify database collections `food_items` and `Categories` are populated.

---

## 🔒 Security Best Practices
- **No Secrets in Source:** All API keys, secrets, and connection strings are managed through environment variables and strictly ignored by Git.
- **Credential Rotation:** Before publishing to any public repository, rotate any previously exposed API credentials (such as OpenCage API keys and JWT secrets).
- **Environment Separation:** CORS origins and endpoints adapt seamlessly between development and production without editing source code.
