"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const InvoiceController_1 = require("../controllers/InvoiceController");
const Router = express_1.Router();
const { getAllInvoice, getInvoice, createInvoice, updateInvoice, deleteInvoice, getInvoicePending, createInvoicePending, updateInvoicePending, deleteInvoicePending, approvalInvoicePending, restoreInvoice } = InvoiceController_1.useInvoiceController();
Router.get('/invoiceall', getAllInvoice);
Router.get('/invoice', getInvoice);
Router.post('/invoice', createInvoice);
Router.put('/invoice', updateInvoice);
Router.delete('/invoice', deleteInvoice);
Router.get('/invoice/request', getInvoicePending);
Router.post('/invoice/request', createInvoicePending);
Router.put('/invoice/request', updateInvoicePending);
Router.delete('/invoice/request', deleteInvoicePending);
Router.put('/invoice/approval', approvalInvoicePending);
Router.put('/invoice/restore', restoreInvoice);
exports.default = Router;
//# sourceMappingURL=InvoiceRouter.js.map