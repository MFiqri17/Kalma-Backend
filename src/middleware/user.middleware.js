"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_service_1 = __importDefault(require("../services/user.service"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const responseFunction_1 = require("../utils/functions/responseFunction");
const checkExistingUser = async (req, res, next) => {
    try {
        const { email, username } = req.body;
        const user = await user_service_1.default.getUserByEmailOrUsernameTwoParams(email, username);
        if (req.user && user && req.user.id !== user.id)
            return res.status(400).json((0, responseFunction_1.existedUserResponse)());
        if (!req.user && user)
            return res.status(400).json((0, responseFunction_1.existedUserResponse)());
        next();
    }
    catch (error) {
        console.error('Error checking existing user:', error);
        return res.status(500).json((0, responseFunction_1.serverErrorResponse)());
    }
};
const isUserEmailVerified = async (req, res, next) => {
    try {
        const user = await user_service_1.default.getUserById(req.user.id);
        const isEmailVerified = user_service_1.default.isEmailVerified(user.is_verified);
        if (!isEmailVerified)
            return res.status(403).json((0, responseFunction_1.emailIsNotVerifiedResponse)());
        next();
    }
    catch (error) {
        console.error('Error checking verified email:', error);
        return res.status(500).json((0, responseFunction_1.serverErrorResponse)());
    }
};
const verifyEmailVerificationToken = (req, res, next) => {
    try {
        const tokenUser = jsonwebtoken_1.default.verify(req.params.token, process.env.EMAIL_VERIFICATION_TOKEN);
        req.user = tokenUser;
        next();
    }
    catch (error) {
        console.error('Error verify link token:', error);
        return res.status(400).json((0, responseFunction_1.invalidLinkTokenResponse)());
    }
};
const verifyForgotPasswordToken = (req, res, next) => {
    try {
        const tokenUser = jsonwebtoken_1.default.verify(req.params.token, process.env.FORGOT_PASSWORD_TOKEN);
        req.user = tokenUser;
        next();
    }
    catch (error) {
        console.error('Error verify link token:', error);
        return res.status(400).json((0, responseFunction_1.invalidLinkTokenResponse)());
    }
};
const UserMiddleware = {
    checkExistingUser,
    isUserEmailVerified,
    verifyEmailVerificationToken,
    verifyForgotPasswordToken,
};
exports.default = UserMiddleware;
