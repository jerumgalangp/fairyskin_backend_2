import { Router as useRouter } from 'express';
import { useRoleController } from '../controllers/RoleController';

const Router: useRouter = useRouter();
const { getAllRole, getRole, createRole, updateRole, deleteRole, restoreRole } = useRoleController();

Router.get('/roleall', getAllRole);
Router.get('/role', getRole);
Router.post('/role', createRole);
Router.put('/role', updateRole);
Router.delete('/role', deleteRole);
Router.put('/role/restore', restoreRole);

export default Router;
