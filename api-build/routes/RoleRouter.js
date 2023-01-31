"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const RoleController_1 = require("../controllers/RoleController");
const Router = express_1.Router();
const { getAllRole, getRole, createRole, updateRole, deleteRole, restoreRole } = RoleController_1.useRoleController();
Router.get('/roleall', getAllRole);
Router.get('/role', getRole);
Router.post('/role', createRole);
Router.put('/role', updateRole);
Router.delete('/role', deleteRole);
Router.put('/role/restore', restoreRole);
exports.default = Router;
//# sourceMappingURL=RoleRouter.js.map