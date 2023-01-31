// // Author: JPG
// // Date: March 4, 2021
// // Desc: CREATED FOR AnnouncementManagement Services

// import { HttpResponseType, HTTP_RESPONSES } from '../constant/HttpConstant';
// import { useItemDao } from '../dao/ItemDao';
// import { HeadersRouteInterface } from '../interfaces/routes/HttpRoutesInterface';
// import { ItemRouteCreateInterface, ItemRouteInterface, ItemRouteUpdateInterface, ItemRouteUpdateStatusInterface } from '../interfaces/routes/ItemRouteInterface';
// import {
//     useItemOptionsTransformPayload,
//     useItemStatusTransformUpdatePayload,
//     useItemTransformCreatePayload,
//     useItemTransformPayload,
//     useItemTransformRestorePayload,
//     useItemTransformUpdatePayload
// } from '../transformers/ItemTransformer';
// import { useTransformPaginationPayload } from '../transformers/Pagination';

// const {
//     getItem: getItemDao,
//     getItemOptions: getItemOptionsDao,
//     createItem: createItemDao,
//     updateItem: updateItemDao,
//     updateItemStatus: updateItemStatusDao,
//     deleteItem: deleteItemDao,
//     restoreItem: restoreItemDao,
//     getItemByCategory: getItemByCategoryDao
// } = useItemDao();

// export const useItemService = () => {
//     const getItem = async (request: ItemRouteInterface, headers: HeadersRouteInterface) => {
//         try {
//             const transformedPagination = useTransformPaginationPayload(headers);
//             const payload = useItemTransformPayload(request);
//             return await getItemDao(payload, transformedPagination, headers);
//         } catch (err) {
//             console.log('Error Service: getBankDao -> ', err);
//             return HTTP_RESPONSES[HttpResponseType.ServerError];
//         }
//     };

//     const getItemOptions = async (request: ItemRouteInterface, headers: HeadersRouteInterface) => {
//         try {
//             const transformedPagination = useTransformPaginationPayload(headers);
//             const payload = useItemOptionsTransformPayload(request);
//             return await getItemOptionsDao(payload, transformedPagination, headers);
//         } catch (err) {
//             console.log('Error Service: getBankDao -> ', err);
//             return HTTP_RESPONSES[HttpResponseType.ServerError];
//         }
//     };

//     const createItem = async (request: ItemRouteCreateInterface) => {
//         try {
//             const payload = useItemTransformCreatePayload(request);
//             return await createItemDao(payload);
//         } catch (err) {
//             console.log('Error Service: createItemDao -> ', err);
//             return HTTP_RESPONSES[HttpResponseType.ServerError];
//         }
//     };

//     const updateItem = async (request: ItemRouteUpdateInterface) => {
//         try {
//             const payload = useItemTransformUpdatePayload(request);
//             return await updateItemDao(request.id, payload);
//         } catch (err) {
//             console.log('Error Service: updateItem -> ', err);
//             return HTTP_RESPONSES[HttpResponseType.ServerError];
//         }
//     };

//     const updateItemStatus = async (request: ItemRouteUpdateStatusInterface) => {
//         try {
//             const payload = useItemStatusTransformUpdatePayload(request);
//             return await updateItemStatusDao(payload);
//         } catch (err) {
//             console.log('Error Service: updateItemStatus -> ', err);
//             return HTTP_RESPONSES[HttpResponseType.ServerError];
//         }
//     };

//     const deleteItem = async (id: string[]) => {
//         try {
//             //const payload = useItemTransformDeletePayload(id);
//             return await deleteItemDao(id);
//         } catch (err) {
//             console.log('Error Service: deleteItemDao -> ', err);
//             return HTTP_RESPONSES[HttpResponseType.ServerError];
//         }
//     };

//     const restoreItem = async (id: string) => {
//         try {
//             const payload = useItemTransformRestorePayload();
//             return await restoreItemDao(id, payload);
//         } catch (err) {
//             console.log('Error Service: restoreBank -> ', err);
//             return HTTP_RESPONSES[HttpResponseType.ServerError];
//         }
//     };

//     const getItemByCategory = async (request: ItemRouteInterface, headers: HeadersRouteInterface) => {
//         try {
//             const transformedPagination = useTransformPaginationPayload(headers);
//             const payload = useItemTransformPayload(request);
//             return await getItemByCategoryDao(payload, transformedPagination, headers);
//         } catch (err) {
//             console.log('Error Service: getItemByCategoryDao -> ', err);
//             return HTTP_RESPONSES[HttpResponseType.ServerError];
//         }
//     };

//     return {
//         getItem,
//         getItemOptions,
//         createItem,
//         updateItem,
//         updateItemStatus,
//         deleteItem,
//         restoreItem,
//         getItemByCategory
//     };
// };
