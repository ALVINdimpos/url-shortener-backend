import jwt from "jsonwebtoken";

// JWT secret
const secret = process.env.JWT_SECRET || "1234567890";

// Generate a token
const generateToken = (payload: object) => {
  return jwt.sign(payload, secret, { expiresIn: "1h" });
};

// Verify a token
const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    return null;
  }
};

export { generateToken, verifyToken };
