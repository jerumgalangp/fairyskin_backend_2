// import { Request, Response } from 'express';
// import { HttpResponseType, HTTP_RESPONSES } from '../constant/HttpConstant';
// import { HeadersRouteInterface, HttpResponseRouteInterface } from '../interfaces/routes/HttpRoutesInterface';
// import { ItemRouteCreateInterface, ItemRouteInterface, ItemRouteUpdateInterface, ItemRouteUpdateStatusInterface } from '../interfaces/routes/ItemRouteInterface';
// import { useItemService } from '../services/ItemService';

// const {
//     getItem: getItemService,
//     getItemOptions: getItemOptionsService,
//     createItem: createItemService,
//     updateItem: updateItemService,
//     updateItemStatus: updateItemStatusService,
//     deleteItem: deleteItemService,
//     restoreItem: restoreItemService,
//     getItemByCategory: getItemByCategoryService
// } = useItemService();

// export const useItemController = () => {
//     const getItem = async (req: Request, res: Response) => {
//         try {
//             const request: ItemRouteInterface = req.query;
//             const headers = req.headers as HeadersRouteInterface;
//             const response: HttpResponseRouteInterface = await getItemService(request, headers);
//             res.status(response.statusCode).json(response);
//         } catch (err) {
//             console.log('Error Controller: getItemService -> ', err);
//             const response: HttpResponseRouteInterface = HTTP_RESPONSES[HttpResponseType.ServerError];
//             res.status(response.statusCode).json(response);
//         }
//     };

//     const getItemOptions = async (req: Request, res: Response) => {
//         try {
//             const request: ItemRouteInterface = req.query;
//             const headers = req.headers as HeadersRouteInterface;
//             const response: HttpResponseRouteInterface = await getItemOptionsService(request, headers);
//             res.status(response.statusCode).json(response);
//         } catch (err) {
//             console.log('Error Controller: getItemOptionsService -> ', err);
//             const response: HttpResponseRouteInterface = HTTP_RESPONSES[HttpResponseType.ServerError];
//             res.status(response.statusCode).json(response);
//         }
//     };

//     const createItem = async (req: Request, res: Response) => {
//         try {
//             const request: ItemRouteCreateInterface = req.body;
//             let response: HttpResponseRouteInterface;

//             response = await createItemService(request);
//             res.status(response.statusCode).json(response);
//         } catch (err) {
//             console.log('Error Controller: createItemService -> ', err);
//             const response: HttpResponseRouteInterface = HTTP_RESPONSES[HttpResponseType.ServerError];
//             res.status(response.statusCode).json(response);
//         }
//     };

//     const createItemImage = async (req: Request, res: Response) => {
//         try {
//             const request: ItemRouteCreateInterface = req.body;
//             let response: HttpResponseRouteInterface;
//             const { filename } = req.file;
//             const filepath = req.file.path;
//             request.filename = filename;
//             request.filepath = filepath;
//             response = await createItemService(request);
//             res.status(response.statusCode).json(response);
//         } catch (err) {
//             console.log('Error Controller: createItemService -> ', err);
//             const response: HttpResponseRouteInterface = HTTP_RESPONSES[HttpResponseType.ServerError];
//             res.status(response.statusCode).json(response);
//         }
//     };

//     const updateItem = async (req: Request, res: Response) => {
//         try {
//             const request: ItemRouteUpdateInterface = req.body;
//             let response: HttpResponseRouteInterface;
//             const { filename } = req.file;
//             const filepath = req.file.path;
//             request.filename = filename;
//             console.log(filepath);
//             request.filepath = filepath;
//             response = await updateItemService(request);
//             res.status(response.statusCode).json(response);
//         } catch (err) {
//             console.log('Error Controller: updateItemService -> ', err);
//             const response: HttpResponseRouteInterface = HTTP_RESPONSES[HttpResponseType.ServerError];
//             res.status(response.statusCode).json(response);
//         }
//     };

//     const updateItemStatus = async (req: Request, res: Response) => {
//         try {
//             const request: ItemRouteUpdateStatusInterface = req.body;

//             let response: HttpResponseRouteInterface;

//             response = await updateItemStatusService(request);
//             res.status(response.statusCode).json(response);
//         } catch (err) {
//             console.log('Error Controller: updateItemStatusService -> ', err);
//             const response: HttpResponseRouteInterface = HTTP_RESPONSES[HttpResponseType.ServerError];
//             res.status(response.statusCode).json(response);
//         }
//     };

//     const deleteItem = async (req: Request, res: Response) => {
//         try {
//             const id = req.query.id as string[];
//             let response: HttpResponseRouteInterface;
//             response = await deleteItemService(id);
//             res.status(response.statusCode).json(response);
//         } catch (err) {
//             console.log('Error Controller: deleteItemService -> ', err);
//             const response: HttpResponseRouteInterface = HTTP_RESPONSES[HttpResponseType.ServerError];
//             res.status(response.statusCode).json(response);
//         }
//     };

//     const restoreItem = async (req: Request, res: Response) => {
//         try {
//             const id = req.query.id as string;
//             let response: HttpResponseRouteInterface;

//             response = await restoreItemService(id);
//             res.status(response.statusCode).json(response);
//         } catch (err) {
//             console.log('Error Controller: restoreItemService -> ', err);
//             const response: HttpResponseRouteInterface = HTTP_RESPONSES[HttpResponseType.ServerError];
//             res.status(response.statusCode).json(response);
//         }
//     };

//     const getItemByCategory = async (req: Request, res: Response) => {
//         try {
//             const request: ItemRouteInterface = req.query;
//             const headers = req.headers as HeadersRouteInterface;
//             const response: HttpResponseRouteInterface = await getItemByCategoryService(request, headers);
//             res.status(response.statusCode).json(response);
//         } catch (err) {
//             console.log('Error Controller: getItemByCategoryService -> ', err);
//             const response: HttpResponseRouteInterface = HTTP_RESPONSES[HttpResponseType.ServerError];
//             res.status(response.statusCode).json(response);
//         }
//     };
//     return {
//         getItem,
//         getItemOptions,
//         createItem,
//         createItemImage,
//         updateItem,
//         updateItemStatus,
//         deleteItem,
//         restoreItem,
//         getItemByCategory
//     };
// };
