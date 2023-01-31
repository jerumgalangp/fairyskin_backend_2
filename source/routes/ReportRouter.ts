import { Router as useRouter } from 'express';
import { useReportController } from '../controllers/ReportController';

const Router: useRouter = useRouter();
const { getQSPR, getTSPR, getPPR } = useReportController();

Router.get('/reports/qspr', getQSPR);
Router.get('/reports/tspr', getTSPR);
Router.get('/reports/ppr', getPPR);

export default Router;
