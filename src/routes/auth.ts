import { Router } from 'express';
import { validationResult } from 'express-validator';
import { body } from 'express-validator';
import passport from 'passport';
import { generateToken } from '../utils/jwt';
import bcrypt from 'bcryptjs';
import { User } from '../models';
import { RequestHandler } from 'express';

declare module 'express-session' {
  interface SessionData {
    passport: { user: number };
    returnTo?: string;
  }
}

const router = Router();

// Google Authentication Route
router.get(
  '/google',
  (req, res, next) => {
    const redirect_url =
      typeof req.query.redirect_url === 'string'
        ? req.query.redirect_url
        : undefined;
    req.session.returnTo = redirect_url || `${process.env.CLIENT_URL}/urls`;
    next();
  },
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    prompt: 'select_account',
  })
);

// Google Authentication Callback
router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: `${process.env.CLIENT_URL}/auth/login?error=google_auth_failed`,
    session: true,
  }),
  (req, res) => {
    const user = req.user as User;
    const token = generateToken({ id: user?.id, email: user?.email });
    const returnTo = req.session.returnTo || `${process.env.CLIENT_URL}/urls`;
    delete req.session.returnTo;
    res.redirect(`${returnTo}?token=${token}`);
  }
);

// GitHub Authentication Route
router.get(
  '/github',
  (req, res, next) => {
    const redirect_url =
      typeof req.query.redirect_url === 'string'
        ? req.query.redirect_url
        : undefined;
    req.session.returnTo = redirect_url || `${process.env.CLIENT_URL}/urls`;
    next();
  },
  passport.authenticate('github', { scope: ['user:email'] })
);

// GitHub Authentication Callback
router.get(
  '/github/callback',
  passport.authenticate('github', {
    failureRedirect: `${process.env.CLIENT_URL}/auth/login?error=github_auth_failed`,
    session: true,
  }),
  (req, res) => {
    const user = req.user as User;
    const token = generateToken({ id: user?.id, email: user?.email });
    const returnTo = req.session.returnTo || `${process.env.CLIENT_URL}/urls`;
    delete req.session.returnTo;
    res.redirect(`${returnTo}?token=${token}`);
  }
);

router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ error: 'Error logging out' });
    res.status(204).json({ message: 'Logged out successfully' });
  });
});

// Login a user
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  (async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        message: 'Invalid email or password',
      });
    }

    const token = generateToken({ id: user.id, email: user.email });
    res.json({
      data: { token },
      message: 'Login successful',
    });
  }) as RequestHandler
);

// Create a user
router.post(
  '/',
  [
    body('email').isEmail().withMessage('Invalid email address'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
    body('username').notEmpty().withMessage('Username is required'),
  ],
  (async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const { email, password, username } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.findOne({ where: { email } });
    if (user) {
      return res.status(400).json({
        message: 'User already exists',
      });
    }
    const newUser = await User.create({
      email,
      password: hashedPassword,
      username,
    });
    res.status(201).json({
      data: newUser,
      message: 'User created successfully',
    });
  }) as RequestHandler
);

// Get all users (Authenticated)
router.get('/', (async (req, res, next) => {
  try {
    const users = await User.findAll();
    res.json({
      data: users,
      message: 'Users fetched successfully',
    });
  } catch (error) {
    next(error);
  }
}) as RequestHandler);

// Get a user by id (Authenticated)
router.get('/:id', (async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (user) {
      res.json({
        data: user,
        message: 'User fetched successfully',
      });
    } else {
      res.status(404).json({
        message: 'User not found',
      });
    }
  } catch (error) {
    next(error);
  }
}) as RequestHandler);

// Update a user by id (Authenticated)
router.put('/:id', (async (req, res, next) => {
  try {
    const { id } = req.params;
    const { email, password, username } = req.body;
    const user = await User.findByPk(id);
    if (user) {
      user.email = email;
      user.password = password;
      user.username = username;
      await user.save();
      res.json({
        data: user,
        message: 'User updated successfully',
      });
    } else {
      res.status(404).json({
        message: 'User not found',
      });
    }
  } catch (error) {
    next(error);
  }
}) as RequestHandler);

// Delete a user by id (Authenticated)
router.delete('/:id', (async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (user) {
      await user.destroy();
      res.json({
        message: 'User deleted successfully',
      });
    } else {
      res.status(404).json({
        message: 'User not found',
      });
    }
  } catch (error) {
    next(error);
  }
}) as RequestHandler);

export default router;
