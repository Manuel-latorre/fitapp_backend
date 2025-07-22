import { Injectable, BadRequestException } from '@nestjs/common';
import { InviteDto } from './dto/invite';
import { LoginDto } from './dto/login';
import { RegisterDto } from './dto/register';
import { LogoutDto } from './dto/logout';
import { ForgotPasswordDto } from './dto/forgot-password';
import { ResetPasswordDto } from './dto/reset-password';
import { PrismaService } from 'src/prisma.service';
import { randomBytes, pbkdf2Sync } from 'crypto';
import { Resend } from 'resend';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {

    constructor(private prisma: PrismaService, private jwtService: JwtService) {}

    async login(login: LoginDto) {
        // 1. Buscar usuario por email
        const user = await this.prisma.user.findUnique({
            where: { email: login.email },
        });
        if (!user) {
            throw new BadRequestException('Credenciales inválidas.');
        }

        // 2. Validar contraseña
        const valid = await bcrypt.compare(login.password, user.password);
        if (!valid) {
            throw new BadRequestException('Credenciales inválidas.');
        }

        // 3. Generar access y refresh tokens
        const payload = { sub: user.id, email: user.email, role: user.role };
        const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
        const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

        // 4. Guardar el refresh token en la base de datos
        await this.prisma.refreshToken.create({
            data: {
                token: refreshToken,
                userId: user.id,
                createdAt: new Date(),
                expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 días
                revoked: false,
            },
        });

        // 5. Retornar usuario y tokens
        return {
            message: 'Login exitoso.',
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                phone: user.phone,
                profile_picture: user.profile_picture,
                role: user.role,
            },
            accessToken,
            refreshToken,
        };
    }

    async inviteUser(invite: InviteDto) {
        // 1. Validar que el email no esté registrado como usuario
        const existingUser = await this.prisma.user.findUnique({
            where: { email: invite.email },
        });
        if (existingUser) {
            throw new BadRequestException('El email ya está registrado como usuario.');
        }

        // 2. Crear un token único y expiración (ej: 48h)
        const token = randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 48); // 48 horas

        // 3. Crear la invitación en la base de datos (ahora con token)
        const invitation = await this.prisma.invitation.create({
            data: {
                email: invite.email,
                name: invite.name,
                phone: invite.phone,
                is_new: invite.is_new ?? 'true',
                role: invite.role ?? 'user',
                createdAt: new Date(),
                expiresAt,
                used: false,
                token,
            },
        });

        // 4. Generar el magic link (ajusta la URL base según tu frontend)
        const magicLink = `https://tu-frontend.com/registro?token=${token}&email=${encodeURIComponent(invite.email)}&name=${encodeURIComponent(invite.name)}&phone=${encodeURIComponent(invite.phone)}&isNew=${invite.is_new ?? 'true'}`;

        // 5. Enviar el magic link por email usando Resend
        const resend = new Resend(process.env.RESEND_API_KEY);
        try {
            await resend.emails.send({
                from: 'MartuPf <noreply@martupf.com>',
                to: invite.email,
                subject: 'Invitación a registrarte',
                html: `<p>Hola ${invite.name},</p>
                       <p>Has sido invitado a registrarte. Haz click en el siguiente enlace para completar tu registro:</p>
                       <p><a href="${magicLink}">${magicLink}</a></p>
                       <p>Este enlace expirará en 48 horas.</p>`
            });
        } catch (error) {
            throw new BadRequestException('No se pudo enviar el email de invitación.');
        }

        return {
            message: 'Invitación creada y magic link enviado por email.',
            invitationId: invitation.id,
        };
    }

    async register(register: RegisterDto) {
        // 1. Buscar invitación válida por email y token
        const invitation = await this.prisma.invitation.findFirst({
            where: {
                email: register.email,
                token: register.token,
                used: false,
                expiresAt: { gt: new Date() },
            },
        });
        if (!invitation) {
            throw new BadRequestException('Invitación inválida, expirada o ya utilizada.');
        }

        // 2. Validar que el usuario no exista
        const existingUser = await this.prisma.user.findUnique({
            where: { email: register.email },
        });
        if (existingUser) {
            throw new BadRequestException('El usuario ya existe.');
        }

        // 3. Hashear la contraseña (usando pbkdf2Sync para ejemplo, puedes usar bcrypt si prefieres)
        const password = await bcrypt.hash(register.password, 10);

        // 4. Crear el usuario
        const user = await this.prisma.user.create({
            data: {
                email: invitation.email,
                name: invitation.name,
                phone: invitation.phone,
                role: invitation.role,
                password,
                profile_picture: null,
                created_at: new Date(),
            },
        });

        // 5. Marcar la invitación como usada
        await this.prisma.invitation.update({
            where: { id: invitation.id },
            data: { used: true },
        });

        // 6. Generar JWT y refresh token reales
        const payload = { sub: user.id, email: user.email, role: user.role };
        const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
        const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

        // Guarda el refresh token en la base de datos
        await this.prisma.refreshToken.create({
            data: {
                token: refreshToken,
                userId: user.id,
                createdAt: new Date(),
                expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 días
                revoked: false,
            },
        });

        return {
            message: 'Usuario registrado exitosamente.',
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                phone: user.phone,
                profile_picture: user.profile_picture,
                role: user.role,
            },
            accessToken,
            refreshToken,
        };
    }

    async logout(logout: LogoutDto) {
        // 1. Buscar usuario por email
        const user = await this.prisma.user.findUnique({
            where: { email: logout.email },
        });
        if (!user) {
            throw new BadRequestException('Usuario no encontrado.');
        }

        // 2. Revocar todos los refresh tokens activos del usuario
        await this.prisma.refreshToken.updateMany({
            where: {
                userId: user.id,
                revoked: false,
                expiresAt: { gt: new Date() },
            },
            data: { revoked: true },
        });

        return { message: 'Sesión cerrada correctamente.' };
    }

    async forgotPassword(forgotPassword: ForgotPasswordDto) {
        // 1. Buscar usuario por email
        const user = await this.prisma.user.findUnique({
            where: { email: forgotPassword.email },
        });
        if (!user) {
            // No revelar si el usuario existe o no
            return { message: 'Si el email existe, se ha enviado un enlace de recuperación.' };
        }

        // 2. Generar token único y expiración (ej: 1h)
        const token = randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1 hora

        // 3. Guardar el token en la base de datos
        await this.prisma.passwordResetToken.create({
            data: {
                token,
                userId: user.id,
                createdAt: new Date(),
                expiresAt,
                used: false,
            },
        });

        // 4. Enviar email con el link de reseteo (ajusta la URL base)
        const resetLink = `https://tu-frontend.com/reset-password?token=${token}&email=${encodeURIComponent(user.email)}`;
        const resend = new Resend(process.env.RESEND_API_KEY);
        try {
            await resend.emails.send({
                from: 'MartuPf <noreply@martupf.com>',
                to: user.email,
                subject: 'Recuperación de contraseña',
                html: `<p>Hola ${user.name},</p>
                       <p>Haz click en el siguiente enlace para restablecer tu contraseña:</p>
                       <p><a href="${resetLink}">${resetLink}</a></p>
                       <p>Este enlace expirará en 1 hora.</p>`
            });
        } catch (error) {
            // No revelar error de envío
        }

        return { message: 'Si el email existe, se ha enviado un enlace de recuperación.' };
    }

    async resetPassword(resetPassword: ResetPasswordDto) {
        // 1. Buscar el usuario por email
        const user = await this.prisma.user.findUnique({
            where: { email: resetPassword.email },
        });
        if (!user) {
            throw new BadRequestException('Token o email inválido.');
        }

        // 2. Buscar el token válido
        const tokenRecord = await this.prisma.passwordResetToken.findFirst({
            where: {
                userId: user.id,
                token: resetPassword.token,
                used: false,
                expiresAt: { gt: new Date() },
            },
        });
        if (!tokenRecord) {
            throw new BadRequestException('Token inválido o expirado.');
        }

        // 3. Hashear la nueva contraseña
        const password = await bcrypt.hash(resetPassword.password, 10);

        // 4. Actualizar la contraseña del usuario
        await this.prisma.user.update({
            where: { id: user.id },
            data: { password },
        });

        // 5. Marcar el token como usado
        await this.prisma.passwordResetToken.update({
            where: { id: tokenRecord.id },
            data: { used: true },
        });

        return { message: 'Contraseña restablecida correctamente.' };
    }

    async refreshToken(refreshToken: string) {
        // 1. Buscar el refresh token en la base de datos
        const stored = await this.prisma.refreshToken.findUnique({
            where: { token: refreshToken },
            include: { user: true },
        });
        if (!stored || stored.revoked || stored.expiresAt < new Date()) {
            throw new BadRequestException('Refresh token inválido o expirado.');
        }

        // 2. Generar un nuevo access token
        const user = stored.user;
        const payload = { sub: user.id, email: user.email, role: user.role };
        const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });

        return {
            message: 'Token refrescado exitosamente.',
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                phone: user.phone,
                profile_picture: user.profile_picture,
                role: user.role,
            },
            accessToken,
        };
    }

    async getAllInvitations() {
        return this.prisma.invitation.findMany();
    }

    async getInvitationById(id: string) {
        return this.prisma.invitation.findUnique({ where: { id } });
    }
}
