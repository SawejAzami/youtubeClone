import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import {User } from "../models/user.model.js"

 const veryfyJWT = asyncHandler(async (req, res, next) => {
  try {

    console.log("token is valid", req.cookies?.accessToken);
     const token= req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer","")
  
     if(!token){
      throw new ApiError(401,"Unautorized request in ")
     }
     
  
    const decodedToken= jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  
    const user = await User.findById(decodedToken?._id).select('-password -refreshToken');
    if(!user){
      throw new ApiError(401,"invalid accessToken from in use jwtauth")
    }
  
    req.user=user;
    next()
  } catch (error) {
    throw new ApiError(401,error?.message||"Invalidtry accesstoken in jwtAuth")
  }

});

export {veryfyJWT}