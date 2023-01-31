"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AreaController_1 = require("../controllers/AreaController");
const Router = express_1.Router();
const { getAllArea, getArea, createArea, updateArea, deleteArea, restoreArea } = AreaController_1.useAreaController();
Router.get('/areaall', getAllArea);
Router.get('/area', getArea);
Router.post('/area', createArea);
Router.put('/area', updateArea);
Router.delete('/area', deleteArea);
Router.put('/area/restore', restoreArea);
exports.default = Router;
//# sourceMappingURL=AreaRouter.js.map