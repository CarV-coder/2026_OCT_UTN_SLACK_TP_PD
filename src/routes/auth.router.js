import express from "express";
import { login, register, verifyEmail } from "../controllers/auth.controller.js";

const auth_router = express.Router()

auth_router.post(
    '/register',
    register
)

auth_router.post(
    '/login',
    login
)

auth_router.get(
    '/verify-email/:verify_email_token',
    verifyEmail
)

export default auth_router