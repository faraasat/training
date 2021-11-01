"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jwt_1 = require("./../middlewares/jwt");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const error_1 = require("./../helpers/error");
const user_1 = __importDefault(require("../models/user"));
exports.default = {
    login: ({ userLoginInput }) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { password, email } = userLoginInput;
            const user = yield user_1.default.findOne({ email: email });
            if (!user)
                return (0, error_1.handleError)("User Not Found", "User Not Found", 404);
            const isPasswordValid = yield bcryptjs_1.default.compare(password, user.passwordHash);
            if (!isPasswordValid)
                return (0, error_1.handleError)("Authentication Failed", "Authentication Failed", 401);
            const { _id, username } = user;
            const token = `bearer ${jsonwebtoken_1.default.sign({ _id, username, email }, process.env.JWT_SECRET_STRING, { expiresIn: "1d" })}`;
            return { _id: _id, token: token };
        }
        catch (error) {
            throw error;
        }
    }),
    signup: ({ userCreateInput }) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { username, password, email } = userCreateInput;
            const hashedPassword = yield bcryptjs_1.default.hash(password, 14);
            const user = new user_1.default({
                username: username,
                passwordHash: hashedPassword,
                email: email,
            });
            const { _id } = yield user.save();
            return _id.toString();
        }
        catch (error) {
            throw error;
        }
    }),
    updateUser: ({ userUpdateInput }) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id, token, username, password, email } = userUpdateInput;
            const validatedToken = yield (0, jwt_1.validateToken)(token);
            if (validatedToken._id !== id)
                return (0, error_1.handleError)("Authentication Failed", "Authentication Failed", 401);
            const user = yield user_1.default.findById(id).select("username email passwordHash");
            const hashedPassword = yield bcryptjs_1.default.hash(password, 14);
            const updatedUser = yield user_1.default.findByIdAndUpdate(id, {
                username: username || user.username,
                email: email || user.email,
                passwordHash: hashedPassword || user.passwordHash,
            });
            const tokenObj = {
                _id: updatedUser._id,
                username: updatedUser.username,
                email: updatedUser.email,
            };
            const newToken = `bearer ${jsonwebtoken_1.default.sign(tokenObj, process.env.JWT_SECRET_STRING, { expiresIn: "1d" })}`;
            return { _id: updatedUser._id, token: newToken };
        }
        catch (error) {
            throw error;
        }
    }),
    deleteUser: ({ userDeleteInput }) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id, token } = userDeleteInput;
            const validatedToken = yield (0, jwt_1.validateToken)(token);
            if (validatedToken._id !== id)
                return (0, error_1.handleError)("Authentication Failed", "Authentication Failed", 401);
            const deletedUser = yield user_1.default.findByIdAndDelete(id);
            if (!deletedUser)
                return (0, error_1.handleError)("User Not Found", "User Not Found", 404);
            return id;
        }
        catch (error) {
            throw error;
        }
    }),
};
