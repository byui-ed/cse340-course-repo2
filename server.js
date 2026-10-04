import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import { testConnection, pool } from './src/models/db.js';
import router from './src/routes.js';
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import flash from './src/middleware/flash.js';

// Define the application environment
const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || 'production';

// Define the port number the server will listen on
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Trust reverse proxy in production (Render, Heroku, etc.)
// Crucial for secure cookies to work behind SSL-terminating proxies
if (NODE_ENV === 'production') {
    app.set('trust proxy', 1);
}

// Allow Express to receive and process common POST data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Initialize PostgreSQL Session Store
const PgSession = connectPgSimple(session);

/**
 * Configure Express session middleware
 */
app.use(session({
    store: new PgSession({
        pool: pool,                     // Uses database pool from db.js
        tableName: 'user_sessions',     // Table name in PostgreSQL
        createTableIfMissing: true      // Automatically creates table if not present
    }),
    secret: process.env.SESSION_SECRET || 'your-very-secure-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 60 * 60 * 1000,          // 1 hour
        secure: NODE_ENV === 'production', // Requires HTTPS in production
        httpOnly: true,
        sameSite: 'lax'
    }
}));

// Use flash message middleware
app.use(flash);

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Tell Express where to find your templates
app.set('views', path.join(__dirname, 'src/views'));

// Middleware to log all incoming requests
app.use((req, res, next) => {
    if (NODE_ENV === 'development') {
        console.log(`${req.method} ${req.url}`);
    }
    next();
});

// Middleware to set res.locals variables for all templates
app.use((req, res, next) => {
    res.locals.isLoggedIn = false;
    if (req.session && req.session.user) {
        res.locals.isLoggedIn = true;
    }

    res.locals.user = req.session.user || null;
    res.locals.NODE_ENV = NODE_ENV;
    next();
});

// Use the imported router to handle routes
app.use(router);

// Catch-all route for 404 errors
app.use((req, res, next) => {
    const err = new Error('Page Not Found');
    err.status = 404;
    next(err);
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Error occurred:', err.message);
    console.error('Stack trace:', err.stack);
    
    const status = err.status || 500;
    const template = status === 404 ? '404' : '500';
    
    const context = {
        title: status === 404 ? 'Page Not Found' : 'Server Error',
        error: err.message,
        stack: err.stack
    };
    
    res.status(status).render(`errors/${template}`, context);
});

app.listen(PORT, async () => {
    try {
        await testConnection();
        console.log(`Server is running at http://127.0.0.1:${PORT}`);
        console.log(`Environment: ${NODE_ENV}`);
    } catch (error) {
        console.error('Error connecting to the database:', error);
    }
});