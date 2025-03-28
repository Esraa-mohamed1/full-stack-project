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
exports.AuthController = void 0;
const utils_1 = require("../lib/utils");
const jwt_1 = require("../lib/jwt");
const user_model_1 = require("../models/user.model");
const role_model_1 = require("../models/role.model");
class AuthController {
    static login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            if (!utils_1.UtilsService.isEmail(body.email)) {
                return res.status(400).json({ message: 'Email format is invalid' });
            }
            try {
                const userFound = yield user_model_1.User.findOne({ email: body.email }).populate('role');
                if (!userFound) {
                    return res.status(404).json({ message: 'User not found' });
                }
                const passwordMatch = yield utils_1.UtilsService.comparePasswords(body.password, userFound.password);
                if (!passwordMatch) {
                    return res.status(401).json({ message: 'Invalid credentials' });
                }
                const _a = userFound.toJSON(), { password } = _a, user = __rest(_a, ["password"]);
                const token = jwt_1.JwtService.createToken(user);
                return res.status(200).json({ token });
            }
            catch (error) {
                return res.status(500).json({ message: 'Error logging in' });
            }
        });
    }
    static register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            const errors = {};
            if (!body.firstName || body.firstName.length < 3) {
                errors.firstName = 'First name must be at least 3 characters';
            }
            if (!body.lastName || body.lastName.length < 3) {
                errors.lastName = 'Last name must be at least 3 characters';
            }
            if (!body.password || body.password.length < 6) {
                errors.password = 'Password must be at least 6 characters';
            }
            if (!body.address || body.address.length < 3) {
                errors.address = 'Address must be at least 3 characters';
            }
            if (!utils_1.UtilsService.isEmail(body.email)) {
                errors.email = 'Email format is invalid';
            }
            if (Object.keys(errors).length > 0) {
                return res.status(400).json({ errors });
            }
            body.password = yield utils_1.UtilsService.hashPassword(body.password);
            const userRole = yield role_model_1.Role.findOne({ name: 'user' });
            if (!userRole) {
                return res.status(500).json({ message: 'Er' });
            }
            try {
                const newUser = yield user_model_1.User.create(Object.assign(Object.assign({}, body), { role: userRole._id }));
                const _a = (yield newUser.populate('role')).toJSON(), { password } = _a, user = __rest(_a, ["password"]);
                return res.status(201).json(user);
            }
            catch (error) {
                return res.status(500).json({ message: 'Error registering user' });
            }
        });
    }
    static profile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const authUser = jwt_1.JwtService.getUserFromRequest(req);
            if (!authUser) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
            try {
                const user = yield user_model_1.User.findById(authUser._id)
                    .select('-password')
                    .populate('favoriteProducts')
                    .populate('role');
                if (!user) {
                    return res.status(404).json({ message: 'User not found' });
                }
                return res.status(200).json(user.toJSON());
            }
            catch (error) {
                return res.status(500).json({ message: 'Error getting user profile' });
            }
        });
    }
}
exports.AuthController = AuthController;
