import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) {}

    @Post('/login')
    login(@Body() body: { email: string, password: string }) {
        return this.authService.login(body.email, body.password);
    }

    @Post('/invite')
    invite(@Body() body: { email: string, name: string, phone: string, is_new: string }) {
        return this.authService.inviteUser(body.email, body.name, body.phone, body.is_new);
    }

    @Post('/register')
    register(@Body() body: { email: string, password: string, name: string, phone: string, is_new: string }) {
        return this.authService.register(body.email, body.password, body.name, body.phone, body.is_new);
    }

    @Post('/logout')
    logout(@Body() body: { email: string }) {
        return this.authService.logout(body.email);
    }

    @Post('/forgot-password')
    forgotPassword(@Body() body: { email: string }) {
        return this.authService.forgotPassword(body.email);
    }

    @Post('/reset-password')
    resetPassword(@Body() body: { email: string, password: string }) {
        return this.authService.resetPassword(body.email, body.password);
    }

    
}
