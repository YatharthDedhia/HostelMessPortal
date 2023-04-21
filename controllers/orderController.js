const Order = require("../models/orderModel");
const Product = require('../models/productModel');
const errorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');

//Create New Order
exports.newOrder = catchAsyncErrors(async (req, res, next) => {
    const { shippingInfo, orderItems, paymentInfo, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body;
    const order = await Order.create({ shippingInfo, orderItems, paymentInfo, itemsPrice, taxPrice, shippingPrice, totalPrice, paidAt: Date.now(), user: req.user._id });
    res.status(201).json({
        success: true,
        order
    });
});

exports.getSingleOrder = catchAsyncErrors(async (req, res, next) => {
    const order=await Order.findById(req.params.id).populate("user","name email");
    if(!order)
    {
        return next(new errorHandler("Order not found with this Id",404));
    }
    res.status(200).json({
        success: true,
        order
    });
});

//get logged in user orders
exports.myOrders = catchAsyncErrors(async (req, res, next) => {
    const orders=await Order.find({user:req.user._id});
    res.status(200).json({
        success: true,
        orders
    });
});

//get all  orders (admin)
exports.getAllOrders = catchAsyncErrors(async (req, res, next) => {
    const orders=await Order.find();

    let totalAmount=0;
    orders.forEach((order)=>{
        totalAmount+=order.totalPrice;
    });
    res.status(200).json({
        success: true,
        totalAmount,
        orders
    });
});


exports.updateOrder = catchAsyncErrors(async (req, res, next) => {
    const order=await Order.findById(req.params.id);
    if(order.orderStatus==="Delivered")
    {
        return next(new errorHandler("You have already received this order",404));
    }
    order.orderItems.forEach(async (order)=>{
        await updateStock(order.product,order.quantity);
    })
    order.orderStatus=req.body.status;
    if(req.body.status==="Delivered")
    {
    order.deliveredAt=Date.now();
    }
    await order.save({runValidatorsBeforeSave:false});
    
    res.status(200).json({
        success: true,
        order
    });
});

async function updateStock(id,quantity)
{
    const product= await Product.findById(id);
    product.stock-=quantity;
    await product.save({runValidatorsBeforeSave:false});

}

exports.deleteOrder = catchAsyncErrors(async (req, res, next) => {
    const order=await Order.findById(req.params.id);
    if(!order)
    {
        return next(new errorHandler("Order not found with this Id",404));
    }
    await order.remove();
    
    res.status(200).json({
        success: true,
        order
    });
});