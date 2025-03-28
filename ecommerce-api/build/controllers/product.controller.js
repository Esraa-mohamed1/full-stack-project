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
exports.ProductController = void 0;
const jwt_1 = require("../lib/jwt");
const utils_1 = require("../lib/utils");
const product_model_1 = require("../models/product.model");
const user_model_1 = require("../models/user.model");
class ProductController {
    static findAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { search, category } = req.query;
            const page = req.query.page ? Number(req.query.page) : 1;
            const limit = req.query.limit ? Number(req.query.limit) : 10;
            const skip = (page - 1) * limit;
            let query = {};
            if (category) {
                query = { category };
            }
            if (search) {
                query = Object.assign(Object.assign({}, query), { $or: [
                        { name: { $regex: search, $options: 'i' } }
                    ] });
            }
            try {
                const products = yield product_model_1.Product.find(query).skip(skip).limit(limit);
                return res.status(200).json(products);
            }
            catch (error) {
                return res.status(500).json({ message: 'Error getting products' });
            }
        });
    }
    static findOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const product = yield product_model_1.Product.findById(id);
                if (!product) {
                    return res.status(404).json({ message: 'Product not found' });
                }
                return res.status(200).json(product.toJSON());
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: 'Error getting product' });
            }
        });
    }
    static create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            const authUser = jwt_1.JwtService.getUserFromRequest(req);
            if (!authUser) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
            try {
                const userFound = yield user_model_1.User.findById(authUser._id)
                    .select('-password')
                    .populate('role');
                if (!userFound) {
                    return res.status(404).json({ message: 'User not found' });
                }
                const isAdmin = yield utils_1.UtilsService.isUserAdmin(userFound._id);
                if (!isAdmin) {
                    return res.status(401).json({ message: 'Unauthorized' });
                }
                const newProduct = yield product_model_1.Product.create(body);
                if (!newProduct) {
                    return res.status(400).json({ message: 'Error creating product' });
                }
                return res.status(201).json(newProduct.toJSON());
            }
            catch (error) {
                return res.status(500).json({ message: 'Error creating product' });
            }
        });
    }
    static update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f;
            const body = req.body;
            const authUser = jwt_1.JwtService.getUserFromRequest(req);
            if (!authUser) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
            try {
                const userFound = yield user_model_1.User.findById(authUser._id)
                    .select('-password')
                    .populate('role');
                if (!userFound) {
                    return res.status(404).json({ message: 'User not found' });
                }
                const isAdmin = yield utils_1.UtilsService.isUserAdmin(userFound._id);
                if (!isAdmin) {
                    return res.status(401).json({ message: 'Unauthorized' });
                }
                const productFound = yield product_model_1.Product.findById(req.params.id);
                if (!productFound) {
                    return res.status(404).json({ message: 'Product not found' });
                }
                const productUpdated = yield product_model_1.Product.findByIdAndUpdate(req.params.id, {
                    category: (_a = body.category) !== null && _a !== void 0 ? _a : productFound.category,
                    name: (_b = body.name) !== null && _b !== void 0 ? _b : productFound.name,
                    price: (_c = body.price) !== null && _c !== void 0 ? _c : productFound.price,
                    stock: (_d = body.stock) !== null && _d !== void 0 ? _d : productFound.stock,
                    specifications: (_e = body.specifications) !== null && _e !== void 0 ? _e : productFound.specifications,
                    images: (_f = body.images) !== null && _f !== void 0 ? _f : productFound.images
                }, { new: true });
                if (!productUpdated) {
                    return res.status(404).json({ message: 'Product not found' });
                }
                return res.status(200).json(productUpdated.toJSON());
            }
            catch (error) {
                return res.status(500).json({ message: 'Error updating product' });
            }
        });
    }
    static favorite(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const authUser = jwt_1.JwtService.getUserFromRequest(req);
            if (!authUser) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
            try {
                const userFound = yield user_model_1.User.findById(authUser._id).select('-password');
                if (!userFound) {
                    return res.status(404).json({ message: 'User not found' });
                }
                const productExists = yield product_model_1.Product.findById(id);
                if (!productExists) {
                    return res.status(404).json({ message: 'Product not found' });
                }
                const isFavorite = userFound.favoriteProducts.includes(id);
                if (isFavorite) {
                    userFound.favoriteProducts = userFound.favoriteProducts.filter(p => p.toString() !== id);
                }
                else {
                    userFound.favoriteProducts.push(id);
                }
                const updatedUser = yield user_model_1.User.findByIdAndUpdate(userFound._id, { favoriteProducts: userFound.favoriteProducts }, { new: true })
                    .select('-password')
                    .populate('favoriteProducts');
                if (!updatedUser) {
                    return res.status(500).json({ message: 'Error updating favorite products' });
                }
                return res.status(200).json(updatedUser);
            }
            catch (error) {
                return res.status(500).json({ message: 'Error updating favorite products' });
            }
        });
    }
    static delete(req, res) {
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
                const isAdmin = yield utils_1.UtilsService.isUserAdmin(userFound._id);
                if (!isAdmin) {
                    return res.status(401).json({ message: 'Unauthorized' });
                }
                const productDeleted = yield product_model_1.Product.findByIdAndDelete(req.params.id);
                if (!productDeleted) {
                    return res.status(404).json({ message: 'Product not found' });
                }
                return res.status(200).json();
            }
            catch (error) {
                return res.status(500).json({ message: 'Error deleting product' });
            }
        });
    }
}
exports.ProductController = ProductController;
