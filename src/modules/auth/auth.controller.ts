import { Body, Controller, Get, HttpCode, Post, Query, UsePipes, ValidationPipe, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login';
import { InviteDto } from './dto/invite';
import { RegisterDto } from './dto/register';
import { LogoutDto } from './dto/logout';
import { ForgotPasswordDto } from './dto/forgot-password';
import { ResetPasswordDto } from './dto/reset-password';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) {}

    @Post('/login')
    login(@Body() body: LoginDto) {
        return this.authService.login(body);
    }

    @Post('/invite')
    invite(@Body() body: InviteDto) {
        return this.authService.inviteUser(body);
    }

    @Post('/register')
    register(@Body() body: RegisterDto) {
        return this.authService.register(body);
    }

    @Post('/logout')
    logout(@Body() body: LogoutDto) {
        return this.authService.logout(body);
    }

    @Post('/forgot-password')
    forgotPassword(@Body() body: ForgotPasswordDto) {
        return this.authService.forgotPassword(body);
    }

    @Post('/reset-password')
    resetPassword(@Body() body: ResetPasswordDto) {
        return this.authService.resetPassword(body);
    }

    @Post('/refresh')
    refresh(@Body() body: RefreshTokenDto) {
        return this.authService.refreshToken(body.refreshToken);
    }

    @Get('/invitations')
    @ApiOkResponse({
        description: 'Lista de invitaciones',
        schema: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    id: { type: 'string', example: 'uuid' },
                    email: { type: 'string', example: 'cliente@email.com' },
                    name: { type: 'string', example: 'Juan Perez' },
                    phone: { type: 'string', example: '+5491122334455' },
                    is_new: { type: 'string', example: 'true' },
                    role: { type: 'string', example: 'user' },
                    createdAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
                    expiresAt: { type: 'string', example: '2024-01-02T00:00:00.000Z' },
                    used: { type: 'boolean', example: false },
                    token: { type: 'string', example: 'token-unico' },
                },
            },
        },
    })
    getAllInvitations() {
        return this.authService.getAllInvitations();
    }

    @Get('/invitations/:id')
    @ApiOkResponse({
        description: 'Invitación por ID',
        schema: {
            type: 'object',
            properties: {
                id: { type: 'string', example: 'uuid' },
                email: { type: 'string', example: 'cliente@email.com' },
                name: { type: 'string', example: 'Juan Perez' },
                phone: { type: 'string', example: '+5491122334455' },
                is_new: { type: 'string', example: 'true' },
                role: { type: 'string', example: 'user' },
                createdAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
                expiresAt: { type: 'string', example: '2024-01-02T00:00:00.000Z' },
                used: { type: 'boolean', example: false },
                token: { type: 'string', example: 'token-unico' },
            },
        },
    })
    getInvitationById(@Param('id') id: string) {
        return this.authService.getInvitationById(id);
    }
}
