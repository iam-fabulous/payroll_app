import { IsString, IsNotEmpty, IsNumber, IsDateString, IsEnum, IsOptional, IsInt, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateStaffDto {
  @ApiProperty({ example: 'John Doe', description: 'The name of the staff member' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '2023-01-01', description: 'ISO 8601 date string' })
  @IsDateString()
  @IsNotEmpty()
  dateJoined: string; // "YYYY-MM-DD"

  @ApiProperty({ example: 50000, description: 'The base salary of the staff member' })
  @IsNumber()
  @Min(0)
  baseSalary: number;

  
  @ApiProperty({ example: 'EMPLOYEE', description: 'The type of staff member', enum: ['EMPLOYEE', 'MANAGER', 'SALES'] })
  @IsString()
  @IsEnum(['EMPLOYEE', 'MANAGER', 'SALES'], {
    message: 'Type must be one of: EMPLOYEE, MANAGER, SALES',
  })
  type: 'EMPLOYEE' | 'MANAGER' | 'SALES';

  @ApiPropertyOptional({ example: 1, description: 'The ID of the supervisor' })
  @IsOptional()
  @IsInt()
  supervisorId?: number;
}