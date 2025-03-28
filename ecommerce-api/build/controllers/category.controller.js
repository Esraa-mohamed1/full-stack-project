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
exports.CategoryController = void 0;
const category_nodel_1 = require("../models/category.nodel");
class CategoryController {
    static findAll(_, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return res.status(200).json(yield category_nodel_1.Category.find());
            }
            catch (error) {
                return res.status(500).json({ message: 'Error getting categories' });
            }
        });
    }
}
exports.CategoryController = CategoryController;
