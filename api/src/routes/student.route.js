import express from "express";
import { getFeesDetails, getPaymentHistory } from "../controllers/student.controller.js";
import { verifyJwt } from "../middlewares/userAuthorization.js";

const router = express.Router();


router
.route("/fees-details")
.get(verifyJwt, getFeesDetails);

router
.route("/payment-history")
.get(verifyJwt, getPaymentHistory);

export default router;