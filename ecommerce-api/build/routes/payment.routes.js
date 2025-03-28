"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const payment_controller_1 = require("../controllers/payment.controller");
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const router = (0, express_1.Router)();
router.post('/create-session', auth_middleware_1.default, payment_controller_1.PaymentController.createSession);
router.post('/webhook', (0, express_1.raw)({ type: 'application/json' }), payment_controller_1.PaymentController.webhook);
exports.default = router;
