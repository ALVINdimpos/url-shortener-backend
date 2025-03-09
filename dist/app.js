"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const express_session_1 = __importDefault(require("express-session"));
const passport_config_1 = __importDefault(require("./passport-config"));
const auth_1 = __importDefault(require("./routes/auth"));
const url_1 = __importDefault(require("./routes/url"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const models_1 = require("./models");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const csurf_1 = __importDefault(require("csurf"));
const app = (0, express_1.default)();
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
app.use((0, cors_1.default)({
    origin: true,
    credentials: true,
}));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
const sessionConfig = {
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
app.use((0, express_session_1.default)(sessionConfig));
app.use(passport_config_1.default.initialize());
app.use(passport_config_1.default.session());
// Skip CSRF in test environment
const csrfProtection = process.env.NODE_ENV === 'test'
    ? (req, res, next) => next()
    : (0, csurf_1.default)({
        cookie: {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
        },
    });
// CSRF Token endpoint
app.get('/csrf-token', csrfProtection, (req, res) => {
    res.json({ token: req.csrfToken() });
});
models_1.sequelize
    .authenticate()
    .then(() => {
    console.log('Database connection established successfully.');
})
    .catch((err) => {
    console.error('Unable to connect to the database:', err);
});
const specs = (0, swagger_jsdoc_1.default)(swaggerOptions);
app.use('/auth/users', auth_1.default);
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(specs));
app.use('/urls', url_1.default);
// Error handler for CSRF
app.use((err, req, res, next) => {
    if (err.code === 'EBADCSRFTOKEN') {
        res.status(403).json({ error: 'Invalid CSRF token' });
    }
    else {
        next(err);
    }
});
const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV === 'development') {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}
exports.default = app;
