//Third party imports
import jwt from "jsonwebtoken";
import { TIMETOKEN, SECRET_KEY } from "../config/config.js";

//Local imports
import UserService from "../services/user_services.js";

const userService = new UserService();

export const generateToken = (user, time = `${TIMETOKEN}m`) => {
  const id = user._id || user.id;
  const payload = {
    userId: id,
  };

  return jwt.sign(payload, SECRET_KEY, {
    expiresIn: time,
  });
};

export const refreshToken = async (req, res, next) => {
  try {
    const tokenCookie = req.cookies.token;
    if (!tokenCookie) return res.status(403).json({ msg: "Unhautorized" });
    const decode = jwt.verify(tokenCookie, SECRET_KEY);
    const user = await userService.getById(decode.userId);
    if (!user) return res.status(404).json({ msg: "User not found" });
    // Check if the token is about to expire
    const now = Math.floor(Date.now() / 1000); // Current time in seconds
    const tokenExp = decode.exp; // Token expiration time
    const timeUntilExp = tokenExp - now; // Time to expiration in seconds
    if (timeUntilExp <= 30) {
      // Generate a new token with a renewed expiration time
      const newToken = generateToken(user, `${TIMETOKEN}m`);
      res.cookie("token", newToken, { httpOnly: true });
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(403).json({ msg: "Unhautorized" });
  }
};
