import Order from "../models/orderModel.js";
import HandleErorr from "../helper/errorhandler.js";

export const createNeworder = async (req, res, next) => {
  const {
    shippingAddress,
    orderItems,
    paymentInfo,
    itemPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  const order = await Order.create({
    shippingAddress,
    orderItems,
    paymentInfo,
    itemPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    user: req.user._id,
  });

  res.status(201).json({
    success: true,
    order,
    message: "order placed successfully",
  });
};

//GET SINGE ORDER-------

export const getOrderDetails = async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email",
  );

  if (!order) {
    return next(new HandleErorr("order not found", 404));
  }

  res.status(200).json({
    success: true,
    order,
  });
};
export const getAllOrders = async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id });
  if (!orders) {
    return next(new HandleErorr("order not found", 404));
  }

  res.status(200).json({
    success: true,
    orders,
  });
};

//ADMINE all orders
export const getAllOrderByAdmin = async (req, res, next) => {
  const orders = await Order.find().populate("user", "name email");
  if (orders.length === 0) {
    return next(new HandleErorr("Orders not found", 404));
  }
  const totalAmount = orders.reduce(
    (total, order) => total + order.totalPrice,
    0,
  );

  res.status(200).json({
    success: true,
    orders,
    totalAmount,
  });
};

// admin delete  orders

export const DeleteOrderByAdmin = async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new HandleErorr("Order not found", 404));
  }

  if (order.orderStatus !== "Delivered") {
    return next(
      new HandleErorr(
        "This order is under processing and cannot be deleted",
        400,
      ),
    );
  }

  await Order.deleteOne({ _id: req.params.id });

  res.status(200).json({
    success: true,
    message: "Order deleted successfully",
  });
};
