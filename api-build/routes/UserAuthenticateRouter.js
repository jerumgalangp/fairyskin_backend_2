"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UserAuthenticateController_1 = require("../controllers/UserAuthenticateController");
const Middlewares_1 = require("../services/Middlewares");
const Router = express_1.Router();
const { login, logout } = UserAuthenticateController_1.useUserSessionController();
const { validateAuthentication } = Middlewares_1.useMiddlewares();
Router.post('/login', validateAuthentication, login);
Router.delete('/logout', logout);
exports.default = Router;
//# sourceMappingURL=UserAuthenticateRouter.js.map