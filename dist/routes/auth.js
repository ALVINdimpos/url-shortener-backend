"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const express_validator_2 = require("express-validator");
const passport_1 = __importDefault(require("passport"));
const jwt_1 = require("../utils/jwt");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const models_1 = require("../models");
const router = (0, express_1.Router)();
// Google Authentication Route
router.get('/google', (req, res, next) => {
    const redirect_url = typeof req.query.redirect_url === 'string'
        ? req.query.redirect_url
        : undefined;
    req.session.returnTo = redirect_url || `${process.env.CLIENT_URL}/urls`;
    next();
}, passport_1.default.authenticate('google', {
    scope: ['profile', 'email'],
    prompt: 'select_account',
}));
// Google Authentication Callback
router.get('/google/callback', passport_1.default.authenticate('google', {
    failureRedirect: `${process.env.CLIENT_URL}/auth/login?error=google_auth_failed`,
    session: true,
}), (req, res) => {
    const user = req.user;
    const token = (0, jwt_1.generateToken)({ id: user === null || user === void 0 ? void 0 : user.id, email: user === null || user === void 0 ? void 0 : user.email });
    const returnTo = req.session.returnTo || `${process.env.CLIENT_URL}/urls`;
    delete req.session.returnTo;
    res.redirect(`${returnTo}?token=${token}`);
});
// GitHub Authentication Route
router.get('/github', (req, res, next) => {
    const redirect_url = typeof req.query.redirect_url === 'string'
        ? req.query.redirect_url
        : undefined;
    req.session.returnTo = redirect_url || `${process.env.CLIENT_URL}/urls`;
    next();
}, passport_1.default.authenticate('github', { scope: ['user:email'] }));
// GitHub Authentication Callback
router.get('/github/callback', passport_1.default.authenticate('github', {
    failureRedirect: `${process.env.CLIENT_URL}/auth/login?error=github_auth_failed`,
    session: true,
}), (req, res) => {
    const user = req.user;
    const token = (0, jwt_1.generateToken)({ id: user === null || user === void 0 ? void 0 : user.id, email: user === null || user === void 0 ? void 0 : user.email });
    const returnTo = req.session.returnTo || `${process.env.CLIENT_URL}/urls`;
    delete req.session.returnTo;
    res.redirect(`${returnTo}?token=${token}`);
});
router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err)
            return res.status(500).json({ error: 'Error logging out' });
        res.status(204).json({ message: 'Logged out successfully' });
    });
});
// Login a user
router.post('/login', [
    (0, express_validator_2.body)('email').isEmail().withMessage('Invalid email address'),
    (0, express_validator_2.body)('password').notEmpty().withMessage('Password is required'),
], (async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: 'Validation failed',
            errors: errors.array(),
        });
    }
    const { email, password } = req.body;
    const user = await models_1.User.findOne({ where: { email } });
    if (!user || !(await bcryptjs_1.default.compare(password, user.password))) {
        return res.status(401).json({
            message: 'Invalid email or password',
        });
    }
    const token = (0, jwt_1.generateToken)({ id: user.id, email: user.email });
    res.json({
        data: { token },
        message: 'Login successful',
    });
}));
// Create a user
router.post('/', [
    (0, express_validator_2.body)('email').isEmail().withMessage('Invalid email address'),
    (0, express_validator_2.body)('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
    (0, express_validator_2.body)('username').notEmpty().withMessage('Username is required'),
], (async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: 'Validation failed',
            errors: errors.array(),
        });
    }
    const { email, password, username } = req.body;
    const hashedPassword = await bcryptjs_1.default.hash(password, 10);
    const user = await models_1.User.findOne({ where: { email } });
    if (user) {
        return res.status(400).json({
            message: 'User already exists',
        });
    }
    const newUser = await models_1.User.create({
        email,
        password: hashedPassword,
        username,
    });
    res.status(201).json({
        data: newUser,
        message: 'User created successfully',
    });
}));
// Get all users (Authenticated)
router.get('/', (async (req, res, next) => {
    try {
        const users = await models_1.User.findAll();
        res.json({
            data: users,
            message: 'Users fetched successfully',
        });
    }
    catch (error) {
        next(error);
    }
}));
// Get a user by id (Authenticated)
router.get('/:id', (async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await models_1.User.findByPk(id);
        if (user) {
            res.json({
                data: user,
                message: 'User fetched successfully',
            });
        }
        else {
            res.status(404).json({
                message: 'User not found',
            });
        }
    }
    catch (error) {
        next(error);
    }
}));
// Update a user by id (Authenticated)
router.put('/:id', (async (req, res, next) => {
    try {
        const { id } = req.params;
        const { email, password, username } = req.body;
        const user = await models_1.User.findByPk(id);
        if (user) {
            user.email = email;
            user.password = password;
            user.username = username;
            await user.save();
            res.json({
                data: user,
                message: 'User updated successfully',
            });
        }
        else {
            res.status(404).json({
                message: 'User not found',
            });
        }
    }
    catch (error) {
        next(error);
    }
}));
// Delete a user by id (Authenticated)
router.delete('/:id', (async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await models_1.User.findByPk(id);
        if (user) {
            await user.destroy();
            res.json({
                message: 'User deleted successfully',
            });
        }
        else {
            res.status(404).json({
                message: 'User not found',
            });
        }
    }
    catch (error) {
        next(error);
    }
}));
exports.default = router;
