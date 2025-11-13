import { IsDateString, IsNotEmpty } from 'class-validator';

export class CalculateSalaryDto {

  @IsNotEmpty()
  
  staffId: number;

  @IsDateString()
  @IsNotEmpty()
  currentDate: string; // "YYYY-MM-DD"
}