import { asyncHandler } from "../../utility/asyncHandler.js";
import { ApiError } from "../../utility/ApiError.js";
import { ApiResponse } from "../../utility/ApiResponse.js";
import jwt from 'jsonwebtoken'
import { User } from "../model/user.model.js";

export const verifyJwt  = asyncHandler(async(req, res, next) => {
    try {
        const token = req.cookies.accessToken || req.header("Authorization")?.replace("Bearer ", "")
    
        if (!token) {
            console.log("No token found in verifyJwt")
            throw new ApiError(404, "Unauthorized request (Error from verifyjwt)")
        }
    
        const decodedToken = jwt.decode(token, process.env.ACCESS_TOKEN_SECRET)
    
        const user = User.findById(decodedToken._id).select("-password -refreshToken")
    
        if (!user) {
            throw new ApiError(400, "User not Found (Error from verifyjwt)")
        }
    
        req.user = user;
        next();
    } catch (error) {
        console.log(error);
        res.status(error.statusCode || 500).json({message: error.message})
    }
})