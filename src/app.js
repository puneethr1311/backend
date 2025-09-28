/**************************************************
 * 📌 FULL-STACK EXPRESS APP SETUP + DATA FLOW NOTES
 * -------------------------------------------------
 * This file explains:
 *   1. Express server setup (cors, cookie-parser, etc.)
 *   2. Middleware purpose
 *   3. Complete data flow (Frontend ↔ Backend ↔ Database)
 **************************************************/

/**************************************************
 * 1. 📦 IMPORT DEPENDENCIES
 **************************************************/
import express, { urlencoded } from "express";
// Express.js → main web framework
// urlencoded → parses HTML form submissions

import cookieParser from "cookie-parser";
// Parses cookies into req.cookies and req.signedCookies

import cors from "cors";
// Handles Cross-Origin Resource Sharing (frontend ↔ backend)

import dotenv from "dotenv";
// Loads environment variables from .env file into process.env

/**************************************************
 * 2. ⚙️ LOAD ENVIRONMENT VARIABLES
 **************************************************/
dotenv.config();
// Example: process.env.CORS_ORIGIN = "http://localhost:3000"

/**************************************************
 * 3. 🚀 CREATE EXPRESS APP
 **************************************************/
const app = express();

/**************************************************
 * 4. 🛠 MIDDLEWARE CONFIGURATION
 **************************************************/

// ✅ Enable CORS for frontend origin
app.use(cors({
    origin: process.env.CORS_ORIGIN, // Allow only this origin
    credentials: true                // Allow cookies + auth headers
}));

// ✅ Parse JSON request bodies
app.use(express.json({ limit: "24kb" }));
// Converts incoming JSON into req.body
// Example: { "email": "test@gmail.com" }

// ✅ Parse form data (x-www-form-urlencoded)
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
// extended: true → allows nested objects in form data

// ✅ Serve static files from "public" folder
app.use(express.static("public"));
// Example: GET /logo.png → serves ./public/logo.png

// ✅ Parse cookies from client requests
app.use(cookieParser());
// Example: Cookie: session_id=xyz → req.cookies.session_id = "xyz"

/**************************************************
 * 5. 📤 EXPORT APP
 **************************************************/
export default app;
// This "app" is imported into server.js where app.listen() starts the server

/**************************************************
 * 📊 COMPLETE DATA FLOW (FRONTEND ↔ BACKEND ↔ DB)
 **************************************************

 1️⃣ FRONTEND → BACKEND
 ------------------------
 - User performs an action (e.g., submits login form)
 - Browser/React app sends request:
      fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "test@gmail.com", password: "12345" }),
        credentials: "include" // include cookies
      });
 - Request reaches Express:
      - cors() checks if origin is allowed
      - express.json() parses request body
      - cookieParser() reads cookies if present

 2️⃣ BACKEND → DATABASE
 ------------------------
 - Backend takes req.body.email & req.body.password
 - Queries DB (PostgreSQL/MongoDB/MySQL):
      SELECT * FROM users WHERE email = 'test@gmail.com';
 - DB returns matching user record (if found)

 3️⃣ DATABASE → BACKEND
 ------------------------
 - DB sends data to backend
 - Backend applies business logic:
      - Compare password hashes
      - Generate session token or JWT
 - If valid:
      res.cookie("session_id", token, { httpOnly: true, secure: true });
      res.json({ success: true, user: { id, name } });

 4️⃣ BACKEND → FRONTEND
 ------------------------
 - Backend sends HTTP response:
      - JSON payload → { success: true, user: {...} }
      - Cookie (via Set-Cookie header) → stored in browser
 - Frontend receives:
      - JSON → updates UI (e.g., user logged in)
      - Cookie → stored automatically for future requests

 5️⃣ NEXT REQUESTS (SESSION FLOW)
 ------------------------
 - Browser automatically sends cookie:
      Cookie: session_id=xyz
 - Backend reads it via cookieParser
 - Verifies session/JWT
 - Provides requested data (e.g., profile info)

 **************************************************
 * 🔑 KEY POINTS (Interview Ready)
 **************************************************
 ✔ cors() allows cross-origin frontend ↔ backend communication
 ✔ express.json() & express.urlencoded() parse incoming data
 ✔ cookieParser() handles authentication/session cookies
 ✔ express.static() serves static files
 ✔ Data flow: 
    Frontend → Backend → Database → Backend → Frontend
 ✔ Backend often sets cookies or JWTs for authentication
 ✔ Frontend sends cookies automatically on future requests
 **************************************************/

//routes : 
import userRouter from "./routes/user.routes.js";

//routes declaration 
app.use("/api/v1/users",userRouter);