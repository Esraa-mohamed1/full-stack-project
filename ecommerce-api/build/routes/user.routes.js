"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const router = (0, express_1.Router)();
router.get('/', auth_middleware_1.default, user_controller_1.UserController.findAll);
router.get('/:id', auth_middleware_1.default, user_controller_1.UserController.findOne);
router.patch('/:id', auth_middleware_1.default, user_controller_1.UserController.update);
router.delete('/:id', auth_middleware_1.default, user_controller_1.UserController.delete);
exports.default = router;
