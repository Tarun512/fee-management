import { asyncHandler } from "../../utility/asyncHandler.js";
import { ApiError } from "../../utility/ApiError.js";
import { ApiResponse } from "../../utility/ApiResponse.js";
import { FeeStructure } from "../model/feeStructure.model.js";
import { Student } from "../model/student.model.js";
// tested
const createFeesStructure = asyncHandler(async(req, res) => {
    try {
        if(req.user.role !== "admin" && req.user.role !== "accountant"){
            throw new ApiError(400,"You can't add fees structure");
        }
        const {school, branch, batch, year, totalFees} = req.body;
        if(!school || !branch || !batch || !year || !totalFees){
            console.log(req.body);
            throw new ApiError(400,"Every field is required");
        }
        const feeStructureName = `${school}_${branch}_${batch}_${year}`;
        const Fee_Structure = await FeeStructure.create({
            feeStructureName,
            school, 
            branch, 
            batch,
            year, 
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
// tested
const editFeesStructure = asyncHandler(async(req,res)=>{
    try {
        if(req.user.role !== "accountant" && req.user.role !== "admin"){
            throw new ApiError(400,"You are not allowed to edit fees structure");
        }
        const id = req.params.id;
        const feeStructureExist = await FeeStructure.findById(id);
        if(!feeStructureExist){
            throw new ApiError(400,"FeeStructure not exist");
        }
        const {feeStructureName,school,branch,batch,year,totalFees} = req.body;
        if (!feeStructureName || !school || !branch || !batch || !year || !totalFees){
            throw new ApiError(400,"Every field is required");
        }
        const feeStructure = await FeeStructure.findByIdAndUpdate(id,{feeStructureName,school,branch,batch,year,totalFees},{new: true,runValidators: true});
        if(!feeStructure){
            throw new ApiError(500,"Internal server error");
        }
        res
        .status(201)
        .json(new ApiResponse(201,feeStructure,"feeStructure updated successfully"));
    
    } catch (error) {
        res
        .status(error.statusCode || 400)
        .json(error.message || "problem occurred when editing feeStructure");
    }
})
// tested
const deleteStudentFromFeeStructure = asyncHandler(async(req, res) => {
    try {
        const {registerationId, feesStructureName} = req.body;
        const studentToBeDeleted = await Student.findOne({registerationId});
        if(!studentToBeDeleted) {
            throw new ApiError(400,"Student not found");
        }
        const feeStructure = await FeeStructure.findOneAndUpdate({feeStructureName: feesStructureName}, {$pull: {enrolled: studentToBeDeleted._id}}, {new: true, useFindAndModify: false})
        if(!feeStructure) {
            throw new ApiError(400,"Fee Structure not found");
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
const getFeeStructure = asyncHandler(async(req,res)=>{
    try {
        // const { feeStructureName } = req.body;
        // console.log(req.body);
        
        const {id} = req.params;
        console.log(id);
        
        const feeStructures = await FeeStructure.findById(id);
        if(!feeStructures) {
            throw new ApiError(404,"Fee Structures not found");
        }
        console.log(feeStructures);
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

const getFeeStructureByForm = asyncHandler(async(req,res)=>{
    try {
        // const { feeStructureName } = req.body;
        // console.log(req.body);
        const {school,branch,batch,year,feeStructureName} = req.body;
        if(!school || !branch || !batch || !year || !feeStructureName){
            throw new ApiError(400,"Every field is required");
        }
        const feeStructures = await FeeStructure.findOne({feeStructureName});
        if(!feeStructures) {
            throw new ApiError(404,"Fee Structures not found");
        }
        console.log(feeStructures);
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

// tested
const getAllFeeStructures = asyncHandler(async(req, res) => {
    try {
        const feeStructures = await FeeStructure.find();
        console.log(feeStructures);
        
        if(feeStructures.length === 0) {
            throw new ApiError(404,"Fee Structures not found --why");
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
// tested
const deleteFeeStructure = asyncHandler(async(req, res) => {
    try {
        const id = req.params.id
        const feeStructure = await FeeStructure.findByIdAndDelete(id);
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
// tested
const importStudentsFromOtherFeeStructure = asyncHandler(async(req, res) => {
    try {
        const {fromFeeStructureName, toFeeStructureName} = req.body;
        const [fromFeeStructure, toFeeStructure] = await Promise.all([
            FeeStructure.findOne({feeStructureName: fromFeeStructureName}),
            FeeStructure.findOne({feeStructureName: toFeeStructureName})
        ]);
        if(!fromFeeStructure || !toFeeStructure) {
            throw new ApiError("Fee Structure not found", 404);
        }
        toFeeStructure.enrolled = [...toFeeStructure.enrolled, ...fromFeeStructure.enrolled];
        await toFeeStructure.save();
        fromFeeStructure.enrolled = [];
        await fromFeeStructure.save();
        return res
        .status(200)
        .json(new ApiResponse(200, toFeeStructure, "Students imported successfully"));
    } catch (error) {
        console.log(error);
        res
        .status(error.statusCode || 500)
        .json({message: error.message || "Internal Server Error"})
    }
})

export {
    createFeesStructure,
    editFeesStructure,
    // addStudentToFeeStructure,
    deleteStudentFromFeeStructure,
    getFeeStructure,
    getFeeStructureByForm,
    getAllFeeStructures,
    importStudentsFromOtherFeeStructure,
    deleteFeeStructure
}