"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
mongoose_1.default.connect('mongodb+srv://admin:admin@cluster0.0k7ap.mongodb.net/ecommerce-admin')
    .then(() => console.log('Successfully connected to the database'))
    .catch(err => console.error('Error connecting to the database: ', err));
