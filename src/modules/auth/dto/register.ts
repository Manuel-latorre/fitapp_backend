import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
    @ApiProperty({ example: 'cliente@email.com' })
    @IsEmail()
    @IsNotEmpty()
    @MinLength(1)
    email: string;

    @ApiProperty({ example: 'Password123!' })
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    password: string;

    @ApiProperty({ example: 'Juan Perez' })
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    name: string;

    @ApiProperty({ example: '+5491122334455' })
    @IsString()
    @IsNotEmpty()
    phone: string;

    @ApiProperty({ example: 'true' })
    @IsString()
    is_new: string;

    @ApiProperty({ example: 'user' })
    @IsString()
    @IsNotEmpty()
    role: string;

    @ApiProperty({ example: 'token-del-magic-link' })
    @IsString()
    @IsNotEmpty()
    token: string;
}