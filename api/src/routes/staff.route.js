import express from "express";
import { registerStudents, getStudents, getStudentsWithPendingFees, filterPayments, deleteStudent, deleteStaff } from "../controllers/staff.controller.js";
import { verifyJwt } from "../middlewares/userAuthorization.js";

const router = express.Router();

router
.route("/register-students")
.post(verifyJwt, registerStudents);

router
.route("/get-students")
.post(verifyJwt, getStudents);

router
.route("/:id")
.post(verifyJwt, getStudentsWithPendingFees);

router
.route("/filter-payments")
.get(verifyJwt, filterPayments);

router
.route("/delete-student")
.delete(verifyJwt, deleteStudent);

router
.route("/delete-staff")
.delete(verifyJwt, deleteStaff);

export default router;