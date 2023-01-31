import { getConnection } from 'typeorm';

interface IConnectionManager {
    query: string;
    parameters?: any[];
}

export const useConnectionManager = async (args?: IConnectionManager) => {
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    const parameters = args ? args.parameters || [] : [];
    const queryResults = args ? (args.query ? await connection.query(args.query, parameters) : '') : '';
    return { queryRunner, queryResults };
};
