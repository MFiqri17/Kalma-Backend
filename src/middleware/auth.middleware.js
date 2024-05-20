"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_service_1 = __importDefault(require("../services/user.service"));
const auth_service_1 = __importDefault(require("../services/auth.service"));
const responseFunction_1 = require("../utils/functions/responseFunction");
const checkUserCredentials = async (req, res, next) => {
    const { email_or_username, password } = req.body;
    const user = await user_service_1.default.getUserByEmailOrUsernameOneParams(email_or_username);
    if (!user || !(await auth_service_1.default.comparePassword(password, user.password)))
        return res.status(400).json((0, responseFunction_1.invalidCredentialResponse)());
    try {
        req.user = user;
        next();
    }
    catch (error) {
        console.log('Error verify user credentials', error);
        return res.status(500).json((0, responseFunction_1.serverErrorResponse)());
    }
};
const verifyAccessToken = async (req, res, next) => {
    const bearer = req.headers.authorization;
    if (!bearer)
        return res.status(401).json((0, responseFunction_1.invalidAccessTokenResponse)());
    const [, token] = bearer.split(' ');
    if (!token)
        return res.status(401).json((0, responseFunction_1.invalidAccessTokenResponse)());
    try {
        const user = jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN);
        const userExisted = user && (await user_service_1.default.getUserById(user.id));
        if (!userExisted)
            return res.status(401).json((0, responseFunction_1.invalidAccessTokenResponse)());
        req.user = userExisted;
        next();
    }
    catch (error) {
        console.log('Error verify access Token', error);
        return res.status(401).json((0, responseFunction_1.invalidAccessTokenResponse)());
    }
};
const verifyRefreshToken = async (req, res, next) => {
    const cookies = req.cookies;
    if (!(cookies === null || cookies === void 0 ? void 0 : cookies.refreshToken))
        return res.status(401).json((0, responseFunction_1.invalidRefreshTokenResponse)());
    const refreshToken = cookies === null || cookies === void 0 ? void 0 : cookies.refreshToken;
    if (!refreshToken)
        return res.status(401).json((0, responseFunction_1.invalidRefreshTokenResponse)());
    try {
        const user = jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_TOKEN);
        const userExisted = user && (await user_service_1.default.getUserById(user.id));
        if (!userExisted)
            return res.status(401).json((0, responseFunction_1.invalidRefreshTokenResponse)());
        req.user = userExisted;
        res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'none' });
        next();
    }
    catch (error) {
        console.log('Error verify refresh Token', error);
        return res.status(401).json((0, responseFunction_1.invalidRefreshTokenResponse)());
    }
};
const AuthMiddleware = {
    checkUserCredentials,
    verifyAccessToken,
    verifyRefreshToken,
};
exports.default = AuthMiddleware;
