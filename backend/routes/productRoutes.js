import express from "express";
const router = express.Router();
import {
  GetAllproducts,
  GetSingleProduct,
  welcomeMessage,
  addProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  viewProductReviews,
  adminViewProducts,
  deleteReview,
} from "../controller/productContrller.js";
import { roleBasedAccess, verifyToken } from "../helper/userAuth.js";

router.get("/", welcomeMessage);

// user side product routes
router.get("/products", GetAllproducts);
router.get("/product/:id", GetSingleProduct);

//user review routes
router.route("/product/review").post(verifyToken, createProductReview);
// admin product routes
router
  .route("/admin/product/create")
  .post(verifyToken, roleBasedAccess("admin"), addProduct);
router
  .route("/admin/product/product/:id")
  .put(verifyToken, roleBasedAccess("admin"), updateProduct)
  .delete(verifyToken, roleBasedAccess("admin"), deleteProduct);
//admin view all products

//view reviews of a product
router
  .route("/admin/product/reviews")
  .get(verifyToken, roleBasedAccess("admin"), viewProductReviews)
  .delete(verifyToken, roleBasedAccess("admin"), deleteReview);

router
  .route("/admin/products")
  .get(verifyToken, roleBasedAccess("admin"), adminViewProducts);

//delete review of a product

export default router;
