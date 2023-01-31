// import cors from 'cors';
// import express, { Application, NextFunction, Request, Response } from 'express';
// import http from 'http';
// import Logger from './common/logger/winston.logger';
// import config from './config/config';
// import logging from './config/logging';
// import { connectDB } from './connection';
// //import { HttpResponseType, HTTP_RESPONSES } from "./constant/HttpConstant";
// //import { HttpResponseRouteInterface } from "./interfaces/routes/HttpRoutesInterface";
// import { useEncrypt } from './constant/encryption';
// import { appRouter } from './routes';
// import { useMiddlewares } from './services/Middlewares';

// const NAMESPACE_REQ = 'Server REQUEST';
// const NAMESPACE_RES = 'Server RESPONSE';
// const app: Application = express();

// const { customer, order, payment, user, user_table, dashboard, role, menu, products, invoice, tracking, area, report } = appRouter;
// const { validateSession, validateImage } = useMiddlewares();
// //const { validateImage } = useMiddlewares();

// /** Log the request */
// app.use((req: Request, res: Response, next: NextFunction) => {
//     /** Log the req */
//     logging.info(NAMESPACE_REQ, `METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]- IP: [${process.env.APP_ZONE}]`);

//     res.on('finish', () => {
//         /** Log the res */
//         logging.info(NAMESPACE_RES, `METHOD: [${req.method}] - URL: [${req.url}] - STATUS: [${res.statusCode}] - IP: [${req.socket.remoteAddress}]`);
//     });

//     next();
// });

// /** Parse the body of the request */
// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// /** Rules of our API */
// // app.use((req, res, next) => {
// //     res.header('Access-Control-Allow-Origin', '*');
// //     res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

// //     if (req.method == 'OPTIONS') {
// //         res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
// //         return res.status(200).json({});
// //     }

// //     next();
// // });

// /** Routes go here */

// //app.use(ewt.path, validateSession, ewt.router);
// //app.use(holiday.path, validateSession, holiday.router);

// //app.use(personnel.path, validateSession, personnel.router);
// //app.use(parameter.path, validateSession, parameter.router);
// app.use(user_table.path, validateSession, user_table.router);
// app.use(dashboard.path, validateSession, dashboard.router);

// app.use(customer.path, validateSession, customer.router);
// app.use(order.path, validateSession, order.router);
// app.use(payment.path, validateSession, payment.router);
// app.use(role.path, validateSession, role.router);
// app.use(area.path, validateSession, area.router);
// app.use(menu.path, validateSession, menu.router);
// app.use(products.path, validateSession, products.router);
// app.use(tracking.path, validateSession, tracking.router);
// app.use(invoice.path, validateSession, invoice.router);
// app.use(report.path, validateSession, report.router);
// app.use(user.path, user.router);

// app.use('/fairy_skin/files', validateImage, express.static('./files'));

// /** Error handling */
// // app.use((req:Request, res:Response) => {

// //     logging.info(NAMESPACE_REQ, `METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`);
// //       const response: HttpResponseRouteInterface = HTTP_RESPONSES[HttpResponseType.BadRequest];
// //       res.status(response.statusCode).json(response);
// //     // res.status(404).json({
// //     //     message: error.message
// //     // });
// // });

// /* Temporary Encryptor */
// app.get('/v1/encrypt', (req: Request, res: Response) => {
//     if (!req.body.token) res.status(400).json({ message: 'token is required' });
//     res.status(200).json({ 'X-KeyToken': useEncrypt(req.body.token) });
// });

// /* Index Route */
// app.get('/', (_, res: Response) => {
//     const endpoints = Object.keys(appRouter);
//     const availableEndpoints = endpoints.reduce((accum, route) => (accum += `🚀 - /${process.env.APP_NAME}/api/${route} `), '');
//     res.send(availableEndpoints);
// });

// // const https = require('https');
// // const fs = require('fs');

// // const options = {
// //     key: fs.readFileSync('D:/react/mariz_clozet/backend/.cert/key.pem'),
// //     cert: fs.readFileSync('D:/react/mariz_clozet/backend/.cert/cert.pem')
// // };

// const httpServer = http.createServer(app);

// //const httpServer = http.createServer(app);

// //httpServer.listen(config.server.app_port, () => logging.info(NAMESPACE, `Server is running ${config.server.app_host}:${config.server.app_port}`));
// const server_port = process.env.APP_PORT || process.env.PORT || 2500;

// httpServer.listen(server_port, async () => {
//     await connectDB();

//     Logger.info(`FAIRY SKIN API Server is running in ${config.server.app_host} port:${server_port}`);

//     // logging.info('FAIRY SKIN API', `Server started on port ${server_port}!`);
// });

// module.exports = httpServer;

// // httpServer.listen(config.server.app_port || 3333, () => {
// //     console.log('Server started on port 3333!');
// //   });
