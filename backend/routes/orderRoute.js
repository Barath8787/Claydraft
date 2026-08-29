import express from "express";
import { roleBasedAccess, verifyToken } from "../helper/userAuth.js";
import {
  createNeworder,
  getAllOrderByAdmin,
  getAllOrders,
  getOrderDetails,
  DeleteOrderByAdmin,
  updateByAdmin,
} from "../controller/orderController.js";
import { verify } from "crypto";

const router = express.Router();

router.route("/new/order").post(verifyToken, createNeworder);
router.route("/order/:id").get(verifyToken, getOrderDetails);
router.route("/orders/user").get(verifyToken, getAllOrders);

//ADMINE---------
router
  .route("/admin/orders")
  .get(verifyToken, roleBasedAccess("admin"), getAllOrderByAdmin);

router
  .route("/admin/order/:id")
  .delete(verifyToken, roleBasedAccess("admin"), DeleteOrderByAdmin)
  .put(verifyToken, roleBasedAccess("admin"), updateByAdmin);
export default router;
