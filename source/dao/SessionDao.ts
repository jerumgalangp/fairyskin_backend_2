import { getRepository } from 'typeorm';
import { ORM_DB_SCHEMA, SESSION_TIMEOUT } from '../config/config';
import { Entities } from '../constant/Entities';
import { SessionEntity } from '../entities/SessionEntites';
import { UserEntity } from '../entities/UserEntities';

export const useSessionDao = () => {
    const getSession = async (userId: string) => {
        try {
            const query = getRepository(SessionEntity)
                .createQueryBuilder(Entities.SESSION)
                .leftJoinAndSelect(`${Entities.SESSION}.user`, 'user')
                .where(`${Entities.SESSION}.user_id = :userId`, { userId })
                .getOne();

            return (await query) || null;
        } catch (err) {
            console.log('Error Dao: getSession -> ', err);
            return null;
        }
    };

    const createSession = async (userId: string) => {
        try {
            await getRepository(SessionEntity).query(
                `INSERT INTO ${ORM_DB_SCHEMA}."${Entities.SESSION}" (expiry_date, user_id) ` + `VALUES ` + `(CURRENT_TIMESTAMP + (${SESSION_TIMEOUT} || ' minutes')::INTERVAL, '${userId}') `
            );
            return true;
        } catch (err) {
            console.log('Error Dao: createDcSession -> ', err);
            return null;
        }
    };

    const extendSession = async (userId: string) => {
        try {
            await getRepository(SessionEntity).query(
                `UPDATE ${ORM_DB_SCHEMA}."${Entities.SESSION}" ` + `SET ` + `expiry_date = CURRENT_TIMESTAMP + (${SESSION_TIMEOUT} || ' minutes')::INTERVAL ` + `WHERE user_id = '${userId}'`
            );
            return true;
        } catch (err) {
            console.log('Error Dao: extendSession -> ', err);
            return false;
        }
    };

    const destroySession = async (userId: string) => {
        try {
            await getRepository(SessionEntity).query(`UPDATE ${ORM_DB_SCHEMA}."${Entities.SESSION}" ` + `SET ` + `expiry_date = NULL ` + `WHERE user_id = '${userId}'`);
            return true;
        } catch (err) {
            console.log('Error Dao: destroySession -> ', err);
            return false;
        }
    };

    const verifySession = async (userId: string) => {
        try {
            const query = getRepository(SessionEntity)
                .createQueryBuilder(Entities.SESSION)
                .select()
                .withDeleted()
                .where(`user_id = :userId ` + `AND ` + `expiry_date IS NOT NULL ` + `AND ` + `expiry_date > CURRENT_TIMESTAMP`, { userId })
                .getMany();
            const results = await query;
            return results.length > 0;
        } catch (err) {
            console.log('Error Dao: verifySession -> ', err);
            return false;
        }
    };

    const loginSession = async (username: string) => {
        try {
            const query = getRepository(UserEntity).createQueryBuilder(Entities.USER).select().where(`username = :username `, { username }).getOne();
            return (await query) || null;
        } catch (err) {
            console.log('Error Dao: loginSession -> ', err);
            return null;
        }
    };

    const checkIfSessionExists = async (userId: string) => {
        try {
            const query = getRepository(SessionEntity).createQueryBuilder(Entities.SESSION).select().where(`user_id = :userId `, { userId }).getMany();
            const results = await query;
            return results.length > 0;
        } catch (err) {
            console.log('Error Dao: checkIfSessionExists -> ', err);
            return false;
        }
    };

    return {
        getSession,
        createSession,
        extendSession,
        destroySession,
        verifySession,
        loginSession,
        checkIfSessionExists
    };
};
