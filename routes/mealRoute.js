const express = require('express');
const mealController = require('../controllers/mealController')
const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

router.route('/meals')
    .get(mealController.getAllMeals)
    .post(isAuthenticatedUser, authorizeRoles("admin"), mealController.addMeal)

module.exports = router;