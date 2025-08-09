import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { CreatePlanDto, UpdatePlanDto, PlanResponseDto } from './dto';

@Injectable()
export class PlansService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createPlanDto: CreatePlanDto): Promise<PlanResponseDto> {
    const { weeks, ...planData } = createPlanDto;

    // Crear el plan con todas las relaciones anidadas
    const plan = await this.prisma.plan.create({
      data: {
        ...planData,
        user_id: userId,
        weeks: {
          create: weeks.map((week, weekIndex) => ({
            week_number: weekIndex + 1,
            title: week.title,
            notes: week.notes,
            sessions: {
              create: week.sessions.map((session, sessionIndex) => ({
                session_number: sessionIndex + 1,
                title: session.title,
                notes: session.notes,
                blocks: {
                  create: session.blocks.map((block, blockIndex) => ({
                    block_number: blockIndex + 1,
                    title: block.title,
                    notes: block.notes,
                    exercises: {
                      create: block.exercises.map((exercise, exerciseIndex) => ({
                        exercise_number: exerciseIndex + 1,
                        name: exercise.name,
                        link: exercise.link,
                        series: exercise.series,
                        reps: exercise.reps,
                        kg: exercise.kg,
                        rest_seconds: exercise.rest_seconds,
                        pse: exercise.pse,
                        rir: exercise.rir,
                        observations: exercise.observations,
                      })),
                    },
                  })),
                },
              })),
            },
          })),
        },
      },
      include: this.getIncludeOptions(),
    });

    return this.formatPlanResponse(plan);
  }

  async findAll(userId?: string): Promise<PlanResponseDto[]> {
    const whereClause = userId ? { user_id: userId } : {};
    
    const plans = await this.prisma.plan.findMany({
      where: whereClause,
      include: this.getIncludeOptions(),
      orderBy: { created_at: 'desc' },
    });

    return plans.map(plan => this.formatPlanResponse(plan));
  }

  async findOne(id: string, userId: string): Promise<PlanResponseDto> {
    const plan = await this.prisma.plan.findFirst({
      where: { 
        id,
        user_id: userId,
      },
      include: this.getIncludeOptions(),
    });

    if (!plan) {
      throw new NotFoundException(`Plan with ID ${id} not found`);
    }

    return this.formatPlanResponse(plan);
  }

  async update(id: string, userId: string, updatePlanDto: UpdatePlanDto): Promise<PlanResponseDto> {
    // Verificar que el plan existe y pertenece al usuario
    const existingPlan = await this.prisma.plan.findFirst({
      where: { id, user_id: userId },
    });

    if (!existingPlan) {
      throw new NotFoundException(`Plan with ID ${id} not found`);
    }

    const { weeks, ...planData } = updatePlanDto;

    let updateData: any = { ...planData };

    // Si se proporcionan weeks, actualizarlas completamente
    if (weeks) {
      updateData.weeks = {
        deleteMany: {}, // Eliminar weeks existentes
        create: weeks.map((week, weekIndex) => ({
          week_number: weekIndex + 1,
          title: week.title,
          notes: week.notes,
          sessions: {
            create: week.sessions.map((session, sessionIndex) => ({
              session_number: sessionIndex + 1,
              title: session.title,
              notes: session.notes,
              blocks: {
                create: session.blocks.map((block, blockIndex) => ({
                  block_number: blockIndex + 1,
                  title: block.title,
                  notes: block.notes,
                  exercises: {
                    create: block.exercises.map((exercise, exerciseIndex) => ({
                      exercise_number: exerciseIndex + 1,
                      name: exercise.name,
                      link: exercise.link,
                      series: exercise.series,
                      reps: exercise.reps,
                      kg: exercise.kg,
                      rest_seconds: exercise.rest_seconds,
                      pse: exercise.pse,
                      rir: exercise.rir,
                      observations: exercise.observations,
                    })),
                  },
                })),
              },
            })),
          },
        })),
      };
    }

    const updatedPlan = await this.prisma.plan.update({
      where: { id },
      data: updateData,
      include: this.getIncludeOptions(),
    });

    return this.formatPlanResponse(updatedPlan);
  }

  async remove(id: string, userId: string): Promise<void> {
    const plan = await this.prisma.plan.findFirst({
      where: { id, user_id: userId },
    });

    if (!plan) {
      throw new NotFoundException(`Plan with ID ${id} not found`);
    }

    await this.prisma.plan.delete({
      where: { id },
    });
  }

  async findUserPlans(userId?: string, status?: string): Promise<PlanResponseDto[]> {
    const whereClause: any = {};
    
    if (userId) {
      whereClause.user_id = userId;
    }
    
    if (status) {
      whereClause.status = status;
    }

    const plans = await this.prisma.plan.findMany({
      where: whereClause,
      include: this.getIncludeOptions(),
      orderBy: { created_at: 'desc' },
    });

    return plans.map(plan => this.formatPlanResponse(plan));
  }

  async updatePlanStatus(id: string, userId: string, status: string): Promise<PlanResponseDto> {
    const plan = await this.prisma.plan.findFirst({
      where: { id, user_id: userId },
    });

    if (!plan) {
      throw new NotFoundException(`Plan with ID ${id} not found`);
    }

    const updatedPlan = await this.prisma.plan.update({
      where: { id },
      data: { status },
      include: this.getIncludeOptions(),
    });

    return this.formatPlanResponse(updatedPlan);
  }

  async updateCurrentWeek(id: string, userId: string, weekNumber: number): Promise<PlanResponseDto> {
    const plan = await this.prisma.plan.findFirst({
      where: { id, user_id: userId },
      include: { weeks: true },
    });

    if (!plan) {
      throw new NotFoundException(`Plan with ID ${id} not found`);
    }

    // Verificar que la semana existe
    const weekExists = plan.weeks.some(week => week.week_number === weekNumber);
    if (!weekExists) {
      throw new NotFoundException(`Week ${weekNumber} not found in plan`);
    }

    const updatedPlan = await this.prisma.plan.update({
      where: { id },
      data: { current_week_number: weekNumber },
      include: this.getIncludeOptions(),
    });

    return this.formatPlanResponse(updatedPlan);
  }

  private getIncludeOptions() {
    return {
      weeks: {
        include: {
          sessions: {
            include: {
              blocks: {
                include: {
                  exercises: {
                    orderBy: { exercise_number: 'asc' as const },
                  },
                },
                orderBy: { block_number: 'asc' as const },
              },
            },
            orderBy: { session_number: 'asc' as const },
          },
        },
        orderBy: { week_number: 'asc' as const },
      },
    };
  }

  private formatPlanResponse(plan: any): PlanResponseDto {
    return {
      id: plan.id,
      user_id: plan.user_id,
      name: plan.name,
      description: plan.description,
      start_date: plan.start_date.toISOString(),
      end_date: plan.end_date?.toISOString(),
      current_week_number: plan.current_week_number,
      status: plan.status,
      weeks: plan.weeks.map(week => ({
        id: week.id,
        week_number: week.week_number,
        title: week.title,
        notes: week.notes,
        is_template: week.is_template,
        copied_from_week_id: week.copied_from_week_id,
        status: week.status,
        sessions: week.sessions.map(session => ({
          id: session.id,
          session_number: session.session_number,
          title: session.title,
          notes: session.notes,
          completed: session.completed,
          completion_date: session.completion_date?.toISOString(),
          blocks: session.blocks.map(block => ({
            id: block.id,
            block_number: block.block_number,
            title: block.title,
            notes: block.notes,
            exercises: block.exercises.map(exercise => ({
              id: exercise.id,
              exercise_number: exercise.exercise_number,
              name: exercise.name,
              link: exercise.link,
              series: exercise.series,
              reps: exercise.reps,
              kg: exercise.kg?.toString(),
              rest_seconds: exercise.rest_seconds,
              pse: exercise.pse,
              rir: exercise.rir,
              observations: exercise.observations,
              completed: exercise.completed,
              actual_series: exercise.actual_series,
              actual_reps: exercise.actual_reps,
              actual_kg: exercise.actual_kg?.toString(),
              actual_pse: exercise.actual_pse,
              actual_rir: exercise.actual_rir,
              completion_notes: exercise.completion_notes,
              created_at: exercise.created_at.toISOString(),
              updated_at: exercise.updated_at.toISOString(),
            })),
            created_at: block.created_at.toISOString(),
          })),
          created_at: session.created_at.toISOString(),
          updated_at: session.updated_at.toISOString(),
        })),
        created_at: week.created_at.toISOString(),
        updated_at: week.updated_at.toISOString(),
      })),
      created_at: plan.created_at.toISOString(),
      updated_at: plan.updated_at.toISOString(),
    };
  }
}
