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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentController = void 0;
const stripe_1 = __importDefault(require("stripe"));
const config_1 = require("../config");
const jwt_1 = require("../lib/jwt");
const user_model_1 = require("../models/user.model");
const cart_model_1 = require("../models/cart.model");
const order_model_1 = require("../models/order.model");
const stripe = new stripe_1.default(`${config_1.STRIPE_SECRET}`);
function createOrder(userId, total) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield user_model_1.User.findById(userId).select('-password');
            if (!user)
                return;
            const cart = yield cart_model_1.Cart.findOne({ user: user._id });
            if (!cart)
                return;
            const products = cart.products.map(p => ({
                product: p._id,
                quantity: p.quantity
            }));
            const order = yield order_model_1.Order.create({
                user: user._id,
                products,
                total: total / 100,
                status: 'pending',
                address: user.address
            });
            if (!order)
                return;
            yield cart_model_1.Cart.findByIdAndUpdate(cart._id, { products: [] });
        }
        catch (error) {
            console.error('Error cre0000fter payment', error);
        }
    });
}
class PaymentController {
    static createSession(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            const authUser = jwt_1.JwtService.getUserFromRequest(req);
            if (!authUser) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
            if (!body || body.length === 0) {
                return res.status(400).json({ message: 'Invalid request' });
            }
            try {
                const session = yield stripe.checkout.sessions.create({
                    line_items: body,
                    mode: 'payment',
                    metadata: { userId: authUser._id.toString() },
                    success_url: `${config_1.CLIENT_URL}/home/orders`,
                    cancel_url: `${config_1.CLIENT_URL}/home/cart`
                });
                if (!session) {
                    return res.status(500).json({ message: 'Error creating pan' });
                }
                return res.status(201).json(session);
            }
            catch (error) {
                console.log("vvvvvvvvvvvvvvvvvvvv", error);
                return res.status(500).json({ message: 'Error c1111111111yment session' });
            }
        });
    }
    static webhook(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const sig = req.headers['stripe-signature'];
            if (!sig) {
                return res.status(400).json({ message: 'Webhook error' });
            }
            try {
                const event = stripe.webhooks.constructEvent(req.rawBody, sig, config_1.STRIPE_WEBHOOK_SECRET);
                if (!event) {
                    return res.status(400).json({ message: 'Webhook error' });
                }
                if (event.type === 'checkout.session.completed') {
                    const { metadata, amount_total: amountTotal } = event.data.object;
                    if ((metadata === null || metadata === void 0 ? void 0 : metadata.userId) && amountTotal) {
                        yield createOrder(metadata.userId, amountTotal);
                    }
                }
                return res.status(200).json({ message: 'Webhook received' });
            }
            catch (error) {
                return res.status(400).json({ message: 'Webhook error' });
            }
        });
    }
}
exports.PaymentController = PaymentController;
