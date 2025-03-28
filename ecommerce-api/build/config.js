"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.STRIPE_WEBHOOK_SECRET = exports.STRIPE_SECRET = exports.JWT_SECRET = exports.DATABASE_URL = exports.CLIENT_URL = exports.PORT = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.PORT = 4500;
exports.CLIENT_URL = 'http://localhost:4200';
exports.DATABASE_URL = 'mongodb://127.0.0.1:27017/aya_ecommerce';
exports.JWT_SECRET = 'supersecretjwt';
exports.STRIPE_SECRET = 'sk_test_51R6q6lRvr7CocWURjbPMWk2XstUnzfufabbKS4pB4pMtFuxQmb71dJLTLFfX0IgmysZAvOLIsucicWJ0V9tnFWmp00aiHdOZtT';
exports.STRIPE_WEBHOOK_SECRET = 'whsec_45065cbf8f30ad16d07531f6f58e14b2c5ab30869121b3eb8d96c62e634800d5';
