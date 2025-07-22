import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @ApiOkResponse({
    description: 'Lista de usuarios',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'uuid' },
          name: { type: 'string', example: 'Juan Perez' },
          email: { type: 'string', example: 'cliente@email.com' },
          phone: { type: 'string', example: '+5491122334455' },
          profile_picture: { type: 'string', example: null },
          password: { type: 'string', example: 'hashed-password' },
          role: { type: 'string', example: 'user' },
          created_at: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
        },
      },
    },
  })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({
    description: 'Usuario por ID',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'uuid' },
        name: { type: 'string', example: 'Juan Perez' },
        email: { type: 'string', example: 'cliente@email.com' },
        phone: { type: 'string', example: '+5491122334455' },
        profile_picture: { type: 'string', example: null },
        password: { type: 'string', example: 'hashed-password' },
        role: { type: 'string', example: 'user' },
        created_at: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
      },
    },
  })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }
}
