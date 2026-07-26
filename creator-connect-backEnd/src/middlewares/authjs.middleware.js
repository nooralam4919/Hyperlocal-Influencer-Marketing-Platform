import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiErrors.js";
import { asyncHandler } from "../utils/asynHandler.js";
import { User } from "../models/user.model.js";

/**
 * verifyJWT — protects routes that require authentication.
 *
 * Looks for the token in:
 *  1. cookies.accessToken (browser clients)
 *  2. Authorization: Bearer <token> header (mobile / Postman)
 *
 * Attaches `req.user` on success.
 */
const verifyJWT = asyncHandler(async (req, _res, next) => {
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    throw new ApiError(401, "Unauthorized — no access token provided");
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  } catch (err) {
    throw new ApiError(401, "Invalid or expired access token");
  }

  const user = await User.findById(decoded._id).select(
    "-password -refreshToken"
  );

  if (!user) {
    throw new ApiError(401, "User not found — invalid token");
  }

  req.user = user;
  next();
});

/**
 * verifyRole — restricts a route to specific roles.
 * Must be used AFTER verifyJWT.
 *
 * Usage: router.get("/admin", verifyJWT, verifyRole("owner"), handler)
 */
const verifyRole = (...roles) => {
  return (req, _res, next) => {
    if (!roles.includes(req.user?.role)) {
      throw new ApiError(
        403,
        `Forbidden — only ${roles.join(", ")} can access this route`
      );
    }
    next();
  };
};

export { verifyJWT, verifyRole };
