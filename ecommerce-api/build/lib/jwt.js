"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const moment_1 = __importDefault(require("moment"));
const config_1 = require("../config");
class JwtService {
    static createToken(user) {
        if (!config_1.JWT_SECRET || !user)
            return;
        const payload = Object.assign(Object.assign({}, user), { iat: (0, moment_1.default)().unix(), exp: (0, moment_1.default)().add(30, 'days').unix() });
        return jsonwebtoken_1.default.sign(payload, config_1.JWT_SECRET);
    }
    static getUserFromRequest(req) {
        const authHeader = req.headers.authorization;
        if (!(authHeader === null || authHeader === void 0 ? void 0 : authHeader.startsWith('Bearer ')))
            return;
        const token = authHeader.replace('Bearer ', '').replace(/['"]+/g, '');
        if (!config_1.JWT_SECRET || !token)
            return;
        return jsonwebtoken_1.default.verify(token, config_1.JWT_SECRET);
    }
}
exports.JwtService = JwtService;
