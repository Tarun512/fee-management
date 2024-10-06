import { asyncHandler } from "../../utility/asyncHandler.js";
import { ApiError } from "../../utility/ApiError.js";
import { ApiResponse } from "../../utility/ApiResponse.js";
import { FeeStructure } from "../model/feeStructure.model.js";
import { Student } from "../model/student.model.js";

const createFeesStructure = asyncHandler(async(req, res) => {
    try {
        const {name, school, branch, batch, semester, totalFees} = req.body;
        const Fee_Structure = await FeeStructure.create({
            name,
            school, 
            branch, 
            batch,
            semester, 
            totalFees
        })
        if(!Fee_Structure) {
            throw new ApiError(500, "Error creating Fee Structure")
            }
        return res
        .status(201)
        .json(new ApiResponse(201, Fee_Structure, "Fee Structure created successfully"));
    } catch (error) {
        console.log(error);
        res
        .status(error.statusCode || 500)
        .json({message: error.message || "Internal Server Error"})
    }
})


// const addStudentToFeeStructure = asyncHandler(async(req, res) => {
//     try {
//         const {regdId, feesStructureName} = req.body;
//         // Here is regdId is an array of student regisration ids
//         const student = await Student.find({registrationId: {$in: regdId}});
//         if(!student) {
//             throw new ApiError("Student not found", 404);
//         }
//         const studentIds = student.map(student => student._id);
//         const feeStructure = await FeeStructure.findOneAndUpdate({name: feesStructureName}, {$addToSet: {enrolled: {$each: studentIds}}}, {new: true, useFindAndModify: false})
//         if(!feeStructure) {
//             throw new ApiError("Fee Structure not found", 404);
//         }
//         return res
//         .status(200)
//         .json(new ApiResponse(200, feeStructure, "Student added to Fee Structure successfully"));
//     } catch (error) {
//         console.log(error);
//         res
//         .status(error.statusCode || 500)
//         .json({message: error.message || "Internal Server Error"})
//     }
// })

const deleteStudentFromFeeStructure = asyncHandler(async(req, res) => {
    try {
        const {regdId, feesStructureName} = req.body;
        const studentToBeDeleted = await Student.findOne({regdId: regdId});
        if(!studentToBeDeleted) {
            throw new ApiError("Student not found", 404);
        }
        const feeStructure = await FeeStructure.findOneAndUpdate({name: feesStructureName}, {$pull: {enrolled: studentToBeDeleted._id}}, {new: true, useFindAndModify: false})
        if(!feeStructure) {
            throw new ApiError("Fee Structure not found", 404);
        }
        return res
        .status(200)
        .json(new ApiResponse(200, feeStructure, "Student removed from Fee Structure successfully"));
    } catch (error) {
        console.log(error);
        res
        .status(error.statusCode || 500)
        .json({message: error.message || "Internal Server Error"})
    }
})

const getAllFeeStructures = asyncHandler(async(req, res) => {
    try {
        const feeStructures = await FeeStructure.find();
        if(!feeStructures) {
            throw new ApiError("Fee Structures not found", 404);
        }
        return res
        .status(200)
        .json(new ApiResponse(200, feeStructures, "Fee Structures fetched successfully"));
    } catch (error) {
        console.log(error);
        res
        .status(error.statusCode || 500)
        .json({message: error.message || "Internal Server Error"})
    }
})

const deleteFeeStructure = asyncHandler(async(req, res) => {
    try {
        const {feesStructureName} = req.body;
        const feeStructure = await FeeStructure.findOneAndDelete({name: feesStructureName});
        if(!feeStructure) {
            throw new ApiError("Fee Structure not found", 404);
        }
        return res
        .status(200)
        .json(new ApiResponse(200, feeStructure, "Fee Structure deleted successfully"));
    } catch (error) {
        console.log(error);
        res
        .status(error.statusCode || 500)
        .json({message: error.message || "Internal Server Error"})
    }
})

export {
    createFeesStructure,
    addStudentToFeeStructure,
    deleteStudentFromFeeStructure,
    getAllFeeStructures,
    deleteFeeStructure
}