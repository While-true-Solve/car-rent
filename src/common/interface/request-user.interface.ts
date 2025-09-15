import { Request } from 'express';
import { UserRole } from '../enum/user-enum';

export interface IUserRequest extends Request {
    user: {
        id: string;
        role: UserRole.USER;
        [key: string]: any; // agar boshqa fieldlar bo‘lsa
    };
}