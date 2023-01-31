import { SessionEntity } from '../../entities/SessionEntites';

declare global {
    namespace Express {
        export interface Request {
            token: string | null;
            userId: string | null;
            userName: string;
            userTable: string;
            session: SessionEntity | null;
        }
    }
}
