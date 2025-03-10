/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management operations
 *
 * /auth/users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               username:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *               - username
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               username:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *               - username
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Validation failed
 *
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *
 * /auth/users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Numeric ID of the user to get
 *     responses:
 *       200:
 *         description: A single user object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *
 * /auth/users/login:
 *   post:
 *     summary: Login a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Successfully logged in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       401:
 *         description: Invalid email or password
 *
 * /auth/users/logout:
 *   post:
 *     summary: Logout a user
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Successfully logged out
 *       401:
 *         description: Unauthorized
 *
 * /auth/users/google:
 *   get:
 *     summary: Initiate Google OAuth
 *     tags: [Users]
 *     responses:
 *       302:
 *         description: Redirected to Google OAuth
 *
 * /auth/google/callback:
 *   get:
 *     summary: Handle Google OAuth callback
 *     tags: [Users]
 *     responses:
 *       302:
 *         description: Redirected to dashboard after successful authentication
 *       400:
 *         description: Authentication failed
 *
 * /auth/users/github:
 *   get:
 *     summary: Initiate GitHub OAuth
 *     tags: [Users]
 *     responses:
 *       302:
 *         description: Redirected to GitHub OAuth
 *
 * /auth/users/github/callback:
 *   get:
 *     summary: Handle GitHub OAuth callback
 *     tags: [Users]
 *     responses:
 *       302:
 *         description: Redirected to dashboard after successful authentication
 *       400:
 *         description: Authentication failed
 *
 * /csrf-token:
 *   get:
 *     summary: Get a CSRF token
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: A CSRF token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 */

/**
 * @swagger
 * tags:
 *   name: URLs
 *   description: URL management operations
 *
 * /urls/shorten:
 *   post:
 *     summary: Shorten a URL
 *     tags: [URLs]
 *     security:
 *       - bearerAuth: []
 *       - csrfToken: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               long_url:
 *                 type: string
 *             required:
 *               - long_url
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               long_url:
 *                 type: string
 *             required:
 *               - long_url
 *     responses:
 *       200:
 *         description: The shortened URL object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Url'
 *       401:
 *         description: Unauthorized
 *       400:
 *         description: Validation failed
 *
 * /urls/{short_code}:
 *   get:
 *     summary: Redirect to the original URL
 *     tags: [URLs]
 *     parameters:
 *       - in: path
 *         name: short_code
 *         schema:
 *           type: string
 *         required: true
 *         description: Short code of the URL
 *     responses:
 *       302:
 *         description: Redirected to the original URL
 *       404:
 *         description: URL not found
 *
 *   delete:
 *     summary: Delete a URL
 *     tags: [URLs]
 *     security:
 *       - bearerAuth: []
 *       - csrfToken: []
 *     parameters:
 *       - in: path
 *         name: short_code
 *         schema:
 *           type: string
 *         required: true
 *         description: Short code of the URL
 *     responses:
 *       200:
 *         description: URL deleted successfully
 *       404:
 *         description: URL not found
 *       401:
 *         description: Unauthorized
 *
 *   patch:
 *     summary: Update a URL
 *     tags: [URLs]
 *     security:
 *       - bearerAuth: []
 *       - csrfToken: []
 *     parameters:
 *       - in: path
 *         name: short_code
 *         schema:
 *           type: string
 *         required: true
 *         description: Short code of the URL
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               long_url:
 *                 type: string
 *             required:
 *               - long_url
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               long_url:
 *                 type: string
 *             required:
 *               - long_url
 *     responses:
 *       200:
 *         description: URL updated successfully
 *       404:
 *         description: URL not found
 *       401:
 *         description: Unauthorized
 *       400:
 *         description: Validation failed
 *
 * /urls:
 *   get:
 *     summary: Get all URLs for a user
 *     tags: [URLs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of URLs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Url'
 *       401:
 *         description: Unauthorized
 *
 * /urls/stats/{short_code}:
 *   get:
 *     summary: Get URL stats by short code
 *     tags: [URLs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: URL stats
 *       404:
 *         description: URL not found
 *       401:
 *         description: Unauthorized
 *
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated ID of the user
 *         email:
 *           type: string
 *           description: The email of the user
 *         username:
 *           type: string
 *           description: The username of the user
 *         password:
 *           type: string
 *           description: The hashed password of the user
 *
 *     Url:
 *       type: object
 *       properties:
 *         short_code:
 *           type: string
 *           description: The short code of the URL
 *         long_url:
 *           type: string
 *           description: The original long URL
 *         user_id:
 *           type: integer
 *           description: The ID of the user who created the URL
 *         clicks:
 *           type: integer
 *           description: The number of times the URL has been clicked
 *       required:
 *         - short_code
 *         - long_url
 *         - user_id
 *         - clicks
 *
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *     csrfToken:
 *       type: apiKey
 *       in: header
 *       name: X-CSRF-Token
 */
