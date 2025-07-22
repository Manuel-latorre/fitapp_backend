import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from '../../prisma.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [
        JwtModule.register({
            secret: process.env.JWT_SECRET || 'supersecret', // Usa variable de entorno en producción
            signOptions: { expiresIn: process.env.JWT_EXPIRES_IN }, // Access token
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, PrismaService],
})
export class AuthModule {

}