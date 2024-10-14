import express from 'express';
import { verifyJwt } from '../middlewares/userAuthorization.js';
import { createFeesStructure,deleteFeeStructure,getAllFeeStructures,deleteStudentFromFeeStructure, importStudentsFromOtherFeeStructure, editFeesStructure, getFeeStructure } from '../controllers/feeStructure.controller.js';

const router = express.Router();

router
.route("/create-fee-structure")
.post(verifyJwt,createFeesStructure);

router
.route("/edit-fee-structure/:id")
.post(verifyJwt,editFeesStructure);

router
.route('/delete-student-from-fee-structure')
.delete(verifyJwt,deleteStudentFromFeeStructure);

router
.route('/import-students-to-fee-structure')
.post(verifyJwt, importStudentsFromOtherFeeStructure)

router
.route('/get-fee-structure')
.post(verifyJwt,getFeeStructure);

router
.route('/all-fee-structures')
.get(verifyJwt,getAllFeeStructures);

router
.route('/delete-fee-structure')
.delete(verifyJwt,deleteFeeStructure);

export default router;
