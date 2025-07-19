import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
    login(email: string, password: string) {
        return 'login';
    }

    inviteUser(email: string, name: string, phone: string, is_new: string) {
        return 'invite';
    }

    register(email: string, password: string, name: string, phone: string, is_new: string) {
        return 'register';
    }

    logout(email: string) {
        return 'logout';
    }

    forgotPassword(email: string) {
        return 'forgotPassword';
    }

    resetPassword(email: string, password: string) {
        return 'resetPassword';
    }
}
