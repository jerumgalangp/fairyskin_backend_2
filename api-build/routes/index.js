"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appRouter = void 0;
const AreaRouter_1 = __importDefault(require("./AreaRouter"));
const CustomerRouter_1 = __importDefault(require("./CustomerRouter"));
const DashboardRouter_1 = __importDefault(require("./DashboardRouter"));
const InvoiceRouter_1 = __importDefault(require("./InvoiceRouter"));
const MenuRouter_1 = __importDefault(require("./MenuRouter"));
const OrderRouter_1 = __importDefault(require("./OrderRouter"));
const ParameterRouter_1 = __importDefault(require("./ParameterRouter"));
const PaymentRouter_1 = __importDefault(require("./PaymentRouter"));
const ProductRouter_1 = __importDefault(require("./ProductRouter"));
const ReportRouter_1 = __importDefault(require("./ReportRouter"));
const RoleRouter_1 = __importDefault(require("./RoleRouter"));
const TrackingRouter_1 = __importDefault(require("./TrackingRouter"));
const UserAuthenticateRouter_1 = __importDefault(require("./UserAuthenticateRouter"));
const UserRouter_1 = __importDefault(require("./UserRouter"));
const useCreateRoute = (path, router) => {
    return { path, router };
};
exports.appRouter = {
    customer: useCreateRoute(`/${process.env.APP_NAME}/api`, CustomerRouter_1.default),
    order: useCreateRoute(`/${process.env.APP_NAME}/api`, OrderRouter_1.default),
    payment: useCreateRoute(`/${process.env.APP_NAME}/api`, PaymentRouter_1.default),
    user_table: useCreateRoute(`/${process.env.APP_NAME}/api`, UserRouter_1.default),
    parameter: useCreateRoute(`/${process.env.APP_NAME}/api`, ParameterRouter_1.default),
    user: useCreateRoute(`/${process.env.APP_NAME}/authenticate`, UserAuthenticateRouter_1.default),
    dashboard: useCreateRoute(`/${process.env.APP_NAME}/api`, DashboardRouter_1.default),
    role: useCreateRoute(`/${process.env.APP_NAME}/api`, RoleRouter_1.default),
    menu: useCreateRoute(`/${process.env.APP_NAME}/api`, MenuRouter_1.default),
    products: useCreateRoute(`/${process.env.APP_NAME}/api`, ProductRouter_1.default),
    invoice: useCreateRoute(`/${process.env.APP_NAME}/api`, InvoiceRouter_1.default),
    tracking: useCreateRoute(`/${process.env.APP_NAME}/api`, TrackingRouter_1.default),
    area: useCreateRoute(`/${process.env.APP_NAME}/api`, AreaRouter_1.default),
    report: useCreateRoute(`/${process.env.APP_NAME}/api`, ReportRouter_1.default)
};
//# sourceMappingURL=index.js.map