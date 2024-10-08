import { ApiResponse } from "../../utility/ApiResponse.js";
import { ApiError } from "../../utility/ApiError.js";
import { asyncHandler } from "../../utility/asyncHandler.js";
import { FeeStructure } from "../model/feeStructure.model.js";
import { Staff } from "../model/staff.model.js";
import { Payment } from "../model/payment.model.js";
import { Student } from "../model/student.model.js";

// tested
const registerStudents = asyncHandler(async(req, res) => {
    try {
        if(req.user.role !== "admin" && req.user.role !== "accountant"){
            throw new ApiError(403,"Forbidden");
        }
        const {name, email, password, role, registerationId, school, branch, batch, feeStructureName} = req.body;
        if (!name || !email || !password || !role || !registerationId || !school || !branch || !batch || !feeStructureName) {
            console.log(req.body);
            throw new ApiError(400, "Every field is required")
        }
        if (role !== "student") {
            throw new ApiError(400, "Role should be student")
        }
        const feeStructure = await FeeStructure.findOne({feeStructureName: feeStructureName});
        if (!feeStructure) {
            throw new ApiError(400, "Fee structure not found")
        }
        const student = await Student.create({name, email, password, role, registerationId, school, branch, batch});
        if (!student) {
            throw new ApiError(400, "Failed to create student")
        }
        
        student.course = feeStructure._id;
        feeStructure.enrolled.push(student._id);
        await feeStructure.save({validateBeforeSave: false})
        await student.save({validateBeforeSave: false})
        res
        .status(201)
        .json(new ApiResponse(201, student, "Student created successfully"))
    } catch (error) {
        console.log(error)
        res
        .status(error.statusCode || 500)
        .json({messsage: error.message || "Server Error"})
    }
})
// tested
const getStudents = asyncHandler(async(req, res) => {
    try {
        if(req.user.role !== "admin" && req.user.role !== "accountant"){
            throw new ApiError(403,"Forbidden");
        }
        const regdId = req.body.registerationId;
        const students = await Student.find({registerationId: regdId}).select("-password");
        if (!students) {
            throw new ApiError(404, "No students found")
        }
        res
        .status(200)
        .json(new ApiResponse(200, students, "Students found successfully"))
    } catch (error) {
        console.log(error)
        res
        .status(error.statusCode || 500)
        .json({messsage: error.message || "Server Error"})
    }
})
// tested
const getStudentsWithPendingFees = asyncHandler(async(req, res) => {
    try {
        if(req.user.role !== "admin" && req.user.role !== "accountant"){
            console.log(req.user);
            
            throw new ApiError(403,"Forbidden");
        }
        const id = req.params.id;
        const feeStructure = await FeeStructure.findById(id);
        if (!feeStructure) {
            throw new ApiError(404, "Fee structure not found")
        }
        const studentsWithPendingDues = await FeeStructure.aggregate([
            {$match: { _id: feeStructure._id }},
            {
                $lookup: {
                    from: "students",
                    localField: "enrolled",
                    foreignField: "_id",
                    as: "students"
                }
            },
            {
                $unwind: "$students"
            },
            {
                $replaceRoot: {
                    newRoot: {
                        $mergeObjects: ['$$ROOT', '$students']
                    }
                }
            },
            {
                $project: {
                    feeStructurename: 1,
                    "students.name": 1,
                    "students.registerationId": 1,
                    "students.totalFeesPaid": 1,
                    "students.fine": 1,
                    totalFees: 1,
                    pendingDues: {
                        $subtract: [
                            {$add: ["$totalFees", "$students.fine"]},
                            "$students.totalFeesPaid"
                        ]
                    }
                }
            },
            {
                $match: {
                    "pendingDues": { $gt: 0 }
                }
            }
        ])
        if (!studentsWithPendingDues) {
            throw new ApiError(404, "No students found with pending dues")
        }
        res
        .status(200)
        .json(new ApiResponse(200, studentsWithPendingDues, "Students found with pending dues"))
    
    } catch (error) {
        console.log(error)
        res
        .status(error.statusCode || 500)
        .json({messsage: error.message || "Server Error"})
    }
})
// tested
const filterPayments = asyncHandler(async(req, res) => {
    try {
        if(req.user.role !== "admin" && req.user.role !== "accountant"){
            throw new ApiError(403,"Forbidden");
        }
        const query = req.query;
        const queryObj = {};
        if (query.registerationId) {
            queryObj.registerationId = query.registerationId;
        }
        if (query.batch) {
            queryObj.batch = query.batch;
        }
        if (query.school) {
            queryObj.school = query.school;
        }
        if (query.branch) {
            queryObj.branch = query.branch;
        }
        queryObj.startDate = query.startDate ? new Date(query.startDate) : new Date("2000-01-01");
        queryObj.endDate = query.endDate ? new Date(query.endDate) : new Date("2050-12-31");
    
        // Ensure dates are valid
        if (isNaN(queryObj.startDate)) {
            queryObj.startDate = new Date("2000-01-01"); // Default start date
        }
        if (isNaN(queryObj.endDate)) {
            queryObj.endDate = new Date("2050-12-31"); // Default end date
        }
    
        const filterPayments = await Payment.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: queryObj.startDate,
                        $lte: queryObj.endDate
                    }
                }
            },
            {
                $lookup: {
                    from: "students",
                    localField: "studentId",
                    foreignField: "_id",
                    as: "student"
                }
            },
            {
                $unwind: "$student"
            },
            {
                $project: {
                    studentName: "$student.name",
                    studentRegisterationId: "$student.registerationId",
                    studentBatch: "$student.batch",
                    studentSchool: "$student.school",
                    studentBranch: "$student.branch",
                    createdAt: 1,
                    amount: 1,
                    mode: 1,
                }
            },
            {
                $match: {
                    $and: [
                        ...(queryObj.registerationId ? [{
                            "studentRegisterationId": {
                                $regex: queryObj.registerationId,
                                $options: "i"
                            }
                        }] : []),
                        {
                            "studentBatch": {
                                $regex: queryObj.batch,
                                $options: "i"
                            }
                        },
                        {
                            "studentSchool": {
                                $regex: queryObj.school,
                                $options: "i"
                            }
                        },
                        {
                            "studentBranch": {
                                $regex: queryObj.branch,
                                $options: "i"
                            }
                        }
                    ]
                }
            }
        ])
        if (!filterPayments) {
            throw new ApiError(404, "No payments found")
        }
        res
        .status(200)
        .json(new ApiResponse(200, filterPayments, "Payments found successfully"))
    } catch (error) {
        console.log(error)
        res
        .status(error.statusCode || 500)
        .json({messsage: error.message || "Server Error"})
    }
})
// tested
const deleteStudent = asyncHandler(async(req, res) => {
    try {
        if(req.user.role !== "admin" && req.user.role !== "accountant"){
            throw new ApiError(403,"Forbidden");
        }
        const regdId = req.body.registerationId;
        const student = await Student.findOneAndDelete({registerationId: regdId});
        if (!student) {
            throw new ApiError(404, "Student not found")
        }
        res
        .status(200)
        .json(new ApiResponse(200, student, "Student deleted successfully"))
    } catch (error) {
        console.log(error)
        res
        .status(error.statusCode || 500)
        .json({messsage: error.message || "Server Error"})
    }
})

// tested
const deleteStaff = asyncHandler(async(req, res) => {
    const role = req.user.role;
    if (role !== "admin") {
        throw new ApiError(401, "Unauthorized access")
    }
    const {staffName, staffEmail} = req.body;
    try {
        const staff = await Staff.findOneAndDelete({name: staffName, email: staffEmail});
        if (!staff) {
            throw new ApiError(404, "Staff not found")
        }
        res
        .status(200)
        .json(new ApiResponse(200, staff, "Staff deleted successfully"))
    } catch (error) {
        console.log(error)
        res
        .status(error.statusCode || 500)
        .json({messsage: error.message || "Server Error"})
    }
})


export {
    registerStudents,
    getStudents,
    getStudentsWithPendingFees,
    filterPayments,
    deleteStudent,
    deleteStaff
}