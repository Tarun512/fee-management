import { Student } from "../model/student.model.js";
import { FeeStructure } from "../model/feeStructure.model.js";
import { asyncHandler } from "../../utility/asyncHandler.js";
import { ApiError } from "../../utility/ApiError.js";
import { ApiResponse } from "../../utility/ApiResponse.js";

const getFeesDetails = asyncHandler( async(req, res) => {
    try {
        const id = req.user._id;
        const student = await Student.findById(id).populate("course");
        if(!student) {
            throw new ApiError("Student not found", 404);
        }
        const feesDetailsObj = {}
        feesDetailsObj.totalFees = student.course.totalFees;
        feesDetailsObj.totalFeesPaid = student.totalFeesPaid;
        feesDetailsObj.fine = student.fine;
        feesDetailsObj.remainingFees = student.course.totalFees + student.fine - student.totalFeesPaid;
        return res.status(200).json(new ApiResponse(true, feesDetailsObj, "Fees details fetched successfully"));
    } catch (error) {
        console.log(error);
        res.status(error.statusCode || 500).json({message: error.message || "Internal Server Error"})
    }
})
<<<<<<< HEAD

const getPaymentHistory = asyncHandler( async(req, res) => {
    try {
        const id = req.user._id;
        const student = await Student.findById(id).populate("paymentHistory");
        if(!student || student.paymentHistory.length === 0) {
            throw new ApiError("Student not found or payment history is empty", 404);
        }
        return res.status(200).json(new ApiResponse(true, student.paymentHistory, "Payment history fetched successfully"));
    } catch (error) {
        console.log(error);
        res.status(error.statusCode || 500).json({message: error.message || "Internal Server Error"})
    }
})

export { getFeesDetails, getPaymentHistory };
=======
>>>>>>> da2c50e86e61a9c1108998373b2207318ae060b8
