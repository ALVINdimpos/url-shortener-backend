import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET || "your_default_secret";

const generateToken = (payload: object) => {
  return jwt.sign(payload, secret, { expiresIn: "1h" });
};

const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    return null;
  }
};

export { generateToken, verifyToken };
