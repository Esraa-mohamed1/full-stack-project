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
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderController = void 0;
const jwt_1 = require("../lib/jwt");
const user_model_1 = require("../models/user.model");
const order_model_1 = require("../models/order.model");
class OrderController {
    static findAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const authUser = jwt_1.JwtService.getUserFromRequest(req);
            if (!authUser) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
            try {
                const userFound = yield user_model_1.User.findById(authUser._id).select('-password');
                if (!userFound) {
                    return res.status(404).json({ message: 'User not found' });
                }
                const orders = yield order_model_1.Order.find({ user: authUser._id }).populate('products.product');
                if (!orders) {
                    return res.status(404).json({ message: 'Orders not found' });
                }
                return res.status(200).json(orders);
            }
            catch (error) {
                return res.status(500).json({ message: 'Error getting orders' });
            }
        });
    }
}
exports.OrderController = OrderController;
