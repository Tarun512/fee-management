import { asyncHandler } from "../../utility/asyncHandler.js";
import { ApiError } from "../../utility/ApiError.js";
import { ApiResponse } from "../../utility/ApiResponse.js";
import jwt from 'jsonwebtoken'
import { Staff } from "../model/staff.model.js";
import { Student } from "../model/student.model.js";

export const verifyJwt  = asyncHandler(async(req, res, next) => {
    try {
        const token = req.cookies.accessToken || req.header("Authorization")?.replace("Bearer ", "")
    
        if (!token) {
            console.log("No token found in verifyJwt")
            throw new ApiError(404, "Unauthorized request (Error from verifyjwt)")
        }
    
        const decodedToken = jwt.decode(token, process.env.ACCESS_TOKEN_SECRET)
        if (!decodedToken) {
            throw new ApiError(400, "Invalid token (Error from verifyjwt)")
        }
        if(decodedToken.role === "student") {
            const user = await Student.findById(decodedToken._id).select("-password -refreshToken")
            if (!user) {
                throw new ApiError(400, "User not Found (Error from verifyjwt)")
            }
            req.user = user;
            next();
            return
        } else if(decodedToken.role === "admin" || decodedToken.role === "accountant") {
            const user = await Staff.findById(decodedToken._id).select("-password -refreshToken")
            if (!user) {
                throw new ApiError(400, "User not Found (Error from verifyjwt)")
            }
            req.user = user;
            next();
            return
        } else {
            throw new ApiError(400, "Invalid token (Error from verifyjwt)")
        }
    } catch (error) {
        console.log(error);
        res.status(error.statusCode || 500).json({message: error.message})
    }
})