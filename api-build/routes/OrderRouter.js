"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const upload_1 = __importDefault(require("../config/upload"));
const OrderController_1 = require("../controllers/OrderController");
const upload = multer_1.default(upload_1.default);
const Router = express_1.Router();
const { getOrder, getOrderDelivery, getOrderDeliveryPending, getOrderProduct, getOrderDeliveredProduct, getOrderDeliveryProduct, createOrder, createOrderFile, updateOrder, updateOrderDeliveryPending, approvalOrderDeliveryPending, updateOrderFile, deleteOrder, restoreOrder } = OrderController_1.useOrderController();
Router.get('/order', getOrder);
Router.get('/order/delivery', getOrderDelivery);
Router.get('/order/delivery-product', getOrderDeliveredProduct);
Router.get('/order-product', getOrderProduct);
Router.post('/order', createOrder);
Router.put('/order', updateOrder);
Router.delete('/order', deleteOrder);
Router.put('/order/restore', restoreOrder);
Router.get('/order/delivery/request', getOrderDeliveryPending);
Router.put('/order/delivery/request', updateOrderDeliveryPending);
Router.put('/order/delivery/approval', approvalOrderDeliveryPending);
Router.get('/order/delivery/order-product', getOrderDeliveryProduct);
Router.post('/order/file', upload.single('order_filename'), createOrderFile);
Router.put('/order/file', upload.single('order_filename'), updateOrderFile);
exports.default = Router;
//# sourceMappingURL=OrderRouter.js.map