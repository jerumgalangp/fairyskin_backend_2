import { Router as useRouter } from 'express';
import { useCustomerController } from '../controllers/CustomerController';

const Router: useRouter = useRouter();
const { getCustomer, createCustomer, updateCustomer, deleteCustomer, restoreCustomer } = useCustomerController();

Router.get('/customer', getCustomer);
Router.post('/customer', createCustomer);
Router.put('/customer', updateCustomer);
Router.delete('/customer', deleteCustomer);
Router.put('/customer/restore', restoreCustomer);

export default Router;
