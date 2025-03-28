"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const cart_controller_1 = require("../controllers/cart.controller");
const router = (0, express_1.Router)();
router.get('/', auth_middleware_1.default, cart_controller_1.CartController.getCart);
router.post('/', auth_middleware_1.default, cart_controller_1.CartController.addProductToCart);
router.delete('/clear', auth_middleware_1.default, cart_controller_1.CartController.clearCart);
router.delete('/remove/:id', auth_middleware_1.default, cart_controller_1.CartController.removeProductFromCart);
router.delete('/decrease/:id', auth_middleware_1.default, cart_controller_1.CartController.decreaseProductByOne);
exports.default = router;
