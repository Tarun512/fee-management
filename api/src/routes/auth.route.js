import express from 'express';
import {loginUser, logoutUser, refreshAllTokens} from '../controllers/auth.controller.js'
import { verifyJwt } from '../middlewares/userAuthorization.js'

const router = express.Router()

router
.route("/login")
.post( loginUser )

router
.route("/logout")
.post( verifyJwt,logoutUser )

router
.route("/refresh")
.post( verifyJwt, refreshAllTokens )

export default router