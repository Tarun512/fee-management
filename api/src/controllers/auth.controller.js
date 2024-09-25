import { asyncHandler } from "../../utility/asyncHandler.js";
import { ApiError } from "../../utility/ApiError.js";
import { ApiResponse } from "../../utility/ApiResponse.js";
import { User } from "../model/user.model.js";


const registerUser = asyncHandler(async(req,res) => {
    try {
        const {name, email, password, role, school, branch, batch} = req.body;
        if (!name && !email && !password) {
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



export  {
    registerUser
}