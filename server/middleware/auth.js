import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protectRoute = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.json({ success: false, message: "JWT must be provided" });
    }
    const token = authHeader.split(" ")[1];

   
    

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded);
     const userId = decoded.userId || decoded.id;
    if (!userId) {
         return res.json({ success: false, message: "Invalid token: user ID missing" });
      }
      const user = await User.findById(userId).select("-password");

    
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    
    req.user = user;
    next();
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
