import { Payment } from "../model/payment.model.js";
import {Student} from "../model/student.model.js";
import { asyncHandler } from "../../utility/asyncHandler.js"
import { ApiError } from "../../utility/ApiError.js";
import { ApiResponse } from "../../utility/ApiResponse.js";
import mongoose from "mongoose";
// tested
const addPayment = asyncHandler(async(req, res) => {
    try {
        if(req.user.role !== "admin" && req.user.role !== "accountant"){
            throw new ApiError(403,"Forbidden");
        }
        const { registerationId, amount, date, mode } = req.body;
        if (!registerationId || !amount || !date || !mode) {
            console.log(req.body);
            
            throw new ApiError(400,"Please provide all required fields");
        }
        const student = await Student.findOne({registerationId});
        if (!student) {
            throw new ApiError(400,"Student not found");
        }
        const studentId = student._id;
        const payment = await Payment.create({
            studentId,
            amount,
            date,
            mode
        });
        if (!payment) {
            throw new ApiError(400,"Payment could not be added");
        }
        student.paymentHistory.push(payment._id);
        student.totalFeesPaid += amount;
        await student.save();
        res
        .status(201)
        .json(new ApiResponse(201, payment, "Payment added successfully"))
    } catch (error) {
        console.log(error);
        res
        .status(error.statusCode || 500)
        .json({message: error.message || "Server Error"})
    }
})
// tested
const editPayment = asyncHandler(async(req, res) => {
    const { id } = req.params;
    const {registerationId, amount, date, mode} = req.body;
    try {
        if(req.user.role !== "admin" && req.user.role !== "accountant"){
            throw new ApiError(403,"Forbidden");
        }
        if(!mongoose.Types.ObjectId.isValid(id)) {
            throw new ApiError(400,"Invalid payment id");
        }
        if (!registerationId || !amount || !date || !mode) {
            throw new ApiError(400,"Please provide all required fields");
        }
        const student = await Student.findOne({registerationId})
        if (!student) {
            throw new ApiError(400,"Student not found");
        }
        const payment = await Payment.findById(id)
        if (!payment) {
            throw new ApiError(400,"Payment not found");
        }
        student.totalFeesPaid -= payment.amount;
        payment.amount = amount;
        payment.date = date;
        payment.mode = mode;
        await payment.save({validateBeforeSave: false});
        student.totalFeesPaid += payment.amount;
        await student.save({validateBeforeSave: false});
        
        res
        .status(200)
        .json(new ApiResponse(200, payment, "Payment updated successfully"))
    } catch (error) {
        console.log(error);
        res
        .status(error.statusCode || 500)
        .json({message: error.message || "Server Error"})
    }
})
// tested
const deletePayment = asyncHandler(async(req, res) => {
    const { id } = req.params;
    try {
        if(req.user.role !== "admin" && req.user.role !== "accountant"){
            throw new ApiError(403,"Forbidden");
        }
        const payment = await Payment.findByIdAndDelete(id);
        if (!payment) {
            throw new ApiError(400,"Payment not found");
        }
        const student = await Student.findOne({paymentHistory: payment._id});
        if (!student) {
            throw new ApiError(400,"Student not found");
        }
        student.paymentHistory = student.paymentHistory.filter(paymentId => paymentId.toString()!== id);
        student.totalFeesPaid -= payment.amount;
        await student.save();
        res
        .status(200)
        .json(new ApiResponse(200, payment, "Payment deleted successfully"))
    } catch (error) {
        console.log(error);
        res
        .status(error.statusCode || 500)
        .json({message: error.message || "Server Error"})
    }
})

const getPayments = asyncHandler(async(req,res)=>{
    try {
        const {startDate,endDate,regNo} = req.body;
        if(!startDate && !endDate && !regNo){
            throw new ApiError(404,"Atleast one field is required");
        }
        if(new Date(endDate) < new Date(startDate)){
            throw new ApiError(401,"Enddate must be greater than StartDate");
        }
        
        
        if(regNo != ''){
            const student = await Student.findOne({registerationId: regNo});
            if(!student){
                console.log(req.body);
                console.log(regNo);
                throw new ApiError(401,"Student not exist");
            }
            const payments = await Payment.findOne({
                studentId: student._id,
                createdAt: {
                  $gt: new Date(`${startDate}T00:00:00Z`),  // Greater than startDate
                  $lt: new Date(`${endDate}T23:59:59Z`)     // Less than endDate (end of the day)
                }
              });
            if(!payments){
                throw new ApiError(401,"Payments not exist")
            }
            res
            .status(200)
            .json(new ApiResponse(200,payments,"Payments fetched successfully"));
        }
        if(regNo == ''){
            const payments = await Payment.find({
                createdAt: {
                  $gt: new Date(`${startDate}T00:00:00Z`),  // Greater than startDate
                  $lt: new Date(`${endDate}T23:59:59Z`)     // Less than endDate (end of the day)
                }
              });
            if(!payments){
                throw new ApiError(401,"Payments not exist")
            }
            res
            .status(200)
            .json(new ApiResponse(200,payments,"Payments fetched successfully"));
        }
    } catch (error) {
        res
        .status(error.statusCode || 500)
        .json({message: error.message || "internal server error"})
    }
})
const getPayment = asyncHandler(async(req,res)=>{
    try {
        const {id} = req.params;
        let response = await Payment.findById(id);
        if(response.success == false){
            throw new ApiError(401,"Payment not found");
        }
        const studentId = response.studentId;
        const student = await Student.findById(studentId);
        response = {...response._doc,registerationId: student.registerationId}
        res
        .status(response.statusCode || 200)
        .json(new ApiResponse(200,response,"Payment fetched successfully"))
    } catch (error) {
        res
        .status(error.statusCode || 500)
        .json({message: error.message || "internal server error"})
    }
})
const handleVerify = asyncHandler(async(req,res)=>{
    try {
        const {registerationId} = req.params;
        const response = await Student.findOne({registerationId: registerationId});
        if(response.success == false){
            throw new ApiError(400,"RegisterationId is not exist");
        }
        res
        .status(response.statusCode || 200)
        .json(new ApiResponse(200,response,"Student fetched successfully"));
    } catch (error) {
        res
        .status(error.statusCode || 500)
        .json({message: error.message || "Internal server error"})
    }
})
export { 
    addPayment,
    editPayment,
    deletePayment,
    getPayments,
    getPayment,
    handleVerify
 };