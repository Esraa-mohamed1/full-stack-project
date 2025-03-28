"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    role: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Role', required: true },
    favoriteProducts: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Product' }],
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    address: { type: String, required: true }
}, { timestamps: true });
exports.User = mongoose_1.default.model('User', userSchema);
