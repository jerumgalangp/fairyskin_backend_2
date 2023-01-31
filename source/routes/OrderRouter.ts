import { Router as useRouter } from 'express';
import multer from 'multer';
import uploadConfig from '../config/upload';
import { useOrderController } from '../controllers/OrderController';

const upload = multer(uploadConfig);
const Router: useRouter = useRouter();
const {
    getOrder,
    getOrderDelivery,
    getOrderDeliveryPending,
    getOrderProduct,
    getOrderDeliveredProduct,
    getOrderDeliveryProduct,
    createOrder,
    createOrderFile,
    updateOrder,
    updateOrderDeliveryPending,
    approvalOrderDeliveryPending,
    updateOrderFile,
    deleteOrder,
    restoreOrder
} = useOrderController();

Router.get('/order', getOrder);
Router.get('/order/delivery', getOrderDelivery);
Router.get('/order/delivery-product', getOrderDeliveredProduct);
Router.get('/order-product', getOrderProduct);
Router.post('/order', createOrder);
Router.put('/order', updateOrder);
Router.delete('/order', deleteOrder);
Router.put('/order/restore', restoreOrder);

Router.get('/order/delivery/request', getOrderDeliveryPending);
Router.put('/order/delivery/request', updateOrderDeliveryPending);
Router.put('/order/delivery/approval', approvalOrderDeliveryPending);
Router.get('/order/delivery/order-product', getOrderDeliveryProduct);

Router.post('/order/file', upload.single('order_filename'), createOrderFile);

Router.put('/order/file', upload.single('order_filename'), updateOrderFile);

export default Router;
