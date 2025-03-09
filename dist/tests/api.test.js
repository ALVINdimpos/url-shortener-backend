"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
const models_1 = require("../models");
const jwt_1 = require("../utils/jwt");
describe("API Tests", () => {
    let authToken;
    let testUser;
    beforeAll(async () => {
        // Ensure database is synced and clean
        await models_1.sequelize.sync({ force: true });
        // Create test user with properly hashed password
        testUser = await models_1.User.create({
            email: "test@example.com",
            password: "$2a$10$testHashedPassword",
            username: "testuser",
        });
        authToken = (0, jwt_1.generateToken)({ id: testUser.id, email: testUser.email });
    });
    afterAll(async () => {
        // Clean up database and close connection
        await models_1.sequelize.sync({ force: true });
        await models_1.sequelize.close();
    });
    describe("URL Shortener", () => {
        let testUrl;
        beforeEach(async () => {
            // Create a test URL
            testUrl = await models_1.Url.create({
                long_url: "https://example.com",
                short_code: "testcode",
                user_id: testUser.id,
            });
        });
        it("should shorten a URL", async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .post("/urls/shorten")
                .set("Authorization", `Bearer ${authToken}`)
                .send({ long_url: "https://example.com" });
            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty("data.short_code");
        });
        it("should redirect to original URL", async () => {
            const res = await (0, supertest_1.default)(app_1.default).get(`/urls/${testUrl.short_code}`);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("data.long_url");
        });
    });
    describe("Authentication", () => {
        it("should register a new user", async () => {
            const res = await (0, supertest_1.default)(app_1.default).post("/auth/users").send({
                email: "newuser@example.com",
                password: "password123",
                username: "newuser",
            });
            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty("data.email", "newuser@example.com");
        });
        it("should get all users", async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .get("/auth/users")
                .set("Authorization", `Bearer ${authToken}`);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("data");
        });
        it("should get a user by ID", async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .get(`/auth/users/${testUser.id}`)
                .set("Authorization", `Bearer ${authToken}`);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("data");
        });
        it("should login a user", async () => {
            const res = await (0, supertest_1.default)(app_1.default).post("/auth/users/login").send({
                email: "test@example.com",
                password: "password123",
            });
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("data");
            expect(res.body.data).toHaveProperty("token");
        });
        it("should logout a user", async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .get("/auth/logout") // Changed from POST to GET
                .set("Authorization", `Bearer ${authToken}`);
            expect(res.status).toBe(200);
        });
        it("should initiate Google OAuth", async () => {
            const res = await (0, supertest_1.default)(app_1.default).get("/auth/users/google");
            expect(res.status).toBe(302); // Redirect
        });
        it("should handle Google OAuth callback", async () => {
            const res = await (0, supertest_1.default)(app_1.default).get("/auth/google/callback");
            expect(res.status).toBe(302); // Redirect
        });
        it("should initiate GitHub OAuth", async () => {
            const res = await (0, supertest_1.default)(app_1.default).get("/auth/users/github");
            expect(res.status).toBe(302); // Redirect
        });
        it("should handle GitHub OAuth callback", async () => {
            const res = await (0, supertest_1.default)(app_1.default).get("/auth/users/github/callback");
            expect(res.status).toBe(302); // Redirect
        });
        it("should get a CSRF token", async () => {
            const res = await (0, supertest_1.default)(app_1.default).get("/csrf-token");
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("token");
        });
    });
    describe("URLs", () => {
        let testUrl;
        beforeEach(async () => {
            testUrl = await models_1.Url.create({
                long_url: "https://example.com",
                short_code: "abc123",
                user_id: testUser.id,
            });
        });
        it("should delete a URL", async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .delete(`/urls/${testUrl.short_code}`)
                .set("Authorization", `Bearer ${authToken}`);
            expect(res.status).toBe(200);
        });
        it("should update a URL", async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .put(`/urls/${testUrl.short_code}`)
                .set("Authorization", `Bearer ${authToken}`)
                .send({ long_url: "http://example.com/updated" });
            expect(res.status).toBe(200);
        });
        it("should get all URLs for a user", async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .get("/urls")
                .set("Authorization", `Bearer ${authToken}`);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("data");
        });
    });
});
