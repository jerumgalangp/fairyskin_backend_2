import { Router as useRouter } from 'express';
import { useMenuController } from '../controllers/MenuController';

const Router: useRouter = useRouter();
const { getAllMenu, getMenu, createMenu, updateMenu, deleteMenu, restoreMenu } = useMenuController();

Router.get('/menuall', getAllMenu);
Router.get('/menu', getMenu);
Router.post('/menu', createMenu);
Router.put('/menu', updateMenu);
Router.delete('/menu', deleteMenu);
Router.put('/menu/restore', restoreMenu);

export default Router;
