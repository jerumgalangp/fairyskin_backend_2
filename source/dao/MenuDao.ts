import { MenuDaoCreateInterface, MenuDaoDeleteInterface, MenuDaoRestoreInterface, MenuDaoUpdateInterface } from 'source/interfaces/dao/MenuDaoInterface';
import { getManager, getRepository, InsertResult } from 'typeorm';
import { HttpResponseType, HTTP_RESPONSES } from '../constant/HttpConstant';
import { PaginationDaoInterface } from '../interfaces/dao/PaginationDaoInterface';
import { Entities } from './../constant/Entities';
import { AccessEntity } from './../entities/AccessEntities';
import { MenuEntity } from './../entities/MenuEntities';
import { HeadersRouteInterface } from './../interfaces/routes/HttpRoutesInterface';
import { MenuRouteInterface } from './../interfaces/routes/MenuRouteInterface';
import { useConnectionManager } from './../util/ConnectionManager';
import { useSchemaAndTableName } from './../util/Schema';

export const useMenuDao = () => {
    const getAllMenu = async (_payload: { [column: string]: any }[], pagination: PaginationDaoInterface, headers: HeadersRouteInterface) => {
        try {
            let defaultSort = 'created_at';
            if (headers.sort_by !== undefined) defaultSort = headers.sort_by;

            if (!defaultSort.includes('.')) {
                defaultSort = Entities.MENU + '.' + defaultSort;
            }

            let query = getRepository(MenuEntity).createQueryBuilder(Entities.MENU);

            if (headers.filters !== undefined && headers.filters?.length > 0) {
                let filters = JSON.parse(headers.filters);
                filters.map((v: any) => {
                    if (v.id.includes('.')) {
                        let f = v.id.split('.');
                        query = query.andWhere(`UPPER(${f[0]}.${f[1]}) Like :q`, { q: `%${v.value.toUpperCase()}%` });
                    } else {
                        query = query.andWhere(`UPPER(${Entities.MENU}.${v.id}) Like :q`, { q: `%${v.value.toUpperCase()}%` });
                    }
                });
            }

            const count = await query.getCount();

            query.orderBy(defaultSort, headers.sort ? (headers.sort === 'DESC' ? 'DESC' : 'ASC') : 'DESC');

            const results = await query.getMany();

            //const results = await UserEntity.find(queries);
            const total = count; //await UserEntity.count(queries);

            let pageCount = Math.ceil(total / pagination.take) || 1;

            return {
                ...HTTP_RESPONSES[HttpResponseType.Success],
                message: 'Successfully Retrieved data.',
                results,
                pagination: { total, current: pagination.current, pageCount }
            };
        } catch (err) {
            console.log('Error Dao: Query for getMenuDao Transaction -> ', err);
            return {
                ...HTTP_RESPONSES[HttpResponseType.BadRequest],
                message: err.message
            };
        }
    };
    const getMenu = async (payload: MenuRouteInterface, pagination: PaginationDaoInterface, headers: HeadersRouteInterface) => {
        try {
            let defaultSort = 'order';
            if (headers.sort_by !== undefined) defaultSort = headers.sort_by;

            if (!defaultSort.includes('.')) {
                defaultSort = Entities.MENU + '.' + defaultSort;
            }

            let where = '';
            if (headers.filters !== undefined && headers.filters?.length > 0) {
                let filters = JSON.parse(headers.filters);

                filters.map((v: any) => {
                    let c = Entities.MENU;
                    if (v.id === 'status') {
                        c = Entities.ACCESS;
                    }

                    where = `AND UPPER(${c}.${v.id}) Like UPPER('%${v.value}%')`;
                });
            }

            //const hasAccess = await getRepository(AccessEntity).createQueryBuilder(Entities.ACCESS).where(`role_id = '${payload.role_id}'`).getMany();
            const joinTable = useSchemaAndTableName(Entities.ACCESS);
            const mainTable = useSchemaAndTableName(Entities.MENU);

            // console.log('----------');
            // console.log(payload.role_id);
            // console.log('----------');

            // console.log('headers', where);
            //if (hasAccess.length > 0) {
            let { queryResults: results } = await useConnectionManager({
                query:
                    `
                    SELECT 
                        ${Entities.MENU}.ID, MENU_NAME,   ${Entities.MENU}.ORDER, ${Entities.ACCESS}.STATUS
                    FROM 
                        ` +
                    `${mainTable}` +
                    ` ${Entities.MENU} 
                    LEFT JOIN 
                        ` +
                    `${joinTable}` +
                    ` ${Entities.ACCESS} 
                    ON ${Entities.MENU} .ID = ${Entities.ACCESS}.MENU_ID
                    WHERE 
                    ${Entities.ACCESS}.ROLE_ID  = $1
                    ${where}
                    ORDER BY ${defaultSort} ${headers.sort ? (headers.sort === 'DESC' ? 'DESC' : 'ASC') : 'ASC'} `,
                parameters: [payload.role_id]
            });

            const total = results.length;
            let pageCount = Math.ceil(total / pagination.take) || 1;

            return {
                ...HTTP_RESPONSES[HttpResponseType.Success],
                message: 'Successfully Retrieved data.',
                results,
                pagination: { total, current: pagination.current, pageCount }
            };
        } catch (err) {
            console.log('Error Dao: Query for getMenuDao Transaction -> ', err);
            return {
                ...HTTP_RESPONSES[HttpResponseType.BadRequest],
                message: err.message
            };
        }
    };

    const createMenu = async (payload: MenuDaoCreateInterface) => {
        try {
            const userExist = await getRepository(MenuEntity).createQueryBuilder(Entities.MENU).where(`UPPER(menu_name) = UPPER('${payload.menu_name}')`).getMany();

            if (userExist.length > 0) {
                return {
                    ...HTTP_RESPONSES[HttpResponseType.BadRequest],
                    message: `User ${payload.menu_name.toUpperCase()} already exist!`
                };
            }

            const query = getRepository(MenuEntity).createQueryBuilder(Entities.MENU).insert().into(MenuEntity).values(payload);
            const data: InsertResult = await query.execute();
            const { id } = data.identifiers[0];
            return { ...HTTP_RESPONSES[HttpResponseType.Created], id, message: 'Successfully created.' };
        } catch (err) {
            console.log('Error Dao: Create Menu Transaction -> ', err);
            return {
                ...HTTP_RESPONSES[HttpResponseType.BadRequest],
                message: err.message
            };
        }
    };

    const updateMenu = async (id: string, payload: MenuDaoUpdateInterface) => {
        try {
            const transaction = await getManager().transaction(async (transactionEntityManager) => {
                try {
                    //UPDATE ACCESS RIGHTS

                    payload.menu_name?.map(async (v: any) => {
                        await transactionEntityManager
                            .getRepository(AccessEntity)
                            .createQueryBuilder(Entities.ACCESS)
                            .update(AccessEntity)
                            .set({
                                status: v.status,
                                updated_by: payload.updated_by,
                                updated_at: new Date()
                            })
                            .where('role_id = :role_id', { role_id: id })
                            .andWhere('menu_id = :menu_id', { menu_id: v.id })
                            .execute();
                    });

                    return true;
                } catch (err) {
                    console.log('Error Dao: Deleting ewt Dao Transaction -> ', err);
                    return false;
                }
            });

            if (transaction) {
                return { ...HTTP_RESPONSES[HttpResponseType.Updated], message: 'Successfully updated.' };
            } else {
                console.log('Error Dao: Create Role Transaction -> ', 'Error Creating Role!');
                return {
                    ...HTTP_RESPONSES[HttpResponseType.BadRequest],
                    message: 'Error Creating Role!'
                };
            }
        } catch (err) {
            console.log('Error Dao: update Menu -> ', err);
            return { ...HTTP_RESPONSES[HttpResponseType.BadRequest], message: err.message };
        }
    };

    const deleteMenu = async (id: string, payload: MenuDaoDeleteInterface) => {
        try {
            await getRepository(MenuEntity).createQueryBuilder(Entities.MENU).update(MenuEntity).set(payload).where('id = :id', { id }).execute();
            await getRepository(MenuEntity).delete({ id });
            return { ...HTTP_RESPONSES[HttpResponseType.Deleted], message: 'Successfully deleted.' };
        } catch (err) {
            console.log('Error Dao: delete Menu -> ', err);
            return { ...HTTP_RESPONSES[HttpResponseType.BadRequest], message: err.message };
        }
    };

    const restoreMenu = async (id: string, payload: MenuDaoRestoreInterface) => {
        try {
            await getRepository(MenuEntity)
                .createQueryBuilder(Entities.MENU)
                .update(MenuEntity)
                .set({ ...payload, updated_at: new Date() })
                .where('id = :id', { id })
                .execute();
            await getRepository(MenuEntity).restore({ id });
            return { ...HTTP_RESPONSES[HttpResponseType.Restored], message: 'Successfully restored.' };
        } catch (err) {
            console.log('Error Dao: restoreMenu -> ', err);
            return { ...HTTP_RESPONSES[HttpResponseType.BadRequest], message: err.message };
        }
    };

    // const getMenuReport = async (request: MenuRouteInterface) => {
    //     try {
    //         let df_value = request!.df as string;
    //         let dt_value = request!.dt as string;

    //         let df_date: any = moment(new Date(df_value)).format('DD/MM/yyyy');
    //         let dt_date: any = moment(new Date(dt_value)).add(1, 'day').format('DD/MM/yyyy');

    //         let queries: FindManyOptions<MenuEntity> = {
    //             relations: ['personnel_Menu'],
    //             where: { created_at: Between(df_date, dt_date) },
    //             order: { created_at: 'ASC' }
    //         };

    //         const results = await MenuEntity.find(queries);

    //         return {
    //             ...HTTP_RESPONSES[HttpResponseType.Success],
    //             message: 'Successfully Retrieved data.',
    //             results
    //         };
    //     } catch (err) {
    //         console.log('Error Dao: Query for getMenuReport Transaction -> ', err);
    //         return {
    //             ...HTTP_RESPONSES[HttpResponseType.BadRequest],
    //             message: err.message
    //         };
    //     }
    // };

    return {
        getAllMenu,
        getMenu,
        createMenu,
        updateMenu,
        deleteMenu,
        restoreMenu
        //getMenuReport
    };
};
