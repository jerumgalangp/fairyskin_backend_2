import { Router as useRouter } from 'express';
import { useAreaController } from '../controllers/AreaController';

const Router: useRouter = useRouter();
const { getAllArea, getArea, createArea, updateArea, deleteArea, restoreArea } = useAreaController();

Router.get('/areaall', getAllArea);
Router.get('/area', getArea);
Router.post('/area', createArea);
Router.put('/area', updateArea);
Router.delete('/area', deleteArea);
Router.put('/area/restore', restoreArea);

export default Router;
