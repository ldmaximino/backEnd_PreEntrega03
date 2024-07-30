//Local imports
import Controllers from "./class.controller.js";
import UserService from "../services/user_services.js";
import { generateToken } from "../middlewares/jwt.js";

const userService = new UserService();

export default class UserController extends Controllers {
  constructor() {
    super(userService);
  }

  async registerResponse(req, res, next) {
    try {
      if (req.headers["user-agent"].slice(0, 7) === "Postman") {
        res.status(400).json({ message: "User created" });
      } else {
        return res.redirect("/user_registered");
      }
    } catch (error) {
      next(error);
    }
  }

  async loginJwt(req, res, next) {
    try {
      const user = await userService.login(req.body);
      if (!user) {
        if (req.headers["user-agent"].slice(0, 7) === "Postman") {
          return res.json({ message: "User not exists" });
        } else return res.redirect("/user_login_error");
      }
      const token = generateToken(user);
      res.cookie("token", token, { httpOnly: true });
      if (req.headers["user-agent"].slice(0, 7) === "Postman") {
        return res.json(user);
      } else return res.redirect("/products");
    } catch (error) {
      next(error);
    }
  }

  async currentSession(req, res, next) {
    try {
      if (req.user) {
        const id = req.user._id || req.user.id;
        const user = await userService.getUserById(id);
        return res.json({ "current user": user });
      }
    } catch (error) {
      next(error);
    }
  }
}
