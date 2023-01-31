"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UserController_1 = require("../controllers/UserController");
const Router = express_1.Router();
const { getUser, getUserByID, createUser, updateUser, deleteUser, resetUserPassword } = UserController_1.useUserController();
Router.get('/user', getUser);
Router.get('/userID', getUserByID);
Router.post('/user', createUser);
Router.put('/user', updateUser);
Router.put('/user/password', resetUserPassword);
Router.delete('/user', deleteUser);
exports.default = Router;
//# sourceMappingURL=UserRouter.js.map