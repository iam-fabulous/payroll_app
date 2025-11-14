import { IsInt, IsNotEmpty, IsPositive } from 'class-validator';

export class UpdateSupervisorDto {

  @IsNotEmpty()
  staffId: number;

  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  supervisorId: number;
}