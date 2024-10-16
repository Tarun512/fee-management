import express from "express";
import { registerStudents, getStudent, getStudentsWithPendingFees, filterPayments, deleteStudent, deleteStaff, editStudent, getStudentByForm } from "../controllers/staff.controller.js";
import { verifyJwt } from "../middlewares/userAuthorization.js";

const router = express.Router();

router
.route("/register-students")
.post(verifyJwt, registerStudents);

router
.route("/edit-student/:id")
.post(verifyJwt,editStudent);

router
.route("/get-student/:id")
.get(verifyJwt, getStudent);

router
.route("/get-student-by-form")
.post(verifyJwt, getStudentByForm);

router
.route("/pending-fees/:id")
.post(verifyJwt, getStudentsWithPendingFees);

router
.route("/filter-payments")
.get(verifyJwt, filterPayments);

router
.route("/delete-student/:id")
.delete(verifyJwt, deleteStudent);

router
.route("/delete-staff")
.delete(verifyJwt, deleteStaff);

export default router;