import { asyncHandler } from "../../utility/asyncHandler.js";
import { ApiError } from "../../utility/ApiError.js";
import { ApiResponse } from "../../utility/ApiResponse.js";
import { User } from "../model/user.model.js";

const generateAccessTokenAndRefreshToken = async (user) => {
    const accessToken = await user.generateAccessToken()
    const refreshToken = await user.generateRefreshToken()
    return {accessToken, refreshToken}
}


const registerUser = asyncHandler(async(req,res) => {
    try {
        const {name, email, password, role, school, branch, batch} = req.body;
        if (!name || !email || !password) {
            throw new ApiError(400, "Every field is required")
        }
        
        if (role == "Student") {
            const user = await User.create({
                name,
                email,
                password,
                role,
                school,
                branch,
                batch,
                regdNo
            })
            if (!user) {
                throw new ApiError(500, "Can't create the student user")
            }
            return res
            .status(201)
            .json(new ApiResponse(201, user, "Student User created successfully"))
        } else {
            if(email.includes("driems.ac.in")) {
                // Email verifying function call
                const user = await User.create({
                    name,
                    email,
                    password,
                    role
                })
                if (!user) {
                    throw new ApiError(500, "Can't create the admin or accountant user")
                }
                return res
                .status(201)
                .json(new ApiResponse(201, user, "Admin or Accountant User created successfully"))
            }
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }
})

const loginUser = asyncHandler(async(req, res) => {
    try {
        const {name, email, password} = req.body
        if (!name || !email || !password ) {
            throw new ApiError(400, "Every field is required")
        }
        const user = await User.findOne({email})
    
        if(!user) {
            throw new ApiError(404, "User not found")
        }
    
        const isPasswordValid = await user.isPasswordCorrect(password)
    
        if (!isPasswordValid) {
            throw new ApiError(404, "Invalid Password")
        }
        const{accessToken, refreshToken} = await generateAccessTokenAndRefreshToken(user)
        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave: false})
    
        // A copy of user is created as userInstance because we have to delete password and refreshToken while sending the object as response.
        // It could've been done using the select operator while fetching the user but we are again saving the user after fetching it since we have to save refreshToken
        const userInstance = user.toObject()
        delete userInstance.password;
        delete userInstance.refreshToken;
    
        const accessTokenoptions = {
            httpOnly: true,
            secure: true,
            maxAge: 3*60*60*1000
        }
        const refreshTokenoptions = {
            httpOnly: true,
            secure: true,
            maxAge: 5*60*60*1000
        }
    
        return res
        .status(200)
        .cookie("accessToken", accessToken, accessTokenoptions)
        .cookie("refreshToken", refreshToken, refreshTokenoptions)
        .json(new ApiResponse(200, userInstance, "User logged in successfully"))
    } catch (error) {
        console.log(error)
        res.status(error.statusCode || 404).json(error)
    }
})

export  {
    registerUser
}