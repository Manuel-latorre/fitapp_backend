import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  Query,
  UseGuards,
  Request
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth,
  ApiParam,
  ApiQuery
} from '@nestjs/swagger';
import { PlansService } from './plans.service';
import { CreatePlanDto, UpdatePlanDto, PlanResponseDto } from './dto';

@ApiTags('plans')
@Controller('plans')
@ApiBearerAuth()
export class PlansController {
  constructor(private readonly plansService: PlansService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo plan de entrenamiento (Solo Admin)' })
  @ApiResponse({ 
    status: 201, 
    description: 'Plan creado exitosamente',
    type: PlanResponseDto
  })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 403, description: 'Acceso denegado - Solo administradores' })
  create(@Body() createPlanDto: CreatePlanDto): Promise<PlanResponseDto> {
    return this.plansService.create(createPlanDto.user_id, createPlanDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los planes (Admin ve todos, Usuario ve solo los suyos)' })
  @ApiQuery({ 
    name: 'status', 
    required: false, 
    description: 'Filtrar por estado del plan',
    example: 'active'
  })
  @ApiQuery({
    name: 'user_id',
    required: false,
    description: 'ID del usuario (Solo para Admin - filtrar planes de un usuario específico)',
    example: '88327714-d72c-479d-a221-bfc3b8b8b6d3'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de planes obtenida exitosamente',
    type: [PlanResponseDto]
  })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  findAll(
    @Request() req: any,
    @Query('status') status?: string,
    @Query('user_id') userId?: string
  ): Promise<PlanResponseDto[]> {
    const currentUserId = req.user?.id || req.user?.sub;
    const currentUserRole = req.user?.role;
    
    // Si es admin y especifica user_id, buscar planes de ese usuario
    if (currentUserRole === 'admin' && userId) {
      return status 
        ? this.plansService.findUserPlans(userId, status)
        : this.plansService.findAll(userId);
    }
    
    // Si es admin sin user_id, podría ver todos (implementar según necesidad)
    // Si es usuario normal, solo ve sus propios planes
    const targetUserId = currentUserRole === 'admin' && !userId ? null : currentUserId;
    
    return status 
      ? this.plansService.findUserPlans(targetUserId, status)
      : this.plansService.findAll(targetUserId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un plan específico por ID' })
  @ApiParam({ name: 'id', description: 'ID del plan' })
  @ApiResponse({ 
    status: 200, 
    description: 'Plan obtenido exitosamente',
    type: PlanResponseDto
  })
  @ApiResponse({ status: 404, description: 'Plan no encontrado' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  findOne(@Param('id') id: string, @Request() req: any): Promise<PlanResponseDto> {
    const userId = req.user?.id || req.user?.sub;
    return this.plansService.findOne(id, userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un plan existente' })
  @ApiParam({ name: 'id', description: 'ID del plan' })
  @ApiResponse({ 
    status: 200, 
    description: 'Plan actualizado exitosamente',
    type: PlanResponseDto
  })
  @ApiResponse({ status: 404, description: 'Plan no encontrado' })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  update(
    @Param('id') id: string, 
    @Body() updatePlanDto: UpdatePlanDto,
    @Request() req: any
  ): Promise<PlanResponseDto> {
    const userId = req.user?.id || req.user?.sub;
    return this.plansService.update(id, userId, updatePlanDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un plan' })
  @ApiParam({ name: 'id', description: 'ID del plan' })
  @ApiResponse({ status: 200, description: 'Plan eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Plan no encontrado' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  remove(@Param('id') id: string, @Request() req: any): Promise<void> {
    const userId = req.user?.id || req.user?.sub;
    return this.plansService.remove(id, userId);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Actualizar el estado de un plan' })
  @ApiParam({ name: 'id', description: 'ID del plan' })
  @ApiResponse({ 
    status: 200, 
    description: 'Estado del plan actualizado exitosamente',
    type: PlanResponseDto
  })
  @ApiResponse({ status: 404, description: 'Plan no encontrado' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: string,
    @Request() req: any
  ): Promise<PlanResponseDto> {
    const userId = req.user?.id || req.user?.sub;
    return this.plansService.updatePlanStatus(id, userId, status);
  }

  @Patch(':id/current-week')
  @ApiOperation({ summary: 'Actualizar la semana actual del plan' })
  @ApiParam({ name: 'id', description: 'ID del plan' })
  @ApiResponse({ 
    status: 200, 
    description: 'Semana actual actualizada exitosamente',
    type: PlanResponseDto
  })
  @ApiResponse({ status: 404, description: 'Plan o semana no encontrada' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  updateCurrentWeek(
    @Param('id') id: string,
    @Body('weekNumber') weekNumber: number,
    @Request() req: any
  ): Promise<PlanResponseDto> {
    const userId = req.user?.id || req.user?.sub;
    return this.plansService.updateCurrentWeek(id, userId, weekNumber);
  }
}
