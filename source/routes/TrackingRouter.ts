import { Router as useRouter } from 'express';
import { useTrackingController } from '../controllers/TrackingController';

const Router: useRouter = useRouter();
const { getOrdersForTracking, getTracking, getOrderDistributed, createTracking, updateTracking, deleteTracking, restoreTracking } = useTrackingController();

Router.get('/orders-tracking', getOrdersForTracking);
Router.get('/tracking', getTracking);
Router.get('/orders-distributed', getOrderDistributed);
Router.post('/tracking', createTracking);
Router.put('/tracking', updateTracking);
Router.delete('/tracking', deleteTracking);
Router.put('/tracking/restore', restoreTracking);

export default Router;
