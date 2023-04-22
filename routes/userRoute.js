const express = require('express');
const userController = require('../controllers/userController')
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const router = express.Router();

router.route("/register")
    .post(userController.registerUser);

router.route("/login")
    .post(userController.loginUser);

router.route("/password/forgot")
    .post(userController.forgotPassword);

router.route("/password/:token")
    .put(userController.resetPassword);

router.route("/logout")
    .get(userController.logOut);

router.route("/password/update")
    .put(isAuthenticatedUser, userController.updatePassword);

router.route("/me/update")
    .put(isAuthenticatedUser, userController.updateProfile);

router.route("/me")
    .get(isAuthenticatedUser, userController.getUserDetails);

router.route("/admin/users")
    .get(isAuthenticatedUser, authorizeRoles("admin"), userController.getAllUser);

router.route("/admin/user/:id")
    .get(isAuthenticatedUser, authorizeRoles("admin"), userController.getSingleUser)
    .put(isAuthenticatedUser, authorizeRoles("admin"), userController.updateUserRole)
    .delete(isAuthenticatedUser, authorizeRoles("admin"), userController.deleteUser);

router.route("/admin/userinfo")
    .post(isAuthenticatedUser, authorizeRoles("admin"),userController.getUserInfo)

module.exports = router;