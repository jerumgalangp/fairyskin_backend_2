"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const typeorm_1 = require("typeorm");
const config_1 = __importStar(require("./config/config"));
const logging_1 = __importDefault(require("./config/logging"));
const encryption_1 = require("./constant/encryption");
const routes_1 = require("./routes");
const Middlewares_1 = require("./services/Middlewares");
const NAMESPACE_REQ = 'Server REQUEST';
const NAMESPACE_RES = 'Server RESPONSE';
const app = express_1.default();
const { customer, order, payment, user, user_table, dashboard, role, menu, products, invoice, tracking, area, report } = routes_1.appRouter;
const { validateSession, validateImage } = Middlewares_1.useMiddlewares();
const httpServer = http_1.default.createServer(app);
const configEnv = config_1.APP_ZONE === 'development' ? config_1.ORM_CONFIG : config_1.ORM_CONFIG_PROD;
typeorm_1.createConnection(configEnv)
    .then(() => {
    app.use((req, res, next) => {
        logging_1.default.info(NAMESPACE_REQ, `METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]- IP: [${process.env.APP_ZONE}]`);
        res.on('finish', () => {
            logging_1.default.info(NAMESPACE_RES, `METHOD: [${req.method}] - URL: [${req.url}] - STATUS: [${res.statusCode}] - IP: [${req.socket.remoteAddress}]`);
        });
        next();
    });
    app.use(cors_1.default());
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: true }));
    app.use(user_table.path, validateSession, user_table.router);
    app.use(dashboard.path, validateSession, dashboard.router);
    app.use(customer.path, validateSession, customer.router);
    app.use(order.path, validateSession, order.router);
    app.use(payment.path, validateSession, payment.router);
    app.use(role.path, validateSession, role.router);
    app.use(area.path, validateSession, area.router);
    app.use(menu.path, validateSession, menu.router);
    app.use(products.path, validateSession, products.router);
    app.use(tracking.path, validateSession, tracking.router);
    app.use(invoice.path, validateSession, invoice.router);
    app.use(report.path, validateSession, report.router);
    app.use(user.path, user.router);
    app.use('/fairy_skin/files', validateImage, express_1.default.static('./files'));
    app.get('/v1/encrypt', (req, res) => {
        if (!req.body.token)
            res.status(400).json({ message: 'token is required' });
        res.status(200).json({ 'X-KeyToken': encryption_1.useEncrypt(req.body.token) });
    });
    app.get('/', (_, res) => {
        const endpoints = Object.keys(routes_1.appRouter);
        const availableEndpoints = endpoints.reduce((accum, route) => (accum += `🚀 - /${process.env.APP_NAME}/api/${route} `), '');
        res.send(availableEndpoints);
    });
    const server_port = process.env.APP_PORT || process.env.PORT || 2500;
    httpServer.listen(server_port, () => __awaiter(void 0, void 0, void 0, function* () {
        console.log(`FAIRY SKIN API Server is running in ${config_1.default.server.app_host} port:${server_port}`);
    }));
    module.exports = httpServer;
})
    .catch((error) => console.log(error));
//# sourceMappingURL=server.js.map