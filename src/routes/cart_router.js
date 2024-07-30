//Third party imports
import { Router } from "express";
import passport from "passport";

//Local imports
import CartController from "../controllers/cart_controller.js";
import { refreshToken } from "../middlewares/jwt.js";
import { checkRole } from "../middlewares/checkRole.js";

const controller = new CartController();
const router = Router();

router.get(
  "/",
  [refreshToken, passport.authenticate("current")],
  controller.getAllCarts
);

router.get(
  "/cart",
  [refreshToken, passport.authenticate("current")],
  controller.getCartById
);

router.post(
  "/",
  [refreshToken, passport.authenticate("current")],
  controller.createCart
);

router.post(
  "/product/:pid",
  [refreshToken, passport.authenticate("current"), checkRole],
  controller.saveProductToCart
);

router.put(
  "/",
  [refreshToken, passport.authenticate("current"), checkRole],
  controller.updateCartWithProducts
);

router.put(
  "/product/:pid",
  [refreshToken, passport.authenticate("current")],
  controller.updateProductQuantity
);

router.delete(
  "/product/:pid",
  [refreshToken, passport.authenticate("current"), checkRole],
  controller.deleteProductFromCart
);

router.delete(
  "/",
  [refreshToken, passport.authenticate("current"), checkRole],
  controller.deleteAllProductsFromCart
);

export default router;
