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
