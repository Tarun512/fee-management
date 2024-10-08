import express from 'express';
import { verifyJwt } from '../middlewares/userAuthorization.js';
import { createFeesStructure,deleteFeeStructure,getAllFeeStructures,deleteStudentFromFeeStructure } from '../controllers/feeStructure.controller.js';

const router = express.Router();

router
.route("/create-fee-structure")
.post(verifyJwt,createFeesStructure);

router
.route('/delete-fee-Structure')
.post(verifyJwt,deleteFeeStructure);

router
.route('/all-fee-structures')
.post(verifyJwt,getAllFeeStructures);

router
.route('/delete-student-from-fee-structure')
.post(verifyJwt,deleteStudentFromFeeStructure);

export default router;
