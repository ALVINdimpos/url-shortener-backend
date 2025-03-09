import request from "supertest";
import app from "../app";
import { sequelize, User, Url } from "../models";
import { generateToken } from "../utils/jwt";

describe("API Tests", () => {
  let authToken: string;
  let testUser: any;

  beforeAll(async () => {
    // Ensure database is synced and clean
    await sequelize.sync({ force: true });

    // Create test user with properly hashed password
    testUser = await User.create({
      email: "test@example.com",
      password: "$2a$10$testHashedPassword",
      username: "testuser",
    });

    authToken = generateToken({ id: testUser.id, email: testUser.email });
  });

  afterAll(async () => {
    // Clean up database and close connection
    await sequelize.sync({ force: true });
    await sequelize.close();
  });

  describe("URL Shortener", () => {
    let testUrl: any;

    beforeEach(async () => {
      // Create a test URL
      testUrl = await Url.create({
        long_url: "https://example.com",
        short_code: "testcode",
        user_id: testUser.id,
      });
    });

    it("should shorten a URL", async () => {
      const res = await request(app)
        .post("/urls/shorten")
        .set("Authorization", `Bearer ${authToken}`)
        .send({ long_url: "https://example.com" });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("data.short_code");
    });

    it("should redirect to original URL", async () => {
      const res = await request(app).get(`/urls/${testUrl.short_code}`);

      expect(res.status).toBe(200);
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

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("data.email", "newuser@example.com");
    });

    it("should get all users", async () => {
      const res = await request(app)
        .get("/auth/users")
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("data");
    });

    it("should get a user by ID", async () => {
      const res = await request(app)
        .get(`/auth/users/${testUser.id}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("data");
    });

    it("should login a user", async () => {
      const res = await request(app).post("/auth/users/login").send({
        email: "test@example.com",
        password: "password123",
      });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("data");
      expect(res.body.data).toHaveProperty("token");
    });

    it("should logout a user", async () => {
      const res = await request(app)
        .get("/auth/logout") // Changed from POST to GET
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.status).toBe(200);
    });

    it("should initiate Google OAuth", async () => {
      const res = await request(app).get("/auth/users/google");

      expect(res.status).toBe(302); // Redirect
    });

    it("should handle Google OAuth callback", async () => {
      const res = await request(app).get("/auth/google/callback");

      expect(res.status).toBe(302); // Redirect
    });

    it("should initiate GitHub OAuth", async () => {
      const res = await request(app).get("/auth/users/github");

      expect(res.status).toBe(302); // Redirect
    });

    it("should handle GitHub OAuth callback", async () => {
      const res = await request(app).get("/auth/users/github/callback");

      expect(res.status).toBe(302); // Redirect
    });

    it("should get a CSRF token", async () => {
      const res = await request(app).get("/csrf-token");

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("token");
    });
  });

  describe("URLs", () => {
    let testUrl: any;

    beforeEach(async () => {
      testUrl = await Url.create({
        long_url: "https://example.com",
        short_code: "abc123",
        user_id: testUser.id,
      });
    });

    it("should delete a URL", async () => {
      const res = await request(app)
        .delete(`/urls/${testUrl.short_code}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.status).toBe(200);
    });

    it("should update a URL", async () => {
      const res = await request(app)
        .put(`/urls/${testUrl.short_code}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({ long_url: "http://example.com/updated" });

      expect(res.status).toBe(200);
    });

    it("should get all URLs for a user", async () => {
      const res = await request(app)
        .get("/urls")
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("data");
    });
  });
});
