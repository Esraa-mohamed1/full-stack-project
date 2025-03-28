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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const utils_1 = require("../lib/utils");
const jwt_1 = require("../lib/jwt");
const user_model_1 = require("../models/user.model");
const role_model_1 = require("../models/role.model");
class UserController {
    static findAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const authUser = jwt_1.JwtService.getUserFromRequest(req);
            if (!authUser) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
            try {
                const isAdmin = yield utils_1.UtilsService.isUserAdmin(authUser._id);
                if (!isAdmin) {
                    return res.status(401).json({ message: 'Unauthorized' });
                }
                const users = yield user_model_1.User.find().select('-password').populate('role');
                return res.status(200).json(users);
            }
            catch (error) {
                return res.status(500).json({ message: 'Error fetching users' });
            }
        });
    }
    static findOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const authUser = jwt_1.JwtService.getUserFromRequest(req);
            try {
                const userFound = yield user_model_1.User.findById(id)
                    .select('-password')
                    .populate('favoriteProducts')
                    .populate('role');
                if (!userFound) {
                    return res.status(404).json({ message: 'User not found' });
                }
                const isAdmin = yield utils_1.UtilsService.isUserAdmin(userFound._id);
                if (!isAdmin && (!authUser || authUser._id.toString() !== id)) {
                    return res.status(401).json({ message: 'Unauthorized' });
                }
                return res.status(200).json(userFound);
            }
            catch (error) {
                return res.status(500).json({ message: 'Error getting user' });
            }
        });
    }
    static create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            const authUser = jwt_1.JwtService.getUserFromRequest(req);
            const errors = {};
            if (!authUser) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
            try {
                const isAdmin = yield utils_1.UtilsService.isUserAdmin(authUser._id);
                if (!isAdmin) {
                    return res.status(401).json({ message: 'Unauthorized' });
                }
            }
            catch (error) {
                return res.status(500).json({ message: 'Error creating user' });
            }
            if (!body.firstName || body.firstName.length < 3) {
                errors.firstName = 'First name must be at least 3 characters';
            }
            if (!body.lastName || body.lastName.length < 3) {
                errors.lastName = 'Last name must be at least 3 characters';
            }
            if (!body.address || body.address.length < 3) {
                errors.address = 'Address must be at least 3 characters';
            }
            if (!body.password || body.password.length < 6) {
                errors.password = 'Password must be at least 6 characters';
            }
            if (!utils_1.UtilsService.isEmail(body.email)) {
                errors.email = 'Email format is invalid';
            }
            if (Object.keys(errors).length > 0) {
                return res.status(400).json({ errors });
            }
            try {
                body.password = yield utils_1.UtilsService.hashPassword(body.password);
                const newUser = yield user_model_1.User.create(Object.assign(Object.assign({}, body), { favoriteProducts: [] }));
                const _a = (yield newUser.populate('role')).toJSON(), { password } = _a, user = __rest(_a, ["password"]);
                return res.status(201).json(user);
            }
            catch (error) {
                return res.status(500).json({ message: 'Error creating user' });
            }
        });
    }
    static update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e;
            const id = req.params.id;
            const body = req.body;
            const authUser = jwt_1.JwtService.getUserFromRequest(req);
            if (!authUser) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
            try {
                const userFound = yield user_model_1.User.findOne({ _id: id });
                if (!userFound) {
                    return res.status(404).json({ message: 'User not found' });
                }
                const isAdmin = yield utils_1.UtilsService.isUserAdmin(userFound._id);
                if (!isAdmin && authUser._id.toString() !== id) {
                    return res.status(401).json({ message: 'Unauthorized' });
                }
                if (body.password) {
                    body.password = yield utils_1.UtilsService.hashPassword(body.password);
                }
                if (isAdmin && body.role) {
                    const roleExists = yield role_model_1.Role.findOne({ _id: body.role });
                    if (!roleExists) {
                        return res.status(404).json({ message: 'Role not found' });
                    }
                }
                const updatedUser = yield user_model_1.User.findByIdAndUpdate(userFound._id, {
                    firstName: (_a = body.firstName) !== null && _a !== void 0 ? _a : userFound.firstName,
                    lastName: (_b = body.lastName) !== null && _b !== void 0 ? _b : userFound.lastName,
                    email: (_c = body.email) !== null && _c !== void 0 ? _c : userFound.email,
                    password: (_d = body.password) !== null && _d !== void 0 ? _d : userFound.password,
                    address: (_e = body.address) !== null && _e !== void 0 ? _e : userFound.address,
                    role: isAdmin && body.role ? body.role : userFound.role
                }, { new: true }).select('-password').populate('role');
                if (!updatedUser) {
                    return res.status(500).json({ message: 'Error updating user' });
                }
                const user = updatedUser.toJSON();
                const token = jwt_1.JwtService.createToken(user);
                return res.status(200).json({ user, token });
            }
            catch (error) {
                console.log('Error:', error);
                return res.status(500).json({ message: 'Error updating user' });
            }
        });
    }
    static delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const authUser = jwt_1.JwtService.getUserFromRequest(req);
            if (!authUser) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
            try {
                const userFound = yield user_model_1.User.findById(id).select('-password');
                if (!userFound) {
                    return res.status(404).json({ message: 'User not found' });
                }
                const isAdmin = yield utils_1.UtilsService.isUserAdmin(userFound._id);
                if (!isAdmin && authUser._id.toString() !== id) {
                    return res.status(401).json({ message: 'Unauthorized' });
                }
                const deletedUser = yield user_model_1.User.findByIdAndDelete(userFound._id);
                if (!deletedUser) {
                    return res.status(500).json({ message: 'Error deleting user' });
                }
                return res.status(200).json({ message: 'User deleted' });
            }
            catch (error) {
                return res.status(500).json({ message: 'Error deleting user' });
            }
        });
    }
}
exports.UserController = UserController;
