import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  forgetPassword,
  resetPassword,
  getUserDetails,
  updateUserPassword,
  updateUserProfile,
  getAllUsers,
  getSingleUser,
  updateUserRole,
  deleteUser,
} from "../controller/userController.js";
import { roleBasedAccess, verifyToken } from "../helper/userAuth.js";

const router = express.Router();
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

router.route("/logout").get(logoutUser);
router.route("/password/forget").post(forgetPassword);
router.route("/password/reset/:token").post(resetPassword);
router.route("/getUserDetails").get(verifyToken, getUserDetails);
router.route("/updateUserPassword").put(verifyToken, updateUserPassword);
router.route("/Profile/update").put(verifyToken, updateUserProfile);

router
  .route("/admin/getAllUsers")
  .get(verifyToken, roleBasedAccess("admin"), getAllUsers);
router
  .route("/admin/getSingleUsers/:id")
  .get(verifyToken, roleBasedAccess("admin"), getSingleUser)
  .put(verifyToken, roleBasedAccess("admin"), updateUserRole)
  .delete(verifyToken, roleBasedAccess("admin"), deleteUser);
export default router;
