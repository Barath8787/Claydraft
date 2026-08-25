import { Product } from "../models/productModel.js";
import HandleErorr from "../helper/errorhandler.js";
import APIHelper from "../helper/ApiHelper.js";

// add product-------------------------
export const addProduct = async (req, res) => {
  // console.log("Request body:", req.body);
  const userId = req.user._id; // Assuming the user ID is stored in req.user
  req.body.user = userId; // Assign the user ID to the product's user field
  const product = await Product.create(req.body);
  res.status(201).json({
    success: true,
    product,
  });
};

// get all products-------------------------
// http://localhost:8000/api/v1/products?keyword=apple
export const GetAllproducts = async (req, res, next) => {
  // const products = await Product.find();
  console.log("Request query:", req.query.keyword);
  const apiHelper = new APIHelper(Product.find(), req.query).search().filter();
  const resultPerPage = 5;
  const productsCount = await Product.countDocuments();
  const totalpages = Math.ceil(productsCount / resultPerPage);
  const currentPage = parseInt(req.query.page) || 1;
  if (currentPage > totalpages && totalpages > 0) {
    return next(new HandleErorr("Page not found", 404));
  }
  apiHelper.pegination(resultPerPage);

  const queryfiltered = apiHelper.query.clone();
  console.log("API Helper query:", apiHelper);
  const products = await apiHelper.query;
  res.status(200).json({
    success: true,
    products,
    productsCount,
    resultPerPage,
    totalpages,
    currentPage,
  });
};

// get single product-------------------------
export const GetSingleProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    // return res.status(404).json({
    //   success: false,
    //   message: "Product not found",
    // });
    return next(new HandleErorr("Product not found", 404));
  }
  res.status(200).json({
    success: true,
    product,
  });
};

//update product-------------------------
export const updateProduct = async (req, res) => {
  const id = req.params.id;
  const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!updatedProduct) {
    // return res.status(404).json({
    //   success: false,
    //   message: "Product not found",
    // });
    return next(new HandleErorr("Product not found", 404));
  }
  res.status(200).json({
    success: true,
    product: updatedProduct,
  });
};
//Delete product-------------------------
export const deleteProduct = async (req, res) => {
  const id = req.params.id;
  const deletedProduct = await Product.findByIdAndDelete(id);
  if (!deletedProduct) {
    // return res.status(404).json({
    //   success: false,
    //   message: "Product not found",
    // });
    return next(new HandleErorr("Product not found", 404));
  }
  res.status(200).json({
    success: true,
    message: "Product deleted successfully",
  });
};
// product review-------------------------
export const createProductReview = async (req, res) => {
  const { rating, comment, productId } = req.body;
  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating).toFixed(2),
    comment,
  };
  const product = await Product.findById(productId);
  if (!product) {
    return next(new HandleErorr("Product not found", 404));
  }

  const reviewexists = product.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString(),
  );
  if (reviewexists) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString()) {
        rev.rating = Number(rating).toFixed(2);
        rev.comment = comment;
      }
    });
  } else {
    product.reviews.push(review);
  }
  product.numOfReviews = product.reviews.length;
  product.ratings =
    product.reviews.reduce((acc, review) => acc + review.rating, 0) /
    product.reviews.length;
  await product.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
    message: "Review added successfully",
  });
  product.numberOfReviews = product.reviews.length;
  //update the product's average rating
  let sum = 0;
  product.reviews.forEach((rev) => {
    sum += rev.rating;
  });
  product.ratings =
    product.reviews.length > 0 ? sum / product.reviews.length : 0;
  await product.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
    message: "Review added successfully",
  });
};

// view product reviews--------------------

export const viewProductReviews = async (req, res, next) => {
  const product = await Product.findById(req.query.id);
  if (!product) {
    return next(new HandleErorr("Product not found", 404));
  }
  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
};

// admine view products--------------------
export const adminViewProducts = async (req, res) => {
  const products = await Product.find();
  res.status(200).json({
    success: true,
    products,
  });
};

// delete product review--------------------
export const deleteReview = async (req, res, next) => {
  const product = await Product.findById(req.query.productId);
  if (!product) {
    return next(new HandleErorr("product not found", 400));
  }
  const reviews = product.reviews.filter(
    (review) => review._id.toString() !== req.query.id,
  );
  let sum = 0;
  reviews.forEach((review) => {
    sum += review.rating;
  });
  const ratings = reviews.length > 0 ? sum / product.reviews.length : 0;
  const numOfReviews = reviews.length;

  await Product.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      ratings,
      numOfReviews,
    },
    { new: true, runValidators: true },
  );
  res.status(200).json({
    success: true,
    message: "Review deleted succesfully",
  });
};

// welcome message--------------------
export const welcomeMessage = (req, res, next) => {
  res.status(200).json({
    message: "Welcome to the MERN Stack API",
  });
};
