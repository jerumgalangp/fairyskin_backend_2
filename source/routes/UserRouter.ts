import { Router as useRouter } from 'express';
import { useUserController } from '../controllers/UserController';

const Router: useRouter = useRouter();
const { getUser, getUserByID, createUser, updateUser, deleteUser, resetUserPassword } = useUserController();

Router.get('/user', getUser);
Router.get('/userID', getUserByID);
Router.post('/user', createUser);
Router.put('/user', updateUser);
Router.put('/user/password', resetUserPassword);
Router.delete('/user', deleteUser);

export default Router;
