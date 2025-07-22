import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
    @ApiProperty({ example: 'cliente@email.com' })
    @IsEmail()
    @IsNotEmpty()
    @MinLength(1)
    email: string;

    @ApiProperty({ example: 'NuevaPassword123!' })
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    password: string;

    @ApiProperty({ example: 'token-de-recovery' })
    @IsString()
    @IsNotEmpty()
    token: string;
}