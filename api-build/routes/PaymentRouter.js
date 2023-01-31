"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const PaymentController_1 = require("../controllers/PaymentController");
const Router = express_1.Router();
const { getPayment, getPaymentHistory, createPayment, updatePayment, deletePayment, deletePaymentHistory, restorePayment } = PaymentController_1.usePaymentController();
Router.get('/payment', getPayment);
Router.get('/payment/history', getPaymentHistory);
Router.post('/payment', createPayment);
Router.put('/payment', updatePayment);
Router.delete('/payment', deletePayment);
Router.delete('/payment/history', deletePaymentHistory);
Router.put('/payment/restore', restorePayment);
exports.default = Router;
//# sourceMappingURL=PaymentRouter.js.map