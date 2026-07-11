import { IsString, IsNotEmpty, IsOptional, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty({ example: 'Finish project report' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Complete the quarterly report for review', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ enum: ['low', 'medium', 'high'], default: 'medium' })
  @IsString()
  @IsIn(['low', 'medium', 'high'])
  @IsOptional()
  priority?: string;

  @ApiProperty({ enum: ['pending', 'in_progress', 'completed'], default: 'pending' })
  @IsString()
  @IsIn(['pending', 'in_progress', 'completed'])
  @IsOptional()
  status?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  dueDate?: string;
}

export class UpdateTaskDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ enum: ['low', 'medium', 'high'], required: false })
  @IsString()
  @IsIn(['low', 'medium', 'high'])
  @IsOptional()
  priority?: string;

  @ApiProperty({ enum: ['pending', 'in_progress', 'completed'], required: false })
  @IsString()
  @IsIn(['pending', 'in_progress', 'completed'])
  @IsOptional()
  status?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  dueDate?: string;
}
