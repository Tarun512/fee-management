import { Student } from "../model/student.model.js";
import { FeeStructure } from "../model/feeStructure.model.js";
import { asyncHandler } from "../../utility/asyncHandler.js";
import { ApiError } from "../../utility/ApiError.js";
import { ApiResponse } from "../../utility/ApiResponse.js";

const getStudentUser = asyncHandler(async (req, res, next) => {
    const userId = req.user._id;
    const student = await Student.findById(userId)
    if (!student) {
        // throw new ApiError()
    }
})