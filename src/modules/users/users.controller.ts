import { Controller, Get, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiOkResponse, ApiResponse, ApiTags, ApiOperation, ApiParam, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
@ApiBearerAuth()
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todos los usuarios (Solo Admin)' })
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
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 403, description: 'Acceso denegado - Solo administradores' })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un usuario específico por ID' })
  @ApiParam({ name: 'id', description: 'ID del usuario' })
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
        role: { type: 'string', example: 'user' },
        created_at: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un usuario (Solo Admin)' })
  @ApiParam({ name: 'id', description: 'ID del usuario a eliminar' })
  @ApiResponse({ status: 200, description: 'Usuario eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 403, description: 'Acceso denegado - Solo administradores' })
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    await this.usersService.remove(id);
    return { message: 'Usuario eliminado exitosamente' };
  }
}
