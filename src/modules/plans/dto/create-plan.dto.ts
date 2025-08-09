import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsDateString, IsArray, ValidateNested, IsNumber, IsDecimal, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateExerciseDto {
  @ApiProperty({ example: 'Press de banca' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 'https://youtube.com/watch?v=example' })
  @IsOptional()
  @IsString()
  link?: string;

  @ApiPropertyOptional({ example: 3 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  series?: number;

  @ApiPropertyOptional({ example: '8-12' })
  @IsOptional()
  @IsString()
  reps?: string;

  @ApiPropertyOptional({ example: '80.5' })
  @IsOptional()
  @IsString()
  kg?: string;

  @ApiPropertyOptional({ example: 120 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  rest_seconds?: number;

  @ApiPropertyOptional({ example: '8' })
  @IsOptional()
  @IsString()
  pse?: string;

  @ApiPropertyOptional({ example: '2' })
  @IsOptional()
  @IsString()
  rir?: string;

  @ApiPropertyOptional({ example: 'Enfocarse en la técnica' })
  @IsOptional()
  @IsString()
  observations?: string;
}

export class CreateBlockDto {
  @ApiProperty({ example: 'Bloque de fuerza' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ example: 'Notas del bloque' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ type: [CreateExerciseDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateExerciseDto)
  exercises: CreateExerciseDto[];
}

export class CreateSessionDto {
  @ApiProperty({ example: 'Sesión de tren superior' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ example: 'Notas de la sesión' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ type: [CreateBlockDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateBlockDto)
  blocks: CreateBlockDto[];
}

export class CreateWeekDto {
  @ApiPropertyOptional({ example: 'Semana de adaptación' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ example: 'Notas de la semana' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ type: [CreateSessionDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSessionDto)
  sessions: CreateSessionDto[];
}

export class CreatePlanDto {
  @ApiProperty({ example: '88327714-d72c-479d-a221-bfc3b8b8b6d3' })
  @IsString()
  user_id: string;

  @ApiProperty({ example: 'Plan de hipertrofia 12 semanas' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 'Plan enfocado en ganancia de masa muscular' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: '2024-01-15T00:00:00Z' })
  @IsDateString()
  start_date: string;

  @ApiPropertyOptional({ example: '2024-04-15T00:00:00Z' })
  @IsOptional()
  @IsDateString()
  end_date?: string;

  @ApiProperty({ type: [CreateWeekDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateWeekDto)
  weeks: CreateWeekDto[];
}
