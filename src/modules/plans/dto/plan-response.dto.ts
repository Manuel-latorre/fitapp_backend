import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ExerciseResponseDto {
  @ApiProperty({ example: 'uuid' })
  id: string;

  @ApiProperty({ example: 1 })
  exercise_number: number;

  @ApiProperty({ example: 'Press de banca' })
  name: string;

  @ApiPropertyOptional({ example: 'https://youtube.com/watch?v=example' })
  link?: string;

  @ApiPropertyOptional({ example: 3 })
  series?: number;

  @ApiPropertyOptional({ example: '8-12' })
  reps?: string;

  @ApiPropertyOptional({ example: '80.5' })
  kg?: string;

  @ApiPropertyOptional({ example: 120 })
  rest_seconds?: number;

  @ApiPropertyOptional({ example: '8' })
  pse?: string;

  @ApiPropertyOptional({ example: '2' })
  rir?: string;

  @ApiPropertyOptional({ example: 'Enfocarse en la técnica' })
  observations?: string;

  @ApiProperty({ example: false })
  completed: boolean;

  @ApiPropertyOptional({ example: 3 })
  actual_series?: number;

  @ApiPropertyOptional({ example: '10' })
  actual_reps?: string;

  @ApiPropertyOptional({ example: '82.5' })
  actual_kg?: string;

  @ApiPropertyOptional({ example: '7' })
  actual_pse?: string;

  @ApiPropertyOptional({ example: '1' })
  actual_rir?: string;

  @ApiPropertyOptional({ example: 'Se sintió pesado' })
  completion_notes?: string;

  @ApiProperty({ example: '2024-01-15T10:30:00Z' })
  created_at: string;

  @ApiProperty({ example: '2024-01-15T10:30:00Z' })
  updated_at: string;
}

export class BlockResponseDto {
  @ApiProperty({ example: 'uuid' })
  id: string;

  @ApiProperty({ example: 1 })
  block_number: number;

  @ApiProperty({ example: 'Bloque de fuerza' })
  title: string;

  @ApiPropertyOptional({ example: 'Notas del bloque' })
  notes?: string;

  @ApiProperty({ type: [ExerciseResponseDto] })
  exercises: ExerciseResponseDto[];

  @ApiProperty({ example: '2024-01-15T10:30:00Z' })
  created_at: string;
}

export class SessionResponseDto {
  @ApiProperty({ example: 'uuid' })
  id: string;

  @ApiProperty({ example: 1 })
  session_number: number;

  @ApiProperty({ example: 'Sesión de tren superior' })
  title: string;

  @ApiPropertyOptional({ example: 'Notas de la sesión' })
  notes?: string;

  @ApiProperty({ example: false })
  completed: boolean;

  @ApiPropertyOptional({ example: '2024-01-15T18:00:00Z' })
  completion_date?: string;

  @ApiProperty({ type: [BlockResponseDto] })
  blocks: BlockResponseDto[];

  @ApiProperty({ example: '2024-01-15T10:30:00Z' })
  created_at: string;

  @ApiProperty({ example: '2024-01-15T10:30:00Z' })
  updated_at: string;
}

export class WeekResponseDto {
  @ApiProperty({ example: 'uuid' })
  id: string;

  @ApiProperty({ example: 1 })
  week_number: number;

  @ApiPropertyOptional({ example: 'Semana de adaptación' })
  title?: string;

  @ApiPropertyOptional({ example: 'Notas de la semana' })
  notes?: string;

  @ApiProperty({ example: false })
  is_template: boolean;

  @ApiPropertyOptional({ example: 'uuid' })
  copied_from_week_id?: string;

  @ApiProperty({ example: 'planned' })
  status: string;

  @ApiProperty({ type: [SessionResponseDto] })
  sessions: SessionResponseDto[];

  @ApiProperty({ example: '2024-01-15T10:30:00Z' })
  created_at: string;

  @ApiProperty({ example: '2024-01-15T10:30:00Z' })
  updated_at: string;
}

export class PlanResponseDto {
  @ApiProperty({ example: 'uuid' })
  id: string;

  @ApiProperty({ example: 'uuid' })
  user_id: string;

  @ApiProperty({ example: 'Plan de hipertrofia 12 semanas' })
  name: string;

  @ApiPropertyOptional({ example: 'Plan enfocado en ganancia de masa muscular' })
  description?: string;

  @ApiProperty({ example: '2024-01-15T00:00:00Z' })
  start_date: string;

  @ApiPropertyOptional({ example: '2024-04-15T00:00:00Z' })
  end_date?: string;

  @ApiProperty({ example: 1 })
  current_week_number: number;

  @ApiProperty({ example: 'active' })
  status: string;

  @ApiProperty({ type: [WeekResponseDto] })
  weeks: WeekResponseDto[];

  @ApiProperty({ example: '2024-01-15T10:30:00Z' })
  created_at: string;

  @ApiProperty({ example: '2024-01-15T10:30:00Z' })
  updated_at: string;
}
