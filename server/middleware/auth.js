import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config(); // To load environment variables from .env file

const auth = async (req, res, next) => {
  try {
    // Check if the authorization header exists
    if (!req.headers.authorization) {
      return res.status(401).json({ message: "Authorization header missing." });
    }

    // Split the token from the Bearer scheme
    const token = req.headers.authorization.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Authentication failed. No token provided." });
    }

    // Use environment variable for JWT secret
    const secret = process.env.JWT_SECRET || "defaultSecret"; // Replace with your environment secret
    
    let decodedData;
    
    try {
      decodedData = jwt.verify(token, secret); // Verifying token with secret
      req.userId = decodedData?.id; // Store user ID from the token payload
    } catch (error) {
      // Handle cases where token is invalid or expired
      return res.status(401).json({ message: "Invalid or expired token." });
    }

    next(); // Proceed to the next middleware if token is valid
  } catch (error) {
    console.error("Authentication error:", error); // Log the error for debugging
    res.status(500).json({ message: "Authentication failed due to server error." });
  }
};

export default auth;
