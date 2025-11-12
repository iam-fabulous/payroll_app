import { IsDateString, IsNotEmpty } from 'class-validator';

export class CalculateSalaryDto {
  @IsDateString()
  @IsNotEmpty()
  currentDate: string; // "YYYY-MM-DD"
}