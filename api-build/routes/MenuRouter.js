"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const MenuController_1 = require("../controllers/MenuController");
const Router = express_1.Router();
const { getAllMenu, getMenu, createMenu, updateMenu, deleteMenu, restoreMenu } = MenuController_1.useMenuController();
Router.get('/menuall', getAllMenu);
Router.get('/menu', getMenu);
Router.post('/menu', createMenu);
Router.put('/menu', updateMenu);
Router.delete('/menu', deleteMenu);
Router.put('/menu/restore', restoreMenu);
exports.default = Router;
//# sourceMappingURL=MenuRouter.js.map