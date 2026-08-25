import User from "../models/userModel.js";
import ErrorHandler from "../helper/errorHandler.js";
import { generateToken } from "../helper/jwtToken.js";
import crypto from "crypto";
import { sendEmail } from "../helper/sendMailer.js";

// user registration
export const registerUser = async (req, res, next) => {
  const { name, email, password } = req.body;
  try {
    if (!req.body.name) {
      return next(new ErrorHandler("name cannot be empty", 400));
    }
    if (!req.body.email) {
      return next(new ErrorHandler("email cannot be empty", 400));
    }
    if (!req.body.password) {
      return next(new ErrorHandler("password cannot be empty", 400));
    }
    const { name, email, password } = req.body;
    const user = await User.create({
      name,
      email,
      password,
    });
    /* const token = user.getJWTToken();
    res.status(201).json({
      success: true,
      user,
      token,
    }); */
    generateToken(user, 201, res);
  } catch (error) {
    next(error);
  }
};

// user login
export const loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorHandler("email or password cannot be empty", 400));
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("invalid email or password", 401));
  }
  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("invalid email or password", 401));
  }
  generateToken(user, 200, res);
};

// user logout
export const logoutUser = async (req, res, next) => {
  const options = {
    expires: new Date(Date.now()),
    httpOnly: true,
  };
  res.cookie("token", null, options);
  res.status(200).json({ success: true, message: " successfully Logged out" });
};

/* export const forgetpassword = async (req, res, next) => {
  const { email } = req.body;
  console.log(req.body);
  const user = await User.findOne({ email });
  console.log("user:", user);
  if (!user) {
    return next(new ErrorHandler("user not found", 404));
  }
  let resetToken;
  try {
    resetToken = user.getforgetpasswordToken();
    await user.save({ validateBeforeSave: false });
    console.log("resetToken:", resetToken);
  } catch (error) {
    console.log(error);
    return next(
      new ErrorHandler("could not generate reset token, please try again", 500),
    );
  }
  const forgetpasswordUrl = `${req.protocol}://${req.host}/reset/${resetToken}`;
  const message = `Your password reset link is: \n\n ${forgetpasswordUrl} \n\n If you have not requested this email, please ignore it.`;
  console.log("forgetpasswordUrl:", forgetpasswordUrl);

  try {
    await sendEmail({
      email: user.email,
      subject: "Password Reset Request",
      message,
    });
    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.forgetpasswordToken = undefined;
    user.forgetpasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new ErrorHandler("could not send email, please try again", 500),
    );
  }
};

*/

// forget password
export const forgetPassword = async (req, res, next) => {
  const { email } = req.body;
  console.log(req.body);
  const user = await User.findOne({ email });
  console.log("user:", user);
  if (!user) {
    return next(new ErrorHandler("user not found", 404));
  }
  let resetToken;
  try {
    resetToken = user.getforgetpasswordToken();
    await user.save({ validateBeforeSave: false });
    console.log("resetToken:", resetToken);
  } catch (error) {
    console.log(error);
    return next(
      new ErrorHandler("could not generate reset token, please try again", 500),
    );
  }
  const forgetpasswordUrl = `${req.protocol}://${req.host}/reset/${resetToken}`;
  const message = `Your password reset link is:

${forgetpasswordUrl}

If you have not requested this email, please ignore it.`;

  const messageHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Password Reset</title>
</head>

<body style="margin:0;padding:0;background:#f4f7fb;font-family:Arial,Helvetica,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f7fb;padding:40px 0;">
<tr>
<td align="center">

<table width="600" cellpadding="0" cellspacing="0"
style="background:#ffffff;border-radius:12px;overflow:hidden;
box-shadow:0 8px 25px rgba(0,0,0,.08);">

<!-- Header -->
<tr>
<td align="center"
style="background:linear-gradient(135deg,#4f46e5,#2563eb);padding:35px;">

<h1 style="margin:0;color:white;font-size:28px;">
🔐 Password Reset
</h1>

<p style="margin-top:10px;color:#dbeafe;font-size:15px;">
Your account security is important to us.
</p>

</td>
</tr>

<!-- Body -->
<tr>
<td style="padding:40px;">

<h2 style="margin-top:0;color:#111827;">
Hello 👋
</h2>

<p style="color:#4b5563;font-size:16px;line-height:28px;">
We received a request to reset your password.
Click the button below to create a new password.
</p>

<table width="100%" cellpadding="0" cellspacing="0">
<tr>
<td align="center" style="padding:30px 0;">

<a href="${forgetpasswordUrl}"
style="
background:#2563eb;
color:#ffffff;
padding:15px 35px;
text-decoration:none;
font-size:16px;
font-weight:bold;
border-radius:8px;
display:inline-block;
">
Reset Password
</a>

</td>
</tr>
</table>

<p style="color:#6b7280;font-size:14px;">
Or copy and paste this link into your browser:
</p>

<p style="
background:#f3f4f6;
padding:15px;
border-radius:8px;
word-break:break-all;
font-size:14px;
color:#2563eb;
">
${forgetpasswordUrl}
</p>

<hr style="border:none;border-top:1px solid #e5e7eb;margin:35px 0;">

<p style="color:#6b7280;font-size:15px;line-height:26px;">
If you didn't request a password reset, you can safely ignore this email.
Your password will remain unchanged.
</p>

</td>
</tr>

<!-- Footer -->
<tr>
<td align="center"
style="background:#f9fafb;padding:25px;">

<p style="margin:0;color:#9ca3af;font-size:13px;">
© ${new Date().getFullYear()}ClayCardfty. All rights reserved.
</p>

<p style="margin-top:8px;color:#9ca3af;font-size:12px;">
This is an automated email. Please do not reply.
</p>

</td>
</tr>

</table>

</td>
</tr>
</table>

</body>
</html>
`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Password Reset Request",
      message,
      html: messageHtml,
    });
    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetpasswordToken = undefined;
    user.resetpasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new ErrorHandler("could not send email, please try again", 500),
    );
  }
};

// reset password
export const resetPassword = async (req, res, next) => {
  const resetToken = req.params.token;
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  console.log("resetPasswordToken:", resetPasswordToken);
  const user = await User.findOne({
    resetpasswordToken: resetPasswordToken,
    resetpasswordExpire: { $gt: Date.now() },
  });
  if (!user) {
    return next(
      new ErrorHandler(
        "reset password token is invalid or has been expired",
        400,
      ),
    );
  }
  const { password, confirmPassword } = req.body;
  if (password !== confirmPassword) {
    return next(new ErrorHandler("password does not match", 400));
  }
  user.password = password;
  user.resetpasswordToken = undefined;
  user.resetpasswordExpire = undefined;
  await user.save();
  generateToken(user, 200, res);
};

// get user details
export const getUserDetails = async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    user,
  });
};

// update user password
export const updateUserPassword = async (req, res, next) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;

  const user = await User.findById(req.user.id).select("+password");
  const iscorrectPassword = await user.comparePassword(oldPassword);
  if (!iscorrectPassword) {
    return next(new ErrorHandler("old password is incorrect", 400));
  }
  if (newPassword !== confirmPassword) {
    return next(new ErrorHandler("new passwords do not match", 400));
  }
  user.password = newPassword;
  await user.save();
  res.status(200).json({
    success: true,
    message: "Password updated successfully",
  });
};

// update user profile
export const updateUserProfile = async (req, res, next) => {
  const { name, email } = req.body;
  const update = { name, email };
  const user = await User.findByIdAndUpdate(req.user.id, update, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    user,
  });
};

// get all users (admin)
export const getAllUsers = async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    success: true,
    message: "All users fetched successfully",
    users,
  });
};

// get single user (admin)
export const getSingleUser = async (req, res, next) => {
  const id = req.params.id;
  const user = await User.findById(id);

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "User fetched successfully",

    user,
  });
};

//update user role (admin)
export const updateUserRole = async (req, res, next) => {
  const id = req.params.id;
  const { role } = req.body;
  console.log("Body:", req.body);
  console.log("Role:", req.body.role);
  const updatedRole = { role };
  const user = await User.findByIdAndUpdate(id, updatedRole, {
    new: true,
    runValidators: true,
  });
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }
  res.status(200).json({
    success: true,
    message: "User role updated successfully",
    user,
  });
};

// delete user (admin)
export const deleteUser = async (req, res, next) => {
  const id = req.params.id;
  const user = await User.findByIdAndDelete(id);
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }
  res.status(200).json({
    success: true,
    message: "User deleted successfully",
  });
};
