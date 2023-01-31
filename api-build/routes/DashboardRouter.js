"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const DashboardController_1 = require("../controllers/DashboardController");
const Router = express_1.Router();
const { getDashboardSalesPerTransaction } = DashboardController_1.useDashboardController();
Router.get('/dashboard/spt', getDashboardSalesPerTransaction);
exports.default = Router;
//# sourceMappingURL=DashboardRouter.js.map