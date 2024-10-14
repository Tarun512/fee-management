import { asyncHandler } from "../../utility/asyncHandler.js";
import { ApiError } from "../../utility/ApiError.js";
import { ApiResponse } from "../../utility/ApiResponse.js";
import { Student } from "../model/student.model.js";
import { Staff } from "../model/staff.model.js";
import jwt from 'jsonwebtoken'

const generateAccessTokenAndRefreshToken = async (user) => {
    const accessToken = await user.generateAccessToken()
    const refreshToken = await user.generateRefreshToken()
    return {accessToken, refreshToken}
}

// tested
const registerUser = asyncHandler(async(req,res) => {
    try {
        const {name, email, password, role} = req.body;
        console.log(req.body);
        if (!name || !email || !password || !role ) {
            throw new ApiError(400, "Every field is required")
        }
        if(email.includes("driems.ac.in")) {
            const dotIndex = email.indexOf('.');
            const atIndex = email.indexOf('@');
            const roleFromEmail = email.substring(dotIndex + 1, atIndex);
            console.log(roleFromEmail);
            if(role !== roleFromEmail){
                throw new ApiError(400,"Role must match with role in email");
            }
            // Email verifying function call
            const user = await Staff.create({
                name,
                email,
                password,
                role,
            })
            if (!user) {
                throw new ApiError(500, "Can't create the admin or accountant user")
            }
            const userInstance = user.toObject()
            delete userInstance.password;
            return res
            .status(201)
            .json(new ApiResponse(201, userInstance, `${role} created successfully`))
        }
        
    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }
})
// tested
const loginUser = asyncHandler(async(req, res) => {
    try {
        const { email, password, role} = req.body
        console.log(req.body);
        
        if (!email || !password || !role) {
            throw new ApiError(400, "Every field is required in login")
        }
        let user;
        if (role === 'student') {
            user = await Student.findOne({email})
            if (!user) {
                throw new ApiError(404, "User not found")
            } else {
                const isPasswordValid = await user.isPasswordCorrect(password)
                if (!isPasswordValid) {
                    throw new ApiError(404, "Invalid Password")
                }
            }
        } else {
            user = await Staff.findOne({email})
            console.log(user);
            if (!user) {
                throw new ApiError(404, "User not found")
            } else {
                const isPasswordValid = await user.isPasswordCorrect(password)
                if (!isPasswordValid) {
                    throw new ApiError(404, "Invalid Password")
                }
            }
        }
    
        const{accessToken, refreshToken} = await generateAccessTokenAndRefreshToken(user)
        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave: false})
    
        // A copy of user is created as userInstance because we have to delete password and refreshToken while sending the object as response.
        // It could've been done using the select operator while fetching the user but we are again saving the user after fetching it since we have to save refreshToken
        const userInstance = user.toObject()
        delete userInstance.password;
    
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
// tested
const refreshAllTokens = asyncHandler(async(req, res) => {
    try {
        const userID = req.user._id;
        const role = req.user.role

        let user
        if (role === 'Student') {
            user = await Student.findById(userID)
        } else {
            user = await Staff.findById(userID)
            }
        console.log(user);    
        if (!user) {
            throw new ApiError(400, "User not found")
        }
        const atoken = req.cookies.accessToken
        const rtoken = req.cookies.refreshToken
        let accessToken, refreshToken;
        if (atoken) {
            const decodedToken = jwt.decode(atoken, process.env.ACCESS_TOKEN_SECRET)
            if (decodedToken.exp*1000 < Date.now() + 5*60*1000) {
                ({accessToken, refreshToken} = await generateAccessTokenAndRefreshToken(user))
                user.refreshToken = refreshToken;
                await user.save({validateBeforeSave: false})
    
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
                .json(new ApiResponse(200, null, "Cookies are successfully refreshed"))
            } else {
                return res.status(200).json(new ApiResponse(200, null, "Cookies are still valid"));
            }
        } else if(rtoken) {
            // I removed these line 
            //const decodedToken = jwt.decode(atoken, process.env.ACCESS_TOKEN_SECRET)
            //if (decodedToken.exp*1000 < Date.now() + 5*60*1000)
            // We don't need to check the expiry time of refersh token as our motive is 
            //to refresh all tokens if the access token is expired in this ELSE block
            ({accessToken, refreshToken} = await generateAccessTokenAndRefreshToken(user))
            user.refreshToken = refreshToken;
            await user.save({validateBeforeSave: false})
    
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
            .json(new ApiResponse(200, null, "Cookies are successfully refreshed"))
        } else {
            throw new ApiError(400, "No tokens or invalid tokens")
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: error.message || "Something went wrong while refreshing tokens"})
    }
})
// tested
const logoutUser = asyncHandler(async(req, res) => {
    const id = req.user._id;
    const role = req.user.role
    let user;
    try {
        if (role === 'Student') {
            user = await Student.findByIdAndUpdate(id, 
                {
                    $unset: {
                        refreshToken: 1
                    }
                },
                {
                    new: true
                }
            )
        } else {
            user = await Staff.findByIdAndUpdate(id, 
                {
                    $unset: {
                        refreshToken: 1
                    }
                },
                {
                    new: true
                }
            )
        }
        
        if (!user) {
            throw new ApiError(404, "Failed to Logout")
        }
        const options = {
            httpOnly: true,
            secure: true
        }
    
        return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, null, "Logged out succssfully"))
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: error.message})
    }
})

export  {
    registerUser,
    loginUser,
    refreshAllTokens,
    logoutUser
}