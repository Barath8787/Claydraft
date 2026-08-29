import Order from "../models/orderModel.js";
import HandleErorr from "../helper/errorhandler.js";
import Product from "../models/productModel.js";

// CREATE NEW ORDER
export const createNeworder = async (req, res, next) => {
  try {
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
      message: "Order placed successfully",
    });
  } catch (error) {
    next(error);
  }
};

// GET SINGLE ORDER
export const getOrderDetails = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email",
    );

    if (!order) {
      return next(new HandleErorr("Order not found", 404));
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    next(error);
  }
};

// GET ALL ORDERS OF LOGGED-IN USER
export const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({
      user: req.user._id,
    });

    if (orders.length === 0) {
      return next(new HandleErorr("Orders not found", 404));
    }

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    next(error);
  }
};

// ADMIN - GET ALL ORDERS
export const getAllOrderByAdmin = async (req, res, next) => {
  try {
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
  } catch (error) {
    next(error);
  }
};

// ADMIN - DELETE ORDER
export const DeleteOrderByAdmin = async (req, res, next) => {
  try {
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

    await Order.deleteOne({
      _id: req.params.id,
    });

    res.status(200).json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// ADMIN - UPDATE ORDER STATUS
export const updateByAdmin = async (req, res, next) => {
  try {
    const id = req.params.id;

    // IMPORTANT: await
    const order = await Order.findById(id);

    if (!order) {
      return next(new HandleErorr("Order not found", 404));
    }

    // Already delivered
    if (order.orderStatus === "Delivered") {
      return next(
        new HandleErorr("This order has already been delivered", 400),
      );
    }

    // New status from request
    const newStatus = req.body.status;

    if (!newStatus) {
      return next(new HandleErorr("Please provide order status", 400));
    }

    // Update stock only when order becomes Delivered
    if (newStatus === "Delivered") {
      await Promise.all(
        order.orderItems.map((item) =>
          updateQuantity(item.product, item.quantity),
        ),
      );

      order.deliveredAt = Date.now();
    }

    // Update order status
    order.orderStatus = newStatus;

    // Save order
    await order.save({
      validateBeforeSave: false,
    });

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    next(error);
  }
};

// UPDATE PRODUCT STOCK
async function updateQuantity(id, quantity) {
  const productData = await Product.findById(id);

  if (!productData) {
    throw new Error("Product not found");
  }

  // Check stock
  if (productData.stock < quantity) {
    throw new Error(`Not enough stock for product: ${productData.name}`);
  }

  // Reduce stock
  productData.stock -= quantity;

  await productData.save({
    validateBeforeSave: false,
  });
}
