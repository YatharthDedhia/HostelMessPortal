const express = require('express');
const accountController=require('../controllers/accountController');

const router = express.Router();

router.route('/deposit').post(accountController.depositMoney);

module.exports=router;