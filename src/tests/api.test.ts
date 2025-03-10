import request from "supertest";
import app from "../app";
import { sequelize, User, Url } from "../models";
import { generateToken } from "../utils/jwt";
import bcrypt from "bcryptjs";

describe("API Tests", () => {
  let authToken: string; // Bearer token for authentication
  let testUser: any; // Test user object
  let testUrl: any; // Test URL object

  beforeAll(async () => {
    // Sync the database and clear all existing data
    await sequelize.sync({ force: true });

    // Create a test user with a valid bcrypt hash
    const hashedPassword = await bcrypt.hash("password123", 10);
    testUser = await User.create({
      email: "test@example.com",
      password: hashedPassword,
      username: "testuser",
    });

    // Create a test URL
    testUrl = await Url.create({
      long_url: "https://example.com",
      short_code: "abc123",
      user_id: testUser.id,
    });

    // Generate authentication token (Bearer Token)
    authToken = generateToken({ id: testUser.id, email: testUser.email });
  });

  afterAll(async () => {
    // Clean up the database and close the connection
    await sequelize.sync({ force: true });
    await sequelize.close();
  });

  describe("isLoggedIn Middleware", () => {
    it("should return 401 if no token is provided", async () => {
      const res = await request(app).get("/urls");
      expect(res.status).toBe(401);
      expect(res.body).toEqual({ message: "Unauthorized" });
    });

    it("should return 401 if token is invalid", async () => {
      const res = await request(app)
        .get("/urls")
        .set("Authorization", `Bearer invalid-token`);
      expect(res.status).toBe(401);
      expect(res.body).toEqual({ message: "Invalid token" });
    });

    it("should call next() if token is valid", async () => {
      const res = await request(app)
        .get("/urls")
        .set("Authorization", `Bearer ${authToken}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("data");
    });
  });

  describe("URL Shortener", () => {
    it("should shorten a URL", async () => {
      const res = await request(app)
        .post("/urls/shorten")
        .set("Authorization", `Bearer ${authToken}`) // Bearer Token
        .send({ long_url: "https://example.com" });

      expect(res.status).toBe(201); // Expect 201 Created
      expect(res.body).toHaveProperty("data.short_code"); // Expect short_code in response
    });

    it("should redirect to original URL", async () => {
      const res = await request(app).get(`/urls/${testUrl.short_code}`);

      expect(res.status).toBe(200); // Expect 200 OK
      expect(res.body).toHaveProperty("data.long_url");
    });
  });

  describe("Authentication", () => {
    it("should register a new user", async () => {
      const res = await request(app).post("/auth/users").send({
        email: "newuser@example.com",
        password: "password123",
        username: "newuser",
      });

      expect(res.status).toBe(201); // Expect 201 Created
      expect(res.body).toHaveProperty("data.email", "newuser@example.com"); // Expect email in response
    });

    it("should get all users", async () => {
      const res = await request(app)
        .get("/auth/users")
        .set("Authorization", `Bearer ${authToken}`); // Bearer Token

      expect(res.status).toBe(200); // Expect 200 OK
      expect(res.body).toHaveProperty("data"); // Expect list of users in response
    });

    it("should get a user by ID", async () => {
      const res = await request(app)
        .get(`/auth/users/${testUser.id}`)
        .set("Authorization", `Bearer ${authToken}`); // Bearer Token

      expect(res.status).toBe(200); // Expect 200 OK
      expect(res.body).toHaveProperty("data"); // Expect user data in response
    });

    it("should login a user", async () => {
      const res = await request(app).post("/auth/users/login").send({
        email: "test@example.com",
        password: "password123",
      });

      expect(res.status).toBe(200); // Expect 200 OK
      expect(res.body).toHaveProperty("data"); // Expect user data in response
      expect(res.body.data).toHaveProperty("token"); // Expect token in response
    });

    it("should logout a user", async () => {
      const res = await request(app).get("/auth/users/logout");

      expect(res.status).toBe(204); // Expect 204 No Content
    });

    it("should initiate Google OAuth", async () => {
      const res = await request(app).get("/auth/users/google");

      expect(res.status).toBe(302); // Expect 302 Redirect
    });

    it("should handle Google OAuth callback", async () => {
      const res = await request(app).get("/auth/users/google/callback");

      expect(res.status).toBe(302); // Expect 302 Redirect
    });

    it("should initiate GitHub OAuth", async () => {
      const res = await request(app).get("/auth/users/github");

      expect(res.status).toBe(302); // Expect 302 Redirect
    });

    it("should handle GitHub OAuth callback", async () => {
      const res = await request(app).get("/auth/users/github/callback");

      expect(res.status).toBe(302); //  Expect 302 Redirect
    });
  });

  describe("URLs", () => {
    it("should delete a URL", async () => {
      const res = await request(app)
        .delete(`/urls/${testUrl.short_code}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.status).toBe(200); // Expect 200 OK
    });

    it("should update a URL", async () => {
      testUrl = await Url.create({
        long_url: "https://example.com",
        short_code: "abc123",
        user_id: testUser.id,
      });

      const res = await request(app)
        .patch(`/urls/${testUrl.short_code}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({ long_url: "http://example.com/updated" });

      expect(res.status).toBe(200); // Expect 200 OK
    });

    it("should get all URLs for a user", async () => {
      const res = await request(app)
        .get("/urls")
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.status).toBe(200); // Expect 200 OK
      expect(res.body).toHaveProperty("data"); // Expect list of URLs in response
    });
  });
});
