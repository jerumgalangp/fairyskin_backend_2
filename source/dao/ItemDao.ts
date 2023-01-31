// import { ItemDaoCreateInterface, ItemDaoInterface, ItemDaoRestoreInterface, ItemDaoUpdateInterface, ItemDaoUpdateStatusInterface } from 'source/interfaces/dao/ItemDaoInterface';
// import { FindManyOptions, getManager, getRepository, InsertResult } from 'typeorm';
// import { HttpResponseType, HTTP_RESPONSES } from '../constant/HttpConstant';
// import { PaginationDaoInterface } from '../interfaces/dao/PaginationDaoInterface';
// import { useConnectionManager } from '../util/ConnectionManager';
// import { useSchemaAndTableName } from '../util/Schema';
// import { Entities } from './../constant/Entities';
// import { ItemEntity } from './../entities/Items';
// import { HeadersRouteInterface } from './../interfaces/routes/HttpRoutesInterface';

// export const useItemDao = () => {
//     const getItem = async (payload: { [column: string]: any }[], pagination: PaginationDaoInterface, headers: HeadersRouteInterface) => {
//         try {
//             let queries: FindManyOptions<ItemEntity> = {
//                 withDeleted: headers.withdeleted === 'true',
//                 order: { deleted_at: 'DESC', created_at: headers.sort ? (headers.sort.toUpperCase() === 'ASC' ? 'ASC' : 'DESC') : 'ASC' },
//                 relations: ['item_category', 'item_status'],
//                 skip: pagination.skip,
//                 take: pagination.take
//             };

//             if (payload.length > 0) queries = { ...queries, where: payload };

//             const results = await ItemEntity.find(queries);
//             const total = await ItemEntity.count(queries);

//             return {
//                 ...HTTP_RESPONSES[HttpResponseType.Success],
//                 message: 'Successfully Retrieved data.',
//                 results,
//                 pagination: { total, current: pagination.current }
//             };
//         } catch (err) {
//             console.log('Error Dao: Query for getItemDao Transaction -> ', err);
//             return {
//                 ...HTTP_RESPONSES[HttpResponseType.BadRequest],
//                 message: err.message
//             };
//         }
//     };

//     const getItemOptions = async (payload: ItemDaoInterface, _pagination: PaginationDaoInterface, _headers: HeadersRouteInterface) => {
//         try {
//             const itemsTable = useSchemaAndTableName(Entities.ITEMS);

//             let whereClause = '';
//             let buyer_id = payload.buyer_id as string;

//             if (payload && buyer_id && buyer_id.length > 0) {
//                 whereClause = `	OR buyer_id = '` + `${payload.buyer_id}` + `'`;
//             }
//             const { queryResults: results } = await useConnectionManager({
//                 query:
//                     `
//                         SELECT * FROM
//                         ` +
//                     `${itemsTable}` +
//                     `
//                         WHERE BUYER_ID is NULL
//                     ` +
//                     `${whereClause}` +
//                     `
//                      `,
//                 parameters: []
//             });
//             return {
//                 ...HTTP_RESPONSES[HttpResponseType.Success],
//                 message: 'Successfully Retrieved data.',
//                 results
//             };
//         } catch (err) {
//             console.log('Error Dao: Query for getItemDao Transaction -> ', err);
//             return {
//                 ...HTTP_RESPONSES[HttpResponseType.BadRequest],
//                 message: err.message
//             };
//         }
//     };

//     const createItem = async (payload: ItemDaoCreateInterface) => {
//         try {
//             const query = getRepository(ItemEntity).createQueryBuilder(Entities.ITEMS).insert().into(ItemEntity).values(payload);
//             const data: InsertResult = await query.execute();
//             const { id } = data.identifiers[0];
//             return { ...HTTP_RESPONSES[HttpResponseType.Created], id, message: 'Successfully created.' };
//         } catch (err) {
//             console.log('Error Dao: Create Item Transaction -> ', err);
//             return {
//                 ...HTTP_RESPONSES[HttpResponseType.BadRequest],
//                 message: err.message
//             };
//         }
//     };

//     const updateItem = async (id: string, payload: ItemDaoUpdateInterface) => {
//         try {
//             console.log(payload);
//             const query = getRepository(ItemEntity).createQueryBuilder(Entities.ITEMS).update(ItemEntity).set(payload).where('id = :id', { id });
//             await query.execute();
//             return { ...HTTP_RESPONSES[HttpResponseType.Updated], message: 'Successfully updated.' };
//         } catch (err) {
//             console.log('Error Dao: update Item -> ', err);
//             return { ...HTTP_RESPONSES[HttpResponseType.BadRequest], message: err.message };
//         }
//     };

//     const updateItemStatus = async (payload: ItemDaoUpdateStatusInterface) => {
//         try {
//             console.log('=========================');
//             console.log(payload);
//             console.log('=========================');
//             const transaction = await getManager().transaction(async (transactionEntityManager) => {
//                 try {
//                     payload.id.map(async (ids: string) => {
//                         await transactionEntityManager
//                             .getRepository(ItemEntity)
//                             .createQueryBuilder(Entities.ITEMS)
//                             .update(ItemEntity)
//                             .set({
//                                 item_status_id: payload.status
//                             })
//                             .where('id = :id', { id: ids })
//                             .execute();
//                     });
//                     return true;
//                 } catch (err) {
//                     console.log('Error Dao: update item status Transaction -> ', err);
//                     return false;
//                 }
//             });

//             if (transaction) {
//                 return { ...HTTP_RESPONSES[HttpResponseType.Updated], message: 'Successfully updated the status of items.' };
//             } else {
//                 console.log('Error Dao: update Buyer -> ');
//                 return { ...HTTP_RESPONSES[HttpResponseType.BadRequest], message: 'Error Updating Item Status' };
//             }
//             // const query = getRepository(BuyerEntity).createQueryBuilder(Entities.BUYER).update(BuyerEntity).set(payload).where('id = :id', { id });
//             // await query.execute();
//             // return { ...HTTP_RESPONSES[HttpResponseType.Updated], message: 'Successfully updated.' };
//             //return { ...HTTP_RESPONSES[HttpResponseType.BadRequest], message: 'err.message' };
//         } catch (err) {
//             console.log('Error Dao: update Buyer -> ', err);
//             return { ...HTTP_RESPONSES[HttpResponseType.BadRequest], message: err.message };
//         }
//     };

//     const deleteItem = async (id: string[]) => {
//         try {
//             id.map(async (i: string) => {
//                 await getRepository(ItemEntity).delete({ id: i });
//             });

//             return { ...HTTP_RESPONSES[HttpResponseType.Deleted], message: 'Successfully deleted.' };
//         } catch (err) {
//             console.log('Error Dao: delete Item -> ', err);
//             return { ...HTTP_RESPONSES[HttpResponseType.BadRequest], message: err.message };
//         }
//     };

//     const restoreItem = async (id: string, payload: ItemDaoRestoreInterface) => {
//         try {
//             await getRepository(ItemEntity)
//                 .createQueryBuilder(Entities.ITEMS)
//                 .update(ItemEntity)
//                 .set({ ...payload, updated_at: new Date() })
//                 .where('id = :id', { id })
//                 .execute();
//             await getRepository(ItemEntity).restore({ id });
//             return { ...HTTP_RESPONSES[HttpResponseType.Restored], message: 'Successfully restored.' };
//         } catch (err) {
//             console.log('Error Dao: restoreBank -> ', err);
//             return { ...HTTP_RESPONSES[HttpResponseType.BadRequest], message: err.message };
//         }
//     };

//     const getItemByCategory = async (_payload: { [column: string]: any }[], pagination: PaginationDaoInterface, _headers: HeadersRouteInterface) => {
//         try {
//             const limit = pagination.take;
//             const offset = pagination.skip;
//             let paging = 'ORDER BY 2 DESC';

//             if (limit && limit !== undefined) paging = `ORDER BY 2 DESC LIMIT ` + `${limit}` + ` OFFSET ` + `${offset}` + ``;

//             const itemsTable = useSchemaAndTableName(Entities.ITEMS);
//             const itemCatTable = useSchemaAndTableName(Entities.ITEM_CATEGORY);

//             const { queryResults: results } = await useConnectionManager({
//                 query:
//                     `
//                     SELECT ITEM_CATEGORY_ID as ID, CATEGORY_NAME, COUNT(*) AS ITEM_COUNTS
//                     FROM
//                     (
//                         select
//                         A.CREATED_AT,
//                         A.ITEM_CATEGORY_ID,
//                         B.CATEGORY_NAME,
//                         B.NO_OF_DEFECTS,
//                         B.ITEM_COUNTS
//                         from
//                             ` +
//                     `${itemsTable}` +
//                     ` A
//                                     left join
//                                         ` +
//                     `${itemCatTable}` +
//                     ` B
//                         on
//                             a.ITEM_CATEGORY_ID = b.id
//                         WHERE
// 	                        A."deleted_at" IS NULL
//                         AND
// 							B.DELETED_AT IS NULL
//                         order by A.CREATED_AT desc
//                     )ITC
//                     GROUP BY ITEM_CATEGORY_ID,CATEGORY_NAME
//                     ` +
//                     `${paging}` +
//                     `
//             `,
//                 parameters: []
//             });

//             const { queryResults: item_by_category_count } = await useConnectionManager({
//                 query:
//                     `
//                     SELECT ITEM_CATEGORY_ID as ID, CATEGORY_NAME
//                     FROM
//                     (
//                         select
//                         A.ITEM_CATEGORY_ID,
//                         B.CATEGORY_NAME,
//                         B.NO_OF_DEFECTS,
//                         B.ITEM_COUNTS
//                         from
//                             ` +
//                     `${itemsTable}` +
//                     ` A
//                                     left join
//                                         ` +
//                     `${itemCatTable}` +
//                     ` B
//                         on
//                             a.ITEM_CATEGORY_ID = b.id
//                         WHERE
// 	                        A."deleted_at" IS NULL
//                         order by A.created_at desc
//                     )ITC
//                      GROUP BY ITEM_CATEGORY_ID,CATEGORY_NAME
//             `,
//                 parameters: []
//             });

//             const total = await item_by_category_count.length;

//             return {
//                 ...HTTP_RESPONSES[HttpResponseType.Success],
//                 message: 'Successfully Retrieved data.',
//                 results,
//                 pagination: { total, current: pagination.current }
//             };
//         } catch (err) {
//             console.log('Error Dao: Query for getItemDao Transaction -> ', err);
//             return {
//                 ...HTTP_RESPONSES[HttpResponseType.BadRequest],
//                 message: err.message
//             };
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
