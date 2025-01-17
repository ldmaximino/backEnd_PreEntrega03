//Local imports
import Controllers from "./class.controller.js";
import ProductService from "../services/product_services.js";
import { PORT } from '../config/config.js';

const productService = new ProductService();

export default class ProductController extends Controllers {
  constructor() {
    super(productService);
  }

  async getAllProducts(req, res, next) {
    try {
      const { page, limit, category, stock, sort } = req.query;
      const products = await productService.getAllProducts(
        page,
        limit,
        category,
        stock,
        sort
      );
      const nextPage = products.hasNextPage
        ? `http://localhost:${PORT}/api/products?page=${products.nextPage}`
        : null;
      const prevPage = products.hasPrevPage
        ? `http://localhost:${PORT}/api/products?page=${products.prevPage}`
        : null;
      res.status(200).json({
        status: "success",
        payload: products.docs,
        totalPages: products.totalPages,
        prevPage: products.prevPage,
        nextPage: products.nextPage,
        page: products.page,
        hasPrevPage: products.hasPrevPage,
        hasNextPage: products.hasNextPage,
        prevLink: prevPage,
        nextLink: nextPage,
        totalDocs: products.totalDocs, //este campo no lo solicitaba el ejercicio pero lo agregué para un mejor control de los filters
      });
    } catch (error) {
      next(error);
    }
  }
}
