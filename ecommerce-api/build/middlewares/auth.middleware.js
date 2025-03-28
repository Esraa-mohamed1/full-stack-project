"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = auth;
const moment_1 = __importDefault(require("moment"));
const jwt_1 = require("../lib/jwt");
function auth(req, res, next) {
    try {
        if (!req.headers.authorization) {
            return res.status(401).json({
                message: 'Unauthorized'
            });
        }
        const payload = jwt_1.JwtService.getUserFromRequest(req);
        if (!payload || payload.exp <= (0, moment_1.default)().unix()) {
            return res.status(401).json({
                message: 'Unauthorized'
            });
        }
        return next();
    }
    catch (err) {
        return res.status(401).json({
            message: 'Unauthorized'
        });
    }
}
