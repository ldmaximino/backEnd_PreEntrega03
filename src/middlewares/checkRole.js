import { createResponse } from "../utils.js";

export const checkRole = (req, res, next) => {
  try {
    const { role } = req.user;
    if (role !== "admin")
      createResponse(res, 401, "This endpoint is only for administrators");
    else next();
  } catch (error) {
    next(error);
  }
};

export const checkRoleCarts = (req, res, next) => {
  try {
    const { role } = req.user;
    if (role !== "user")
      createResponse(res, 401, "Only users with role='user' can add products to the cart");
    else next();
  } catch (error) {
    next(error);
  }
};