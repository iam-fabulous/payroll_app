import { IsString, IsNotEmpty, IsNumber, IsDateString, IsEnum, IsOptional, IsInt, Min } from 'class-validator';

export class CreateStaffDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsDateString()
  @IsNotEmpty()
  dateJoined: string; // "YYYY-MM-DD"

  @IsNumber()
  @Min(0)
  baseSalary: number;

  
  @IsString()
  @IsEnum(['EMPLOYEE', 'MANAGER', 'SALES'], {
    message: 'Type must be one of: EMPLOYEE, MANAGER, SALES',
  })
  type: 'EMPLOYEE' | 'MANAGER' | 'SALES';

  @IsOptional()
  @IsInt()
  supervisorId?: number;
}