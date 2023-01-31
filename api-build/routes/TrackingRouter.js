"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const TrackingController_1 = require("../controllers/TrackingController");
const Router = express_1.Router();
const { getOrdersForTracking, getTracking, getOrderDistributed, createTracking, updateTracking, deleteTracking, restoreTracking } = TrackingController_1.useTrackingController();
Router.get('/orders-tracking', getOrdersForTracking);
Router.get('/tracking', getTracking);
Router.get('/orders-distributed', getOrderDistributed);
Router.post('/tracking', createTracking);
Router.put('/tracking', updateTracking);
Router.delete('/tracking', deleteTracking);
Router.put('/tracking/restore', restoreTracking);
exports.default = Router;
//# sourceMappingURL=TrackingRouter.js.map