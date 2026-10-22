const express = require("express");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const urlRoute = require("./route/url");
const userRoute = require("./route/user");
const session = require("express-session");
const { MongoStore } = require("connect-mongo");
const connectDB = require("./connection/database");
const URL = require("./model/url");

const app = express();
const PORT = process.env.PORT || 8001;

// Trust proxy for secure cookies behind Netlify / reverse proxy
app.set("trust proxy", 1);

// Middleware to ensure DB connection on serverless requests
app.use(async (req, res, next) => {
  try {
    await connectDB();
  } catch (err) {
    console.error("Database connection middleware error:", err.message);
  }
  next();
});

// Middleware for body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// EJS View Engine setup (resolving views path for both local and Netlify function bundle)
const viewsPath = fs.existsSync(path.join(process.cwd(), "views"))
  ? path.join(process.cwd(), "views")
  : path.join(__dirname, "views");

app.set("view engine", "ejs");
app.set("views", viewsPath);

// Static files fallback for local dev (Netlify CDN handles /public directly in production)
app.use(express.static(path.join(__dirname, "public")));

// Session configuration
const sessionOptions = {
  name: "url_shortener_sid",
  secret: process.env.SESSION_SECRET || "url_shortener_secret_fallback_key",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 1000 * 60 * 60 * 24,
  },
};

if (process.env.MONGO_URI) {
  try {
    sessionOptions.store = MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: "sessions",
    });
  } catch (err) {
    console.error("MongoStore creation error:", err.message);
  }
}

app.use(session(sessionOptions));

// Routes
app.use("/url", urlRoute);
app.use("/user", userRoute);

// Frontend route
app.get("/", (req, res) => {
  return res.render("home", {
    userId: req.session ? req.session.userId : null,
  });
});

// Short URL redirection
app.get("/:shortId", async (req, res) => {
  try {
    const shortId = req.params.shortId;

    const entry = await URL.findOneAndUpdate(
      {
        shortId,
      },
      {
        $push: {
          visitHistory: {
            timestamp: Date.now(),
          },
        },
      },
      {
        returnDocument: "after",
      }
    );

    if (!entry) {
      return res.status(404).json({
        error: "short URL not found",
      });
    }

    return res.redirect(entry.originalURL);
  } catch (error) {
    console.error("Redirect error:", error);
    return res.status(500).json({
      error: "something went wrong",
    });
  }
});

// Start server locally when not imported as a module (e.g. by serverless function)
if (require.main === module) {
  app.listen(PORT, () => console.log(`Server started at PORT ${PORT}`));
}

module.exports = app;
