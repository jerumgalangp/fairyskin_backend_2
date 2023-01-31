"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ReportController_1 = require("../controllers/ReportController");
const Router = express_1.Router();
const { getQSPR, getTSPR, getPPR } = ReportController_1.useReportController();
Router.get('/reports/qspr', getQSPR);
Router.get('/reports/tspr', getTSPR);
Router.get('/reports/ppr', getPPR);
exports.default = Router;
//# sourceMappingURL=ReportRouter.js.map