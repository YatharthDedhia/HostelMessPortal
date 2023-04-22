const express = require('express');
const accountController=require('../controllers/accountController');

const router = express.Router();

router.route('/deposit').post(accountController.depositMoney);
router.route('/leaves').post(accountController.applyLeaves);

module.exports=router;