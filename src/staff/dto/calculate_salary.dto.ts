import { IsDateString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CalculateSalaryDto {

  @ApiProperty({ example: 1, description: 'The ID of the staff member' })
  @IsNotEmpty()
  staffId: number;

  @ApiProperty({ example: '2024-12-31', description: 'The date string "YYYY-MM-DD" representing the date to calculate salary for' })
  @IsDateString()
  @IsNotEmpty()
  currentDate: string; // "YYYY-MM-DD"
}