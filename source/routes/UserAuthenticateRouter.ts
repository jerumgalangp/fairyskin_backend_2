import { Router as useRouter } from 'express';
import { useUserSessionController } from '../controllers/UserAuthenticateController';
import { useMiddlewares } from '../services/Middlewares';

const Router: useRouter = useRouter();
const { login, logout } = useUserSessionController();

const { validateAuthentication } = useMiddlewares();
Router.post('/login', validateAuthentication, login);
Router.delete('/logout', logout);

export default Router;
