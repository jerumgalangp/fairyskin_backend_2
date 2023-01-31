"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const CustomerController_1 = require("../controllers/CustomerController");
const Router = express_1.Router();
const { getCustomer, createCustomer, updateCustomer, deleteCustomer, restoreCustomer } = CustomerController_1.useCustomerController();
Router.get('/customer', getCustomer);
Router.post('/customer', createCustomer);
Router.put('/customer', updateCustomer);
Router.delete('/customer', deleteCustomer);
Router.put('/customer/restore', restoreCustomer);
exports.default = Router;
//# sourceMappingURL=CustomerRouter.js.map