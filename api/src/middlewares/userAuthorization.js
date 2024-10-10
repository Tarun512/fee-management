import { asyncHandler } from "../../utility/asyncHandler.js";
import { ApiError } from "../../utility/ApiError.js";
import { ApiResponse } from "../../utility/ApiResponse.js";
import jwt from 'jsonwebtoken'
import { Staff } from "../model/staff.model.js";
import { Student } from "../model/student.model.js";

export const verifyJwt  = asyncHandler(async(req, res, next) => {
    try {
        const atoken = req.cookies.accessToken || req.header("Authorization")?.replace("Bearer ", "")  
        const rtoken = req.cookies.refreshToken || req.header("Authorization")?.replace("Bearer ", "")

        if (!atoken && !rtoken) {
            console.log("No token found in verifyJwt")
            throw new ApiError(404, "Unauthorized request (Error from verifyjwt)")
        }
    
        if (atoken) {
            const decodedToken = jwt.decode(atoken, process.env.ACCESS_TOKEN_SECRET)
            if (!decodedToken) {
                throw new ApiError(400, "Invalid token A(Error from verifyjwt)")
            }
            if(decodedToken.role === "student") {
                const user = await Student.findById(decodedToken._id).select("-password -refreshToken")
                if (!user) {
                    throw new ApiError(400, "User not Found A(Error from verifyjwt)")
                }
                req.user = user;
                next();
                return
            } else if(decodedToken.role === "admin" || decodedToken.role === "accountant") {
                const user = await Staff.findById(decodedToken._id).select("-password -refreshToken")
                if (!user) {
                    throw new ApiError(400, "User not Found A(Error from verifyjwt)")
                }
                req.user = user;
                next();
                return
            } else {
                throw new ApiError(400, "Invalid token A(Error from verifyjwt)")
            }
        // Added below ELSE condition to check for refershToken if the accessToken has expired
        //So that when we try to access the protected route to refershAllTokens , verifyJwt won't block it.
        } else {
            const decodedToken = jwt.decode(rtoken, process.env.REFRESH_TOKEN_SECRET)
            if (!decodedToken) {
                throw new ApiError(400, "Invalid token R(Error from verifyjwt)")
            }
            if(decodedToken.role === "student") {
                const user = await Student.findById(decodedToken._id).select("-password -refreshToken")
                if (!user) {
                    throw new ApiError(400, "User not Found R(Error from verifyjwt)")
                }
                req.user = user;
                next();
                return
            } else if(decodedToken.role === "admin" || decodedToken.role === "accountant") {
                const user = await Staff.findById(decodedToken._id).select("-password -refreshToken")
                if (!user) {
                    throw new ApiError(400, "User not Found R(Error from verifyjwt)")
                }
                req.user = user;
                next();
                return
            } else {
                throw new ApiError(400, "Invalid token R(Error from verifyjwt)")
            }
        }
    } catch (error) {
        console.log(error);
        res.status(error.statusCode || 500).json({message: error.message})
    }
})