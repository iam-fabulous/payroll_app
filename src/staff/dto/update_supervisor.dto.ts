import { IsInt, IsNotEmpty, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class UpdateSupervisorDto {

  @ApiProperty({ example: 1, description: 'The ID of the staff member whose supervisor is to be updated' })
  @IsNotEmpty()
  staffId: number;

  @ApiProperty({ example: 2, description: 'The ID of the new supervisor' })
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  supervisorId: number;
}