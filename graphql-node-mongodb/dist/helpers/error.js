"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleError = void 0;
const handleError = (err, message, status) => {
    const error = new Error();
    error.statusCode = status;
    error.error = err;
    error.message = message;
    throw error;
};
exports.handleError = handleError;
