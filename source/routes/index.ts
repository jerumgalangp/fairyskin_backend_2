import { Router } from 'express';
import AreaRouter from './AreaRouter';
import CustomerRouter from './CustomerRouter';
import DashboardRouter from './DashboardRouter';
import InvoiceRouter from './InvoiceRouter';
import MenuRouter from './MenuRouter';
import OrderRouter from './OrderRouter';
import ParameterRouter from './ParameterRouter';
import PaymentRouter from './PaymentRouter';
import ProductRouter from './ProductRouter';
import ReportRouter from './ReportRouter';
import RoleRouter from './RoleRouter';
import TrackingRouter from './TrackingRouter';
import UserAuthenticateRouter from './UserAuthenticateRouter';
import UserRouter from './UserRouter';
const useCreateRoute = (path: string, router: Router) => {
    return { path, router };
};

export const appRouter = {
    customer: useCreateRoute(`/${process.env.APP_NAME}/api`, CustomerRouter),
    order: useCreateRoute(`/${process.env.APP_NAME}/api`, OrderRouter),
    payment: useCreateRoute(`/${process.env.APP_NAME}/api`, PaymentRouter),
    user_table: useCreateRoute(`/${process.env.APP_NAME}/api`, UserRouter),
    parameter: useCreateRoute(`/${process.env.APP_NAME}/api`, ParameterRouter),
    user: useCreateRoute(`/${process.env.APP_NAME}/authenticate`, UserAuthenticateRouter),
    dashboard: useCreateRoute(`/${process.env.APP_NAME}/api`, DashboardRouter),
    role: useCreateRoute(`/${process.env.APP_NAME}/api`, RoleRouter),
    menu: useCreateRoute(`/${process.env.APP_NAME}/api`, MenuRouter),
    products: useCreateRoute(`/${process.env.APP_NAME}/api`, ProductRouter),
    invoice: useCreateRoute(`/${process.env.APP_NAME}/api`, InvoiceRouter),
    tracking: useCreateRoute(`/${process.env.APP_NAME}/api`, TrackingRouter),
    area: useCreateRoute(`/${process.env.APP_NAME}/api`, AreaRouter),
    report: useCreateRoute(`/${process.env.APP_NAME}/api`, ReportRouter)
};
