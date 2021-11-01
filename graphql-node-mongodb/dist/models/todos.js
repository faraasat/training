"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const todoSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    archives: {
        type: Boolean,
        default: false,
    },
    starred: {
        type: Boolean,
        default: false,
    },
    user: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" }],
});
exports.default = mongoose_1.default.model("Todo", todoSchema);
