//Local imports
import Controllers from "./class.controller.js";
import CartService from "../services/cart_services.js";
import ProductService from "../services/product_services.js";

const cartService = new CartService();
const productService = new ProductService();

export default class CartController extends Controllers {
  constructor() {
    super(cartService);
  }

  async getAllCarts(req, res, next) {
    try {
      const carts = await cartService.getAllCarts();
      if (carts.length > 0) {
        return res.status(200).json(carts);
      } else return res.status(200).json({ msg: "There are not carts" });
    } catch (error) {
      next(error);
    }
  }

  async getCartById(req, res, next) {
    try {
      const cid = req.user.cart;
      const cart = await cartService.getCartById(cid);
      if (!cart) return res.status(404).json({ msg: "Cart not found" });
      return res.status(200).json(cart);
    } catch (error) {
      next(error);
    }
  }

  async createCart(req, res, next) {
    try {
      const cart = await cartService.createCart();
      return res.status(200).json(cart);
    } catch (error) {
      next(error);
    }
  }

  async saveProductToCart(req, res, next) {
    try {
      const cid = req.user.cart;
      const { pid } = req.params;
      const productExist = await productService.getById(pid);
      if (!productExist)
        return res.status(404).json({ msg: "Product not found" }); //if the product doesn't exist on db
      const cartExist = await cartService.getCartById(cid);
      if (!cartExist) return res.status(404).json({ msg: "Cart not found" }); //if the cart doesn't exist on db
      const addProductCart = await cartService.saveProductToCart(cid, pid);
      return res.status(200).json(addProductCart);
    } catch (error) {
      next(error);
    }
  }

  async updateCartWithProducts(req, res, next) {
    try {
      const cid = req.user.cart;
      const cartExist = await cartService.getCartById(cid);
      if (!cartExist) return res.status(404).json({ msg: "Cart not found" }); //if the cart doesn't exist on db
      const updateCartWithProd = await cartService.updateCartWithProducts(
        cid,
        req.body
      );
      return res.status(200).json(updateCartWithProd);
    } catch (error) {
      next(error);
    }
  }

  async updateProductQuantity(req, res, next) {
    try {
      const cid = req.user.cart;
      const { pid } = req.params;
      const { quantity } = req.body;
      const cartExist = await cartService.getCartById(cid);
      if (!cartExist) return res.status(404).json({ msg: "Cart not found" }); //if the cart doesn't exist on db

      //I had to make the find variable to search for the product in cart because in mongoose the '_id' exists and in fs it does not.
      let productExistInCart = "";
      if (process.argv[2] === "mongodb") {
        productExistInCart = cartExist.products.find(
          (prod) => prod.product._id.toString() === pid
        );
      } else if (process.argv[2] === "fs") {
        productExistInCart = cartExist.products.find(
          (prod) => prod.product === pid
        );
      }

      if (!productExistInCart)
        return res
          .status(404)
          .json({ msg: "Product doesn't exist in the cart" }); //if the product doesn't exist in the cart
      const updateProdQuantity = await cartService.updateProductQuantity(
        cid,
        pid,
        quantity
      );
      return res.status(200).json(updateProdQuantity);
    } catch (error) {
      next(error);
    }
  }

  async deleteProductFromCart(req, res, next) {
    try {
      const cid = req.user.cart;
      const { pid } = req.params;
      const cartExist = await cartService.getCartById(cid);
      if (!cartExist) return res.status(404).json({ msg: "Cart not found" }); //if the cart doesn't exist on db
      //I had to make the find variable to search for the product in cart because in mongoose the '_id' exists and in fs it does not.
      let productExistInCart = "";
      if (process.argv[2] === "mongodb") {
        productExistInCart = cartExist.products.find(
          (prod) => prod.product._id.toString() === pid
        );
      } else if (process.argv[2] === "fs") {
        productExistInCart = cartExist.products.find(
          (prod) => prod.product === pid
        );
      }

      if (!productExistInCart)
        return res
          .status(404)
          .json({ msg: "Product doesn't exist in the cart" }); //if the product doesn't exist in the cart
      const deleteProductFromCart = await cartService.deleteProductFromCart(
        cid,
        pid
      );
      return res.status(200).json(deleteProductFromCart);
    } catch (error) {
      next(error);
    }
  }

  async deleteAllProductsFromCart(req, res, next) {
    try {
      const cid = req.user.cart;
      const cartExist = await cartService.getCartById(cid);
      if (!cartExist) return res.status(404).json({ msg: "Cart not found" }); //if the cart doesn't exist on db
      const productsExistInCart = cartExist.products.length;
      if (productsExistInCart === 0)
        return res.status(400).json({ msg: "Cart is empty" });
      const deleteAllProductsFromCart =
        await cartService.deleteAllProductsFromCart(cid);
      return res.status(200).json(deleteAllProductsFromCart);
    } catch (error) {
      next(error);
    }
  }
}
