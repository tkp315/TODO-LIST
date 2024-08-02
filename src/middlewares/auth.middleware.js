import jwt from "jsonwebtoken";
import ApiError from "../utilities/apiError.js";
import asyncHandlerFunction from "../utilities/asyncHandler.js";
import { User } from "../models/user.model.js";


const sessionTime = asyncHandlerFunction(async (req, res, next) => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) {
    throw new ApiError(401, "refresh token not found");
  }

  const decodedToken = jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET
  );
  if (!decodedToken) {
    throw new ApiError(401, "invalid token");
  }
  const user = await User.findById(decodedToken?._id);
  if (!user) {
    throw new ApiError(401, "user is not found throught this token");
  }

  const newAccessToken = jwt.sign(
    {
     name: user.name,
     _id: user._id,
     email: user.email
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn:`${process.env.ACCESS_TOKEN_EXPIRY}m`
    }
  )
  req.user = user;
  res.cookie('accessToken', newAccessToken, { httpOnly: true,
    secure: process.env.NODE_ENV==='production',
  });
  next();
});

const verifyJWT = asyncHandlerFunction(async (req, res, next) => {
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer", "");

  if (!token) {
  return sessionTime(req,res,next);
  }

  const decodedToken = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

  const user = await User.findById(decodedToken?._id);
  if (!user) {
    res.redirect("/api/v1/user/login");
  }

  req.user = user;

  req.user = user;
  if (!req.user) {
    res.redirect("/api/v1/user/login");
  }

  next();
});

export { verifyJWT };
