import { Router as useRouter } from 'express';
import { useParameterController } from '../controllers/ParameterController';

const Router: useRouter = useRouter();
const { getParameter, createParameter, updateParameter, deleteParameter, restoreParameter } = useParameterController();

Router.get('/parameter', getParameter);
Router.post('/parameter', createParameter);
Router.put('/parameter', updateParameter);
Router.delete('/parameter', deleteParameter);
Router.put('/parameter/restore', restoreParameter);

export default Router;
