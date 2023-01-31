"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ParameterController_1 = require("../controllers/ParameterController");
const Router = express_1.Router();
const { getParameter, createParameter, updateParameter, deleteParameter, restoreParameter } = ParameterController_1.useParameterController();
Router.get('/parameter', getParameter);
Router.post('/parameter', createParameter);
Router.put('/parameter', updateParameter);
Router.delete('/parameter', deleteParameter);
Router.put('/parameter/restore', restoreParameter);
exports.default = Router;
//# sourceMappingURL=ParameterRouter.js.map