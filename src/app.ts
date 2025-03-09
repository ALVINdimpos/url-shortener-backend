import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import session, { SessionOptions } from 'express-session';
import passport from './passport-config';
import authRoutes from './routes/auth';
import urlRoutes from './routes/url';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { sequelize } from './models';
import cookieParser from 'cookie-parser';
import csurf from 'csurf';

declare module 'express-session' {
  interface SessionData {
    passport: { user: number };
  }
}

const app = express();

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'URL Shortener API',
      version: '1.0.0',
    },
  },
  apis: ['./src/routes/*.ts', './src/swagger-docs.ts'],
};

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const sessionConfig: SessionOptions = {
  secret: process.env.SESSION_SECRET || '',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
    maxAge: 24 * 60 * 60 * 1000,
  },
};

app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());

// Skip CSRF in test environment
const csrfProtection =
  process.env.NODE_ENV === 'test'
    ? (req: any, res: any, next: any) => next()
    : csurf({
        cookie: {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
        },
      });
// CSRF Token endpoint
app.get('/csrf-token', csrfProtection, (req, res) => {
  res.json({ token: req.csrfToken() });
});

sequelize
  .authenticate()
  .then(() => {
    console.log('Database connection established successfully.');
  })
  .catch((err: Error) => {
    console.error('Unable to connect to the database:', err);
  });

const specs = swaggerJsdoc(swaggerOptions);

app.use('/auth/users', authRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use('/urls', urlRoutes);

// Error handler for CSRF
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    if (err.code === 'EBADCSRFTOKEN') {
      res.status(403).json({ error: 'Invalid CSRF token' });
    } else {
      next(err);
    }
  }
);

const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV === 'development') {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;
