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
exports.CartController = void 0;
const jwt_1 = require("../lib/jwt");
const user_model_1 = require("../models/user.model");
const cart_model_1 = require("../models/cart.model");
class CartController {
    static getCart(req, res) {
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
                const cart = yield cart_model_1.Cart.findOne({ user: authUser._id }).populate('products.product');
                if (!cart) {
                    const cartCreated = yield cart_model_1.Cart.create({ user: authUser._id, products: [] });
                    if (!cartCreated) {
                        return res.status(500).json({ message: 'Error creating cart' });
                    }
                    return res.status(200).json(cartCreated);
                }
                return res.status(200).json(cart);
            }
            catch (error) {
                return res.status(500).json({ message: 'Error getting cart' });
            }
        });
    }
    static addProductToCart(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const authUser = jwt_1.JwtService.getUserFromRequest(req);
            if (!authUser) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
            const { productId, quantity } = req.body;
            if (!productId || !quantity) {
                return res.status(400).json({ message: 'Missing productId or quantity' });
            }
            try {
                const userFound = yield user_model_1.User.findById(authUser._id).select('-password');
                if (!userFound) {
                    return res.status(404).json({ message: 'User not found' });
                }
                let cart = yield cart_model_1.Cart.findOne({ user: authUser._id });
                if (!cart) {
                    cart = yield cart_model_1.Cart.create({ user: authUser._id, products: [] });
                    if (!cart) {
                        return res.status(500).json({ message: 'Error creating cart' });
                    }
                }
                const productIndex = cart.products.findIndex(({ product }) => product.toString() === productId);
                if (productIndex === -1) {
                    cart.products.push({ product: productId, quantity });
                }
                else {
                    cart.products[productIndex].quantity += quantity;
                }
                yield cart.save();
                return res.status(200).json(cart);
            }
            catch (error) {
                return res.status(500).json({ message: 'Error adding product to cart' });
            }
        });
    }
    static decreaseProductByOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const authUser = jwt_1.JwtService.getUserFromRequest(req);
            if (!authUser) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ message: 'Missing Id' });
            }
            try {
                const userFound = yield user_model_1.User.findById(authUser._id).select('-password');
                if (!userFound) {
                    return res.status(404).json({ message: 'User not found' });
                }
                const cart = yield cart_model_1.Cart.findOne({ user: authUser._id });
                if (!cart) {
                    return res.status(404).json({ message: 'Cart not found' });
                }
                const productIndex = cart.products.findIndex(({ product }) => product.toString() === id);
                if (productIndex === -1) {
                    return res.status(404).json({ message: 'Product not found in cart' });
                }
                if (cart.products[productIndex].quantity === 1) {
                    cart.products.splice(productIndex, 1);
                }
                else {
                    cart.products[productIndex].quantity -= 1;
                }
                yield cart.save();
                return res.status(200).json(cart);
            }
            catch (error) {
                return res.status(500).json({ message: 'Error decreasing product quantity' });
            }
        });
    }
    static removeProductFromCart(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const authUser = jwt_1.JwtService.getUserFromRequest(req);
            if (!authUser) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ message: 'Missing Id' });
            }
            try {
                const userFound = yield user_model_1.User.findById(authUser._id).select('-password');
                if (!userFound) {
                    return res.status(404).json({ message: 'User not found' });
                }
                const cart = yield cart_model_1.Cart.findOne({ user: authUser._id });
                if (!cart) {
                    return res.status(404).json({ message: 'Cart not found' });
                }
                const productIndex = cart.products.findIndex(({ product }) => product.toString() === id);
                if (productIndex === -1) {
                    return res.status(404).json({ message: 'Product not found in cart' });
                }
                cart.products.splice(productIndex, 1);
                yield cart.save();
                return res.status(200).json(cart);
            }
            catch (error) {
                return res.status(500).json({ message: 'Error removing product from cart' });
            }
        });
    }
    static clearCart(req, res) {
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
                const cart = yield cart_model_1.Cart.findOne({ user: authUser._id });
                if (!cart) {
                    return res.status(404).json({ message: 'Cart not found' });
                }
                const cartUpdated = yield cart_model_1.Cart.findByIdAndUpdate(cart._id, { products: [] }, { new: true });
                if (!cartUpdated) {
                    return res.status(500).json({ message: 'Error clearing cart' });
                }
                return res.status(200).json(cartUpdated);
            }
            catch (error) {
                return res.status(500).json({ message: 'Error clearing cart' });
            }
        });
    }
}
exports.CartController = CartController;
