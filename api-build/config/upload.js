"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const uploadConfig = {
    storage: multer_1.default.diskStorage({
        destination: function (_req, _file, callback) {
            var fs = require('fs');
            var dir = './files/';
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
            }
            callback(null, dir);
        },
        filename: (req, file, callback) => {
            const filenameParts = file.originalname.split('.');
            const ext = filenameParts.pop();
            let order_reference_number = req.body.order_reference_number.trim();
            let basename = filenameParts.join('.');
            basename = basename.replace(/\s/g, '_');
            console.log('---------------MULTER CONFIG--------------------------------------');
            console.log('order_reference_number', order_reference_number);
            console.log('basename', basename);
            console.log('ext', ext);
            console.log('---------------------MULTER CONFIG---------------------------------');
            callback(null, order_reference_number + '.' + ext);
        }
    })
};
exports.default = uploadConfig;
//# sourceMappingURL=upload.js.map