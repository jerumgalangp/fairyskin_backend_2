import { RoleDaoCreateInterface, RoleDaoDeleteInterface, RoleDaoRestoreInterface, RoleDaoUpdateInterface } from 'source/interfaces/dao/RoleDaoInterface';
import { getManager, getRepository, InsertResult } from 'typeorm';
import { HttpResponseType, HTTP_RESPONSES } from '../constant/HttpConstant';
import { PaginationDaoInterface } from '../interfaces/dao/PaginationDaoInterface';
import { Entities } from './../constant/Entities';
import { AccessEntity } from './../entities/AccessEntities';
import { MenuEntity } from './../entities/MenuEntities';
import { RoleEntity } from './../entities/RoleEntities';
import { UserEntity } from './../entities/UserEntities';
import { HeadersRouteInterface } from './../interfaces/routes/HttpRoutesInterface';

export const useRoleDao = () => {
    const getAllRole = async (_payload: { [column: string]: any }[], pagination: PaginationDaoInterface, headers: HeadersRouteInterface) => {
        try {
            let defaultSort = 'created_at';
            if (headers.sort_by !== undefined) defaultSort = headers.sort_by;

            if (!defaultSort.includes('.')) {
                defaultSort = Entities.ROLES + '.' + defaultSort;
            }

            let query = getRepository(RoleEntity).createQueryBuilder(Entities.ROLES);

            if (headers.filters !== undefined && headers.filters?.length > 0) {
                let filters = JSON.parse(headers.filters);
                filters.map((v: any) => {
                    if (v.id.includes('.')) {
                        let f = v.id.split('.');
                        query = query.andWhere(`UPPER(${f[0]}.${f[1]}) Like :q`, { q: `%${v.value.toUpperCase()}%` });
                    } else {
                        query = query.andWhere(`UPPER(${Entities.ROLES}.${v.id}) Like :q`, { q: `%${v.value.toUpperCase()}%` });
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
            console.log('Error Dao: Query for getRoleDao Transaction -> ', err);
            return {
                ...HTTP_RESPONSES[HttpResponseType.BadRequest],
                message: err.message
            };
        }
    };
    const getRole = async (_payload: { [column: string]: any }[], pagination: PaginationDaoInterface, headers: HeadersRouteInterface) => {
        try {
            let defaultSort = 'created_at';
            if (headers.sort_by !== undefined) defaultSort = headers.sort_by;

            if (!defaultSort.includes('.')) {
                defaultSort = Entities.ROLES + '.' + defaultSort;
            }

            let query = getRepository(RoleEntity).createQueryBuilder(Entities.ROLES);

            if (headers.filters !== undefined && headers.filters?.length > 0) {
                let filters = JSON.parse(headers.filters);

                filters.map((v: any) => {
                    if (v.id.includes('.')) {
                        let f = v.id.split('.');
                        query = query.andWhere(`UPPER(${f[0]}.${f[1]}) Like '%${v.value.toUpperCase()}%' `);
                    } else {
                        query = query.andWhere(`UPPER(${Entities.ROLES}.${v.id}) Like '%${v.value.toUpperCase()}%' `);
                    }
                });
            }
            const count = await query.getCount();

            query
                .skip(pagination.skip)
                .take(pagination.take)
                .orderBy(defaultSort, headers.sort ? (headers.sort === 'DESC' ? 'DESC' : 'ASC') : 'DESC');

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
            console.log('Error Dao: Query for getRoleDao Transaction -> ', err);
            return {
                ...HTTP_RESPONSES[HttpResponseType.BadRequest],
                message: err.message
            };
        }
    };

    const createRole = async (payload: RoleDaoCreateInterface) => {
        try {
            let role_id: any;
            const userExist = await getRepository(RoleEntity).createQueryBuilder(Entities.ROLES).where(`UPPER(role_name) = UPPER('${payload.role_name}')`).getMany();

            if (userExist.length > 0) {
                return {
                    ...HTTP_RESPONSES[HttpResponseType.BadRequest],
                    message: `User ${payload.role_name.toUpperCase()} already exist!`
                };
            }

            const transaction = await getManager().transaction(async (transactionEntityManager) => {
                try {
                    //INSERT
                    const data: InsertResult = await transactionEntityManager.getRepository(RoleEntity).createQueryBuilder(Entities.ROLES).insert().into(RoleEntity).values(payload).execute();

                    let { id } = data.identifiers[0];

                    role_id = id;

                    let menu_id = await transactionEntityManager.getRepository(MenuEntity).createQueryBuilder(Entities.MENU).select('id').execute();

                    menu_id.map(async (id: MenuEntity) => {
                        await transactionEntityManager
                            .getRepository(AccessEntity)
                            .createQueryBuilder(Entities.ACCESS)
                            .insert()
                            .into(AccessEntity)
                            .values({ role_id: role_id, menu_id: id.id, status: 'N' })
                            .execute();
                    });

                    return true;
                } catch (err) {
                    console.log('Error Dao: Deleting ewt Dao Transaction -> ', err);
                    return false;
                }
            });

            if (transaction) {
                return { ...HTTP_RESPONSES[HttpResponseType.Created], role_id, message: 'Successfully created.' };
            } else {
                console.log('Error Dao: Create Role Transaction -> ', 'Error Creating Role!');
                return {
                    ...HTTP_RESPONSES[HttpResponseType.BadRequest],
                    message: 'Error Creating Role!'
                };
            }
        } catch (err) {
            console.log('Error Dao: Create Role Transaction -> ', err);
            return {
                ...HTTP_RESPONSES[HttpResponseType.BadRequest],
                message: err.message
            };
        }
    };

    const updateRole = async (id: string, payload: RoleDaoUpdateInterface) => {
        try {
            const query = getRepository(RoleEntity).createQueryBuilder(Entities.ROLES).update(RoleEntity).set(payload).where('id = :id', { id });
            await query.execute();
            return { ...HTTP_RESPONSES[HttpResponseType.Updated], message: 'Successfully updated.' };
        } catch (err) {
            console.log('Error Dao: update Role -> ', err);
            return { ...HTTP_RESPONSES[HttpResponseType.BadRequest], message: err.message };
        }
    };

    const deleteRole = async (id: string, _payload: RoleDaoDeleteInterface) => {
        try {
            //await getRepository(RoleEntity).createQueryBuilder(Entities.ROLES).update(RoleEntity).set(payload).where('id = :id', { id }).execute();
            const userExist = await getRepository(UserEntity).createQueryBuilder(Entities.USER).where({ role_id: id }).getMany();

            if (userExist.length > 0) {
                return {
                    ...HTTP_RESPONSES[HttpResponseType.BadRequest],
                    message: `Role is already used and cannot be deleted!`
                };
            }

            const transaction = await getManager().transaction(async (transactionEntityManager) => {
                try {
                    await transactionEntityManager.getRepository(AccessEntity).createQueryBuilder(Entities.ACCESS).delete().where({ role_id: id }).execute();
                    await transactionEntityManager.getRepository(RoleEntity).delete({ id });

                    return true;
                } catch (err) {
                    console.log('Error Dao: Deleting ewt Dao Transaction -> ', err);
                    return false;
                }
            });

            if (transaction) {
                return { ...HTTP_RESPONSES[HttpResponseType.Deleted], message: 'Successfully deleted.' };
            } else {
                console.log('Error Dao: Deleting Role Transaction -> ', 'Error Deleting Role!');
                return {
                    ...HTTP_RESPONSES[HttpResponseType.BadRequest],
                    message: 'Error Deleting Role!'
                };
            }
        } catch (err) {
            console.log('Error Dao: delete Role -> ', err);
            return { ...HTTP_RESPONSES[HttpResponseType.BadRequest], message: err.message };
        }
    };

    const restoreRole = async (id: string, payload: RoleDaoRestoreInterface) => {
        try {
            await getRepository(RoleEntity)
                .createQueryBuilder(Entities.ROLES)
                .update(RoleEntity)
                .set({ ...payload, updated_at: new Date() })
                .where('id = :id', { id })
                .execute();
            await getRepository(RoleEntity).restore({ id });
            return { ...HTTP_RESPONSES[HttpResponseType.Restored], message: 'Successfully restored.' };
        } catch (err) {
            console.log('Error Dao: restoreRole -> ', err);
            return { ...HTTP_RESPONSES[HttpResponseType.BadRequest], message: err.message };
        }
    };

    // const getRoleReport = async (request: RoleRouteInterface) => {
    //     try {
    //         let df_value = request!.df as string;
    //         let dt_value = request!.dt as string;

    //         let df_date: any = moment(new Date(df_value)).format('DD/MM/yyyy');
    //         let dt_date: any = moment(new Date(dt_value)).add(1, 'day').format('DD/MM/yyyy');

    //         let queries: FindManyOptions<RoleEntity> = {
    //             relations: ['personnel_Role'],
    //             where: { created_at: Between(df_date, dt_date) },
    //             order: { created_at: 'ASC' }
    //         };

    //         const results = await RoleEntity.find(queries);

    //         return {
    //             ...HTTP_RESPONSES[HttpResponseType.Success],
    //             message: 'Successfully Retrieved data.',
    //             results
    //         };
    //     } catch (err) {
    //         console.log('Error Dao: Query for getRoleReport Transaction -> ', err);
    //         return {
    //             ...HTTP_RESPONSES[HttpResponseType.BadRequest],
    //             message: err.message
    //         };
    //     }
    // };

    return {
        getAllRole,
        getRole,
        createRole,
        updateRole,
        deleteRole,
        restoreRole
        //getRoleReport
    };
};
