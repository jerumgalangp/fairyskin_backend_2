import { Router as useRouter } from 'express';
import { usePaymentController } from '../controllers/PaymentController';

const Router: useRouter = useRouter();
const { getPayment, getPaymentHistory, createPayment, updatePayment, deletePayment, deletePaymentHistory, restorePayment } = usePaymentController();

Router.get('/payment', getPayment);
Router.get('/payment/history', getPaymentHistory);
Router.post('/payment', createPayment);
Router.put('/payment', updatePayment);
Router.delete('/payment', deletePayment);
Router.delete('/payment/history', deletePaymentHistory);
Router.put('/payment/restore', restorePayment);

export default Router;
