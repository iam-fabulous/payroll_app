// --- src/staff/staff.module.ts ---

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// 1. Import Controller and Service
import { StaffController } from './staff.controller';
import { StaffService } from './staff.service';

// 2. Import your Entities (Models)
import { StaffMember } from './models/staff_member';
import { Employee } from './models/employee';
import { Manager } from './models/manager';
import { Sales } from './models/sales';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      StaffMember,
      Employee,
      Manager,
      Sales,
    ]),
  ],
  controllers: [StaffController], // Registers the API endpoints
  providers: [StaffService],      // Registers the business logic
})
export class StaffModule {}