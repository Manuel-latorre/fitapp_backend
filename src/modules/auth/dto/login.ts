import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
    @ApiProperty({ example: 'cliente@email.com' })
    @IsEmail()
    @IsNotEmpty()
    @MinLength(1)
    email: string;

    @ApiProperty({ example: 'Password123!' })
    @IsString() 
    @IsNotEmpty()
    password: string;
}

