import { PaginationDaoInterface } from 'source/interfaces/dao/PaginationDaoInterface';
import { UserDaoCreateInterface, UserDaoDeleteInterface, UserDaoResetPasswordInterface, UserDaoUpdateInterface } from 'source/interfaces/dao/UserDaoInterface';
import { HeadersRouteInterface } from 'source/interfaces/routes/HttpRoutesInterface';
import { getManager, getRepository, InsertResult } from 'typeorm';
import Logger from '../common/logger/winston.logger';
import { useHash } from '../constant/encryption';
import { HttpResponseType, HTTP_RESPONSES } from '../constant/HttpConstant';
import { UserEntity } from '../entities/UserEntities';
import { ORM_DB_SCHEMA } from './../config/ormconfig';
import { Entities } from './../constant/Entities';
import { AccessEntity } from './../entities/AccessEntities';
import { CustomerEntity } from './../entities/CustomerEntities';
import { MenuEntity } from './../entities/MenuEntities';
import { RoleEntity } from './../entities/RoleEntities';
import { useSchemaAndTableName } from './../util/Schema';

export const useUserDao = () => {
    const getUser = async (payload: { [column: string]: any }[], pagination: PaginationDaoInterface, headers: HeadersRouteInterface) => {
        try {
            let defaultSort = 'created_at';
            if (headers.sort_by !== undefined) defaultSort = headers.sort_by;

            if (!defaultSort.includes('.')) {
                defaultSort = Entities.USER + '.' + defaultSort;
            }

            let query = getRepository(UserEntity).createQueryBuilder(Entities.USER).leftJoinAndSelect(`${Entities.USER}.role`, 'role');

            if (headers.filters !== undefined && headers.filters?.length > 0) {
                let filters = JSON.parse(headers.filters);

                filters.map((v: any) => {
                    if (v.id.includes('.')) {
                        let f = v.id.split('.');
                        query = query.andWhere(`UPPER(${f[0]}.${f[1]}) Like '%${v.value.toUpperCase()}%' `);
                    } else {
                        query = query.andWhere(`UPPER(${Entities.USER}.${v.id}) Like '%${v.value.toUpperCase()}%' `);
                    }
                });
            }

            if (payload.length > 0) {
                let p = payload[0];

                // console.log('-----------------------');
                // console.log(p);
                // console.log('-----------------------');
                if (p.type && p.type.value === '%notin%') {
                    query = query.andWhere(`${Entities.USER}.id NOT IN (SELECT user_id FROM ${ORM_DB_SCHEMA}.${Entities.CUSTOMER})`);
                } else if (p.id && p.id !== undefined) {
                    query = query.andWhere(`${Entities.USER}.id NOT IN ('${p.id}') AND role.recipient = 'Y' `);
                }

                // if (payload.length > 0) {
                //     if (payload[0].all_available && payload[0].all_available !== undefined) {
                //         where = `(customer_status = '' OR customer_status is null OR Upper(customer_status) like '%DELIVER%')`;
                //     } else if (payload[0].id && payload[0].id !== undefined) {
                //         where = `user_id not in ('${payload[0].id}')`;
                //     }
                // }
            }

            const count = await query.getCount();

            query
                .skip(pagination.skip)
                .take(pagination.take)
                .orderBy(defaultSort, headers.sort ? (headers.sort === 'DESC' ? 'DESC' : 'ASC') : 'DESC');
            const results = await query.getMany();

            //const results = await UserEntity.find(queries);
            const total = count; //results.length; //await UserEntity.count(queries);
            let pageCount = Math.ceil(total / pagination.take) || 1;

            return {
                ...HTTP_RESPONSES[HttpResponseType.Success],
                message: 'Successfully Retrieved data.',
                results,
                pagination: { total, current: pagination.current, pageCount }
            };
        } catch (err) {
            Logger.error('Error Dao: Query for getUserDao Transaction -> ', err);
            return {
                ...HTTP_RESPONSES[HttpResponseType.BadRequest],
                message: err.message
            };
        }
    };

    const getUserByID = async (payload: { [column: string]: any }[]) => {
        try {
            // let query = getRepository(UserEntity).createQueryBuilder(Entities.USER).leftJoinAndSelect(`${Entities.USER}.role`, 'role');

            // query.getMany();

            let permission: any = await getManager()
                .createQueryBuilder()
                .select('menu_name', 'menu_name')
                .addSelect('role_name', 'role_name')
                .addSelect('role_description', 'role_description')
                .addSelect(`${Entities.MENU}.menu_route`, 'menu_route')
                .from(useSchemaAndTableName(Entities.USER), Entities.USER)
                .leftJoin(RoleEntity, `${Entities.ROLES}`, `${Entities.ROLES}.id = ${Entities.USER}.role_id`)
                .leftJoin(AccessEntity, `${Entities.ACCESS}`, `${Entities.ACCESS}.role_id = ${Entities.ROLES}.id`)
                .leftJoin(MenuEntity, `${Entities.MENU}`, `${Entities.ACCESS}.menu_id = ${Entities.MENU}.id`)
                .where(`${Entities.USER}.id = '${payload[0].id}'`)
                .andWhere(`${Entities.ACCESS}.status = 'Y'`)
                .orderBy(`${Entities.MENU}.order`)
                .getRawMany();

            const results = await getRepository(UserEntity)
                .createQueryBuilder(Entities.USER)
                .leftJoinAndSelect('tbl_users.role', `${Entities.ROLES}`)
                //.leftJoinAndMapMany(`${Entities.ROLES}.access`, AccessEntity, `${Entities.ACCESS}`, `${Entities.ACCESS}.role_id = ${Entities.ROLES}.id`)
                .where(`tbl_users.id = '${payload[0].id}'`)
                .getMany();

            // const UserRepository = getRepository(UserEntity);
            // const results = await UserRepository.findOne(id);
            return {
                ...HTTP_RESPONSES[HttpResponseType.Success],
                message: 'Successfully Retrieved data.',
                results,
                permission
            };
        } catch (err) {
            Logger.error('Error Dao: Query for getUserDao Transaction -> ', err);
            return {
                ...HTTP_RESPONSES[HttpResponseType.BadRequest],
                message: 'Transaction could not proceed!'
            };
        }
    };

    const createUser = async (payload: UserDaoCreateInterface) => {
        try {
            const userExist = await getRepository(UserEntity).createQueryBuilder(Entities.USER).where(`UPPER(username) = UPPER('${payload.username}')`).getMany();

            if (userExist.length > 0) {
                return {
                    ...HTTP_RESPONSES[HttpResponseType.BadRequest],
                    message: `User ${payload.username.toUpperCase()} already exist!`
                };
            }

            let newpass = await useHash(payload.password);
            payload.password = newpass;
            const query = getRepository(UserEntity).createQueryBuilder(Entities.USER).insert().into(UserEntity).values(payload);
            const data: InsertResult = await query.execute();
            const { id } = data.identifiers[0];
            return { ...HTTP_RESPONSES[HttpResponseType.Created], id, message: 'Successfully created.' };
        } catch (err) {
            Logger.error('Error Dao: Create User Transaction -> ', err);
            return {
                ...HTTP_RESPONSES[HttpResponseType.BadRequest],
                message: err.message
            };
        }
    };

    const updateUser = async (id: string, payload: UserDaoUpdateInterface) => {
        try {
            const query = getRepository(UserEntity).createQueryBuilder(Entities.USER).update(UserEntity).set(payload).where('id = :id', { id });
            await query.execute();
            return { ...HTTP_RESPONSES[HttpResponseType.Updated], message: 'Successfully updated.' };
        } catch (err) {
            Logger.error('Error Dao: update User -> ', err);
            return { ...HTTP_RESPONSES[HttpResponseType.BadRequest], message: err.message };
        }
    };

    const resetUserPassword = async (id: string, payload: UserDaoResetPasswordInterface) => {
        try {
            let newpass = await useHash(payload.password);
            payload.password = newpass;
            const query = getRepository(UserEntity).createQueryBuilder(Entities.USER).update(UserEntity).set(payload).where('id = :id', { id });
            await query.execute();
            return { ...HTTP_RESPONSES[HttpResponseType.Reset], message: 'Password succesfully updated.' };
        } catch (err) {
            Logger.error('Error Dao: update User -> ', err);
            return { ...HTTP_RESPONSES[HttpResponseType.BadRequest], message: err.message };
        }
    };

    const deleteUser = async (id: string, payload: UserDaoDeleteInterface) => {
        try {
            const customerExist = await getRepository(CustomerEntity).createQueryBuilder(Entities.CUSTOMER).where(`user_id = :id`, { id }).getMany();
            if (customerExist.length > 0) {
                return {
                    ...HTTP_RESPONSES[HttpResponseType.BadRequest],
                    message: `User is already used and cannot be deleted!`
                };
            }

            await getRepository(UserEntity).createQueryBuilder(Entities.USER).update(UserEntity).set(payload).where('id = :id', { id }).execute();
            await getRepository(UserEntity).delete({ id });
            return { ...HTTP_RESPONSES[HttpResponseType.Deleted], message: 'Successfully deleted.' };
        } catch (err) {
            Logger.error('Error Dao: delete User -> ', err);
            return { ...HTTP_RESPONSES[HttpResponseType.BadRequest], message: err.message };
        }
    };

    return {
        getUser,
        getUserByID,
        createUser,
        updateUser,
        resetUserPassword,
        deleteUser
    };
};
