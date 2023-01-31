"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ProductController_1 = require("../controllers/ProductController");
const Router = express_1.Router();
const { getAllProduct, getProduct, createProduct, updateProduct, deleteProduct, getProductPending, createProductPending, updateProductPending, deleteProductPending, approvalProductPending, restoreProduct } = ProductController_1.useProductController();
Router.get('/productall', getAllProduct);
Router.get('/product', getProduct);
Router.post('/product', createProduct);
Router.put('/product', updateProduct);
Router.delete('/product', deleteProduct);
Router.get('/product/request', getProductPending);
Router.post('/product/request', createProductPending);
Router.put('/product/request', updateProductPending);
Router.delete('/product/request', deleteProductPending);
Router.put('/product/approval', approvalProductPending);
Router.put('/product/restore', restoreProduct);
exports.default = Router;
//# sourceMappingURL=ProductRouter.js.map