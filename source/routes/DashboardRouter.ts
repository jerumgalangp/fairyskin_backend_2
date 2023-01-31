import { Router as useRouter } from 'express';
import { useDashboardController } from '../controllers/DashboardController';

const Router: useRouter = useRouter();
const { getDashboardSalesPerTransaction } = useDashboardController();

//Router.get('/dashboard/total_counts', getDashboardTotalCount);

Router.get('/dashboard/spt', getDashboardSalesPerTransaction);

export default Router;
