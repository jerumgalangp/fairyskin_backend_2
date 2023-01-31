import { ORM_DB_SCHEMA } from '../config/config';

export const useSchemaAndTableName = (tableName: string) => `${ORM_DB_SCHEMA}.${tableName}`;
