import { IsInt, IsNotEmpty, IsPositive } from 'class-validator';

export class UpdateSupervisorDto {
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  supervisorId: number;
}