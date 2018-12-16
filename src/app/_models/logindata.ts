import { User } from './user';

export class LoginData {
    sessionExpiry: string;
    sessionId: string;
    user: User;
    requestId: string;
    responseCode: string;
    responseDescription: string;
}
